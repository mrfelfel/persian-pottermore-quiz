import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { wikiPages } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  const pages = await db
    .select({ slug: wikiPages.slug, title: wikiPages.title, volume: wikiPages.volume, updatedAt: wikiPages.updatedAt })
    .from(wikiPages)
    .orderBy(desc(wikiPages.updatedAt));

  return NextResponse.json(pages);
}
