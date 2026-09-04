'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminPageEditor({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const user = document.cookie.split(';').find(c => c.trim().startsWith('admin_user='));
    if (!user) { router.push('/admin/login'); return; }

    fetch(`/api/wiki/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.page) {
          setContent(data.page.content);
          setTitle(data.page.title);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, router]);

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch(`/api/wiki/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, userId: 1, summary: 'Admin edit via panel' }),
      });
      const data = await res.json();
      setMsg(data.success ? 'ذخیره شد!' : 'خطا در ذخیره');
    } catch {
      setMsg('خطا در اتصال');
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f172a' }}>
        <p style={{ color: '#64748b' }}>در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#0f172a' }}>
      <header className="border-b" style={{ background: '#1e293b', borderColor: '#334155' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="text-sm" style={{ color: '#3b82f6' }}>← بازگشت</Link>
            <h1 className="text-sm font-medium truncate max-w-md" style={{ color: '#f8fafc' }}>{title || slug}</h1>
          </div>
          <div className="flex items-center gap-3">
            {msg && <span className="text-xs" style={{ color: msg.includes('ذخیره') ? '#22c55e' : '#ef4444' }}>{msg}</span>}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
              style={{ background: '#3b82f6' }}
            >
              {saving ? 'در حال ذخیره...' : 'ذخیره'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-6">
        <div className="mb-3 text-[11px]" style={{ color: '#64748b' }}>{slug}</div>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full min-h-[70vh] px-4 py-4 rounded-xl text-sm leading-relaxed outline-none resize-y"
          style={{
            background: '#1e293b',
            color: '#e2e8f0',
            border: '1px solid #334155',
            fontFamily: 'monospace',
            direction: 'ltr',
          }}
          spellCheck={false}
        />
      </main>
    </div>
  );
}
