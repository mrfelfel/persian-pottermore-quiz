'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import NavBar from '@/components/NavBar';
import AddCharacterButton from '@/components/AddCharacterButton';
import { useTWA } from '@/components/TWAInit';
import { hapticFeedback } from '@/lib/twa';
import { ready, characters } from '@/lib/archive/catalog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from 'cn';

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
        <Button
          variant="ghost"
          size="sm"
          asChild
          onClick={() => hapticFeedback('light')}
          className="mb-5 gap-1 text-sm px-0"
          style={{ color: 'var(--tg-button)' }}
        >
          <Link href="/library">
            <span>›</span>
            <span>بازگشت</span>
          </Link>
        </Button>

        {/* Title */}
        <h1
          className="text-lg font-bold mb-1"
          style={{ color: 'var(--tg-text)' }}
        >
          شخصیت‌ها
        </h1>
        <p className="text-xs mb-4" style={{ color: 'var(--tg-hint)' }}>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 mr-1" style={{
            background: 'var(--tg-bg-secondary)',
            color: 'var(--tg-hint)',
          }}>
            {characters.length}
          </Badge>
          شخصیت ثبت‌شده
        </p>

        {/* Add character button */}
        <AddCharacterButton userId={user?.id?.toString() || null} />

        {/* Filter pills */}
        {ALL_SCHOOLS.length > 0 && (
          <div
            className="flex gap-2 overflow-x-auto pb-4 mb-2 -mx-1 px-1"
            style={{ scrollbarWidth: 'none' }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                hapticFeedback('light');
                setActiveFilter(null);
              }}
              className={cn(
                'shrink-0 rounded-full px-3 h-8 text-[11px] font-medium',
              )}
              style={{
                background: activeFilter === null ? 'var(--tg-button)' : 'var(--tg-bg-secondary)',
                color: activeFilter === null ? 'var(--tg-button-text)' : 'var(--tg-hint)',
              }}
            >
              همه ({characters.length})
            </Button>
            {ALL_SCHOOLS.map((school) => {
              const count = characters.filter((c) =>
                c.school?.includes(school)
              ).length;
              return (
                <Button
                  key={school}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    hapticFeedback('light');
                    setActiveFilter(activeFilter === school ? null : school);
                  }}
                  className="shrink-0 rounded-full px-3 h-8 text-[11px] font-medium"
                  style={{
                    background: activeFilter === school ? 'var(--tg-button)' : 'var(--tg-bg-secondary)',
                    color: activeFilter === school ? 'var(--tg-button-text)' : 'var(--tg-hint)',
                  }}
                >
                  {school} ({count})
                </Button>
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
            >
              <Card
                className="rounded-2xl border-0 shadow-none py-0 text-right transition-transform active:scale-[0.97]"
                style={{ background: 'var(--tg-bg-secondary)' }}
              >
                <CardContent className="p-4">
                  <div
                    className="text-sm font-medium mb-1"
                    style={{ color: 'var(--tg-text)' }}
                  >
                    {ch.name}
                  </div>
                  {ch.aliases.length > 0 && (
                    <div
                      className="text-[10px] mb-1.5 truncate"
                      style={{ color: 'var(--tg-hint)' }}
                    >
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
                    <div
                      className="text-[10px] mt-1"
                      style={{ color: 'var(--tg-hint)' }}
                    >
                      {ch.period}
                    </div>
                  )}
                </CardContent>
              </Card>
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