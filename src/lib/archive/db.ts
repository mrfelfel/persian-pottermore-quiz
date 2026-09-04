/**
 * Archive data layer — reads directly from SQLite.
 * Replaces the old JSON-based catalog.ts.
 */
import { getDb } from '@/lib/db/schema';

// ── Volume definitions ────────────────────────────────────────────────────────

export const VOLUMES = [
  { id: '01-volume-1-pre-ministry', title: 'جلد اول — پیش از وزارت', icon: '🌍', slug: 'vol-01-pre-ministry' },
  { id: '02-volume-2-birth-of-ministry', title: 'جلد دوم — تولد وزارت', icon: '🏛️', slug: 'vol-02-birth-of-ministry' },
  { id: '03-volume-3-magia', title: 'جلد سوم — مجیا / مجیکا شیلد', icon: '🏫', slug: 'vol-03-magia' },
  { id: '04-volume-4-hogwarts', title: 'جلد چهارم — هاگوارتز', icon: '⚡', slug: 'vol-04-hogwarts' },
  { id: '05-volume-5-other-schools', title: 'جلد پنجم — سایر مدارس', icon: '🏰', slug: 'vol-05-other-schools' },
  { id: '06-volume-6-characters', title: 'جلد ششم — شخصیت‌ها', icon: '👤', slug: 'vol-06-characters' },
  { id: '07-volume-7-identities', title: 'جلد هفتم — هویت‌ها', icon: '🎭', slug: 'vol-07-identities' },
  { id: '08-volume-8-economy', title: 'جلد هشتم — اقتصاد', icon: '💰', slug: 'vol-08-economy' },
  { id: '09-volume-9-social-structure', title: 'جلد نهم — ساختار اجتماعی', icon: '🕸️', slug: 'vol-09-social-structure' },
  { id: '10-volume-10-media', title: 'جلد دهم — رسانه', icon: '📰', slug: 'vol-10-media' },
  { id: '11-volume-11-technology', title: 'جلد یازدهم — تکنولوژی', icon: '💻', slug: 'vol-11-technology' },
  { id: '12-volume-12-conflicts', title: 'جلد دوازدهم — اختلافات', icon: '⚔️', slug: 'vol-12-conflicts' },
  { id: '13-volume-13-ministry-1396', title: 'جلد سیزدهم — وزارت ۱۳۹۶', icon: '🔄', slug: 'vol-13-ministry-1396' },
  { id: '14-volume-14-end-of-generation', title: 'جلد چهاردهم — پایان یک نسل', icon: '🌅', slug: 'vol-14-end-of-generation' },
  { id: '15-volume-15-fantasy-organization', title: 'جلد پانزدهم — سازمان تخیل', icon: '✨', slug: 'vol-15-fantasy-organization' },
  { id: '16-volume-16-return-1405', title: 'جلد شانزدهم — بازگشت ۱۴۰۵', icon: '🔙', slug: 'vol-16-return-1405' },
  { id: '17-special-files', title: 'پرونده‌های ویژه', icon: '📁', slug: 'vol-17-special-files' },
  { id: '18-appendix', title: 'ضمیمه', icon: '📊', slug: 'vol-18-appendix' },
];

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ChapterSummary {
  slug: string;
  title: string;
  epigraph?: string;
  size: number;
}

export interface Volume {
  id: string;
  title: string;
  slug: string;
  icon: string;
  chapters: ChapterSummary[];
}

export interface Character {
  id: string;
  name: string;
  aliases: string[];
  role: string;
  school: string;
  period: string;
  firstAppearance: string;
  abilities: string;
  relations: string;
  projects: string;
  importantEvents: string;
  communityRole: string;
  identityChanges: string;
  lastSeen: string;
  disputes: string;
  epigraph: string;
  content: string;
  metadata: Record<string, string>;
}

export interface TimelineEntry {
  year: string;
  yearGregorian: string;
  events: string[];
}

// ── Parsing helpers (same logic as old build-archive.mjs) ─────────────────────

function extractBlockquote(raw: string): string {
  const lines = raw.split('\n');
  let i = 0;
  if (i < lines.length && lines[i].startsWith('# ')) i++;
  while (i < lines.length && (lines[i].trim() === '' || lines[i].trim() === '---')) i++;

  const limit = Math.min(i + 15, lines.length);
  const bqLines: string[] = [];
  let inBq = false;
  for (; i < limit; i++) {
    const line = lines[i];
    if (line.startsWith('> ')) {
      inBq = true;
      bqLines.push(line.replace(/^>\s?/, ''));
    } else if (inBq && line.trim() === '') {
      bqLines.push('');
    } else if (inBq) {
      break;
    } else if (line.trim() !== '' && line.trim() !== '---') {
      break;
    }
  }
  return bqLines.join('\n').trim();
}

