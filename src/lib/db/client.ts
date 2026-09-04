// This file is intentionally empty — client-side data fetching uses API routes.

// Note: better-sqlite3 is server-only.
// For client-side, we use the API routes instead.
// This file exports functions that call the API.

const API_BASE = '/api';

export async function fetchWikiPage(slug: string) {
  const res = await fetch(`${API_BASE}/wiki/${slug}`);
  if (!res.ok) return null;
  return res.json();
}

export async function saveWikiPage(slug: string, content: string, userId: number, summary: string) {
  const res = await fetch(`${API_BASE}/wiki/${slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, userId, summary }),
  });
  return res.json();
}

export async function lockPage(slug: string, userId: number) {
  const res = await fetch(`${API_BASE}/wiki/lock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, userId }),
  });
  return res.json();
}

export async function releaseLock(slug: string, userId: number) {
  const res = await fetch(`${API_BASE}/wiki/lock`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, userId }),
  });
  return res.json();
}

export async function getEditHistory(slug: string) {
  const res = await fetch(`${API_BASE}/wiki/history/${slug}`);
  if (!res.ok) return [];
  return res.json();
}

export async function authenticateUser(telegramId: number, firstName: string, lastName?: string, username?: string, photoUrl?: string) {
  const res = await fetch(`${API_BASE}/auth/telegram`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telegramId, firstName, lastName, username, photoUrl }),
  });
  return res.json();
}
