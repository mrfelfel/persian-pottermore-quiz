import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Try DB first (works locally)
    const { getCatalog } = await import('@/lib/archive/db');
    const catalog = getCatalog();
    return NextResponse.json(catalog);
  } catch {
    try {
      // Fallback: read from MD files directly (for Vercel serverless)
      const { getCatalogFromFiles } = await import('@/lib/archive/files');
      const catalog = getCatalogFromFiles();
      return NextResponse.json(catalog);
    } catch (e) {
      return NextResponse.json({ error: 'Failed to load catalog' }, { status: 500 });
    }
  }
}
