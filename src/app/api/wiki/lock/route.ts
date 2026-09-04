import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/schema';

const LOCK_DURATION = 30 * 60; // 30 minutes in seconds

// POST - Acquire lock
export async function POST(req: NextRequest) {
  const { slug, userId } = await req.json();

  if (!slug || !userId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const db = getDb();

  // Check existing lock
  const existing = db.prepare(`
    SELECT * FROM edit_locks WHERE page_slug = ? AND expires_at > CURRENT_TIMESTAMP
  `).get(slug) as any;

  if (existing && existing.user_id !== userId) {
    return NextResponse.json({
      error: 'Page is locked',
      lockedBy: existing.user_id,
      expiresAt: existing.expires_at
    }, { status: 409 });
  }

  // Acquire or extend lock
  db.prepare(`
    INSERT OR REPLACE INTO edit_locks (page_slug, user_id, locked_at, expires_at)
    VALUES (?, ?, CURRENT_TIMESTAMP, datetime(CURRENT_TIMESTAMP, '+${LOCK_DURATION} seconds'))
  `).run(slug, userId);

  return NextResponse.json({ success: true });
}

// DELETE - Release lock
export async function DELETE(req: NextRequest) {
  const { slug, userId } = await req.json();

  const db = getDb();
  db.prepare('DELETE FROM edit_locks WHERE page_slug = ? AND user_id = ?').run(slug, userId);

  return NextResponse.json({ success: true });
}