function stripHeaderAndEpigraph(raw: string): string {
  const lines = raw.split('\n');
  let i = 0;
  if (i < lines.length && lines[i].startsWith('# ')) i++;
  while (i < lines.length && (lines[i].trim() === '' || lines[i].trim() === '---')) i++;
  if (i < lines.length && lines[i].startsWith('> ')) {
    while (i < lines.length && (lines[i].startsWith('> ') || (lines[i].trim() === '' && i + 1 < lines.length && lines[i + 1].startsWith('> ')))) {
      i++;
    }
  }
  while (i < lines.length && (lines[i].trim() === '' || lines[i].trim() === '---')) i++;
  return lines.slice(i).join('\n').trim();
}

const CHARACTER_FIELDS: Record<string, string[]> = {
  name:              ['نام'],
  aliases:           ['نام‌های مستعار', 'نام های مستعار'],
  activePeriod:      ['دوره فعالیت', 'دوره فعاليت'],
  firstAppearance:   ['اولین حضور قابل شناسایی', 'اولین حضور'],
  role:              ['نقش'],
  school:            ['مدرسه/سازمان'],
  abilities:         ['توانایی‌ها/مهارت‌ها', 'توانایی ها/مهارت ها'],
  relations:         ['روابط'],
  projects:          ['پروژه‌ها', 'پروژه ها'],
  importantEvents:   ['اتفاقات مهم'],
  communityRole:     ['نقش در جامعه'],
  identityChanges:   ['تغییر هویت در طول زمان'],
  lastSeen:          ['آخرین ردپای قابل مشاهده', 'آخرین ردپا'],
  disputes:          ['اختلافات'],
};

function parseCharacterMetadata(raw: string): Record<string, string> {
  const lines = raw.split('\n');
  const dashIndices: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') dashIndices.push(i);
    if (dashIndices.length >= 3) break;
  }

  let metaStart: number, metaEnd: number;
  if (dashIndices.length >= 3) {
    const hasEpigraph = lines.slice(dashIndices[0] + 1, dashIndices[1]).some(l => l.startsWith('> '));
    metaStart = hasEpigraph ? dashIndices[1] + 1 : dashIndices[0] + 1;
    metaEnd = hasEpigraph ? dashIndices[2] : dashIndices[1];
  } else if (dashIndices.length === 2) {
    metaStart = dashIndices[0] + 1;
    metaEnd = dashIndices[1];
  } else if (dashIndices.length === 1) {
    metaStart = 0;
    metaEnd = dashIndices[0];
  } else {
    return {};
  }

  const metaLines = lines.slice(metaStart, metaEnd);
  const meta: Record<string, string> = {};
  for (const line of metaLines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    if (key) meta[key] = value;
  }

  const result: Record<string, string> = {};
  for (const [engKey, persianKeys] of Object.entries(CHARACTER_FIELDS)) {
    for (const pk of persianKeys) {
      if (meta[pk] !== undefined) {
        result[engKey] = meta[pk];
        break;
      }
    }
  }
  return result;
}

function parseAliases(aliasesStr: string): string[] {
  if (!aliasesStr || aliasesStr === '—' || aliasesStr === '-') return [];
  return aliasesStr.split(/،|,/).map(s => s.trim()).filter(Boolean);
}

// ── Data access ───────────────────────────────────────────────────────────────

