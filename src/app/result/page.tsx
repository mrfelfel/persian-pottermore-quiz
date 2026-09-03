'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTWA } from '@/components/TelegramProvider';
import { hapticFeedback, showBackButton, hideBackButton, TG_EMOJI } from '@/lib/twa';
import { getHouse } from '@/lib/houses';
import { HouseResult } from '@/lib/quiz';
import TGButton from '@/components/TGButton';
import Link from 'next/link';

export default function ResultPage() {
  const { user, isInTelegram } = useTWA();
  const router = useRouter();
  const [results, setResults] = useState<HouseResult[] | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/'); return; }
    const saved = localStorage.getItem('hp_results');
    if (saved) {
      const r = JSON.parse(saved) as HouseResult[];
      setResults(r);
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
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--tg-bg)' }}>

      {/* House reveal */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-8">

        {/* Emoji */}
        <div
          className={`text-[72px] leading-none mb-4 select-none ${show ? 'animate-scale-in' : 'opacity-0'}`}
        >
          {top.emoji}
        </div>

        {/* House name */}
        <div className={`${show ? 'animate-slide-up' : 'opacity-0'}`}>
          <div className="text-[26px] font-bold text-center" style={{ color: top.colorBg }}>
            {top.name}
          </div>
          <div className="text-[14px] text-center mt-1" style={{ color: 'var(--tg-hint)' }}>
            {top.trait}
          </div>
          <div className="text-[13px] text-center mt-1" style={{ color: 'var(--tg-hint)' }}>
            {TG_EMOJI.sparkle} {user.first_name} عزیز
          </div>
        </div>

        {/* Score ring */}
        <div
          className={`relative w-[140px] h-[140px] my-8 ${show ? 'animate-scale-in' : 'opacity-0'}`}
          style={{ animationDelay: '0.2s' }}
        >
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none"
              stroke="var(--tg-bg-secondary)" strokeWidth="10" />
            <circle cx="60" cy="60" r="50" fill="none"
              stroke={top.colorBg} strokeWidth="10"
              strokeDasharray={`${results[0].percentage * 3.14} 314`}
              strokeLinecap="round"
              className="transition-all duration-[1.2s] ease-out"
              style={{ strokeDasharray: show ? `${results[0].percentage * 3.14} 314` : '0 314' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[28px] font-bold" style={{ color: top.colorBg }}>
              %{results[0].percentage}
            </span>
          </div>
        </div>

        {/* Description card */}
        <div
          className={`w-full max-w-[340px] rounded-[16px] p-5 mb-6 ${show ? 'animate-slide-up' : 'opacity-0'}`}
          style={{ background: 'var(--tg-bg-secondary)', animationDelay: '0.3s' }}
        >
          <p className="text-[14px] leading-[1.7]" style={{ color: 'var(--tg-text)' }}>
            {top.description}
          </p>
        </div>

        {/* All houses breakdown */}
        <div className={`w-full max-w-[340px] space-y-3 ${show ? 'animate-slide-up' : 'opacity-0'}`}
          style={{ animationDelay: '0.4s' }}>
          <div className="text-[13px] font-medium px-1 mb-2" style={{ color: 'var(--tg-hint)' }}>
            {TG_EMOJI.bar_chart} نتیجه کامل
          </div>
          {results.map((r, i) => {
            const house = getHouse(r.house);
            return (
              <div
                key={r.house}
                className="rounded-[12px] p-3"
                style={{ background: 'var(--tg-bg-secondary)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[18px]">{house.emoji}</span>
                    <span className="text-[13px] font-medium" style={{ color: 'var(--tg-text)' }}>
                      {house.name}
                    </span>
                  </div>
                  <span className="text-[13px] font-bold" style={{ color: house.colorBg }}>
                    %{r.percentage}
                  </span>
                </div>
                <div className="h-[6px] rounded-full overflow-hidden" style={{ background: 'var(--tg-bg)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: show ? `${r.percentage}%` : '0%',
                      backgroundColor: house.colorBg,
                      transition: `width 0.8s ease-out ${0.5 + i * 0.15}s`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom buttons */}
      <div className={`px-5 pb-8 space-y-3 ${show ? 'animate-slide-up' : 'opacity-0'}`}
        style={{ animationDelay: '0.6s' }}>

        <Link href="/quiz" onClick={() => hapticFeedback('medium')}>
          <TGButton variant="primary">
            {TG_EMOJI.party} دوباره بازی کن
          </TGButton>
        </Link>

        <Link href="/" onClick={() => hapticFeedback('light')}>
          <TGButton variant="secondary">
            {TG_EMOJI.castle} بازگشت به صفحه اصلی
          </TGButton>
        </Link>
      </div>
    </div>
  );
}
