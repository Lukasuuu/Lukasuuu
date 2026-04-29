import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  sendBookingConfirmation,
  sendBookingCancellation,
  sendPaymentConfirmation,
  sendPaymentFailed,
  sendPlanExpired,
  sendContactFormEmail,
} from './services/emailService.js';
import {
  sendWhatsAppConfirmation,
  sendWhatsAppReminder,
  sendWhatsAppCancellation,
} from './services/whatsappService.js';
import {
  sendNewBookingAlert,
  sendBookingCancelledAlert,
} from './services/telegramService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use((req, res, next) => {
    if (req.path === '/api/webhooks/stripe') {
      next();
    } else {
      express.json()(req, res, next);
    }
  });
  app.use(express.urlencoded({ extended: true }));

  // ===========================================================================
  // STRIPE CHECKOUT
  // ===========================================================================
  app.post('/api/create-checkout-session', async (req, res) => {
    try {
      const { Stripe } = await import('stripe').catch(() => ({ default: null })) as any;
      if (!Stripe || !process.env.STRIPE_SECRET_KEY) {
        return res.status(503).json({ error: 'Stripe not configured' });
      }
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const { priceId, userId, userEmail, planType, appUrl } = req.body;

      if (!priceId || !userId) {
        return res.status(400).json({ error: 'priceId and userId required' });
      }

      const baseUrl = appUrl || process.env.VITE_APP_URL || 'https://bookme.pt';

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        customer_email: userEmail,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/checkout/cancel`,
        allow_promotion_codes: true,
        tax_id_collection: { enabled: true },
        metadata: { userId, planType: planType || '' },
      });

      res.json({ url: session.url });
    } catch (e: any) {
      console.error('[Stripe] create-checkout-session error:', e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // ===========================================================================
  // STRIPE CUSTOMER PORTAL
  // ===========================================================================
  app.post('/api/create-portal-session', async (req, res) => {
    try {
      const { Stripe } = await import('stripe').catch(() => ({ default: null })) as any;
      if (!Stripe || !process.env.STRIPE_SECRET_KEY) {
        return res.status(503).json({ error: 'Stripe not configured' });
      }
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const { customerId, appUrl } = req.body;

      if (!customerId) return res.status(400).json({ error: 'customerId required' });

      const baseUrl = appUrl || process.env.VITE_APP_URL || 'https://bookme.pt';
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${baseUrl}/dashboard/billing`,
      });

      res.json({ url: session.url });
    } catch (e: any) {
      console.error('[Stripe] create-portal-session error:', e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // ===========================================================================
  // STRIPE WEBHOOKS
  // ===========================================================================
  app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
      const { Stripe } = await import('stripe').catch(() => ({ default: null })) as any;
      if (!Stripe || !process.env.STRIPE_SECRET_KEY) {
        return res.status(503).send('Stripe not configured');
      }
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const sig = req.headers['stripe-signature'] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      let event: any;
      try {
        event = webhookSecret
          ? stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
          : JSON.parse(req.body.toString());
      } catch (err: any) {
        console.error('[Stripe Webhook] Signature error:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.VITE_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object;
          const { userId, planType } = session.metadata || {};
          if (userId) {
            const plan = planType || 'pro';
            await supabase.from('subscriptions').upsert({
              user_id: userId,
              stripe_customer_id: session.customer,
              stripe_subscription_id: session.subscription,
              plan,
              status: 'active',
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });

            await supabase.from('profiles').update({ plan }).eq('id', userId);

            const { data: profile } = await supabase
              .from('profiles')
              .select('email, name')
              .eq('id', userId)
              .single();

            if (profile?.email) {
              await sendPaymentConfirmation({
                to: profile.email,
                userName: profile.name || 'utilizador',
                plan: plan.charAt(0).toUpperCase() + plan.slice(1),
                amount: `€${(session.amount_total / 100).toFixed(2)}`,
              });
            }
          }
          break;
        }

        case 'customer.subscription.updated': {
          const sub = event.data.object;
          const { data: existing } = await supabase
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_subscription_id', sub.id)
            .single();

          if (existing) {
            await supabase.from('subscriptions').update({
              status: sub.status,
              current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
              current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
              cancel_at_period_end: sub.cancel_at_period_end,
              updated_at: new Date().toISOString(),
            }).eq('stripe_subscription_id', sub.id);
          }
          break;
        }

        case 'customer.subscription.deleted': {
          const sub = event.data.object;
          const { data: existing } = await supabase
            .from('subscriptions')
            .select('user_id, plan')
            .eq('stripe_subscription_id', sub.id)
            .single();

          if (existing) {
            await supabase.from('subscriptions').update({
              status: 'cancelled',
              plan: 'free',
              updated_at: new Date().toISOString(),
            }).eq('stripe_subscription_id', sub.id);

            await supabase.from('profiles').update({ plan: 'free' }).eq('id', existing.user_id);

            const { data: profile } = await supabase
              .from('profiles')
              .select('email, name')
              .eq('id', existing.user_id)
              .single();

            if (profile?.email) {
              await sendPlanExpired({
                to: profile.email,
                userName: profile.name || 'utilizador',
                plan: (existing.plan || 'Pro').charAt(0).toUpperCase() + (existing.plan || 'pro').slice(1),
              });
            }
          }
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object;
          const { data: existing } = await supabase
            .from('subscriptions')
            .select('user_id, plan')
            .eq('stripe_customer_id', invoice.customer)
            .single();

          if (existing) {
            await supabase.from('subscriptions').update({
              status: 'payment_failed',
              updated_at: new Date().toISOString(),
            }).eq('stripe_customer_id', invoice.customer);

            const { data: profile } = await supabase
              .from('profiles')
              .select('email, name')
              .eq('id', existing.user_id)
              .single();

            if (profile?.email) {
              await sendPaymentFailed({
                to: profile.email,
                userName: profile.name || 'utilizador',
                plan: (existing.plan || 'pro').charAt(0).toUpperCase() + (existing.plan || 'pro').slice(1),
              });
            }
          }
          break;
        }

        default:
          break;
      }

      res.json({ received: true });
    } catch (e: any) {
      console.error('[Stripe Webhook] Error:', e.message);
      res.status(500).send('Internal error');
    }
  });

  // ===========================================================================
  // NOTIFICATIONS API
  // ===========================================================================
  app.post('/api/notifications/send', async (req, res) => {
    try {
      const { type, booking, client, service, staff, business } = req.body;

      const results: Record<string, boolean> = {};

      if (client?.email) {
        if (type === 'confirmation') {
          results.email = await sendBookingConfirmation({
            to: client.email,
            clientName: client.name,
            serviceName: service.name,
            staffName: staff.name,
            bookingDate: booking.booking_date,
            startTime: booking.start_time,
            businessName: business.name,
            businessPhone: business.phone,
          });
        } else if (type === 'cancellation') {
          results.email = await sendBookingCancellation({
            to: client.email,
            clientName: client.name,
            serviceName: service.name,
            bookingDate: booking.booking_date,
            startTime: booking.start_time,
            businessName: business.name,
          });
        } else if (type === 'reminder') {
          const { sendBookingReminder } = await import('./services/emailService.js');
          results.email = await sendBookingReminder({
            to: client.email,
            clientName: client.name,
            serviceName: service.name,
            staffName: staff.name,
            bookingDate: booking.booking_date,
            startTime: booking.start_time,
            businessName: business.name,
            businessPhone: business.phone,
          });
        }
      }

      const settings = business.settings || {};

      if (settings.notifications_whatsapp && client?.phone) {
        if (type === 'confirmation') {
          results.whatsapp = await sendWhatsAppConfirmation({
            phone: client.phone,
            clientName: client.name,
            serviceName: service.name,
            staffName: staff.name,
            bookingDate: booking.booking_date,
            startTime: booking.start_time,
            businessName: business.name,
          });
        } else if (type === 'cancellation') {
          results.whatsapp = await sendWhatsAppCancellation({
            phone: client.phone,
            clientName: client.name,
            serviceName: service.name,
            bookingDate: booking.booking_date,
            startTime: booking.start_time,
            businessName: business.name,
          });
        } else if (type === 'reminder') {
          results.whatsapp = await sendWhatsAppReminder({
            phone: client.phone,
            clientName: client.name,
            serviceName: service.name,
            staffName: staff.name,
            bookingDate: booking.booking_date,
            startTime: booking.start_time,
            businessName: business.name,
          });
        }
      }

      if (settings.notifications_telegram && settings.telegram_chat_id) {
        if (type === 'confirmation') {
          results.telegram = await sendNewBookingAlert({
            chatId: settings.telegram_chat_id,
            clientName: client.name,
            serviceName: service.name,
            staffName: staff.name,
            bookingDate: booking.booking_date,
            startTime: booking.start_time,
            price: booking.price || service.price || 0,
          });
        } else if (type === 'cancellation') {
          results.telegram = await sendBookingCancelledAlert({
            chatId: settings.telegram_chat_id,
            clientName: client.name,
            serviceName: service.name,
            bookingDate: booking.booking_date,
            startTime: booking.start_time,
          });
        }
      }

      res.json({ success: true, results });
    } catch (e: any) {
      console.error('[Notifications] Error:', e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // ===========================================================================
  // CONTACT FORM
  // ===========================================================================
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      const adminEmail = process.env.ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL || 'admin@bookme.pt';
      await sendContactFormEmail({ name, email, subject, message, adminEmail });

      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ===========================================================================
  // PUSH SUBSCRIPTIONS
  // ===========================================================================
  app.post('/api/push/subscribe', async (req, res) => {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.VITE_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      const { userId, subscription } = req.body;
      await supabase.from('push_subscriptions').upsert({
        user_id: userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      }, { onConflict: 'endpoint' });
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ===========================================================================
  // STATIC FILES
  // ===========================================================================
  const staticPath =
    process.env.NODE_ENV === 'production'
      ? path.resolve(__dirname, 'public')
      : path.resolve(__dirname, '..', 'dist', 'public');

  app.use(express.static(staticPath));

  app.get('*', (_req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`BookMe server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
