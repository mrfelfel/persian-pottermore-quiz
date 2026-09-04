import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { editHistory } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;

  const history = await db
    .select()
    .from(editHistory)
    .where(eq(editHistory.pageSlug, slug))
    .orderBy(desc(editHistory.createdAt))
    .limit(20);

  return NextResponse.json(history);
}
