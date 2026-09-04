import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const { telegramId, firstName, lastName, username, photoUrl } = await req.json();

  if (!telegramId || !firstName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Upsert user
  const [existing] = await db.select().from(users).where(eq(users.telegramId, telegramId));

  if (existing) {
    await db.update(users)
      .set({ firstName, lastName: lastName || null, username: username || null, photoUrl: photoUrl || null, lastActive: new Date() })
      .where(eq(users.telegramId, telegramId));
  } else {
    await db.insert(users).values({ telegramId, firstName, lastName: lastName || null, username: username || null, photoUrl: photoUrl || null });
  }

  const [user] = await db.select().from(users).where(eq(users.telegramId, telegramId));
  return NextResponse.json({ user });
}
