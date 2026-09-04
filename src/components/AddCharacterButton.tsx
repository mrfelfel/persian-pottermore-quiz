'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createWikiPage } from '@/lib/wiki/store';
import { hapticFeedback } from '@/lib/twa';

interface AddCharacterButtonProps {
  userId: string | null;
}

export default function AddCharacterButton({ userId }: AddCharacterButtonProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [school, setSchool] = useState('');

  if (!userId) return null;

  const handleCreate = () => {
    if (!name.trim()) return;
    hapticFeedback('success');

    const slug = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');

    const template = `# ${name.trim()}

---

> ${role || 'شخصیت جدید در جامعه جادوگری فارسی'}

---

## اطلاعات پایه

نام: ${name.trim()}
نام‌های مستعار: —
دوره فعالیت: —
اولین حضور قابل شناسایی: —
نقش: ${role || '—'}
مدرسه/سازمان: ${school || '—'}
روابط: —
پروژه‌ها: —
اتفاقات مهم: —
نقش در جامعه: —
تغییر هویت در طول زمان: —
آخرین ردپای قابل مشاهده: —

## روایت

تاریخچه این شخصیت هنوز تکمیل نشده است. لطفاً با اطلاعات خود آن را کامل کنید.
`;

    createWikiPage(slug, template, parseInt(userId));
    router.push(`/archive/characters/${slug}`);
  };

  return (
    <div className="mb-4">
      {!showForm ? (
        <button
          onClick={() => {
            hapticFeedback('light');
            setShowForm(true);
          }}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-[13px] font-medium"
          style={{ background: 'var(--tg-button)', color: 'var(--tg-button-text)' }}
        >
          <span>+</span>
          <span>افزودن شخصیت جدید</span>
        </button>
      ) : (
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ background: 'var(--tg-bg-secondary)' }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-sm font-medium"
              style={{ color: 'var(--tg-text)' }}
            >
              شخصیت جدید
            </span>
            <button
              onClick={() => setShowForm(false)}
              className="text-[12px]"
              style={{ color: 'var(--tg-hint)' }}
            >
              لغو
            </button>
          </div>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="نام شخصیت *"
            className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none"
            style={{ background: 'var(--tg-bg)', color: 'var(--tg-text)' }}
          />

          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="نقش (مثلاً: مدیر مدرسه)"
            className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none"
            style={{ background: 'var(--tg-bg)', color: 'var(--tg-text)' }}
          />

          <input
            type="text"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            placeholder="مدرسه/سازمان"
            className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none"
            style={{ background: 'var(--tg-bg)', color: 'var(--tg-text)' }}
          />

          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="w-full py-2.5 rounded-lg text-[13px] font-medium"
            style={{
              background: name.trim() ? 'var(--tg-button)' : 'var(--tg-hint)',
              color: 'var(--tg-button-text)',
              opacity: name.trim() ? 1 : 0.5,
            }}
          >
            ایجاد
          </button>
        </div>
      )}
    </div>
  );
}
