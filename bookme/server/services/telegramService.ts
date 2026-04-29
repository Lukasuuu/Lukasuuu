/**
 * Telegram Service — BookMe
 * Sends notifications via Telegram Bot API
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

async function sendTelegramMessage(chatId: string, text: string): Promise<boolean> {
  if (!BOT_TOKEN) {
    console.warn('[Telegram] TELEGRAM_BOT_TOKEN not set — skipping message to', chatId);
    return false;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('[Telegram] API error:', err);
      return false;
    }
    return true;
  } catch (e) {
    console.error('[Telegram] Network error:', e);
    return false;
  }
}

export async function sendNewBookingAlert(params: {
  chatId: string;
  clientName: string;
  serviceName: string;
  staffName: string;
  bookingDate: string;
  startTime: string;
  price: number;
}): Promise<boolean> {
  const msg = `📅 *Nova marcação!*\n\n👤 *Cliente:* ${params.clientName}\n📋 *Serviço:* ${params.serviceName}\n👤 *Staff:* ${params.staffName}\n📆 *Data:* ${params.bookingDate} às ${params.startTime}\n💰 *Preço:* €${params.price.toFixed(2)}`;
  return sendTelegramMessage(params.chatId, msg);
}

export async function sendBookingCancelledAlert(params: {
  chatId: string;
  clientName: string;
  serviceName: string;
  bookingDate: string;
  startTime: string;
}): Promise<boolean> {
  const msg = `❌ *Marcação cancelada*\n\n👤 *Cliente:* ${params.clientName}\n📋 *Serviço:* ${params.serviceName}\n📆 *Data:* ${params.bookingDate} às ${params.startTime}`;
  return sendTelegramMessage(params.chatId, msg);
}

export async function sendTelegramNotification(chatId: string, message: string): Promise<boolean> {
  return sendTelegramMessage(chatId, message);
}

export async function getTelegramUpdates(): Promise<any[]> {
  if (!BOT_TOKEN) return [];
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
    const data = await res.json();
    return data.result || [];
  } catch {
    return [];
  }
}
