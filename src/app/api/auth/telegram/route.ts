import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/schema';

export async function POST(req: NextRequest) {
  const { telegramId, firstName, lastName, username, photoUrl } = await req.json();

  if (!telegramId || !firstName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const db = getDb();

  // Upsert user
  const existing = db.prepare('SELECT id FROM users WHERE telegram_id = ?').get(telegramId);

  if (existing) {
    db.prepare(`
      UPDATE users SET first_name = ?, last_name = ?, username = ?, photo_url = ?, last_active = CURRENT_TIMESTAMP
      WHERE telegram_id = ?
    `).run(firstName, lastName || null, username || null, photoUrl || null, telegramId);
  } else {
    db.prepare(`
      INSERT INTO users (telegram_id, first_name, last_name, username, photo_url)
      VALUES (?, ?, ?, ?, ?)
    `).run(telegramId, firstName, lastName || null, username || null, photoUrl || null);
  }

  const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(telegramId);

  return NextResponse.json({ user });
}
