'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import { hapticFeedback, showBackButton, hideBackButton } from '@/lib/twa';
import { ready, timeline } from '@/lib/archive/catalog';

export default function TimelinePage() {
  const [loaded, setLoaded] = useState(timeline.length > 0);

  useEffect(() => {
    ready().then(() => setLoaded(true));
    showBackButton(() => {
      hapticFeedback('light');
      window.location.href = '/archive';
    });
    return () => hideBackButton();
  }, []);

  if (!loaded) {
    return (
      <div className="min-h-[100dvh] pb-20" style={{ background: 'var(--tg-bg)' }}>
        <main className="px-6 pt-8 max-w-lg mx-auto text-center py-12">
          <div className="text-3xl mb-2 animate-pulse">📅</div>
          <p style={{ color: 'var(--tg-hint)' }}>در حال بارگذاری...</p>
        </main>
        <NavBar />
      </div>
    );
  }

  // Build the full year list 1390-1405, using data from timeline when available.
  // Timeline data may use Persian digits (۱۳۹۶) so we match by index instead of string.
  const startYear = 1390;
  const allYears = Array.from({ length: 16 }, (_, i) => {
    const entry = timeline[i];
    if (entry) return entry;
    return {
      year: (startYear + i).toString(),
      yearGregorian: `${1911 + i}-${1912 + i}`,
      events: [],
    };
  });

  return (
    <div className="min-h-[100dvh] pb-20" style={{ background: 'var(--tg-bg)' }}>
      <main className="px-6 pt-8 max-w-lg mx-auto">
        {/* Back button */}
        <Link
          href="/archive"
          onClick={() => hapticFeedback('light')}
          className="inline-flex items-center gap-1 text-sm mb-5"
          style={{ color: 'var(--tg-button)' }}
        >
          <span>›</span>
          <span>بازگشت</span>
        </Link>

        {/* Title */}
        <h1
          className="text-lg font-bold mb-1"
          style={{ color: 'var(--tg-text)' }}
        >
          خط زمانی ۱۳۹۰–۱۴۰۵
        </h1>
        <p className="text-xs mb-6" style={{ color: 'var(--tg-hint)' }}>
          {timeline.reduce((sum, t) => sum + t.events.length, 0)} رویداد در{' '}
          {timeline.filter((t) => t.events.length > 0).length} سال
        </p>

        {/* Vertical timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute right-[11px] top-0 bottom-0 w-[2px]"
            style={{ background: 'var(--tg-bg-secondary)' }}
          />

          <div className="space-y-5">
            {allYears.map((entry, index) => {
              const hasEvents = entry.events.length > 0;

              return (
                <div key={entry.year} className="relative flex gap-4">
                  {/* Year dot */}
                  <div className="relative z-10 flex flex-col items-center shrink-0">
                    <div
                      className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[8px] font-bold"
                      style={{
                        background: hasEvents
                          ? 'var(--tg-button)'
                          : 'var(--tg-bg-secondary)',
                        color: hasEvents
                          ? 'var(--tg-button-text)'
                          : 'var(--tg-hint)',
                      }}
                    >
                      {index + 1}
                    </div>
                  </div>

                  {/* Year card */}
                  <div
                    className="flex-1 rounded-2xl p-4 mb-0"
                    style={{ background: 'var(--tg-bg-secondary)' }}
                  >
                    <div className="flex items-baseline gap-2 mb-2">
                      <span
                        className="text-sm font-bold"
                        style={{ color: 'var(--tg-text)' }}
                      >
                        {entry.year}
                      </span>
                      <span
                        className="text-[10px]"
                        style={{ color: 'var(--tg-hint)' }}
                      >
                        {entry.yearGregorian}
                      </span>
                    </div>

                    {hasEvents ? (
                      <ul className="space-y-1.5">
                        {entry.events.map((event, i) => (
                          <li
                            key={i}
                            className="text-[12px] leading-relaxed flex items-start gap-2"
                            style={{ color: 'var(--tg-text)' }}
                          >
                            <span
                              className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full"
                              style={{ background: 'var(--tg-button)' }}
                            />
                            {event}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p
                        className="text-[11px] italic"
                        style={{ color: 'var(--tg-hint)' }}
                      >
                        رویداد ثبت‌شده‌ای وجود ندارد
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <NavBar />
    </div>
  );
}
