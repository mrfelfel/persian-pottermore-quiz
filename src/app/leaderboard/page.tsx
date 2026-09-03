'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTWA } from '@/components/TelegramProvider';
import { TG_EMOJI } from '@/lib/twa';
import { HOUSES } from '@/lib/ministry/types';
import { getLeaderboard } from '@/lib/ministry/store';
import NavBar from '@/components/NavBar';

export default function LeaderboardPage() {
  const { user } = useTWA();
  const router = useRouter();
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    if (!user) { router.push('/'); return; }
    setEntries(getLeaderboard());
  }, [user, router]);

  if (!user) return null;

  const medals = [TG_EMOJI.crown, TG_EMOJI.medal, TG_EMOJI.medal];

  return (
    <div className="min-h-[100dvh] pb-20" style={{ background: 'var(--tg-bg)' }}>
      <main className="px-5 pt-6 max-w-lg mx-auto">
        <h1 className="text-lg font-bold mb-2" style={{ color: 'var(--tg-text)' }}>
          {TG_EMOJI.trophy} رتبه‌بندی
        </h1>
        <p className="text-xs mb-5" style={{ color: 'var(--tg-hint)' }}>
          برترین جادوگران بر اساس XP
        </p>

        <div className="space-y-2">
          {entries.map((entry, i) => {
            const house = HOUSES[entry.house as keyof typeof HOUSES];
            const isTop3 = i < 3;
            return (
              <div key={entry.name}
                className="flex items-center gap-3 p-3.5 rounded-xl"
                style={{
                  background: isTop3 ? `${house?.colorBg}15` : 'var(--tg-bg-secondary)',
                  border: isTop3 ? `1px solid ${house?.colorBg}30` : '1px solid transparent',
                }}>
                <div className="w-7 text-center shrink-0">
                  {isTop3 ? (
                    <span className="text-lg">{medals[i]}</span>
                  ) : (
                    <span className="text-sm font-bold" style={{ color: 'var(--tg-hint)' }}>
                      {i + 1}
                    </span>
                  )}
                </div>
                <div className="w-7 text-center shrink-0">
                  <span className="text-lg">{house?.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium truncate" style={{ color: 'var(--tg-text)' }}>
                    {entry.name}
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--tg-hint)' }}>
                    لول {entry.level} • {house?.name}
                  </div>
                </div>
                <div className="text-xs font-bold shrink-0" style={{ color: 'var(--tg-button)' }}>
                  {entry.xp} XP
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <NavBar />
    </div>
  );
}
