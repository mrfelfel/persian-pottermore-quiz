'use client';

import { useState } from 'react';
import { hapticFeedback } from '@/lib/twa';

interface WikiEditorProps {
  content: string;
  isEditing: boolean;
  editContent: string;
  onContentChange: (content: string) => void;
  onSave: (summary: string) => void;
  onCancel: () => void;
  onStartEdit: () => void;
  saving: boolean;
  canEdit: boolean;
  lockInfo: { lockedBy: number; lockedByName?: string } | null;
  saved: boolean;
  error: string;
}

export default function WikiEditor({
  content,
  isEditing,
  editContent,
  onContentChange,
  onSave,
  onCancel,
  onStartEdit,
  saving,
  canEdit,
  lockInfo,
  saved,
  error,
}: WikiEditorProps) {
  const [summary, setSummary] = useState('');

  if (isEditing) {
    return (
      <div className="mt-6">
        {/* Edit toolbar */}
        <div
          className="flex items-center justify-between p-3 rounded-t-xl"
          style={{ background: 'var(--tg-bg-secondary)' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: 'var(--tg-button)' }}>
              ✏️
            </span>
            <span
              className="text-sm font-medium"
              style={{ color: 'var(--tg-text)' }}
            >
              در حال ویرایش
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                hapticFeedback('light');
                onCancel();
              }}
              className="px-3 py-1.5 rounded-lg text-[12px]"
              style={{
                background: 'var(--tg-bg)',
                color: 'var(--tg-hint)',
              }}
            >
              لغو
            </button>
            <button
              onClick={() => {
                hapticFeedback('success');
                onSave(summary);
              }}
              disabled={saving}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium"
              style={{
                background: saving ? 'var(--tg-hint)' : 'var(--tg-button)',
                color: 'var(--tg-button-text)',
                opacity: saving ? 0.5 : 1,
              }}
            >
              {saving ? '...' : 'ذخیره'}
            </button>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          value={editContent}
          onChange={(e) => onContentChange(e.target.value)}
          className="w-full p-4 text-[13px] leading-[1.8] resize-none outline-none"
          style={{
            background: 'var(--tg-bg)',
            color: 'var(--tg-text)',
            minHeight: '300px',
            borderRight: '3px solid var(--tg-button)',
          }}
          dir="rtl"
          placeholder="محتوا را اینجا بنویسید..."
        />

        {/* Edit summary */}
        <div
          className="p-3 rounded-b-xl"
          style={{ background: 'var(--tg-bg-secondary)' }}
        >
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="خلاصه تغییرات (اختیاری)"
            className="w-full px-3 py-2 rounded-lg text-[12px] outline-none"
            style={{
              background: 'var(--tg-bg)',
              color: 'var(--tg-text)',
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <div
            className="mt-2 p-2 rounded-lg text-[11px] text-center"
            style={{ background: 'rgba(229,57,53,0.1)', color: 'var(--tg-destructive, #e53935)' }}
          >
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Action bar */}
      <div className="flex items-center justify-between mb-3">
        {canEdit ? (
          <button
            onClick={() => {
              hapticFeedback('light');
              onStartEdit();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px]"
            style={{ background: 'var(--tg-bg-secondary)', color: 'var(--tg-button)' }}
          >
            <span>✏️</span>
            <span>ویرایش</span>
          </button>
        ) : (
          <div className="text-[11px]" style={{ color: 'var(--tg-hint)' }}>
            برای ویرایش وارد شوید
          </div>
        )}
      </div>

      {/* Lock warning */}
      {lockInfo && (
        <div
          className="p-3 rounded-xl mb-4 text-[12px]"
          style={{ background: 'rgba(255,193,7,0.1)', color: '#ffc107' }}
        >
          🔒 در حال ویرایش توسط شخص دیگر
        </div>
      )}

      {/* Saved toast */}
      {saved && (
        <div
          className="p-3 rounded-xl mb-4 text-[12px] text-center animate-fade-in"
          style={{ background: 'rgba(76,175,80,0.1)', color: '#4caf50' }}
        >
          ✓ ذخیره شد
        </div>
      )}

      {/* Error */}
      {error && !isEditing && (
        <div
          className="p-3 rounded-xl mb-4 text-[12px] text-center"
          style={{ background: 'rgba(229,57,53,0.1)', color: 'var(--tg-destructive, #e53935)' }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
