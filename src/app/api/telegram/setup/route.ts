import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8848984430:AAHKOIyORxHiCL_irFEhSnnvQvYz6hXrcRo';

export async function GET() {
  const webhookUrl = `https://persian-pottermore-quiz.vercel.app/api/telegram/webhook`;

  try {
    // Remove old webhook
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`);

    // Set new webhook
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ['message', 'callback_query'],
      }),
    });
    const data = await res.json();

    return NextResponse.json({
      success: data.ok,
      webhookUrl,
      result: data.result,
      description: data.description,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 });
  }
}
