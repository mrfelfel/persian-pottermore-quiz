'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTWA } from '@/components/TelegramProvider';
import { hapticFeedback, TG_EMOJI } from '@/lib/twa';
import { HOUSES, DEPARTMENTS, ROLE_NAMES, xpForLevel } from '@/lib/ministry/types';
import { getProfile, saveProfile, resetProfile } from '@/lib/ministry/store';
import NavBar from '@/components/NavBar';

export default function ProfilePage() {
  const { user } = useTWA();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) { router.push('/'); return; }
    const p = getProfile();
    if (p) setProfile(p);
  }, [user, router]);

  if (!user || !profile) return null;

  const house = profile.house ? HOUSES[profile.house as keyof typeof HOUSES] : null;
  const dept = profile.department ? DEPARTMENTS[profile.department as keyof typeof DEPARTMENTS] : null;
  const currentXp = profile.xp - Array.from({ length: profile.level - 1 }, (_, i) => (i + 1) * 100).reduce((a, b) => a + b, 0);
  const nextLevelXp = xpForLevel(profile.level);

  return (
    <div className="min-h-[100dvh] pb-20" style={{ background: 'var(--tg-bg)' }}>
      <main className="px-5 pt-6 max-w-lg mx-auto">

        {/* Header card */}
        <div className="rounded-2xl p-5 mb-4 text-center"
          style={{ background: 'var(--tg-bg-secondary)' }}>
          <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl"
            style={{ background: house ? house.colorBg : 'var(--tg-button)' }}>
            {house ? house.emoji : TG_EMOJI.wizard}
          </div>
          <h1 className="text-lg font-bold mb-0.5" style={{ color: 'var(--tg-text)' }}>
            {profile.name}
          </h1>
          <p className="text-xs mb-3" style={{ color: 'var(--tg-hint)' }}>
            {ROLE_NAMES[profile.role as keyof typeof ROLE_NAMES]}
          </p>

          {/* Level */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-xs font-bold" style={{ color: 'var(--tg-button)' }}>
              لول {profile.level}
            </span>
            <div className="flex-1 max-w-[160px] h-1.5 rounded-full"
              style={{ background: 'var(--tg-bg)' }}>
              <div className="h-full rounded-full" style={{
                width: `${(currentXp / nextLevelXp) * 100}%`,
                background: 'var(--tg-button)',
              }} />
            </div>
            <span className="text-[10px]" style={{ color: 'var(--tg-hint)' }}>
              {currentXp}/{nextLevelXp} XP
            </span>
          </div>
        </div>

        {/* Currency */}
        <div className="rounded-2xl p-4 mb-4"
          style={{ background: 'var(--tg-bg-secondary)' }}>
          <div className="text-xs font-medium mb-2.5" style={{ color: 'var(--tg-hint)' }}>
            {TG_EMOJI.crown} موجودی بانکی
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'گالیون', value: profile.currency.galleons, color: '#FFD700' },
              { label: 'دراخما', value: profile.currency.sickles, color: '#C0C0C0' },
              { label: 'کنت', value: profile.currency.knuts, color: '#CD7F32' },
            ].map(c => (
              <div key={c.label}>
                <div className="text-lg font-bold" style={{ color: c.color }}>{c.value}</div>
                <div className="text-[10px]" style={{ color: 'var(--tg-hint)' }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* House info */}
        {house && (
          <div className="rounded-2xl p-4 mb-4"
            style={{ background: 'var(--tg-bg-secondary)' }}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{house.emoji}</span>
              <div>
                <div className="text-sm font-medium" style={{ color: house.colorBg }}>
                  {house.name}
                </div>
                <div className="text-[11px]" style={{ color: 'var(--tg-hint)' }}>
                  بنیان‌گذار: {house.founder} — {house.trait}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Department */}
        {dept && (
          <div className="rounded-2xl p-4 mb-4"
            style={{ background: 'var(--tg-bg-secondary)' }}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{dept.emoji}</span>
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--tg-text)' }}>
                  {dept.name}
                </div>
                <div className="text-[11px]" style={{ color: 'var(--tg-hint)' }}>
                  {dept.nameEn}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Classes */}
        <div className="rounded-2xl p-4 mb-4"
          style={{ background: 'var(--tg-bg-secondary)' }}>
          <div className="text-xs font-medium mb-2.5" style={{ color: 'var(--tg-hint)' }}>
            {TG_EMOJI.book} کلاس‌های تکمیل شده
          </div>
          <div className="space-y-1.5">
            {Object.entries(profile.completedClasses || {}).filter(([_, c]) => (c as number) > 0).map(([classId, count]) => (
              <div key={classId} className="flex justify-between text-[13px]">
                <span style={{ color: 'var(--tg-text)' }}>{classId}</span>
                <span style={{ color: 'var(--tg-button)' }}>{count as number} بار</span>
              </div>
            ))}
            {Object.keys(profile.completedClasses || {}).length === 0 && (
              <p className="text-xs" style={{ color: 'var(--tg-hint)' }}>هنوز کلاسی تکمیل نشده</p>
            )}
          </div>
        </div>

        {/* Badges */}
        {profile.badges.length > 0 && (
          <div className="rounded-2xl p-4 mb-4"
            style={{ background: 'var(--tg-bg-secondary)' }}>
            <div className="text-xs font-medium mb-2.5" style={{ color: 'var(--tg-hint)' }}>
              {TG_EMOJI.medal} نشان‌ها
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.badges.map((b: string) => (
                <span key={b} className="px-2.5 py-1 rounded-full text-[11px]"
                  style={{ background: 'var(--tg-bg)', color: 'var(--tg-text)' }}>
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2 mb-4">
          <button
            onClick={() => { hapticFeedback('medium'); router.push('/classes'); }}
            className="w-full p-3.5 rounded-xl text-sm text-left flex items-center gap-3"
            style={{ background: 'var(--tg-bg-secondary)', color: 'var(--tg-text)' }}>
            <span className="text-lg">{TG_EMOJI.flask}</span>
            <span>رفتن به کلاس‌ها</span>
            <span className="mr-auto text-xs" style={{ color: 'var(--tg-hint)' }}>←</span>
          </button>
          <button
            onClick={() => { hapticFeedback('medium'); router.push('/departments'); }}
            className="w-full p-3.5 rounded-xl text-sm text-left flex items-center gap-3"
            style={{ background: 'var(--tg-bg-secondary)', color: 'var(--tg-text)' }}>
            <span className="text-lg">{TG_EMOJI.shield}</span>
            <span>انتخاب اداره</span>
            <span className="mr-auto text-xs" style={{ color: 'var(--tg-hint)' }}>←</span>
          </button>
        </div>

        {/* Reset */}
        <button
          onClick={() => { hapticFeedback('heavy'); resetProfile(); router.push('/'); }}
          className="w-full py-3 rounded-xl text-xs"
          style={{ color: 'var(--tg-destructive)' }}>
          شروع مجدد
        </button>
      </main>
      <NavBar />
    </div>
  );
}
