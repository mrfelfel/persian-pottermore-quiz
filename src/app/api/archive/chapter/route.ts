import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
  }

  try {
    const { getChapterContent } = await import('@/lib/archive/db');
    const chapter = getChapterContent(slug);
    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }
    return NextResponse.json(chapter);
  } catch {
    try {
      const { getChapterContentFromFiles } = await import('@/lib/archive/files');
      const chapter = getChapterContentFromFiles(slug);
      if (!chapter) {
        return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
      }
      return NextResponse.json(chapter);
    } catch (e) {
      return NextResponse.json({ error: 'Failed to load chapter' }, { status: 500 });
    }
  }
}
