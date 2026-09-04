'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getWikiPage,
  saveWikiPage,
  lockPage,
  releaseLock,
  isEditor,
  type EditLock,
} from './store';

export function useWikiEdit(slug: string, userId: string | null) {
  const [content, setContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [lock, setLock] = useState<EditLock | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load page from API on mount
  useEffect(() => {
    if (initialized) return;
    getWikiPage(slug).then(({ page, lock: pageLock }) => {
      if (page?.content) {
        setContent(page.content);
      }
      if (pageLock) {
        setLock(pageLock);
      }
      setInitialized(true);
    });
  }, [slug, initialized]);

  const startEdit = useCallback(async () => {
    if (!userId) {
      setError('برای ویرایش وارد شوید');
      return;
    }
    const result = await lockPage(slug, parseInt(userId));
    if (!result.success) {
      setError(result.error || 'صفحه توسط شخص دیگری در حال ویرایش است');
      return;
    }
    setIsEditing(true);
    setEditContent(content);
    setError('');
  }, [slug, userId, content]);

  const saveEdit = useCallback(
    async (summary: string) => {
      if (!userId) return;
      setSaving(true);
      const result = await saveWikiPage(slug, editContent, parseInt(userId), summary);
      if (result.success) {
        setIsEditing(false);
        setContent(editContent);
        setLock(null);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(result.error || 'خطا در ذخیره‌سازی');
      }
      setSaving(false);
    },
    [slug, editContent, userId]
  );

  const cancelEdit = useCallback(async () => {
    if (userId) await releaseLock(slug, parseInt(userId));
    setIsEditing(false);
    setEditContent('');
    setError('');
    setLock(null);
  }, [slug, userId]);

  return {
    content,
    setContent: (c: string) => { setContent(c); setInitialized(true); },
    isEditing,
    editContent,
    setEditContent,
    lock,
    saving,
    error,
    saved,
    startEdit,
    saveEdit,
    cancelEdit,
    canEdit: isEditor(userId),
  };
}
