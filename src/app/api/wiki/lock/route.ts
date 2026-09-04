import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { editLocks, users } from '@/lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';

// POST - Lock a page
export async function POST(req: NextRequest) {
  const { slug, userId } = await req.json();
  if (!slug || !userId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Auto-register user if not exists (userId is Telegram chat ID)
  const [existingUser] = await db.select().from(users).where(eq(users.telegramId, userId));
  if (!existingUser) {
    await db.insert(users).values({
      telegramId: userId,
      firstName: 'کاربر',
      role: 'editor',
    });
  }

  // Check existing lock
  const [existing] = await db.select().from(editLocks)
    .where(and(eq(editLocks.pageSlug, slug), gt(editLocks.expiresAt, new Date())));

  if (existing && existing.userId !== userId) {
    return NextResponse.json({ error: 'Page is locked' }, { status: 409 });
  }

  // Upsert lock
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  await db.delete(editLocks).where(eq(editLocks.pageSlug, slug));
  await db.insert(editLocks).values({ pageSlug: slug, userId, expiresAt });

  return NextResponse.json({ success: true });
}

// DELETE - Release a lock
export async function DELETE(req: NextRequest) {
  const { slug, userId } = await req.json();
  if (!slug || !userId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  await db.delete(editLocks).where(and(eq(editLocks.pageSlug, slug), eq(editLocks.userId, userId)));
  return NextResponse.json({ success: true });
}
