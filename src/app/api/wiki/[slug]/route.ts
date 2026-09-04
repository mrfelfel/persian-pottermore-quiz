import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/schema';

// GET - Fetch a wiki page
export async function GET(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const db = getDb();

  const page = db.prepare(`
    SELECT wp.*,
      u1.first_name as created_by_name,
      u2.first_name as updated_by_name
    FROM wiki_pages wp
    LEFT JOIN users u1 ON wp.created_by = u1.id
    LEFT JOIN users u2 ON wp.updated_by = u2.id
    WHERE wp.slug = ?
  `).get(slug);

  if (!page) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  const lock = db.prepare(`
    SELECT el.*, u.first_name as locked_by_name
    FROM edit_locks el
    JOIN users u ON el.user_id = u.id
    WHERE el.page_slug = ? AND el.expires_at > CURRENT_TIMESTAMP
  `).get(slug);

  return NextResponse.json({ page, lock: lock || null });
}

// PUT - Save a wiki page
export async function PUT(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const { content, summary, userId } = await req.json();

  if (!content || !userId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const db = getDb();

  const lock = db.prepare(`
    SELECT * FROM edit_locks WHERE page_slug = ? AND user_id != ? AND expires_at > CURRENT_TIMESTAMP
  `).get(slug, userId);

  if (lock) {
    return NextResponse.json({ error: 'Page is locked by another user' }, { status: 409 });
  }

  const currentPage = db.prepare('SELECT content FROM wiki_pages WHERE slug = ?').get(slug) as any;

  if (currentPage?.content) {
    db.prepare(`
      INSERT INTO edit_history (page_slug, user_id, content, summary)
      VALUES (?, ?, ?, ?)
    `).run(slug, userId, currentPage.content, summary || '');
  }

  const existing = db.prepare('SELECT slug FROM wiki_pages WHERE slug = ?').get(slug);

  if (existing) {
    db.prepare(`
      UPDATE wiki_pages SET content = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP
      WHERE slug = ?
    `).run(content, userId, slug);
  } else {
    db.prepare(`
      INSERT INTO wiki_pages (slug, title, content, created_by, updated_by)
      VALUES (?, ?, ?, ?, ?)
    `).run(slug, slug, content, userId, userId);
  }

  db.prepare('DELETE FROM edit_locks WHERE page_slug = ? AND user_id = ?').run(slug, userId);

  return NextResponse.json({ success: true });
}
