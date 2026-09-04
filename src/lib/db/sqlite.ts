import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'wiki.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');
  initTables(_db);
  return _db;
}

function initTables(db: Database.Database) {
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
}
