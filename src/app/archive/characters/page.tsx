'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import AddCharacterButton from '@/components/AddCharacterButton';
import { useTWA } from '@/components/TelegramProvider';
import { hapticFeedback } from '@/lib/twa';
import { ready, characters } from '@/lib/archive/catalog';

export default function CharactersPage() {
  const { user } = useTWA();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(characters.length > 0);

  useEffect(() => {
    ready().then(() => setLoaded(true));
  }, []);

  const ALL_SCHOOLS = loaded
    ? Array.from(new Set(characters.map((c) => c.school).filter(Boolean))).sort()
    : [];

  const filtered = activeFilter
    ? characters.filter((c) => c.school?.includes(activeFilter))
    : characters;

  if (!loaded) {
    return (
      <div className="min-h-[100dvh] pb-20" style={{ background: 'var(--tg-bg)' }}>
        <main className="px-6 pt-8 max-w-lg mx-auto text-center py-12">
          <div className="text-3xl mb-2 animate-pulse">👤</div>
          <p style={{ color: 'var(--tg-hint)' }}>در حال بارگذاری...</p>
        </main>
        <NavBar />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] pb-20" style={{ background: 'var(--tg-bg)' }}>
      <main className="px-6 pt-8 max-w-lg mx-auto">
        {/* Back button */}
        <Link
          href="/library"
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
          شخصیت‌ها
        </h1>
        <p className="text-xs mb-4" style={{ color: 'var(--tg-hint)' }}>
          {characters.length} شخصیت ثبت‌شده
        </p>

        {/* Add character button */}
        <AddCharacterButton userId={user?.id?.toString() || null} />

        {/* Filter pills */}
        {ALL_SCHOOLS.length > 0 && (
          <div
            className="flex gap-2 overflow-x-auto pb-4 mb-2 -mx-1 px-1"
            style={{ scrollbarWidth: 'none' }}
          >
            <button
              onClick={() => {
                hapticFeedback('light');
                setActiveFilter(null);
              }}
              className="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium"
              style={{
                background:
                  activeFilter === null
                    ? 'var(--tg-button)'
                    : 'var(--tg-bg-secondary)',
                color:
                  activeFilter === null
                    ? 'var(--tg-button-text)'
                    : 'var(--tg-hint)',
              }}
            >
              همه ({characters.length})
            </button>
            {ALL_SCHOOLS.map((school) => {
              const count = characters.filter((c) =>
                c.school?.includes(school)
              ).length;
              return (
                <button
                  key={school}
                  onClick={() => {
                    hapticFeedback('light');
                    setActiveFilter(activeFilter === school ? null : school);
                  }}
                  className="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium"
                  style={{
                    background:
                      activeFilter === school
                        ? 'var(--tg-button)'
                        : 'var(--tg-bg-secondary)',
                    color:
                      activeFilter === school
                        ? 'var(--tg-button-text)'
                        : 'var(--tg-hint)',
                  }}
                >
                  {school} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Character grid */}
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((ch) => (
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
              {ch.aliases.length > 0 && (
                <div
                  className="text-[10px] mb-1 truncate"
                  style={{ color: 'var(--tg-hint)' }}
                >
                  {ch.aliases.join(' · ')}
                </div>
              )}
              <div className="text-[11px] mb-0.5" style={{ color: 'var(--tg-button)' }}>
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
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-10" style={{ color: 'var(--tg-hint)' }}>
            <div className="text-3xl mb-2">🔍</div>
            شخصیتی در این دسته یافت نشد
          </div>
        )}
      </main>
      <NavBar />
    </div>
  );
}
