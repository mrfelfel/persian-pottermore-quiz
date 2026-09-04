'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PageSummary {
  slug: string;
  title: string;
  volume: string | null;
  updatedAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [pages, setPages] = useState<PageSummary[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [pwMsg, setPwMsg] = useState('');

  useEffect(() => {
    const user = document.cookie.split(';').find(c => c.trim().startsWith('admin_user='));
    if (!user) { router.push('/admin/login'); return; }

    fetch('/api/admin/pages')
      .then(r => r.json())
      .then(data => { setPages(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [router]);

  const handlePasswordChange = async () => {
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword }),
    });
    const data = await res.json();
    setPwMsg(data.success ? 'رمز عبور تغییر کرد!' : data.error || 'خطا');
    setNewPassword('');
    setTimeout(() => setPwMsg(''), 3000);
  };

  const filtered = search
    ? pages.filter(p => p.title.includes(search) || p.slug.includes(search))
    : pages;

  const volumes = [...new Set(pages.map(p => p.volume).filter(Boolean))];

  return (
    <div className="min-h-screen" style={{ background: '#0f172a' }}>
      <header className="border-b" style={{ background: '#1e293b', borderColor: '#334155' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold" style={{ color: '#f8fafc' }}>پنل مدیریت</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="text-sm" style={{ color: '#94a3b8' }}
            >
              تغییر رمز
            </button>
            <Link href="/" className="text-sm" style={{ color: '#3b82f6' }}>بازگشت به سایت</Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {showPasswordChange && (
          <div className="mb-6 p-4 rounded-xl" style={{ background: '#1e293b' }}>
            <h3 className="text-sm font-medium mb-3" style={{ color: '#f8fafc' }}>تغییر رمز عبور</h3>
            <div className="flex gap-2">
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="رمز جدید"
                className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: '#0f172a', color: '#f8fafc', border: '1px solid #334155' }}
              />
              <button
                onClick={handlePasswordChange}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: '#3b82f6' }}
              >
                ذخیره
              </button>
            </div>
            {pwMsg && <p className="text-xs mt-2" style={{ color: pwMsg.includes('تغییر') ? '#22c55e' : '#ef4444' }}>{pwMsg}</p>}
          </div>
        )}

        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="جستجو در صفحات..."
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' }}
          />
        </div>

        <div className="mb-4 text-sm" style={{ color: '#94a3b8' }}>
          {filtered.length} صفحه — {volumes.length} جلد
        </div>

        {loading ? (
          <div className="text-center py-20" style={{ color: '#64748b' }}>در حال بارگذاری...</div>
        ) : (
          <div className="space-y-1">
            {filtered.map(page => (
              <Link
                key={page.slug}
                href={`/admin/pages/${encodeURIComponent(page.slug)}`}
                className="flex items-center justify-between px-4 py-3 rounded-lg transition-colors hover:opacity-80"
                style={{ background: '#1e293b' }}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate" style={{ color: '#f8fafc' }}>{page.title}</div>
                  <div className="text-[11px] truncate" style={{ color: '#64748b' }}>{page.slug}</div>
                </div>
                {page.volume && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0 mr-3"
                    style={{ background: '#0f172a', color: '#94a3b8' }}>
                    {page.volume}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
