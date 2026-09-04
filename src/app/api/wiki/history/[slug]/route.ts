import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/schema';

export async function GET(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const db = getDb();

  const history = db.prepare(`
    SELECT eh.*, u.first_name as user_name, u.username
    FROM edit_history eh
    JOIN users u ON eh.user_id = u.id
    WHERE eh.page_slug = ?
    ORDER BY eh.created_at DESC
    LIMIT 50
  `).all(slug);

  return NextResponse.json({ history });
}
