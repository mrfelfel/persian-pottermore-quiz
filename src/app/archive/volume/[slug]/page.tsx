'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import NavBar from '@/components/NavBar';
import { hapticFeedback, showBackButton, hideBackButton } from '@/lib/twa';
import { ready, getVolume } from '@/lib/archive/catalog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function VolumePage() {
  const { slug } = useParams<{ slug: string }>();
  const [loaded, setLoaded] = useState(getVolume(slug) !== undefined);
  const volume = getVolume(slug);

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
          <div className="text-3xl mb-2 animate-pulse">📖</div>
          <p style={{ color: 'var(--tg-hint)' }}>در حال بارگذاری...</p>
        </main>
        <NavBar />
      </div>
    );
  }

  if (!volume) {
    return (
      <div className="min-h-[100dvh] pb-20" style={{ background: 'var(--tg-bg)' }}>
        <main className="px-6 pt-8 max-w-lg mx-auto text-center py-12">
          <div className="text-3xl mb-2">📖</div>
          <p style={{ color: 'var(--tg-hint)' }}>جلد یافت نشد</p>
          <Link
            href="/library"
            className="inline-block mt-4 text-sm"
            style={{ color: 'var(--tg-button)' }}
          >
            بازگشت به آرشیو
          </Link>
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

        {/* Volume header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{volume.icon}</span>
          <div>
            <h1
              className="text-lg font-bold"
              style={{ color: 'var(--tg-text)' }}
            >
              {volume.title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0" style={{
                background: 'var(--tg-bg-secondary)',
                color: 'var(--tg-hint)',
              }}>
                {volume.chapters.length} فصل
              </Badge>
            </div>
          </div>
        </div>

        {/* Chapter list */}
        <div className="space-y-3">
          {volume.chapters.map((chapter, index) => (
            <Link
              key={chapter.slug}
              href={`/archive/chapter/${chapter.slug}`}
              onClick={() => hapticFeedback('light')}
            >
              <Card
                className="rounded-2xl border-0 shadow-none py-0 transition-transform active:scale-[0.98]"
                style={{ background: 'var(--tg-bg-secondary)' }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary" className="text-[10px] font-bold shrink-0 w-6 h-6 rounded-full items-center justify-center mt-0.5 px-0" style={{
                      background: 'var(--tg-bg)',
                      color: 'var(--tg-hint)',
                    }}>
                      {index + 1}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <h2
                        className="text-sm font-medium mb-1"
                        style={{ color: 'var(--tg-text)' }}
                      >
                        {chapter.title}
                      </h2>
                      {chapter.epigraph && (
                        <p
                          className="text-[11px] leading-relaxed line-clamp-2"
                          style={{ color: 'var(--tg-hint)' }}
                        >
                          {chapter.epigraph}
                        </p>
                      )}
                    </div>
                    <span
                      className="text-xs shrink-0 mt-1"
                      style={{ color: 'var(--tg-hint)' }}
                    >
                      ‹
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {volume.chapters.length === 0 && (
          <div className="text-center py-10" style={{ color: 'var(--tg-hint)' }}>
            <div className="text-2xl mb-2">📄</div>
            فصلی در این جلد موجود نیست
          </div>
        )}
      </main>
      <NavBar />
    </div>
  );
}