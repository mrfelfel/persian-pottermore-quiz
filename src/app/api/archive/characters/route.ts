import { NextResponse } from 'next/server';
import { getCharacters } from '@/lib/archive/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const characters = getCharacters();
    return NextResponse.json(characters);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load characters' }, { status: 500 });
  }
}
