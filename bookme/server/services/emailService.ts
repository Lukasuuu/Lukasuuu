/**
 * Email Service — BookMe
 * Sends transactional emails via Resend API
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@bookme.pt';
const FROM_NAME = process.env.RESEND_FROM_NAME || 'BookMe';
const APP_URL = process.env.VITE_APP_URL || 'https://bookme.pt';

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not set — skipping email to', to);
    return false;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: `${FROM_NAME} <${FROM_EMAIL}>`, to, subject, html }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('[Email] Resend error:', err);
      return false;
    }
    return true;
  } catch (e) {
    console.error('[Email] Network error:', e);
    return false;
  }
}

function baseTemplate(content: string, businessName = 'BookMe'): string {
  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body{margin:0;padding:0;background:#0f172a;font-family:Arial,sans-serif;color:#e2e8f0}
    .wrap{max-width:600px;margin:0 auto;padding:32px 16px}
    .card{background:#1e293b;border-radius:12px;overflow:hidden;border:1px solid #334155}
    .hdr{background:linear-gradient(135deg,#3b82f6,#06b6d4);padding:32px;text-align:center}
    .hdr h1{margin:0;color:#fff;font-size:24px}
    .hdr p{margin:8px 0 0;color:rgba(255,255,255,.8);font-size:14px}
    .logo{font-size:28px;font-weight:700;color:#fff;letter-spacing:-1px;margin-bottom:8px}
    .body{padding:32px}
    .row{background:#0f172a;border-left:4px solid #3b82f6;border-radius:4px;padding:12px 16px;margin:10px 0}
    .row span{color:#94a3b8;font-size:13px;display:block}
    .row strong{color:#f1f5f9;font-size:15px}
    .btn{display:inline-block;background:linear-gradient(135deg,#3b82f6,#06b6d4);color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;margin:24px 0}
    .ftr{padding:24px 32px;border-top:1px solid #334155;font-size:12px;color:#64748b;text-align:center}
    .ftr a{color:#3b82f6;text-decoration:none}
  </style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="hdr">
      <div class="logo">B BookMe</div>
      <p>${businessName}</p>
    </div>
    <div class="body">${content}</div>
    <div class="ftr">
      <p>Este email foi enviado automaticamente pelo BookMe. Por favor, não responda a este email.</p>
      <p><a href="${APP_URL}/privacy-policy">Política de Privacidade</a> · <a href="${APP_URL}/terms-and-conditions">Termos e Condições</a></p>
    </div>
  </div>
</div>
</body>
</html>`;
}

export async function sendBookingConfirmation(params: {
  to: string;
  clientName: string;
  serviceName: string;
  staffName: string;
  bookingDate: string;
  startTime: string;
  businessName: string;
  businessPhone?: string;
  bookingId?: string;
}): Promise<boolean> {
  const content = `
    <p style="color:#e2e8f0">Olá <strong>${params.clientName}</strong>,</p>
    <p style="color:#94a3b8">A sua marcação foi confirmada com sucesso! Aqui estão os detalhes:</p>
    <div class="row"><span>📋 Serviço</span><strong>${params.serviceName}</strong></div>
    <div class="row"><span>👤 Profissional</span><strong>${params.staffName}</strong></div>
    <div class="row"><span>📅 Data</span><strong>${params.bookingDate}</strong></div>
    <div class="row"><span>🕐 Hora</span><strong>${params.startTime}</strong></div>
    <div class="row"><span>🏪 Local</span><strong>${params.businessName}</strong></div>
    ${params.businessPhone ? `<div class="row"><span>📞 Contacto</span><strong>${params.businessPhone}</strong></div>` : ''}
    <p style="color:#94a3b8;margin-top:24px">Se precisar cancelar ou reagendar, entre em contacto com ${params.businessName}.</p>
    <a href="${APP_URL}" class="btn">Ver detalhes da marcação</a>`;

  return sendEmail(
    params.to,
    `✅ Marcação confirmada — ${params.businessName}`,
    baseTemplate(content, params.businessName)
  );
}

export async function sendBookingReminder(params: {
  to: string;
  clientName: string;
  serviceName: string;
  staffName: string;
  bookingDate: string;
  startTime: string;
  businessName: string;
  businessPhone?: string;
}): Promise<boolean> {
  const content = `
    <p style="color:#e2e8f0">Olá <strong>${params.clientName}</strong>,</p>
    <p style="color:#94a3b8">Lembrete: tem uma marcação <strong>amanhã</strong>!</p>
    <div class="row"><span>📋 Serviço</span><strong>${params.serviceName}</strong></div>
    <div class="row"><span>👤 Profissional</span><strong>${params.staffName}</strong></div>
    <div class="row"><span>📅 Data</span><strong>${params.bookingDate}</strong></div>
    <div class="row"><span>🕐 Hora</span><strong>${params.startTime}</strong></div>
    <div class="row"><span>🏪 Local</span><strong>${params.businessName}</strong></div>
    ${params.businessPhone ? `<div class="row"><span>📞 Contacto</span><strong>${params.businessPhone}</strong></div>` : ''}
    <p style="color:#94a3b8;margin-top:24px">Até amanhã! 👋</p>`;

  return sendEmail(
    params.to,
    `⏰ Lembrete: marcação amanhã — ${params.businessName}`,
    baseTemplate(content, params.businessName)
  );
}

export async function sendBookingCancellation(params: {
  to: string;
  clientName: string;
  serviceName: string;
  bookingDate: string;
  startTime: string;
  businessName: string;
}): Promise<boolean> {
  const content = `
    <p style="color:#e2e8f0">Olá <strong>${params.clientName}</strong>,</p>
    <p style="color:#94a3b8">A sua marcação foi cancelada.</p>
    <div class="row"><span>📋 Serviço cancelado</span><strong>${params.serviceName}</strong></div>
    <div class="row"><span>📅 Data</span><strong>${params.bookingDate}</strong></div>
    <div class="row"><span>🕐 Hora</span><strong>${params.startTime}</strong></div>
    <p style="color:#94a3b8;margin-top:24px">Se pretender fazer uma nova marcação, aceda ao nosso site.</p>
    <a href="${APP_URL}" class="btn">Fazer nova marcação</a>`;

  return sendEmail(
    params.to,
    `❌ Marcação cancelada — ${params.businessName}`,
    baseTemplate(content, params.businessName)
  );
}

export async function sendWelcomeEmail(params: {
  to: string;
  userName: string;
  businessName: string;
}): Promise<boolean> {
  const content = `
    <p style="color:#e2e8f0">Bem-vindo(a), <strong>${params.userName}</strong>! 🎉</p>
    <p style="color:#94a3b8">A sua conta BookMe foi criada com sucesso. Está pronto(a) para começar a receber marcações online!</p>
    <p style="color:#94a3b8">Com o BookMe pode:</p>
    <ul style="color:#94a3b8;line-height:2">
      <li>Receber marcações online 24/7</li>
      <li>Gerir clientes, serviços e staff</li>
      <li>Enviar notificações automáticas</li>
      <li>Acompanhar métricas do negócio</li>
    </ul>
    <a href="${APP_URL}/dashboard" class="btn">Aceder ao Dashboard</a>`;

  return sendEmail(
    params.to,
    `🎉 Bem-vindo ao BookMe, ${params.businessName}!`,
    baseTemplate(content, params.businessName)
  );
}

export async function sendPaymentConfirmation(params: {
  to: string;
  userName: string;
  plan: string;
  amount: string;
  invoiceUrl?: string;
}): Promise<boolean> {
  const content = `
    <p style="color:#e2e8f0">Olá <strong>${params.userName}</strong>,</p>
    <p style="color:#94a3b8">O seu pagamento foi processado com sucesso!</p>
    <div class="row"><span>📦 Plano</span><strong>BookMe ${params.plan}</strong></div>
    <div class="row"><span>💰 Valor</span><strong>${params.amount}</strong></div>
    <p style="color:#94a3b8;margin-top:24px">O seu plano está agora ativo. Aproveite todas as funcionalidades!</p>
    ${params.invoiceUrl ? `<a href="${params.invoiceUrl}" class="btn">Descarregar Fatura</a>` : `<a href="${APP_URL}/dashboard/billing" class="btn">Ver Faturação</a>`}`;

  return sendEmail(
    params.to,
    `✅ Pagamento confirmado — Plano ${params.plan}`,
    baseTemplate(content)
  );
}

export async function sendPaymentFailed(params: {
  to: string;
  userName: string;
  plan: string;
}): Promise<boolean> {
  const content = `
    <p style="color:#e2e8f0">Olá <strong>${params.userName}</strong>,</p>
    <p style="color:#f87171">Não foi possível processar o seu pagamento para o Plano ${params.plan}.</p>
    <p style="color:#94a3b8">Por favor, verifique os dados do seu cartão e tente novamente.</p>
    <a href="${APP_URL}/dashboard/billing" class="btn">Atualizar método de pagamento</a>`;

  return sendEmail(
    params.to,
    `⚠️ Falha no pagamento — Plano ${params.plan}`,
    baseTemplate(content)
  );
}

export async function sendPlanExpired(params: {
  to: string;
  userName: string;
  plan: string;
}): Promise<boolean> {
  const content = `
    <p style="color:#e2e8f0">Olá <strong>${params.userName}</strong>,</p>
    <p style="color:#94a3b8">A sua subscrição do Plano ${params.plan} expirou. A sua conta foi revertida para o plano Grátis.</p>
    <p style="color:#94a3b8">Pode renovar a qualquer altura para voltar a aceder a todas as funcionalidades.</p>
    <a href="${APP_URL}/dashboard/billing" class="btn">Renovar subscrição</a>`;

  return sendEmail(
    params.to,
    `📧 Subscrição expirada — Plano ${params.plan}`,
    baseTemplate(content)
  );
}

export async function sendContactFormEmail(params: {
  name: string;
  email: string;
  subject: string;
  message: string;
  adminEmail: string;
}): Promise<boolean> {
  const content = `
    <p style="color:#e2e8f0">Nova mensagem do formulário de contacto:</p>
    <div class="row"><span>👤 Nome</span><strong>${params.name}</strong></div>
    <div class="row"><span>📧 Email</span><strong>${params.email}</strong></div>
    <div class="row"><span>📋 Assunto</span><strong>${params.subject}</strong></div>
    <div class="row"><span>💬 Mensagem</span><strong>${params.message}</strong></div>`;

  return sendEmail(
    params.adminEmail,
    `[BookMe] Contacto: ${params.subject}`,
    baseTemplate(content)
  );
}
