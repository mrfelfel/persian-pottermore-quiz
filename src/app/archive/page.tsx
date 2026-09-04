'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import { hapticFeedback } from '@/lib/twa';
import { ready, volumes, characters, timeline } from '@/lib/archive/catalog';
import type { Volume, Character, TimelineEntry } from '@/lib/archive/types';

type Tab = 'volumes' | 'characters' | 'timeline';

const TABS: { key: Tab; label: string }[] = [
  { key: 'volumes', label: 'جلدها' },
  { key: 'characters', label: 'شخصیت‌ها' },
  { key: 'timeline', label: 'خط زمانی' },
];

const TIMELINE_YEARS = Array.from({ length: 16 }, (_, i) => {
  const year = 1390 + i;
  return `${year}`;
});

export default function ArchivePage() {
  const [activeTab, setActiveTab] = useState<Tab>('volumes');
  const [loaded, setLoaded] = useState(volumes.length > 0);

  useEffect(() => {
    ready().then(() => setLoaded(true));
  }, []);

  return (
    <div className="min-h-[100dvh] pb-20" style={{ background: 'var(--tg-bg)' }}>
      <main className="px-6 pt-8 max-w-lg mx-auto">
        {!loaded && (
          <div className="text-center py-20" style={{ color: 'var(--tg-hint)' }}>
            <div className="text-3xl mb-2">⏳</div>
            در حال بارگذاری…
          </div>
        )}

        {/* Header */}
        <h1
          className="text-lg font-bold mb-1"
          style={{ color: 'var(--tg-text)' }}
        >
          <span className="icon-book">📚</span> آرشیو تاریخی جامعه جادوگری فارسی
        </h1>
        <p className="text-xs mb-5" style={{ color: 'var(--tg-hint)' }}>
          مجموعه کامل نوشته‌ها، شخصیت‌ها و رویدادهای تاریخچه جامعه
        </p>

        {/* Tab buttons */}
        <div
          className="flex gap-2 overflow-x-auto pb-4 mb-4 -mx-1 px-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                hapticFeedback('light');
                setActiveTab(tab.key);
              }}
              className="shrink-0 px-4 py-2 rounded-full text-[12px] font-medium transition-colors"
              style={{
                background:
                  activeTab === tab.key
                    ? 'var(--tg-button)'
                    : 'var(--tg-bg-secondary)',
                color:
                  activeTab === tab.key
                    ? 'var(--tg-button-text)'
                    : 'var(--tg-hint)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Volumes tab */}
        {loaded && activeTab === 'volumes' && (
          <div className="grid grid-cols-2 gap-3">
            {volumes.map((vol) => (
              <Link
                key={vol.slug}
                href={`/archive/volume/${vol.slug}`}
                onClick={() => hapticFeedback('light')}
                className="rounded-2xl p-4 flex flex-col items-center gap-2 text-center transition-transform active:scale-[0.97]"
                style={{ background: 'var(--tg-bg-secondary)' }}
              >
                <span className="text-2xl">{vol.icon}</span>
                <span
                  className="text-sm font-medium leading-snug"
                  style={{ color: 'var(--tg-text)' }}
                >
                  {vol.title}
                </span>
                <span className="text-[10px]" style={{ color: 'var(--tg-hint)' }}>
                  {vol.chapters.length} فصل
                </span>
              </Link>
            ))}
            {volumes.length === 0 && (
              <div
                className="col-span-2 text-center py-10"
                style={{ color: 'var(--tg-hint)' }}
              >
                <div className="text-3xl mb-2">📖</div>
                جلدی موجود نیست
              </div>
            )}
          </div>
        )}

        {/* Characters tab */}
        {loaded && activeTab === 'characters' && (
          <div className="grid grid-cols-2 gap-3">
            {characters.map((ch) => (
              <Link
                key={ch.id}
                href={`/archive/characters/${ch.id}`}
                onClick={() => hapticFeedback('light')}
                className="rounded-2xl p-4 text-right transition-transform active:scale-[0.97]"
                style={{ background: 'var(--tg-bg-secondary)' }}
              >
                <div
                  className="text-sm font-medium mb-1"
                  style={{ color: 'var(--tg-text)' }}
                >
                  {ch.name}
                </div>
                <div className="text-[10px] mb-1" style={{ color: 'var(--tg-hint)' }}>
                  {ch.role}
                </div>
                {ch.period && (
                  <div
                    className="text-[10px]"
                    style={{ color: 'var(--tg-hint)' }}
                  >
                    {ch.period}
                  </div>
                )}
              </Link>
            ))}
            {characters.length === 0 && (
              <div
                className="col-span-2 text-center py-10"
                style={{ color: 'var(--tg-hint)' }}
              >
                <div className="text-3xl mb-2">👤</div>
                شخصیتی موجود نیست
              </div>
            )}
          </div>
        )}

        {/* Timeline tab */}
        {loaded && activeTab === 'timeline' && (
          <div className="space-y-2">
            {TIMELINE_YEARS.map((year) => {
              const entry = timeline.find((t) => t.year === year);
              return (
                <Link
                  key={year}
                  href="/archive/timeline"
                  onClick={() => hapticFeedback('light')}
                  className="flex items-center justify-between rounded-2xl p-4 transition-transform active:scale-[0.98]"
                  style={{ background: 'var(--tg-bg-secondary)' }}
                >
                  <div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: 'var(--tg-text)' }}
                    >
                      {year}
                    </span>
                    {entry?.yearGregorian && (
                      <span
                        className="text-[10px] mr-2"
                        style={{ color: 'var(--tg-hint)' }}
                      >
                        ({entry.yearGregorian})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {entry && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{
                          background: 'var(--tg-bg)',
                          color: 'var(--tg-hint)',
                        }}
                      >
                        {entry.events.length} رویداد
                      </span>
                    )}
                    <span style={{ color: 'var(--tg-hint)' }} className="text-xs">
                      ‹
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <NavBar />
    </div>
  );
}
