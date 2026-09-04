'use client';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { useTWA } from '@/components/TWAInit';
import { hapticFeedback, showBackButton, hideBackButton, TG_EMOJI } from '@/lib/twa';
import { getHouse } from '@/lib/houses';
import { HouseResult } from '@/lib/quiz';
import { setHouse, addXp, addBadge, getProfile, createProfile } from '@/lib/ministry/store';
import { HouseId } from '@/lib/ministry/types';
import TGButton from '@/components/TGButton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from 'cn';

export default function ResultPage() {
  const { user, isInTelegram } = useTWA();
  const router = useRouter();
  const [results, setResults] = useState<HouseResult[] | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/'); return; }
    const saved = localStorage.getItem('hp_results');
    if (saved) {
      const r: HouseResult[] = JSON.parse(saved);
      setResults(r);
      // Save house to profile
      let profile = getProfile();
      if (!profile) {
        profile = createProfile(user.first_name, user.username, user.photo_url);
      }
      if (!profile.house && r[0]) {
        setHouse(r[0].house as HouseId);
        addXp(50); // quiz completion bonus
        addBadge('گروه‌بندی شده');
      }
      hapticFeedback('success');
      setTimeout(() => setShow(true), 300);
    } else {
      router.push('/quiz');
    }
  }, [user, router]);

  useEffect(() => {
    if (isInTelegram) {
      showBackButton(() => router.push('/'));
      return () => hideBackButton();
    }
  }, [isInTelegram, router]);

  if (!results || !user) return null;

  const top = getHouse(results[0].house);

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: 'var(--tg-bg)' }}>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-5 pt-6 sm:pt-8 pb-4">

          {/* House reveal */}
          <div className={`text-center ${show ? 'animate-scale-in' : 'opacity-0'}`}>
            <div className="text-5xl sm:text-6xl mb-3 select-none">{top.emoji}</div>
            <Badge
              variant="default"
              className="text-lg sm:text-[22px] font-bold px-5 py-1.5 h-auto"
              style={{ background: top.colorBg }}
            >
              {top.name}
            </Badge>
            <div className="text-sm mt-2" style={{ color: 'var(--tg-hint)' }}>
              {top.trait}
            </div>
            <div className="text-xs sm:text-[13px] mt-1" style={{ color: 'var(--tg-hint)' }}>
              {TG_EMOJI.sparkle} {user.first_name} عزیز
            </div>
          </div>

          {/* Score ring */}
          <div className={`flex justify-center my-8 sm:my-10 ${show ? 'animate-scale-in' : 'opacity-0'}`}
            style={{ animationDelay: '0.2s' }}>
            <div className="relative w-32 h-32 sm:w-[140px] sm:h-[140px]">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none"
                  stroke="var(--tg-bg-secondary)" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none"
                  stroke={top.colorBg} strokeWidth="10"
                  strokeLinecap="round"
                  className="transition-all duration-[1.2s] ease-out"
                  style={{ strokeDasharray: show ? `${results[0].percentage * 3.14} 314` : '0 314' }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl sm:text-[28px] font-bold" style={{ color: top.colorBg }}>
                  %{results[0].percentage}
                </span>
              </div>
            </div>
          </div>

          {/* Description card */}
          <Card
            className={`mb-6 border-0 ${show ? 'animate-slide-up' : 'opacity-0'}`}
            style={{ background: 'var(--tg-bg-secondary)', animationDelay: '0.3s' }}
          >
            <CardContent className="pt-6">
              <p className="text-[13px] sm:text-sm leading-[1.8]" style={{ color: 'var(--tg-text)' }}>
                {top.description}
              </p>
            </CardContent>
          </Card>

          {/* All houses breakdown */}
          <div className={`space-y-3 ${show ? 'animate-slide-up' : 'opacity-0'}`}
            style={{ animationDelay: '0.4s' }}>
            <div className="text-xs sm:text-[13px] font-medium px-1 mb-1.5"
              style={{ color: 'var(--tg-hint)' }}>
              {TG_EMOJI.bar_chart} نتیجه کامل
            </div>
            {results.map((r, i) => {
              const house = getHouse(r.house);
              return (
                <Card
                  key={r.house}
                  className="border-0 py-3"
                  style={{ background: 'var(--tg-bg-secondary)' }}
                >
                  <CardContent className="pt-0 px-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg">{house.emoji}</span>
                        <span className="text-xs sm:text-[13px] font-medium"
                          style={{ color: 'var(--tg-text)' }}>
                          {house.name}
                        </span>
                      </div>
                      <Badge
                        variant="default"
                        className="text-xs sm:text-[13px] font-bold"
                        style={{ background: house.colorBg }}
                      >
                        %{r.percentage}
                      </Badge>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: 'var(--tg-bg)' }}>
                      <div className="h-full rounded-full"
                        style={{
                          width: show ? `${r.percentage}%` : '0%',
                          backgroundColor: house.colorBg,
                          transition: `width 0.8s ease-out ${0.5 + i * 0.12}s`,
                        }} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      {/* Bottom buttons */}
      <footer className={`shrink-0 px-4 sm:px-5 pb-6 pt-3 space-y-3 ${show ? 'animate-slide-up' : 'opacity-0'}`}
        style={{ animationDelay: '0.6s', paddingBottom: 'max(24px, var(--safe-bottom))' }}>

        <Link href="/quiz" onClick={() => hapticFeedback('medium')}>
          <TGButton>{TG_EMOJI.party} دوباره بازی کن</TGButton>
        </Link>

        <Link href="/" onClick={() => hapticFeedback('light')}>
          <TGButton variant="secondary">{TG_EMOJI.castle} بازگشت</TGButton>
        </Link>
      </footer>
    </div>
  );
}
