#!/usr/bin/env node
/**
 * Seed the SQLite database with all archive content.
 * Run this after build to populate the database for production.
 * On Vercel, this runs as part of the build step.
 */
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'wiki.db');
const CHAPTERS_PATH = path.join(process.cwd(), 'src', 'lib', 'archive', 'data', 'chapters.json');
const CHARACTERS_PATH = path.join(process.cwd(), 'src', 'lib', 'archive', 'data', 'characters.json');

// Ensure data directory exists
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

// Create admin user (theAIGOD)
const adminExists = db.prepare('SELECT id FROM users WHERE telegram_id = ?').get(999999999);
if (!adminExists) {
  db.prepare('INSERT INTO users (telegram_id, first_name, username, role) VALUES (?, ?, ?, ?)')
    .run(999999999, 'theAIGOD', 'theAIGOD', 'admin');
  console.log('✅ Admin user "theAIGOD" created');
}

// Seed chapters from JSON
if (fs.existsSync(CHAPTERS_PATH)) {
  console.log('📚 Seeding chapters...');
  const chapters = JSON.parse(fs.readFileSync(CHAPTERS_PATH, 'utf8'));
  const insert = db.prepare(`
    INSERT OR IGNORE INTO wiki_pages (slug, title, content, volume, created_by, updated_by)
    VALUES (?, ?, ?, ?, 1, 1)
  `);
  let count = 0;
  for (const [slug, chapter] of Object.entries(chapters)) {
    const ch = chapter;
    insert.run(slug, ch.title || slug, ch.content || '', ch.volume || null);
    count++;
  }
  console.log(`✅ Seeded ${count} chapters`);
} else {
  console.log('⚠️  chapters.json not found, skipping chapter seed');
}

// Seed characters from JSON
if (fs.existsSync(CHARACTERS_PATH)) {
  console.log('👤 Seeding characters...');
  const characters = JSON.parse(fs.readFileSync(CHARACTERS_PATH, 'utf8'));
  const insert = db.prepare(`
    INSERT OR IGNORE INTO wiki_pages (slug, title, content, volume, created_by, updated_by)
    VALUES (?, ?, ?, ?, 1, 1)
  `);
  let count = 0;
  for (const char of characters) {
    const slug = `character-${char.id}`;
    const content = char.content || `# ${char.name}\n\n${char.epigraph || ''}`;
    insert.run(slug, char.name, content, 'characters');
    count++;
  }
  console.log(`✅ Seeded ${count} characters`);
} else {
  console.log('⚠️  characters.json not found, skipping character seed');
}

db.close();
console.log('🎉 Database seeded successfully at', DB_PATH);
