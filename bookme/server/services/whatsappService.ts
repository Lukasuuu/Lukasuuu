/**
 * WhatsApp Service — BookMe
 * Sends WhatsApp messages via Twilio API
 */

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const FROM_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155552671';

async function sendWhatsApp(to: string, body: string): Promise<boolean> {
  if (!ACCOUNT_SID || !AUTH_TOKEN) {
    console.warn('[WhatsApp] Twilio credentials not set — skipping message to', to);
    return false;
  }

  const toNumber = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`;
    const creds = Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString('base64');

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${creds}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ From: FROM_NUMBER, To: toNumber, Body: body }).toString(),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[WhatsApp] Twilio error:', err);
      return false;
    }
    return true;
  } catch (e) {
    console.error('[WhatsApp] Network error:', e);
    return false;
  }
}

export async function sendWhatsAppConfirmation(params: {
  phone: string;
  clientName: string;
  serviceName: string;
  staffName: string;
  bookingDate: string;
  startTime: string;
  businessName: string;
}): Promise<boolean> {
  const msg = `✅ *Marcação confirmada!*\n\n📋 *Serviço:* ${params.serviceName}\n👤 *Profissional:* ${params.staffName}\n📅 *Data:* ${params.bookingDate}\n🕐 *Hora:* ${params.startTime}\n🏪 *Local:* ${params.businessName}\n\nPara cancelar, responda CANCELAR.`;
  return sendWhatsApp(params.phone, msg);
}

export async function sendWhatsAppReminder(params: {
  phone: string;
  clientName: string;
  serviceName: string;
  staffName: string;
  bookingDate: string;
  startTime: string;
  businessName: string;
}): Promise<boolean> {
  const msg = `⏰ *Lembrete de marcação para amanhã!*\n\n📋 *Serviço:* ${params.serviceName}\n👤 *Profissional:* ${params.staffName}\n🕐 *Hora:* ${params.startTime}\n🏪 *Local:* ${params.businessName}\n\nAté amanhã! 👋`;
  return sendWhatsApp(params.phone, msg);
}

export async function sendWhatsAppCancellation(params: {
  phone: string;
  clientName: string;
  serviceName: string;
  bookingDate: string;
  startTime: string;
  businessName: string;
}): Promise<boolean> {
  const msg = `❌ *Marcação cancelada*\n\n📋 *Serviço:* ${params.serviceName}\n📅 *Data:* ${params.bookingDate}\n🕐 *Hora:* ${params.startTime}\n🏪 *Local:* ${params.businessName}\n\nSe desejar fazer nova marcação, visite o nosso site.`;
  return sendWhatsApp(params.phone, msg);
}