export function getCatalog(): Volume[] {
  const db = getDb();
  const pages = db.prepare(`
    SELECT slug, title, content, volume
    FROM wiki_pages
    WHERE volume IS NOT NULL AND volume LIKE 'vol-%'
    ORDER BY slug
  `).all() as { slug: string; title: string; content: string; volume: string }[];

  const volumeMap = new Map<string, Volume>();
  for (const vol of VOLUMES) {
    volumeMap.set(vol.slug, { ...vol, chapters: [] });
  }

  for (const page of pages) {
    const vol = volumeMap.get(page.volume);
    if (!vol) continue;
    // Skip non-chapter pages (like WIKI-DATABASE)
    if (page.slug.endsWith('---WIKI-DATABASE')) continue;
    // Skip character sub-pages in vol-06 (they're duplicates)
    if (page.volume === 'vol-06-characters' && !page.slug.includes('---ch')) continue;

    const epigraph = extractBlockquote(page.content);
    const titleFromContent = (page.content.split('\n').find(l => l.startsWith('# ')) || '').replace(/^#\s+/, '');
    const title = titleFromContent || page.title;

    vol.chapters.push({
      slug: page.slug,
      title,
      epigraph: epigraph || undefined,
      size: Buffer.byteLength(page.content, 'utf-8'),
    });
  }

  return Array.from(volumeMap.values());
}

export function getCharacters(): Character[] {
  const db = getDb();
  // Use vol-06-characters---* pages (these have the latest updated content)
  const pages = db.prepare(`
    SELECT slug, title, content
    FROM wiki_pages
    WHERE slug LIKE 'vol-06-characters---%' AND slug NOT LIKE '%---WIKI-DATABASE'
    ORDER BY slug
  `).all() as { slug: string; title: string; content: string }[];

  return pages.map(page => {
    const meta = parseCharacterMetadata(page.content);
    const epigraph = extractBlockquote(page.content);
    const content = stripHeaderAndEpigraph(page.content);
    // Extract ID from slug: vol-06-characters---hiva → hiva
    const id = page.slug.split('---').pop() || page.slug;

    return {
      id,
      name: meta.name || page.title,
      aliases: parseAliases(meta.aliases || ''),
      role: meta.role || '',
      school: meta.school || '',
      period: meta.activePeriod || '',
      firstAppearance: meta.firstAppearance || '',
      abilities: meta.abilities || '',
      relations: meta.relations || '',
      projects: meta.projects || '',
      importantEvents: meta.importantEvents || '',
      communityRole: meta.communityRole || '',
      identityChanges: meta.identityChanges || '',
      lastSeen: meta.lastSeen || '',
      disputes: meta.disputes || '',
      epigraph,
      content,
      metadata: meta,
    };
  });
}

export function getCharacter(id: string): Character | undefined {
  return getCharacters().find(c => c.id === id);
}

export function getTimeline(): TimelineEntry[] {
  const db = getDb();
  const page = db.prepare(`
    SELECT content FROM wiki_pages WHERE slug LIKE '%timeline%' OR slug LIKE '%time-line%'
  `).get() as { content: string } | undefined;

  if (!page) return [];

  const lines = page.content.split('\n');
  const timeline: TimelineEntry[] = [];
  let currentYear: string | null = null;
  let currentGregorian = '';
  let currentEvents: string[] = [];

  const PERSIAN_YEAR_RE = /^[۰-۹]+$/;

  for (const line of lines) {
    const yearMatch = line.match(/^##\s+(\S+)\s*\(([^)]+)\)/);
    if (yearMatch && PERSIAN_YEAR_RE.test(yearMatch[1])) {
      if (currentYear) {
        timeline.push({ year: currentYear, yearGregorian: currentGregorian, events: currentEvents });
      }
      currentYear = yearMatch[1];
      currentGregorian = yearMatch[2];
      currentEvents = [];
      continue;
    }

    const simpleYearMatch = line.match(/^##\s+(\S+)\s*$/);
    if (simpleYearMatch && PERSIAN_YEAR_RE.test(simpleYearMatch[1])) {
      if (currentYear) {
        timeline.push({ year: currentYear, yearGregorian: currentGregorian || '', events: currentEvents });
      }
      currentYear = simpleYearMatch[1];
      currentGregorian = '';
      currentEvents = [];
      continue;
    }

    const eventMatch = line.match(/^[-*]\s+(.+)/);
    if (eventMatch && currentYear) {
      currentEvents.push(eventMatch[1].trim());
    }
  }

  if (currentYear) {
    timeline.push({ year: currentYear, yearGregorian: currentGregorian || '', events: currentEvents });
  }

  return timeline;
}

export function getChapterContent(slug: string): { content: string; title: string; volume?: string; epigraph?: string } | null {
  const db = getDb();
  const page = db.prepare(`
    SELECT content, title, volume FROM wiki_pages WHERE slug = ?
  `).get(slug) as { content: string; title: string; volume?: string } | undefined;

  if (!page) return null;

  const epigraph = extractBlockquote(page.content);
  const content = stripHeaderAndEpigraph(page.content);
  const titleFromContent = (page.content.split('\n').find(l => l.startsWith('# ')) || '').replace(/^#\s+/, '');

  return {
    content,
    title: titleFromContent || page.title,
    volume: page.volume || undefined,
    epigraph: epigraph || undefined,
  };
}
