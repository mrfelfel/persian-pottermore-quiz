/**
 * Archive data layer — reads directly from MD files on disk.
 * Used as fallback on Vercel serverless where SQLite isn't available.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Volume, Character, TimelineEntry } from './types';
import { VOLUMES } from './db';

const ARCHIVE_DIR = path.join(process.cwd(), 'archive');

// ── Parsing helpers (same as db.ts) ──────────────────────────────────────────

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
    if (line.startsWith('> ')) { inBq = true; bqLines.push(line.replace(/^>\s?/, '')); }
    else if (inBq && line.trim() === '') { bqLines.push(''); }
    else if (inBq) { break; }
    else if (line.trim() !== '' && line.trim() !== '---') { break; }
  }
  return bqLines.join('\n').trim();
}

function stripHeaderAndEpigraph(raw: string): string {
  const lines = raw.split('\n');
  let i = 0;
  if (i < lines.length && lines[i].startsWith('# ')) i++;
  while (i < lines.length && (lines[i].trim() === '' || lines[i].trim() === '---')) i++;
  if (i < lines.length && lines[i].startsWith('> ')) {
    while (i < lines.length && (lines[i].startsWith('> ') || (lines[i].trim() === '' && i + 1 < lines.length && lines[i + 1].startsWith('> ')))) { i++; }
  }
  while (i < lines.length && (lines[i].trim() === '' || lines[i].trim() === '---')) i++;
  return lines.slice(i).join('\n').trim();
}

const CHARACTER_FIELDS: Record<string, string[]> = {
  name: ['نام'], aliases: ['نام‌های مستعار', 'نام های مستعار'],
  activePeriod: ['دوره فعالیت', 'دوره فعاليت'], firstAppearance: ['اولین حضور قابل شناسایی', 'اولین حضور'],
  role: ['نقش'], school: ['مدرسه/سازمان'],
  abilities: ['توانایی‌ها/مهارت‌ها', 'توانایی ها/مهارت ها'], relations: ['روابط'],
  projects: ['پروژه‌ها', 'پروژه ها'], importantEvents: ['اتفاقات مهم'],
  communityRole: ['نقش در جامعه'], identityChanges: ['تغییر هویت در طول زمان'],
  lastSeen: ['آخرین ردپای قابل مشاهده', 'آخرین ردپا'], disputes: ['اختلافات'],
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
  } else if (dashIndices.length === 2) { metaStart = dashIndices[0] + 1; metaEnd = dashIndices[1]; }
  else if (dashIndices.length === 1) { metaStart = 0; metaEnd = dashIndices[0]; }
  else { return {}; }
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
    for (const pk of persianKeys) { if (meta[pk] !== undefined) { result[engKey] = meta[pk]; break; } }
  }
  return result;
}

function parseAliases(aliasesStr: string): string[] {
  if (!aliasesStr || aliasesStr === '—' || aliasesStr === '-') return [];
  return aliasesStr.split(/،|,/).map(s => s.trim()).filter(Boolean);
}

function safeReadFile(filePath: string): string | null {
  try { return fs.readFileSync(filePath, 'utf-8'); } catch { return null; }
}

// ── Data access (file-based) ─────────────────────────────────────────────────

export function getCatalogFromFiles(): Volume[] {
  const catalog: Volume[] = VOLUMES.map(vol => ({ ...vol, chapters: [] }));

  for (const vol of catalog) {
    const volDir = path.join(ARCHIVE_DIR, vol.id);
    if (!fs.existsSync(volDir)) continue;
    const files = fs.readdirSync(volDir).filter(f => f.endsWith('.md')).sort();
    for (const filename of files) {
      const raw = safeReadFile(path.join(volDir, filename));
      if (!raw) continue;
      const fileSlug = filename.replace('.md', '');
      const chapterSlug = `${vol.slug}---${fileSlug}`;
      const titleFromContent = (raw.split('\n').find(l => l.startsWith('# ')) || '').replace(/^#\s+/, '');
      vol.chapters.push({
        slug: chapterSlug,
        title: titleFromContent || fileSlug,
        epigraph: extractBlockquote(raw) || undefined,
        size: Buffer.byteLength(raw, 'utf-8'),
      });
    }
  }
  return catalog;
}

export function getCharactersFromFiles(): Character[] {
  const charDir = path.join(ARCHIVE_DIR, '06-volume-6-characters');
  if (!fs.existsSync(charDir)) return [];
  const files = fs.readdirSync(charDir).filter(f => f.endsWith('.md') && f !== 'WIKI-DATABASE.md').sort();
  return files.map(filename => {
    const raw = safeReadFile(path.join(charDir, filename));
    if (!raw) return null;
    const meta = parseCharacterMetadata(raw);
    const content = stripHeaderAndEpigraph(raw);
    return {
      id: filename.replace('.md', ''),
      name: meta.name || filename.replace('.md', ''),
      aliases: parseAliases(meta.aliases || ''),
      role: meta.role || '', school: meta.school || '', period: meta.activePeriod || '',
      firstAppearance: meta.firstAppearance || '', abilities: meta.abilities || '',
      relations: meta.relations || '', projects: meta.projects || '',
      importantEvents: meta.importantEvents || '', communityRole: meta.communityRole || '',
      identityChanges: meta.identityChanges || '', lastSeen: meta.lastSeen || '',
      disputes: meta.disputes || '', epigraph: extractBlockquote(raw),
      content, metadata: meta,
    };
  }).filter(Boolean) as Character[];
}

export function getTimelineFromFiles(): TimelineEntry[] {
  const raw = safeReadFile(path.join(ARCHIVE_DIR, '18-appendix', 'timeline.md'));
  if (!raw) return [];
  const lines = raw.split('\n');
  const timeline: TimelineEntry[] = [];
  let currentYear: string | null = null;
  let currentGregorian = '';
  let currentEvents: string[] = [];
  const PERSIAN_YEAR_RE = /^[۰-۹]+$/;
  for (const line of lines) {
    const yearMatch = line.match(/^##\s+(\S+)\s*\(([^)]+)\)/);
    if (yearMatch && PERSIAN_YEAR_RE.test(yearMatch[1])) {
      if (currentYear) timeline.push({ year: currentYear, yearGregorian: currentGregorian, events: currentEvents });
      currentYear = yearMatch[1]; currentGregorian = yearMatch[2]; currentEvents = []; continue;
    }
    const simpleYearMatch = line.match(/^##\s+(\S+)\s*$/);
    if (simpleYearMatch && PERSIAN_YEAR_RE.test(simpleYearMatch[1])) {
      if (currentYear) timeline.push({ year: currentYear, yearGregorian: currentGregorian || '', events: currentEvents });
      currentYear = simpleYearMatch[1]; currentGregorian = ''; currentEvents = []; continue;
    }
    const eventMatch = line.match(/^[-*]\s+(.+)/);
    if (eventMatch && currentYear) currentEvents.push(eventMatch[1].trim());
  }
  if (currentYear) timeline.push({ year: currentYear, yearGregorian: currentGregorian || '', events: currentEvents });
  return timeline;
}

export function getChapterContentFromFiles(slug: string): { content: string; title: string; volume?: string; epigraph?: string } | null {
  // Try to find the file by slug pattern: vol-XX-name---chapter-name
  for (const vol of VOLUMES) {
    if (!slug.startsWith(vol.slug + '---')) continue;
    const fileSlug = slug.split('---')[1];
    const filePath = path.join(ARCHIVE_DIR, vol.id, `${fileSlug}.md`);
    const raw = safeReadFile(filePath);
    if (!raw) continue;
    const titleFromContent = (raw.split('\n').find(l => l.startsWith('# ')) || '').replace(/^#\s+/, '');
    return {
      content: stripHeaderAndEpigraph(raw),
      title: titleFromContent || fileSlug,
      volume: vol.slug,
      epigraph: extractBlockquote(raw) || undefined,
    };
  }
  return null;
}
