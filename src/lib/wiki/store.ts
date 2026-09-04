'use client';

// ── Wiki Store — API-backed (SQLite) ──

import {
  fetchWikiPage as apiFetchPage,
  saveWikiPage as apiSavePage,
  lockPage as apiLockPage,
  releaseLock as apiReleaseLock,
  getEditHistory as apiGetHistory,
} from '@/lib/db/client';

export interface WikiPage {
  slug: string;
  title?: string;
  content: string;
  volume?: string;
  updated_by_name?: string;
  updated_at?: string;
  created_at?: string;
}

export interface EditLock {
  lockedBy: number;
  lockedByName: string;
  expiresAt: string;
}

export interface EditRecord {
  id: number;
  page_slug: string;
  user_id: number;
  user_name: string;
  username: string;
  content: string;
  summary: string;
  created_at: string;
}

// ── Page Operations ──

export async function getWikiPage(slug: string): Promise<{ page: WikiPage | null; lock: EditLock | null }> {
  try {
    const data = await apiFetchPage(slug);
    if (!data || data.error) return { page: null, lock: null };
    return {
      page: data.page || null,
      lock: data.lock || null,
    };
  } catch {
    return { page: null, lock: null };
  }
}

export async function saveWikiPage(
  slug: string,
  content: string,
  userId: number,
  summary: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const data = await apiSavePage(slug, content, userId, summary);
    if (data.error) return { success: false, error: data.error };
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ── Lock Operations ──

export async function lockPage(
  slug: string,
  userId: number
): Promise<{ success: boolean; error?: string; lock?: EditLock }> {
  try {
    const data = await apiLockPage(slug, userId);
    if (data.error) {
      return {
        success: false,
        error: data.error,
        lock: data.lock ? { lockedBy: data.lock.lockedByName, lockedByName: data.lock.lockedByName, expiresAt: data.lock.expiresAt } : undefined,
      };
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function releaseLock(slug: string, userId: number): Promise<void> {
  try {
    await apiReleaseLock(slug, userId);
  } catch {
    // Silent fail
  }
}

// ── History ──

export async function getEditHistory(slug: string): Promise<EditRecord[]> {
  try {
    const data = await apiGetHistory(slug);
    return data?.history || [];
  } catch {
    return [];
  }
}

// ── Create Page ──

export async function createWikiPage(
  slug: string,
  content: string,
  userId: number
): Promise<{ success: boolean; error?: string }> {
  // Use saveWikiPage API (handles upsert)
  return saveWikiPage(slug, content, userId, 'ایجاد صفحه جدید');
}

// ── Auth ──

export function isEditor(userId: string | null): boolean {
  return !!userId;
}
