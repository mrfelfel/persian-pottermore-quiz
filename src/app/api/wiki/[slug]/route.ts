import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { wikiPages, users, editHistory, editLocks } from '@/lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';

// GET - Fetch a wiki page
export async function GET(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;

  const [page] = await db
    .select({
      slug: wikiPages.slug,
      title: wikiPages.title,
      content: wikiPages.content,
      volume: wikiPages.volume,
      createdBy: wikiPages.createdBy,
      createdAt: wikiPages.createdAt,
      updatedBy: wikiPages.updatedBy,
      updatedAt: wikiPages.updatedAt,
      createdByName: users.firstName,
    })
    .from(wikiPages)
    .leftJoin(users, eq(wikiPages.createdBy, users.id))
    .where(eq(wikiPages.slug, slug));

  if (!page) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  const [lock] = await db
    .select()
    .from(editLocks)
    .innerJoin(users, eq(editLocks.userId, users.id))
    .where(and(eq(editLocks.pageSlug, slug), gt(editLocks.expiresAt, new Date())));

  return NextResponse.json({ page, lock: lock || null });
}

// PUT - Save a wiki page
export async function PUT(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const { content, summary, userId } = await req.json();

  if (!content || !userId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Check lock — allow save only if no lock or lock belongs to this user
  const [existingLock] = await db
    .select()
    .from(editLocks)
    .where(and(eq(editLocks.pageSlug, slug), gt(editLocks.expiresAt, new Date())));

  if (existingLock && existingLock.userId !== userId) {
    return NextResponse.json({ error: 'Page is locked by another user' }, { status: 409 });
  }

  // Save current content to history
  const [currentPage] = await db.select().from(wikiPages).where(eq(wikiPages.slug, slug));
  if (currentPage?.content) {
    await db.insert(editHistory).values({
      pageSlug: slug,
      userId,
      content: currentPage.content,
      summary: summary || '',
    });
  }

  // Update or insert page
  if (currentPage) {
    await db.update(wikiPages)
      .set({ content, updatedBy: userId, updatedAt: new Date() })
      .where(eq(wikiPages.slug, slug));
  } else {
    await db.insert(wikiPages).values({
      slug,
      title: slug,
      content,
      createdBy: userId,
      updatedBy: userId,
    });
  }

  // Remove lock
  await db.delete(editLocks).where(and(eq(editLocks.pageSlug, slug), eq(editLocks.userId, userId)));

  return NextResponse.json({ success: true });
}
