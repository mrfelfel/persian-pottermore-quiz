#!/usr/bin/env node
/**
 * Seed the SQLite database directly from Markdown archive files.
 * Run: npm run db:seed
 *
 * The database is the single source of truth for the app.
 * MD files serve as the original content source and backup.
 */
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ARCHIVE_DIR = path.join(ROOT, 'archive');
const DB_PATH = path.join(ROOT, 'data', 'wiki.db');

// Volume definitions — must match src/lib/archive/db.ts
const VOLUMES = [
  { dir: '01-volume-1-pre-ministry', title: 'جلد اول — پیش از وزارت', slug: 'vol-01-pre-ministry' },
  { dir: '02-volume-2-birth-of-ministry', title: 'جلد دوم — تولد وزارت', slug: 'vol-02-birth-of-ministry' },
  { dir: '03-volume-3-magia', title: 'جلد سوم — مجیا / مجیکا شیلد', slug: 'vol-03-magia' },
  { dir: '04-volume-4-hogwarts', title: 'جلد چهارم — هاگوارتز', slug: 'vol-04-hogwarts' },
  { dir: '05-volume-5-other-schools', title: 'جلد پنجم — سایر مدارس', slug: 'vol-05-other-schools' },
  { dir: '06-volume-6-characters', title: 'جلد ششم — شخصیت‌ها', slug: 'vol-06-characters' },
  { dir: '07-volume-7-identities', title: 'جلد هفتم — هویت‌ها', slug: 'vol-07-identities' },
  { dir: '08-volume-8-economy', title: 'جلد هشتم — اقتصاد', slug: 'vol-08-economy' },
  { dir: '09-volume-9-social-structure', title: 'جلد نهم — ساختار اجتماعی', slug: 'vol-09-social-structure' },
  { dir: '10-volume-10-media', title: 'جلد دهم — رسانه', slug: 'vol-10-media' },
  { dir: '11-volume-11-technology', title: 'جلد یازدهم — تکنولوژی', slug: 'vol-11-technology' },
  { dir: '12-volume-12-conflicts', title: 'جلد دوازدهم — اختلافات', slug: 'vol-12-conflicts' },
  { dir: '13-volume-13-ministry-1396', title: 'جلد سیزدهم — وزارت ۱۳۹۶', slug: 'vol-13-ministry-1396' },
  { dir: '14-volume-14-end-of-generation', title: 'جلد چهاردهم — پایان یک نسل', slug: 'vol-14-end-of-generation' },
  { dir: '15-volume-15-fantasy-organization', title: 'جلد پانزدهم — سازمان تخیل', slug: 'vol-15-fantasy-organization' },
  { dir: '16-volume-16-return-1405', title: 'جلد شانزدهم — بازگشت ۱۴۰۵', slug: 'vol-16-return-1405' },
  { dir: '17-special-files', title: 'پرونده‌های ویژه', slug: 'vol-17-special-files' },
  { dir: '18-appendix', title: 'ضمیمه', slug: 'vol-18-appendix' },
];

// Ensure data directory
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

console.log('🗄️  Initializing database...');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    telegram_id INTEGER UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT,
    username TEXT,
    photo_url TEXT,
    role TEXT DEFAULT 'viewer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS wiki_pages (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    volume TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(id),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS edit_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_slug TEXT NOT NULL REFERENCES wiki_pages(slug),
    user_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    summary TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS edit_locks (
    page_slug TEXT PRIMARY KEY REFERENCES wiki_pages(slug),
    user_id INTEGER REFERENCES users(id),
    locked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_edit_history_slug ON edit_history(page_slug);
  CREATE INDEX IF NOT EXISTS idx_wiki_pages_volume ON wiki_pages(volume);
`);

// Admin user
const adminExists = db.prepare('SELECT id FROM users WHERE telegram_id = ?').get(999999999);
if (!adminExists) {
  db.prepare('INSERT INTO users (telegram_id, first_name, username, role) VALUES (?, ?, ?, ?)')
    .run(999999999, 'theAIGOD', 'theAIGOD', 'admin');
  console.log('✅ Admin user "theAIGOD" created');
}

const insert = db.prepare(`
  INSERT OR IGNORE INTO wiki_pages (slug, title, content, volume, created_by, updated_by)
  VALUES (?, ?, ?, ?, 1, 1)
`);

// Seed chapters from MD files
let chapterCount = 0;
for (const vol of VOLUMES) {
  const volDir = path.join(ARCHIVE_DIR, vol.dir);
  if (!fs.existsSync(volDir)) continue;

  const files = fs.readdirSync(volDir).filter(f => f.endsWith('.md')).sort();
  for (const filename of files) {
    const filePath = path.join(volDir, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(raw);
    const fileSlug = filename.replace('.md', '');
    const slug = `${vol.slug}---${fileSlug}`;
    const titleFromContent = (raw.split('\n').find(l => l.startsWith('# ')) || '').replace(/^#\s+/, '');
    const title = titleFromContent || parsed.data.title || fileSlug;

    insert.run(slug, title, raw, vol.slug);
    chapterCount++;
  }
}
console.log(`✅ Seeded ${chapterCount} chapters from MD files`);

// Seed characters from MD files
const charDir = path.join(ARCHIVE_DIR, '06-volume-6-characters');
if (fs.existsSync(charDir)) {
  const charFiles = fs.readdirSync(charDir)
    .filter(f => f.endsWith('.md') && f !== 'WIKI-DATABASE.md')
    .sort();

  for (const filename of charFiles) {
    const filePath = path.join(charDir, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const fileSlug = filename.replace('.md', '');
    const slug = `character-${fileSlug}`;
    const titleFromContent = (raw.split('\n').find(l => l.startsWith('# ')) || '').replace(/^#\s+/, '');

    insert.run(slug, titleFromContent || fileSlug, raw, 'characters');
  }
  console.log(`✅ Seeded ${charFiles.length} character profiles`);
}

// Seed timeline
const timelinePath = path.join(ARCHIVE_DIR, '18-appendix', 'timeline.md');
if (fs.existsSync(timelinePath)) {
  const raw = fs.readFileSync(timelinePath, 'utf-8');
  insert.run('vol-18-appendix---timeline', 'خط زمانی', raw, 'vol-18-appendix');
  console.log('✅ Seeded timeline');
}

db.close();
console.log('🎉 Database seeded successfully at', DB_PATH);
