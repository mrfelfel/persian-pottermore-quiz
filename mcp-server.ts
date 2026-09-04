#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import Database from 'better-sqlite3';
import { z } from 'zod';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'wiki.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const server = new McpServer({
  name: 'vezaratjadoo-wiki',
  version: '1.0.0',
});

// Tool: List all wiki pages
server.tool(
  'list_pages',
  'List all wiki pages with titles and last update info',
  {},
  async () => {
    const pages = db.prepare(`
      SELECT slug, title, volume, updated_at,
        (SELECT first_name FROM users WHERE id = updated_by) as editor
      FROM wiki_pages ORDER BY updated_at DESC
    `).all();
    return { content: [{ type: 'text', text: JSON.stringify(pages, null, 2) }] };
  }
);

// Tool: Get a wiki page
server.tool(
  'get_page',
  'Get the full content of a wiki page by slug',
  { slug: z.string().describe('Page slug identifier') },
  async ({ slug }) => {
    const page = db.prepare(`
      SELECT wp.*, u.first_name as editor_name
      FROM wiki_pages wp
      LEFT JOIN users u ON wp.updated_by = u.id
      WHERE wp.slug = ?
    `).get(slug);
    if (!page) return { content: [{ type: 'text', text: `Page "${slug}" not found` }] };
    return { content: [{ type: 'text', text: `# ${page.title}\n\n${page.content}` }] };
  }
);

// Tool: Save/update a wiki page
server.tool(
  'save_page',
  'Save or update a wiki page content',
  {
    slug: z.string().describe('Page slug'),
    content: z.string().describe('Full markdown content'),
    summary: z.string().describe('Edit summary'),
  },
  async ({ slug, content, summary }) => {
    // Use admin user (theAIGOD, telegram_id=999999999)
    const adminUser = db.prepare('SELECT id FROM users WHERE telegram_id = ?').get(999999999);
    const userId = adminUser?.id ?? 1;
    const existing = db.prepare('SELECT content FROM wiki_pages WHERE slug = ?').get(slug);
    if (existing?.content) {
      db.prepare('INSERT INTO edit_history (page_slug, user_id, content, summary) VALUES (?, ?, ?, ?)')
        .run(slug, userId, existing.content, summary);
      db.prepare('UPDATE wiki_pages SET content = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?')
        .run(content, userId, slug);
    } else {
      db.prepare('INSERT INTO wiki_pages (slug, title, content, created_by, updated_by) VALUES (?, ?, ?, ?, ?)')
        .run(slug, slug, content, userId, userId);
    }
    return { content: [{ type: 'text', text: `Page "${slug}" saved successfully` }] };
  }
);

// Tool: Search wiki content
server.tool(
  'search_pages',
  'Search wiki pages by keyword in title or content',
  { query: z.string().describe('Search query') },
  async ({ query }) => {
    const results = db.prepare(`
      SELECT slug, title,
        substr(content, 1, 200) as preview
      FROM wiki_pages
      WHERE title LIKE ? OR content LIKE ?
      LIMIT 20
    `).all(`%${query}%`, `%${query}%`);
    return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
  }
);

// Tool: Get edit history
server.tool(
  'get_history',
  'Get edit history for a wiki page',
  { slug: z.string().describe('Page slug') },
  async ({ slug }) => {
    const history = db.prepare(`
      SELECT eh.id, eh.summary, eh.created_at, u.first_name as editor
      FROM edit_history eh
      JOIN users u ON eh.user_id = u.id
      WHERE eh.page_slug = ?
      ORDER BY eh.created_at DESC
      LIMIT 20
    `).all(slug);
    return { content: [{ type: 'text', text: JSON.stringify(history, null, 2) }] };
  }
);

// Tool: List all users
server.tool(
  'list_users',
  'List all registered users',
  {},
  async () => {
    const users = db.prepare('SELECT id, first_name, username, role, last_active FROM users').all();
    return { content: [{ type: 'text', text: JSON.stringify(users, null, 2) }] };
  }
);

// Tool: Get timeline
server.tool(
  'get_timeline',
  'Get the full timeline data',
  {},
  async () => {
    const content = db.prepare("SELECT content FROM wiki_pages WHERE slug LIKE '%timeline%' OR slug LIKE '%time-line%'").get();
    if (content) return { content: [{ type: 'text', text: content.content }] };
    return { content: [{ type: 'text', text: 'Timeline not found in database' }] };
  }
);

// Tool: Create theAIGOD admin user
server.tool(
  'setup_admin',
  'Create the admin user (theAIGOD) for direct database access',
  {},
  async () => {
    const existing = db.prepare('SELECT id FROM users WHERE telegram_id = ?').get(999999999);
    if (!existing) {
      db.prepare('INSERT INTO users (telegram_id, first_name, username, role) VALUES (?, ?, ?, ?)')
        .run(999999999, 'theAIGOD', 'theAIGOD', 'admin');
      return { content: [{ type: 'text', text: 'Admin user "theAIGOD" created' }] };
    }
    return { content: [{ type: 'text', text: 'Admin user already exists' }] };
  }
);

const transport = new StdioServerTransport();
server.connect(transport);
