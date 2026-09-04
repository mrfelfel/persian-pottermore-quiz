'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Markdown from 'react-markdown';
import NavBar from '@/components/NavBar';
import { hapticFeedback, showBackButton, hideBackButton } from '@/lib/twa';
import { ready, volumes } from '@/lib/archive/catalog';
import { useWikiEdit } from '@/lib/wiki/hooks';
import { useTWA } from '@/components/TelegramProvider';
import WikiEditor from '@/components/WikiEditor';
import type { Chapter } from '@/lib/archive/types';

export default function ChapterPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useTWA();
  const [loaded, setLoaded] = useState(false);
  const [chaptersData, setChaptersData] = useState<Record<string, Chapter>>({});

  // Find chapter by matching slug (catalog uses simple slugs, chapters.json uses prefixed slugs)
  const staticChapter = useMemo(() => {
    if (chaptersData[slug]) return chaptersData[slug] as Chapter;
    // Try to find by prefix match
    const key = Object.keys(chaptersData).find((k) => k.endsWith(`---${slug}`) || k.endsWith(slug));
    return key ? (chaptersData[key] as Chapter) : undefined;
  }, [chaptersData, slug]);

  const fallbackChapter = useMemo(() => {
    if (staticChapter) return null;
    for (const vol of volumes) {
      const ch = vol.chapters.find((c) => c.slug === slug);
      if (ch) {
        return {
          slug: ch.slug,
          title: ch.title,
          volume: vol.slug,
          volumeTitle: vol.title,
          epigraph: ch.epigraph,
          content: '',
          sections: [],
          size: ch.size,
        };
      }
    }
    return null;
  }, [slug]);

  const display = staticChapter || fallbackChapter;

  // Wiki editing
  const wiki = useWikiEdit(slug, user?.id?.toString() || null);

  // Initialize wiki content from static data
  useEffect(() => {
    if (display && !wiki.content && display.content) {
      wiki.setContent(display.content);
    }
  }, [display]);

  useEffect(() => {
    // Load chapters data dynamically
    import('@/lib/archive/data/chapters.json').then((mod) => {
      setChaptersData((mod as any).default || mod);
    }).catch(() => {});

    ready().then(() => setLoaded(true));
    showBackButton(() => {
      hapticFeedback('light');
      window.history.back();
    });
    return () => hideBackButton();
  }, []);

  if (!loaded && !display) {
    return (
      <div className="min-h-[100dvh] pb-20" style={{ background: 'var(--tg-bg)' }}>
        <main className="px-6 pt-8 max-w-lg mx-auto text-center py-12">
          <div className="text-3xl mb-2 animate-pulse">📄</div>
          <p style={{ color: 'var(--tg-hint)' }}>در حال بارگذاری...</p>
        </main>
        <NavBar />
      </div>
    );
  }

  if (!display) {
    return (
      <div className="min-h-[100dvh] pb-20" style={{ background: 'var(--tg-bg)' }}>
        <main className="px-6 pt-8 max-w-lg mx-auto text-center py-12">
          <div className="text-3xl mb-2">📄</div>
          <p style={{ color: 'var(--tg-hint)' }}>فصل یافت نشد</p>
          <Link
            href="/archive"
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

  const volume = volumes.find((v) => v.slug === display.volume);

  return (
    <div className="min-h-[100dvh] pb-20" style={{ background: 'var(--tg-bg)' }}>
      <main className="px-6 pt-8 max-w-lg mx-auto">
        {/* Back button */}
        <Link
          href={volume ? `/archive/volume/${volume.slug}` : '/archive'}
          onClick={() => hapticFeedback('light')}
          className="inline-flex items-center gap-1 text-sm mb-5"
          style={{ color: 'var(--tg-button)' }}
        >
          <span>›</span>
          <span>{volume ? volume.title : 'بازگشت'}</span>
        </Link>

        {/* Chapter header */}
        <h1
          className="text-lg font-bold mb-2"
          style={{ color: 'var(--tg-text)' }}
        >
          {display.title}
        </h1>
        {volume && (
          <p className="text-[11px] mb-4" style={{ color: 'var(--tg-hint)' }}>
            {volume.title}
          </p>
        )}

        {/* Epigraph */}
        {display.epigraph && (
          <blockquote
            className="mb-6 px-4 py-3 rounded-xl text-[12px] leading-relaxed italic"
            style={{
              background: 'var(--tg-bg-secondary)',
              borderRight: '3px solid var(--tg-button)',
              color: 'var(--tg-hint)',
            }}
          >
            {display.epigraph}
          </blockquote>
        )}

        {/* Wiki Editor Controls */}
        <WikiEditor
          content={wiki.content}
          isEditing={wiki.isEditing}
          editContent={wiki.editContent}
          onContentChange={wiki.setEditContent}
          onSave={wiki.saveEdit}
          onCancel={wiki.cancelEdit}
          onStartEdit={wiki.startEdit}
          saving={wiki.saving}
          canEdit={wiki.canEdit}
          lockInfo={wiki.lock}
          saved={wiki.saved}
          error={wiki.error}
        />

        {/* Content */}
        {wiki.content ? (
          <article
            className="chapter-content mt-4"
            style={{ color: 'var(--tg-text)' }}
          >
            <Markdown
              components={{
                h2: ({ children }) => (
                  <h2
                    className="text-base font-bold mt-8 mb-3"
                    style={{ color: 'var(--tg-text)' }}
                  >
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3
                    className="text-sm font-bold mt-6 mb-2"
                    style={{ color: 'var(--tg-text)' }}
                  >
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p
                    className="text-[13px] leading-[2] mb-3"
                    style={{ color: 'var(--tg-text)' }}
                  >
                    {children}
                  </p>
                ),
                blockquote: ({ children }) => (
                  <blockquote
                    className="my-4 px-4 py-3 rounded-xl text-[12px] leading-relaxed"
                    style={{
                      background: 'var(--tg-bg-secondary)',
                      borderRight: '3px solid var(--tg-button)',
                      color: 'var(--tg-hint)',
                    }}
                  >
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: 'var(--tg-link, #6ab2f2)' }}
                  >
                    {children}
                  </a>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-3 space-y-1 text-[13px] leading-[2]">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-3 space-y-1 text-[13px] leading-[2]">
                    {children}
                  </ol>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic">{children}</em>
                ),
              }}
            >
              {wiki.content}
            </Markdown>
          </article>
        ) : (
          <div
            className="text-center py-10 rounded-2xl"
            style={{ background: 'var(--tg-bg-secondary)' }}
          >
            <div className="text-2xl mb-2">🚧</div>
            <p className="text-sm" style={{ color: 'var(--tg-hint)' }}>
              محتوای این فصل هنوز تولید نشده است
            </p>
          </div>
        )}
      </main>
      <NavBar />
    </div>
  );
}
