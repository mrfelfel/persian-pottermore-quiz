#!/usr/bin/env node

/**
 * build-archive.mjs
 *
 * Parses Markdown files from /archive/ and generates JSON data files in src/lib/archive/data/.
 *
 * Outputs:
 *   - catalog.json        — volume → chapter index
 *   - chapters/[slug].json — full chapter content
 *   - characters.json      — parsed character profiles
 *   - timeline.json        — parsed timeline events
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

// ── Paths ────────────────────────────────────────────────────────────────────

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ARCHIVE_DIR = path.join(ROOT, 'archive');
const OUT_DIR = path.join(ROOT, 'src', 'lib', 'archive', 'data');

// ── Volume definitions ───────────────────────────────────────────────────────

const VOLUMES = [
  { dir: '01-volume-1-pre-ministry', title: 'جلد اول — پیش از وزارت', icon: '🌍', slug: 'vol-01-pre-ministry' },
  { dir: '02-volume-2-birth-of-ministry', title: 'جلد دوم — تولد وزارت', icon: '🏛️', slug: 'vol-02-birth-of-ministry' },
  { dir: '03-volume-3-magia', title: 'جلد سوم — مجیا / مجیکا شیلد', icon: '🏫', slug: 'vol-03-magia' },
  { dir: '04-volume-4-hogwarts', title: 'جلد چهارم — هاگوارتز', icon: '⚡', slug: 'vol-04-hogwarts' },
  { dir: '05-volume-5-other-schools', title: 'جلد پنجم — سایر مدارس', icon: '🏰', slug: 'vol-05-other-schools' },
  { dir: '06-volume-6-characters', title: 'جلد ششم — شخصیت‌ها', icon: '👤', slug: 'vol-06-characters' },
  { dir: '07-volume-7-identities', title: 'جلد هفتم — هویت‌ها', icon: '🎭', slug: 'vol-07-identities' },
  { dir: '08-volume-8-economy', title: 'جلد هشتم — اقتصاد', icon: '💰', slug: 'vol-08-economy' },
  { dir: '09-volume-9-social-structure', title: 'جلد نهم — ساختار اجتماعی', icon: '🕸️', slug: 'vol-09-social-structure' },
  { dir: '10-volume-10-media', title: 'جلد دهم — رسانه', icon: '📰', slug: 'vol-10-media' },
  { dir: '11-volume-11-technology', title: 'جلد یازدهم — تکنولوژی', icon: '💻', slug: 'vol-11-technology' },
  { dir: '12-volume-12-conflicts', title: 'جلد دوازدهم — اختلافات', icon: '⚔️', slug: 'vol-12-conflicts' },
  { dir: '13-volume-13-ministry-1396', title: 'جلد سیزدهم — وزارت ۱۳۹۶', icon: '🔄', slug: 'vol-13-ministry-1396' },
  { dir: '14-volume-14-end-of-generation', title: 'جلد چهاردهم — پایان یک نسل', icon: '🌅', slug: 'vol-14-end-of-generation' },
  { dir: '15-volume-15-fantasy-organization', title: 'جلد پانزدهم — سازمان تخیل', icon: '✨', slug: 'vol-15-fantasy-organization' },
  { dir: '16-volume-16-return-1405', title: 'جلد شانزدهم — بازگشت ۱۴۰۵', icon: '🔙', slug: 'vol-16-return-1405' },
  { dir: '17-special-files', title: 'پرونده‌های ویژه', icon: '📁', slug: 'vol-17-special-files' },
  { dir: '18-appendix', title: 'ضمیمه', icon: '📊', slug: 'vol-18-appendix' },
];

// ── Character metadata fields ────────────────────────────────────────────────

const CHARACTER_FIELDS = {
  name:              ['نام'],
  aliases:           ['نام‌های مستعار', 'نام های مستعار'],
  activePeriod:      ['دوره فعالیت', 'دوره فعاليت'],
  firstAppearance:   ['اولین حضور قابل شناسایی', 'اولین حضور'],
  role:              ['نقش'],
  school:            ['مدرسه/سازمان', 'مدرسه/سازمان'],
  abilities:         ['توانایی‌ها/مهارت‌ها', 'توانایی ها/مهارت ها'],
  relations:         ['روابط'],
  projects:          ['پروژه‌ها', 'پروژه ها'],
  importantEvents:   ['اتفاقات مهم'],
  communityRole:     ['نقش در جامعه'],
  identityChanges:   ['تغییر هویت در طول زمان'],
  lastSeen:          ['آخرین ردپای قابل مشاهده', 'آخرین ردپا'],
  disputes:          ['اختلافات'],
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Return the file stem (filename without extension) */
function fileSlug(filename) {
  return path.basename(filename, '.md');
}

