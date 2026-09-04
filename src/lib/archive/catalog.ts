import type { Volume, ChapterSummary, Character, TimelineEntry } from './types';

export type { Volume, ChapterSummary, Character, TimelineEntry };

// ---------------------------------------------------------------------------
// Data arrays — populated by ready() via API calls.
// ---------------------------------------------------------------------------

export const volumes: Volume[] = [];
export const characters: Character[] = [];
export const timeline: TimelineEntry[] = [];

// ---------------------------------------------------------------------------
// Data loading — fetches from /api/archive/* endpoints backed by SQLite.
// ---------------------------------------------------------------------------

async function loadData() {
  try {
    const [volRes, charRes, timeRes] = await Promise.all([
      fetch('/api/archive/catalog'),
      fetch('/api/archive/characters'),
      fetch('/api/archive/timeline'),
    ]);

    if (volRes.ok) {
      const v = await volRes.json();
      volumes.length = 0;
      volumes.push(...(Array.isArray(v) ? v : []));
    }
    if (charRes.ok) {
      const c = await charRes.json();
      characters.length = 0;
      characters.push(...(Array.isArray(c) ? c : []));
    }
    if (timeRes.ok) {
      const t = await timeRes.json();
      timeline.length = 0;
      timeline.push(...(Array.isArray(t) ? t : []));
    }
  } catch {
    // API not available (e.g. during build)
  }
}

let _promise: Promise<void> | null = null;

/**
 * Ensure the archive data has been loaded. Call this (and await it) before
 * reading `volumes`, `characters`, or `timeline`.
 */
export async function ready(): Promise<void> {
  if (!_promise) {
    _promise = loadData();
  }
  return _promise;
}

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

export function getVolume(slug: string): Volume | undefined {
  return volumes.find((v) => v.slug === slug);
}

export function getChapter(slug: string): ChapterSummary | undefined {
  for (const vol of volumes) {
    const ch = vol.chapters.find((c) => c.slug === slug);
    if (ch) return ch;
  }
  return undefined;
}

export function getCharacter(id: string): Character | undefined {
  return characters.find((c) => c.id === id);
}

export function getCharactersBySchool(school: string): Character[] {
  return characters.filter((c) => c.school?.includes(school));
}

export function searchChapters(query: string): ChapterSummary[] {
  const q = query.toLowerCase();
  const results: ChapterSummary[] = [];
  for (const vol of volumes) {
    for (const ch of vol.chapters) {
      if (
        ch.title.toLowerCase().includes(q) ||
        ch.epigraph?.toLowerCase().includes(q)
      ) {
        results.push(ch);
      }
    }
  }
  return results;
}
