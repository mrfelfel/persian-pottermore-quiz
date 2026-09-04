import { pgTable, text, integer, timestamp, varchar, uniqueIndex } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  telegramId: integer('telegram_id').unique().notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name'),
  username: text('username'),
  photoUrl: text('photo_url'),
  role: text('role').default('viewer').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastActive: timestamp('last_active').defaultNow().notNull(),
});

export const wikiPages = pgTable('wiki_pages', {
  slug: text('slug').primaryKey(),
  title: text('title').notNull(),
  content: text('content').default('').notNull(),
  volume: text('volume'),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedBy: integer('updated_by').references(() => users.id),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const editHistory = pgTable('edit_history', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  pageSlug: text('page_slug').notNull().references(() => wikiPages.slug),
  userId: integer('user_id').references(() => users.id),
  content: text('content').notNull(),
  summary: text('summary').default('').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const editLocks = pgTable('edit_locks', {
  pageSlug: text('page_slug').primaryKey().references(() => wikiPages.slug),
  userId: integer('user_id').references(() => users.id),
  lockedAt: timestamp('locked_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

export const adminUsers = pgTable('admin_users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
