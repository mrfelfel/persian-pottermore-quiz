'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { hapticFeedback } from '@/lib/twa';
import { ready, volumes, characters, timeline } from '@/lib/archive/catalog';
import type { Volume, Character, TimelineEntry } from '@/lib/archive/types';

type Tab = 'volumes' | 'characters' | 'timeline';

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'volumes', label: 'جلدها', icon: 'menu_book' },
  { key: 'characters', label: 'شخصیت‌ها', icon: 'groups' },
  { key: 'timeline', label: 'خط زمانی', icon: 'timeline' },
];

const TIMELINE_YEARS = Array.from({ length: 16 }, (_, i) => `${1390 + i}`);

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<Tab>('volumes');
  const [loaded, setLoaded] = useState(volumes.length > 0);
  const [search, setSearch] = useState('');

  useEffect(() => { ready().then(() => setLoaded(true)); }, []);

  const filteredVolumes = search
    ? volumes.filter(v => v.title.includes(search) || v.chapters.some(c => c.title.includes(search)))
    : volumes;

  const filteredCharacters = search
    ? characters.filter(c => c.name.includes(search) || c.role.includes(search) || c.school?.includes(search))
    : characters;

  return (
    <div className="min-h-[100dvh] pb-20" style={{ background: 'var(--tg-bg)' }}>
      <main className="px-5 pt-6 max-w-lg mx-auto">

        {/* Header */}
        <h1 className="text-lg font-bold mb-1" style={{ color: 'var(--tg-text)' }}>
          <span className="material-symbols-outlined text-xl align-middle ml-1" style={{ color: 'var(--tg-button)' }}>local_library</span>
          تاریخ جامعه جادویی فارسی
        </h1>
        <p className="text-xs mb-4" style={{ color: 'var(--tg-hint)' }}>
          جلدها، شخصیت‌ها و رویدادها
        </p>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="جستجو..."
          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none mb-4"
          style={{ background: 'var(--tg-bg-secondary)', color: 'var(--tg-text)' }}
        />

        {/* Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => { hapticFeedback('light'); setActiveTab(tab.key); }}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors"
              style={{
                background: activeTab === tab.key ? 'var(--tg-button)' : 'var(--tg-bg-secondary)',
                color: activeTab === tab.key ? 'var(--tg-button-text)' : 'var(--tg-hint)',
              }}>
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Volumes */}
        {loaded && activeTab === 'volumes' && (
          <div className="space-y-2">
            {filteredVolumes.map(vol => (
              <Link key={vol.slug} href={`/archive/volume/${vol.slug}`}
                onClick={() => hapticFeedback('light')}
                className="flex items-center gap-3 p-3.5 rounded-xl transition-transform active:scale-[0.98]"
                style={{ background: 'var(--tg-bg-secondary)' }}>
                <span className="text-2xl shrink-0">{vol.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: 'var(--tg-text)' }}>{vol.title}</div>
                  <div className="text-[10px]" style={{ color: 'var(--tg-hint)' }}>{vol.chapters.length} فصل</div>
                </div>
                <span className="text-xs shrink-0" style={{ color: 'var(--tg-hint)' }}>‹</span>
              </Link>
            ))}
          </div>
        )}

        {/* Characters */}
        {loaded && activeTab === 'characters' && (
          <div className="grid grid-cols-2 gap-2.5">
            {filteredCharacters.map(ch => (
              <Link key={ch.id} href={`/archive/characters/${ch.id}`}
                onClick={() => hapticFeedback('light')}
                className="rounded-xl p-3.5 text-right transition-transform active:scale-[0.97]"
                style={{ background: 'var(--tg-bg-secondary)' }}>
                <div className="text-sm font-medium mb-0.5 truncate" style={{ color: 'var(--tg-text)' }}>{ch.name}</div>
                {ch.aliases.length > 0 && (
                  <div className="text-[10px] truncate mb-0.5" style={{ color: 'var(--tg-hint)' }}>{ch.aliases.join(' · ')}</div>
                )}
                <div className="text-[10px] truncate" style={{ color: 'var(--tg-button)' }}>{ch.role}</div>
                {ch.period && <div className="text-[10px]" style={{ color: 'var(--tg-hint)' }}>{ch.period}</div>}
              </Link>
            ))}
          </div>
        )}

        {/* Timeline */}
        {loaded && activeTab === 'timeline' && (
          <div className="space-y-1.5">
            {TIMELINE_YEARS.map(year => {
              const entry = timeline.find(t => t.year === year);
              return (
                <Link key={year} href="/archive/timeline"
                  onClick={() => hapticFeedback('light')}
                  className="flex items-center justify-between rounded-xl p-3.5 transition-transform active:scale-[0.98]"
                  style={{ background: 'var(--tg-bg-secondary)' }}>
                  <div>
                    <span className="text-sm font-medium" style={{ color: 'var(--tg-text)' }}>{year}</span>
                    {entry?.yearGregorian && <span className="text-[10px] mr-2" style={{ color: 'var(--tg-hint)' }}>({entry.yearGregorian})</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    {entry && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--tg-bg)', color: 'var(--tg-hint)' }}>{entry.events.length} رویداد</span>}
                    <span style={{ color: 'var(--tg-hint)' }} className="text-xs">‹</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!loaded && <div className="text-center py-20" style={{ color: 'var(--tg-hint)' }}>در حال بارگذاری...</div>}
      </main>
    </div>
  );
}