/** Read file, return { data, content } from gray-matter. Returns null on error. */
function safeRead(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return matter(raw);
  } catch {
    return null;
  }
}

/** Extract epigraph blockquote that appears near the start of the file (after H1). */
function extractBlockquote(raw) {
  const lines = raw.split('\n');
  // Skip H1 and leading blank lines / ---
  let i = 0;
  if (i < lines.length && lines[i].startsWith('# ')) i++;
  while (i < lines.length && (lines[i].trim() === '' || lines[i].trim() === '---')) i++;

  // Scan up to 15 lines from this position for a blockquote
  const limit = Math.min(i + 15, lines.length);
  const bqLines = [];
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
      // Hit non-blank, non-blockquote content — no epigraph
      break;
    }
  }
  return bqLines.join('\n').trim();
}

/**
 * Strip H1 line and leading blockquote from raw markdown, return remaining content.
 * This gives the "body" of the chapter.
 */
function stripHeaderAndEpigraph(raw) {
  const lines = raw.split('\n');
  let i = 0;

  // skip H1 line
  if (i < lines.length && lines[i].startsWith('# ')) i++;

  // skip blank lines / --- after H1
  while (i < lines.length && (lines[i].trim() === '' || lines[i].trim() === '---')) i++;

  // skip blockquote if present
  if (i < lines.length && lines[i].startsWith('> ')) {
    while (i < lines.length && (lines[i].startsWith('> ') || (lines[i].trim() === '' && i + 1 < lines.length && lines[i + 1].startsWith('> ')))) {
      i++;
    }
  }

  // skip trailing blank lines / ---
  while (i < lines.length && (lines[i].trim() === '' || lines[i].trim() === '---')) i++;

  return lines.slice(i).join('\n').trim();
}

