import { NextResponse } from 'next/server';
import { getTimeline } from '@/lib/archive/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const timeline = getTimeline();
    return NextResponse.json(timeline);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load timeline' }, { status: 500 });
  }
}
