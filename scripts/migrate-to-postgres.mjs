#!/usr/bin/env node
/**
 * Migrate data from SQLite (data/wiki.db) to Vercel Postgres.
 * Run: POSTGRES_URL=... node scripts/migrate-to-postgres.mjs
 */
import Database from 'better-sqlite3';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SQLITE_PATH = path.join(ROOT, 'data', 'wiki.db');
const PG_URL = process.env.POSTGRES_URL;

if (!PG_URL) {
  console.error('❌ POSTGRES_URL environment variable is required');
  process.exit(1);
}

if (!fs.existsSync(SQLITE_PATH)) {
  console.error('❌ SQLite database not found at', SQLITE_PATH);
  process.exit(1);
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  console.log('🔄 Migrating from SQLite to Vercel Postgres...\n');

  // Read SQLite
  const sqlite = new Database(SQLITE_PATH);
  sqlite.pragma('journal_mode = WAL');

  const sqliteUsers = sqlite.prepare('SELECT * FROM users').all();
  const sqlitePages = sqlite.prepare('SELECT * FROM wiki_pages').all();
  const sqliteHistory = sqlite.prepare('SELECT * FROM edit_history').all();
  const sqliteLocks = sqlite.prepare('SELECT * FROM edit_locks WHERE expires_at > CURRENT_TIMESTAMP').all();

  console.log(`  SQLite: ${sqliteUsers.length} users, ${sqlitePages.length} pages, ${sqliteHistory.length} history entries`);

  // Connect to Postgres
  const pg = new Client({ connectionString: PG_URL });
  await pg.connect();

  // Create tables
  await pg.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      telegram_id INTEGER UNIQUE NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT,
      username TEXT,
      photo_url TEXT,
      role TEXT DEFAULT 'viewer',
      created_at TIMESTAMP DEFAULT NOW(),
      last_active TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS wiki_pages (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT DEFAULT '' NOT NULL,
      volume TEXT,
      created_by INTEGER REFERENCES users(id),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_by INTEGER REFERENCES users(id),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS edit_history (
      id SERIAL PRIMARY KEY,
      page_slug TEXT NOT NULL REFERENCES wiki_pages(slug),
      user_id INTEGER REFERENCES users(id),
      content TEXT NOT NULL,
      summary TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS edit_locks (
      page_slug TEXT PRIMARY KEY REFERENCES wiki_pages(slug),
      user_id INTEGER REFERENCES users(id),
      locked_at TIMESTAMP DEFAULT NOW(),
      expires_at TIMESTAMP NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('  ✅ Tables created');

  // Migrate users
  for (const user of sqliteUsers) {
    await pg.query(`
      INSERT INTO users (id, telegram_id, first_name, last_name, username, photo_url, role, created_at, last_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (telegram_id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        username = EXCLUDED.username,
        photo_url = EXCLUDED.photo_url,
        role = EXCLUDED.role,
        last_active = EXCLUDED.last_active
    `, [user.id, user.telegram_id, user.first_name, user.last_name, user.username, user.photo_url, user.role, user.created_at, user.last_active]);
  }
  console.log(`  ✅ Users migrated: ${sqliteUsers.length}`);

  // Migrate wiki pages
  for (const page of sqlitePages) {
    await pg.query(`
      INSERT INTO wiki_pages (slug, title, content, volume, created_by, created_at, updated_by, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        volume = EXCLUDED.volume,
        updated_by = EXCLUDED.updated_by,
        updated_at = EXCLUDED.updated_at
    `, [page.slug, page.title, page.content, page.volume, page.created_by, page.created_at, page.updated_by, page.updated_at]);
  }
  console.log(`  ✅ Wiki pages migrated: ${sqlitePages.length}`);

  // Migrate edit history
  for (const entry of sqliteHistory) {
    await pg.query(`
      INSERT INTO edit_history (page_slug, user_id, content, summary, created_at)
      VALUES ($1, $2, $3, $4, $5)
    `, [entry.page_slug, entry.user_id, entry.content, entry.summary, entry.created_at]);
  }
  console.log(`  ✅ Edit history migrated: ${sqliteHistory.length}`);

  // Create admin user
  const adminPasswordHash = hashPassword('felfelix2345');
  await pg.query(`
    INSERT INTO admin_users (username, password_hash)
    VALUES ($1, $2)
    ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash
  `, ['felfelaodi', adminPasswordHash]);
  console.log('  ✅ Admin user created: felfelaodi');

  await pg.end();
  sqlite.close();

  console.log('\n🎉 Migration complete!');
  console.log('   Run `npx drizzle-kit push` to sync schema, then deploy.');
}

main().catch(e => { console.error('❌ Migration failed:', e); process.exit(1); });
