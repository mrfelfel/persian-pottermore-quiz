import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { getCharacters } = await import('@/lib/archive/db');
    const characters = getCharacters();
    return NextResponse.json(characters);
  } catch {
    try {
      const { getCharactersFromFiles } = await import('@/lib/archive/files');
      const characters = getCharactersFromFiles();
      return NextResponse.json(characters);
    } catch (e) {
      return NextResponse.json({ error: 'Failed to load characters' }, { status: 500 });
    }
  }
}
