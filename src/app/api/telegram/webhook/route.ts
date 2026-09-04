import { NextRequest, NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://vezaratjadoo.vercel.app';

async function sendMessage(chatId: number, text: string, replyMarkup?: object) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const body: Record<string, unknown> = { chat_id: chatId, text, parse_mode: 'HTML' };
  if (replyMarkup) body.reply_markup = replyMarkup;
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    const message = update.message || update.callback_query?.message;
    const chatId = message?.chat?.id;
    const text = message?.text || update.callback_query?.data;

    if (!chatId) return NextResponse.json({ ok: true });

    if (text === '/start') {
      await sendMessage(chatId,
        ' wizard وزارت سحر و جادو\n\nبه دنیای جادوگری فارسی خوش اومدی!',
        {
          inline_keyboard: [[
            { text: ' وارد شو', web_app: { url: APP_URL } }
          ]]
        }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: true });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Telegram webhook active' });
}