/** Extract H2 and H3 headings as section headings. */
function extractSections(markdown) {
  const sections = [];
  for (const line of markdown.split('\n')) {
    const m = line.match(/^#{2,3}\s+(.+)/);
    if (m) sections.push(m[1].trim());
  }
  return sections;
}

/** Parse character key-value metadata from raw markdown.
 *  Handles three layouts:
 *    - With epigraph:    H1, ---, > blockquote, ---, metadata, ---, content  (3 dashes)
 *    - Without epigraph: H1, ---, metadata, ---, content  (2 dashes)
 *    - Metadata at top:  metadata, ---, content  (1 dash — e.g. sami.md)
 */
function parseCharacterMetadata(raw) {
  const lines = raw.split('\n');

  // Find all --- line indices
  const dashIndices = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') dashIndices.push(i);
    if (dashIndices.length >= 3) break;
  }

  let metaStart, metaEnd;

  if (dashIndices.length >= 3) {
    // 3 dashes: H1, ---, blockquote, ---, metadata, ---, content
    const hasEpigraph = lines.slice(dashIndices[0] + 1, dashIndices[1])
      .some(l => l.startsWith('> '));
    metaStart = hasEpigraph ? dashIndices[1] + 1 : dashIndices[0] + 1;
    metaEnd = hasEpigraph ? dashIndices[2] : dashIndices[1];
  } else if (dashIndices.length === 2) {
    // 2 dashes: H1, ---, metadata, ---, content
    metaStart = dashIndices[0] + 1;
    metaEnd = dashIndices[1];
  } else if (dashIndices.length === 1) {
    // 1 dash: metadata, ---, content (no H1 header)
    metaStart = 0;
    metaEnd = dashIndices[0];
  } else {
    return {};
  }

  const metaLines = lines.slice(metaStart, metaEnd);
  const meta = {};
  for (const line of metaLines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    if (key) meta[key] = value;
  }

  const result = {};

  // Map Persian keys to English fields
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

/** Parse aliases string into an array. */
function parseAliases(aliasesStr) {
  if (!aliasesStr || aliasesStr === '—' || aliasesStr === '-') return [];
  return aliasesStr.split(/،|,/).map(s => s.trim()).filter(Boolean);
}

/** Extract filename from the archive-relative path. */
function archivePath(dir, filename) {
  return `${dir}/${filename}`;
}

// ── Build functions ──────────────────────────────────────────────────────────

function buildCatalog() {
  const catalog = [];

  for (const vol of VOLUMES) {
    const volDir = path.join(ARCHIVE_DIR, vol.dir);
    if (!fs.existsSync(volDir)) {
      console.warn(`  ⚠ Volume dir not found: ${vol.dir}`);
      catalog.push({ ...vol, chapters: [] });
      continue;
    }

    const files = fs.readdirSync(volDir)
      .filter(f => f.endsWith('.md'))
      .sort();

    const chapters = files.map(filename => {
      const filePath = path.join(volDir, filename);
      const parsed = safeRead(filePath);
      if (!parsed) return null;

      const { data } = parsed;
      const raw = fs.readFileSync(filePath, 'utf-8');
      const title = data.title || (parsed.content.split('\n').find(l => l.startsWith('# ')) || '').replace(/^#\s+/, '') || fileSlug(filename);
      const epigraph = extractBlockquote(raw);
      const size = Buffer.byteLength(raw, 'utf-8');
      const chapterSlug = vol.slug + '---' + fileSlug(filename);

      return {
        slug: chapterSlug,
        title,
        epigraph,
        file: archivePath(vol.dir, filename),
        size,
      };
    }).filter(Boolean);

    catalog.push({
      id: vol.dir,
      title: vol.title,
      slug: vol.slug,
      icon: vol.icon,
      chapters,
    });
  }

  return catalog;
}

function buildChapterFiles(catalog) {
  const chaptersDir = path.join(OUT_DIR, 'chapters');
  fs.mkdirSync(chaptersDir, { recursive: true });

  let count = 0;
  for (const vol of catalog) {
    for (const ch of vol.chapters) {
      const filePath = path.join(ARCHIVE_DIR, ch.file);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = safeRead(filePath);
      if (!parsed) continue;

      const content = stripHeaderAndEpigraph(raw);
      const sections = extractSections(raw);

      const chapterData = {
        slug: ch.slug,
        title: ch.title,
        volume: vol.slug,
        volumeTitle: vol.title,
        epigraph: ch.epigraph,
        content,
        sections,
        size: ch.size,
      };

      fs.writeFileSync(
        path.join(chaptersDir, `${ch.slug}.json`),
        JSON.stringify(chapterData, null, 2),
        'utf-8',
      );
      count++;
    }
  }

  return count;
}

function buildCharacters() {
  const charDir = path.join(ARCHIVE_DIR, '06-volume-6-characters');
  if (!fs.existsSync(charDir)) {
    console.warn('  ⚠ Characters directory not found');
    return [];
  }

  const files = fs.readdirSync(charDir)
    .filter(f => f.endsWith('.md') && f !== 'WIKI-DATABASE.md')
    .sort();

  const characters = files.map(filename => {
    const filePath = path.join(charDir, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = safeRead(filePath);
    if (!parsed) return null;

    const meta = parseCharacterMetadata(raw);
    const epigraph = extractBlockquote(raw);
    const content = stripHeaderAndEpigraph(parsed.content);

    return {
      id: fileSlug(filename),
      name: meta.name || fileSlug(filename),
      aliases: parseAliases(meta.aliases),
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
      file: archivePath('06-volume-6-characters', filename),
      content,
    };
  }).filter(Boolean);

  return characters;
}

function buildTimeline() {
  const timelinePath = path.join(ARCHIVE_DIR, '18-appendix', 'timeline.md');
  if (!fs.existsSync(timelinePath)) {
    console.warn('  ⚠ Timeline file not found');
    return [];
  }

  const raw = fs.readFileSync(timelinePath, 'utf-8');
  const lines = raw.split('\n');

  const timeline = [];
  let currentYear = null;
  let currentGregorian = '';
  let currentEvents = [];

  // Match Persian year digits (۱-۹ combined into year numbers like ۱۳۹۰)
  const PERSIAN_YEAR_RE = /^[۰-۹]+$/;

  for (const line of lines) {
    // Match H2 year headers like ## ۱۳۹۰ (۲۰۱۱-۲۰۱۲)
    const yearMatch = line.match(/^##\s+(\S+)\s*\(([^)]+)\)/);
    if (yearMatch && PERSIAN_YEAR_RE.test(yearMatch[1])) {
      if (currentYear) {
        timeline.push({
          year: currentYear,
          yearGregorian: currentGregorian,
          events: currentEvents,
        });
      }
      currentYear = yearMatch[1];
      currentGregorian = yearMatch[2];
      currentEvents = [];
      continue;
    }

    // Match H2 year headers without Gregorian like ## ۱۳۹۰
    const simpleYearMatch = line.match(/^##\s+(\S+)\s*$/);
    if (simpleYearMatch && PERSIAN_YEAR_RE.test(simpleYearMatch[1])) {
      if (currentYear) {
        timeline.push({
          year: currentYear,
          yearGregorian: currentGregorian || '',
          events: currentEvents,
        });
      }
      currentYear = simpleYearMatch[1];
      currentGregorian = '';
      currentEvents = [];
      continue;
    }

    // Extract list items as events
    const eventMatch = line.match(/^[-*]\s+(.+)/);
    if (eventMatch && currentYear) {
      currentEvents.push(eventMatch[1].trim());
    }
  }

  // Push last year
  if (currentYear) {
    timeline.push({
      year: currentYear,
      yearGregorian: currentGregorian || '',
      events: currentEvents,
    });
  }

  return timeline;
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log('Building archive data files…');
console.log(`  Archive dir : ${ARCHIVE_DIR}`);
console.log(`  Output dir  : ${OUT_DIR}`);
console.log('');

// Ensure output directories
fs.mkdirSync(path.join(OUT_DIR, 'chapters'), { recursive: true });

// 1. catalog.json
console.log('1/4  Building catalog…');
const catalog = buildCatalog();
const totalChapters = catalog.reduce((n, v) => n + v.chapters.length, 0);
fs.writeFileSync(
  path.join(OUT_DIR, 'catalog.json'),
  JSON.stringify(catalog, null, 2),
  'utf-8',
);
console.log(`     ✓ catalog.json — ${catalog.length} volumes, ${totalChapters} chapters`);

// 2. chapters/*.json
console.log('2/4  Building chapter files…');
const chapterCount = buildChapterFiles(catalog);
console.log(`     ✓ chapters/ — ${chapterCount} JSON files`);

// 3. characters.json
console.log('3/4  Building characters…');
const characters = buildCharacters();
fs.writeFileSync(
  path.join(OUT_DIR, 'characters.json'),
  JSON.stringify(characters, null, 2),
  'utf-8',
);
console.log(`     ✓ characters.json — ${characters.length} profiles`);

// 4. timeline.json
console.log('4/4  Building timeline…');
const timeline = buildTimeline();
fs.writeFileSync(
  path.join(OUT_DIR, 'timeline.json'),
  JSON.stringify(timeline, null, 2),
  'utf-8',
);
console.log(`     ✓ timeline.json — ${timeline.length} years`);

console.log('');
console.log('Done.');
