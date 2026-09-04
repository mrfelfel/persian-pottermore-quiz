'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'نام کاربری یا رمز عبور اشتباه است');
      }
    } catch {
      setError('خطا در اتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f172a' }}>
      <div className="w-full max-w-sm p-8 rounded-2xl" style={{ background: '#1e293b' }}>
        <h1 className="text-xl font-bold text-center mb-6" style={{ color: '#f8fafc' }}>
          پنل مدیریت
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#94a3b8' }}>نام کاربری</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: '#0f172a', color: '#f8fafc', border: '1px solid #334155' }}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#94a3b8' }}>رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: '#0f172a', color: '#f8fafc', border: '1px solid #334155' }}
              required
            />
          </div>
          {error && (
            <p className="text-sm text-center" style={{ color: '#ef4444' }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-medium text-white transition-opacity disabled:opacity-50"
            style={{ background: '#3b82f6' }}
          >
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>
      </div>
    </div>
  );
}
