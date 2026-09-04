'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { hapticFeedback } from '@/lib/twa';
import { ready, volumes, characters, timeline } from '@/lib/archive/catalog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from 'cn';

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
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-xl" style={{ color: 'var(--tg-button)' }}>local_library</span>
          <h1 className="text-lg font-bold" style={{ color: 'var(--tg-text)' }}>
            تاریخ جامعه جادویی فارسی
          </h1>
        </div>
        <p className="text-xs mb-4" style={{ color: 'var(--tg-hint)' }}>
          جلدها، شخصیت‌ها و رویدادها
        </p>

        {/* Search */}
        <Input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="جستجو..."
          className="mb-4 h-10 rounded-xl text-sm"
          style={{
            background: 'var(--tg-bg-secondary)',
            borderColor: 'transparent',
            color: 'var(--tg-text)',
          }}
        />

        {/* Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <Button
              key={tab.key}
              variant="ghost"
              size="sm"
              onClick={() => { hapticFeedback('light'); setActiveTab(tab.key); }}
              className={cn(
                'shrink-0 gap-1.5 rounded-full px-3 h-8 text-[11px] font-medium',
                activeTab === tab.key
                  ? 'text-white'
                  : 'text-[var(--tg-hint)] hover:text-[var(--tg-hint)]'
              )}
              style={{
                background: activeTab === tab.key ? 'var(--tg-button)' : 'var(--tg-bg-secondary)',
                color: activeTab === tab.key ? 'var(--tg-button-text)' : 'var(--tg-hint)',
              }}
            >
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Volumes */}
        {loaded && activeTab === 'volumes' && (
          <div className="space-y-2">
            {filteredVolumes.map(vol => (
              <Link key={vol.slug} href={`/archive/volume/${vol.slug}`}
                onClick={() => hapticFeedback('light')}>
                <Card
                  className="rounded-xl py-0 border-0 shadow-none transition-transform active:scale-[0.98] mb-0"
                  style={{ background: 'var(--tg-bg-secondary)' }}
                >
                  <CardContent className="flex items-center gap-3 px-4 py-3.5">
                    <span className="text-2xl shrink-0">{vol.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: 'var(--tg-text)' }}>
                        {vol.title}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0" style={{
                          background: 'var(--tg-bg)',
                          color: 'var(--tg-hint)',
                        }}>
                          {vol.chapters.length} فصل
                        </Badge>
                      </div>
                    </div>
                    <span className="text-xs shrink-0" style={{ color: 'var(--tg-hint)' }}>‹</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {filteredVolumes.length === 0 && (
              <div className="text-center py-12" style={{ color: 'var(--tg-hint)' }}>
                <p className="text-sm">نتیجه‌ای یافت نشد</p>
              </div>
            )}
          </div>
        )}

        {/* Characters */}
        {loaded && activeTab === 'characters' && (
          <div className="grid grid-cols-2 gap-2.5">
            {filteredCharacters.map(ch => (
              <Link key={ch.id} href={`/archive/characters/${ch.id}`}
                onClick={() => hapticFeedback('light')}>
                <Card
                  className="rounded-xl py-0 border-0 shadow-none transition-transform active:scale-[0.97]"
                  style={{ background: 'var(--tg-bg-secondary)' }}
                >
                  <CardContent className="p-3.5">
                    <div className="text-sm font-medium mb-0.5 truncate" style={{ color: 'var(--tg-text)' }}>
                      {ch.name}
                    </div>
                    {ch.aliases.length > 0 && (
                      <div className="text-[10px] truncate mb-1" style={{ color: 'var(--tg-hint)' }}>
                        {ch.aliases.join(' · ')}
                      </div>
                    )}
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0" style={{
                      background: 'var(--tg-button)',
                      color: 'var(--tg-button-text)',
                    }}>
                      {ch.role}
                    </Badge>
                    {ch.period && (
                      <div className="text-[10px] mt-1" style={{ color: 'var(--tg-hint)' }}>
                        {ch.period}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
            {filteredCharacters.length === 0 && (
              <div className="col-span-2 text-center py-12" style={{ color: 'var(--tg-hint)' }}>
                <p className="text-sm">نتیجه‌ای یافت نشد</p>
              </div>
            )}
          </div>
        )}

        {/* Timeline */}
        {loaded && activeTab === 'timeline' && (
          <div className="space-y-1.5">
            {TIMELINE_YEARS.map(year => {
              const entry = timeline.find(t => t.year === year);
              return (
                <Link key={year} href="/archive/timeline"
                  onClick={() => hapticFeedback('light')}>
                  <Card
                    className="rounded-xl py-0 border-0 shadow-none transition-transform active:scale-[0.98]"
                    style={{ background: 'var(--tg-bg-secondary)' }}
                  >
                    <CardContent className="flex items-center justify-between px-4 py-3.5">
                      <div>
                        <span className="text-sm font-medium" style={{ color: 'var(--tg-text)' }}>{year}</span>
                        {entry?.yearGregorian && (
                          <span className="text-[10px] mr-2" style={{ color: 'var(--tg-hint)' }}>
                            ({entry.yearGregorian})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {entry && (
                          <Badge variant="secondary" className="text-[9px] px-1.5 py-0" style={{
                            background: 'var(--tg-bg)',
                            color: 'var(--tg-hint)',
                          }}>
                            {entry.events.length} رویداد
                          </Badge>
                        )}
                        <span style={{ color: 'var(--tg-hint)' }} className="text-xs">‹</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {!loaded && (
          <div className="text-center py-20" style={{ color: 'var(--tg-hint)' }}>
            در حال بارگذاری...
          </div>
        )}
      </main>
    </div>
  );
}
