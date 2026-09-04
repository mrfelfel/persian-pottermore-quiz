import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { editHistory, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;

  const history = await db
    .select({
      id: editHistory.id,
      summary: editHistory.summary,
      createdAt: editHistory.createdAt,
      editor: users.firstName,
    })
    .from(editHistory)
    .leftJoin(users, eq(editHistory.userId, users.id))
    .where(eq(editHistory.pageSlug, slug))
    .orderBy(desc(editHistory.createdAt))
    .limit(20);

  return NextResponse.json(history);
}
