'use client';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { useTWA } from '@/components/TWAInit';
import { TG_EMOJI } from '@/lib/twa';
import { HOUSES } from '@/lib/ministry/types';
import { getLeaderboard } from '@/lib/ministry/store';
import NavBar from '@/components/NavBar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
              <Card
                key={entry.name}
                className="border-0 py-3"
                style={{
                  background: isTop3 ? `${house?.colorBg}15` : 'var(--tg-bg-secondary)',
                  boxShadow: isTop3 ? `inset 0 0 0 1px ${house?.colorBg}30` : 'none',
                }}
              >
                <CardContent className="pt-0 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 text-center shrink-0">
                      {isTop3 ? (
                        <span className="text-lg">{medals[i]}</span>
                      ) : (
                        <Badge variant="secondary" className="w-7 h-6 justify-center text-[11px] font-bold">
                          {i + 1}
                        </Badge>
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
                    <Badge
                      variant="default"
                      className="shrink-0 text-xs font-bold"
                      style={{ background: 'var(--tg-button)' }}
                    >
                      {entry.xp} XP
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
      <NavBar />
    </div>
  );
}
