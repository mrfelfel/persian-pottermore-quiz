'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTWA } from '@/components/TelegramProvider';
import { hapticFeedback, TG_EMOJI } from '@/lib/twa';
import { DEPARTMENTS, DeptId } from '@/lib/ministry/types';
import { getProfile, setDepartment, addXp } from '@/lib/ministry/store';
import NavBar from '@/components/NavBar';

export default function DepartmentsPage() {
  const { user } = useTWA();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [selected, setSelected] = useState<DeptId | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!user) { router.push('/'); return; }
    const p = getProfile();
    if (p) { setProfile(p); setSelected(p.department); }
  }, [user, router]);

  if (!user || !profile) return null;

  const handleSelect = (deptId: DeptId) => {
    hapticFeedback('medium');
    setDepartment(deptId);
    addXp(20);
    setProfile(getProfile());
    setSelected(deptId);
    setMsg(`${DEPARTMENTS[deptId].name} انتخاب شد! +20 XP`);
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="min-h-[100dvh] pb-20" style={{ background: 'var(--tg-bg)' }}>
      <main className="px-5 pt-6 max-w-lg mx-auto">
        <h1 className="text-lg font-bold mb-2" style={{ color: 'var(--tg-text)' }}>
          {TG_EMOJI.shield} ادارات وزارت
        </h1>
        <p className="text-xs mb-5" style={{ color: 'var(--tg-hint)' }}>
          یک اداره انتخاب کن تا عضوش بشی (+20 XP)
        </p>

        {msg && (
          <div className="rounded-xl p-3 mb-4 text-center text-sm animate-fade-in"
            style={{ background: 'var(--tg-bg-secondary)', color: 'var(--tg-button)' }}>
            {msg}
          </div>
        )}

        <div className="space-y-2">
          {Object.values(DEPARTMENTS).map((dept) => (
            <button key={dept.id}
              onClick={() => handleSelect(dept.id)}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl text-right"
              style={{
                background: selected === dept.id ? 'var(--tg-button)' : 'var(--tg-bg-secondary)',
                color: selected === dept.id ? 'var(--tg-button-text)' : 'var(--tg-text)',
              }}>
              <span className="text-xl shrink-0">{dept.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium truncate">{dept.name}</div>
                <div className="text-[11px] opacity-60">{dept.nameEn}</div>
              </div>
              {selected === dept.id && (
                <span className="text-xs shrink-0">✓</span>
              )}
            </button>
          ))}
        </div>
      </main>
      <NavBar />
    </div>
  );
}
