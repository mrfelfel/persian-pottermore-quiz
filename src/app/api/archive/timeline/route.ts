import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { getTimeline } = await import('@/lib/archive/db');
    const timeline = getTimeline();
    return NextResponse.json(timeline);
  } catch {
    try {
      const { getTimelineFromFiles } = await import('@/lib/archive/files');
      const timeline = getTimelineFromFiles();
      return NextResponse.json(timeline);
    } catch (e) {
      return NextResponse.json({ error: 'Failed to load timeline' }, { status: 500 });
    }
  }
}
