import { NextResponse } from 'next/server';
import { getCatalog } from '@/lib/archive/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const catalog = getCatalog();
    return NextResponse.json(catalog);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load catalog' }, { status: 500 });
  }
}
