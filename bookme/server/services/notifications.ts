/**
 * Notification Services for BookMe
 * Email, WhatsApp, and Telegram integrations
 * 
 * Environment variables required:
 * - RESEND_API_KEY: For email notifications
 * - TWILIO_ACCOUNT_SID: For WhatsApp notifications
 * - TWILIO_AUTH_TOKEN: For WhatsApp notifications
 * - TWILIO_WHATSAPP_NUMBER: WhatsApp sender number
 * - TELEGRAM_BOT_TOKEN: For Telegram notifications
 */

interface NotificationData {
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  serviceName: string;
  staffName: string;
  bookingDate: string;
  startTime: string;
  businessName: string;
  businessPhone?: string;
  bookingId?: string;
}

// ============================================================================
// EMAIL NOTIFICATIONS (Resend)
// ============================================================================

export const emailTemplates = {
  confirmationEmail: (data: NotificationData) => ({
    subject: `Confirmação de Marcação - ${data.businessName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3B82F6 0%, #10B981 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
            .detail { margin: 15px 0; padding: 10px; background: white; border-left: 4px solid #3B82F6; }
            .detail strong { color: #1f2937; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
            .button { display: inline-block; background: #3B82F6; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Marcação Confirmada! ✓</h1>
              <p>${data.businessName}</p>
            </div>
            <div class="content">
              <p>Olá ${data.clientName},</p>
              <p>Sua marcação foi confirmada com sucesso! Aqui estão os detalhes:</p>
              
              <div class="detail">
                <strong>📅 Data:</strong> ${data.bookingDate}
              </div>
              <div class="detail">
                <strong>⏰ Hora:</strong> ${data.startTime}
              </div>
              <div class="detail">
                <strong>💇 Serviço:</strong> ${data.serviceName}
              </div>
              <div class="detail">
                <strong>👤 Profissional:</strong> ${data.staffName}
              </div>
              ${data.businessPhone ? `
              <div class="detail">
                <strong>📞 Contacto:</strong> ${data.businessPhone}
              </div>
              ` : ''}
              
              <p style="margin-top: 20px;">Obrigado por escolher ${data.businessName}!</p>
              <p>Se precisar cancelar ou reagendar, entre em contacto conosco.</p>
              
              <div class="footer">
                <p>Este é um email automático. Por favor, não responda a este email.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  reminderEmail: (data: NotificationData) => ({
    subject: `Lembrete: Sua marcação amanhã - ${data.businessName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #F59E0B 0%, #EF4444 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
            .detail { margin: 15px 0; padding: 10px; background: white; border-left: 4px solid #F59E0B; }
            .detail strong { color: #1f2937; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Lembrete de Marcação 🔔</h1>
            </div>
            <div class="content">
              <p>Olá ${data.clientName},</p>
              <p>Queremos lembrá-lo que tem uma marcação amanhã!</p>
              
              <div class="detail">
                <strong>⏰ Hora:</strong> ${data.startTime}
              </div>
              <div class="detail">
                <strong>💇 Serviço:</strong> ${data.serviceName}
              </div>
              <div class="detail">
                <strong>👤 Profissional:</strong> ${data.staffName}
              </div>
              
              <p style="margin-top: 20px;">Se não puder comparecer, por favor contacte-nos o mais breve possível.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  cancellationEmail: (data: NotificationData) => ({
    subject: `Marcação Cancelada - ${data.businessName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Marcação Cancelada</h1>
            </div>
            <div class="content">
              <p>Olá ${data.clientName},</p>
              <p>Sua marcação foi cancelada.</p>
              <p>Se deseja reagendar, entre em contacto conosco.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  welcomeEmail: (data: NotificationData) => ({
    subject: `Bem-vindo a ${data.businessName}!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3B82F6 0%, #10B981 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Bem-vindo! 👋</h1>
            </div>
            <div class="content">
              <p>Olá ${data.clientName},</p>
              <p>Obrigado por se registar em ${data.businessName}!</p>
              <p>Estamos entusiasmados em tê-lo como cliente.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};

// ============================================================================
// WHATSAPP NOTIFICATIONS (Twilio)
// ============================================================================

export const whatsappTemplates = {
  confirmationMessage: (data: NotificationData) =>
    `Olá ${data.clientName}! ✓\n\nSua marcação foi confirmada em ${data.businessName}.\n\n📅 Data: ${data.bookingDate}\n⏰ Hora: ${data.startTime}\n💇 Serviço: ${data.serviceName}\n👤 Profissional: ${data.staffName}\n\nObrigado!`,

  reminderMessage: (data: NotificationData) =>
    `Olá ${data.clientName}! 🔔\n\nLembrete: Tem uma marcação amanhã em ${data.businessName}.\n\n⏰ Hora: ${data.startTime}\n💇 Serviço: ${data.serviceName}\n\nSe não puder comparecer, contacte-nos.`,

  cancellationMessage: (data: NotificationData) =>
    `Olá ${data.clientName}!\n\nSua marcação em ${data.businessName} foi cancelada.\n\nSe deseja reagendar, entre em contacto conosco.`,
};

// ============================================================================
// TELEGRAM NOTIFICATIONS
// ============================================================================

export const telegramTemplates = {
  newBookingNotification: (data: NotificationData) => ({
    text: `📌 Nova Marcação Recebida!\n\n👤 Cliente: ${data.clientName}\n📧 Email: ${data.clientEmail || 'N/A'}\n📞 Telefone: ${data.clientPhone || 'N/A'}\n💇 Serviço: ${data.serviceName}\n👨‍💼 Staff: ${data.staffName}\n📅 Data: ${data.bookingDate}\n⏰ Hora: ${data.startTime}`,
  }),

  confirmationNotification: (data: NotificationData) => ({
    text: `✓ Marcação Confirmada\n\n👤 ${data.clientName}\n💇 ${data.serviceName}\n📅 ${data.bookingDate} às ${data.startTime}`,
  }),
};

// ============================================================================
// SEND FUNCTIONS (Placeholder - requires API keys to implement)
// ============================================================================

/**
 * Send email notification using Resend
 * Requires: RESEND_API_KEY environment variable
 */
export async function sendEmailNotification(
  recipientEmail: string,
  template: 'confirmation' | 'reminder' | 'cancellation' | 'welcome',
  data: NotificationData
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured. Email notifications disabled.');
    return;
  }

  const templates: Record<string, ReturnType<typeof emailTemplates.confirmationEmail>> = {
    confirmation: emailTemplates.confirmationEmail(data),
    reminder: emailTemplates.reminderEmail(data),
    cancellation: emailTemplates.cancellationEmail(data),
    welcome: emailTemplates.welcomeEmail(data),
  };

  const emailTemplate = templates[template];

  // TODO: Implement Resend API call
  // const response = await fetch('https://api.resend.com/emails', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${apiKey}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     from: 'noreply@bookme.pt',
  //     to: recipientEmail,
  //     subject: emailTemplate.subject,
  //     html: emailTemplate.html,
  //   }),
  // });

  console.log(`[EMAIL] Would send to ${recipientEmail}: ${emailTemplate.subject}`);
}

/**
 * Send WhatsApp notification using Twilio
 * Requires: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER
 */
export async function sendWhatsAppNotification(
  recipientPhone: string,
  template: 'confirmation' | 'reminder' | 'cancellation',
  data: NotificationData
): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

  if (!accountSid || !authToken || !whatsappNumber) {
    console.warn('Twilio WhatsApp credentials not configured. WhatsApp notifications disabled.');
    return;
  }

  const templates: Record<string, string> = {
    confirmation: whatsappTemplates.confirmationMessage(data),
    reminder: whatsappTemplates.reminderMessage(data),
    cancellation: whatsappTemplates.cancellationMessage(data),
  };

  const message = templates[template];

  // TODO: Implement Twilio WhatsApp API call
  // const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //   },
  //   body: new URLSearchParams({
  //     From: `whatsapp:${whatsappNumber}`,
  //     To: `whatsapp:${recipientPhone}`,
  //     Body: message,
  //   }).toString(),
  // });

  console.log(`[WHATSAPP] Would send to ${recipientPhone}: ${message.substring(0, 50)}...`);
}

/**
 * Send Telegram notification
 * Requires: TELEGRAM_BOT_TOKEN environment variable
 */
export async function sendTelegramNotification(
  chatId: string,
  template: 'newBooking' | 'confirmation',
  data: NotificationData
): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.warn('TELEGRAM_BOT_TOKEN not configured. Telegram notifications disabled.');
    return;
  }

  const templates: Record<string, ReturnType<typeof telegramTemplates.newBookingNotification>> = {
    newBooking: telegramTemplates.newBookingNotification(data),
    confirmation: telegramTemplates.confirmationNotification(data),
  };

  const telegramTemplate = templates[template];

  // TODO: Implement Telegram Bot API call
  // const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     chat_id: chatId,
  //     text: telegramTemplate.text,
  //     parse_mode: 'HTML',
  //   }),
  // });

  console.log(`[TELEGRAM] Would send to ${chatId}: ${telegramTemplate.text.substring(0, 50)}...`);
}

// ============================================================================
// BATCH NOTIFICATION SENDER
// ============================================================================

export async function sendNotificationBatch(
  channels: ('email' | 'whatsapp' | 'telegram')[],
  data: NotificationData & { recipientEmail?: string; recipientPhone?: string; telegramChatId?: string }
): Promise<void> {
  const promises = [];

  if (channels.includes('email') && data.recipientEmail) {
    promises.push(sendEmailNotification(data.recipientEmail, 'confirmation', data));
  }

  if (channels.includes('whatsapp') && data.recipientPhone) {
    promises.push(sendWhatsAppNotification(data.recipientPhone, 'confirmation', data));
  }

  if (channels.includes('telegram') && data.telegramChatId) {
    promises.push(sendTelegramNotification(data.telegramChatId, 'newBooking', data));
  }

  await Promise.all(promises);
}
