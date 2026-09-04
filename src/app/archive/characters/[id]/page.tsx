'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Markdown from 'react-markdown';
import NavBar from '@/components/NavBar';
import WikiEditor from '@/components/WikiEditor';
import { useWikiEdit } from '@/lib/wiki/hooks';
import { useTWA } from '@/components/TelegramProvider';
import { hapticFeedback, showBackButton, hideBackButton } from '@/lib/twa';
import { ready, getCharacter } from '@/lib/archive/catalog';
import type { Character } from '@/lib/archive/types';

export default function CharacterPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useTWA();
  const [loaded, setLoaded] = useState(false);
  const [character, setCharacter] = useState<Character | undefined>(undefined);

  // Wiki editing
  const wiki = useWikiEdit(`character-${id}`, user?.id?.toString() || null);

  useEffect(() => {
    ready().then(() => {
      setCharacter(getCharacter(id));
      setLoaded(true);
    });
    showBackButton(() => {
      hapticFeedback('light');
      window.location.href = '/archive/characters';
    });
    return () => hideBackButton();
  }, [id]);

  // Initialize wiki content from character data
  useEffect(() => {
    if (character && !wiki.content && character.content) {
      wiki.setContent(character.content);
    }
  }, [character]);

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

  if (!character) {
    return (
      <div className="min-h-[100dvh] pb-20" style={{ background: 'var(--tg-bg)' }}>
        <main className="px-6 pt-8 max-w-lg mx-auto text-center py-12">
          <div className="text-3xl mb-2">👤</div>
          <p style={{ color: 'var(--tg-hint)' }}>شخصیت یافت نشد</p>
          <Link
            href="/archive/characters"
            className="inline-block mt-4 text-sm"
            style={{ color: 'var(--tg-button)' }}
          >
            بازگشت به فهرست شخصیت‌ها
          </Link>
        </main>
        <NavBar />
      </div>
    );
  }

  const metaEntries = character.metadata
    ? Object.entries(character.metadata)
    : [];

  return (
    <div className="min-h-[100dvh] pb-20" style={{ background: 'var(--tg-bg)' }}>
      <main className="px-6 pt-8 max-w-lg mx-auto">
        {/* Back button */}
        <Link
          href="/archive/characters"
          onClick={() => hapticFeedback('light')}
          className="inline-flex items-center gap-1 text-sm mb-5"
          style={{ color: 'var(--tg-button)' }}
        >
          <span>›</span>
          <span>شخصیت‌ها</span>
        </Link>

        {/* Character header */}
        <div className="mb-4">
          <h1
            className="text-xl font-bold mb-1"
            style={{ color: 'var(--tg-text)' }}
          >
            {character.name}
          </h1>
          {character.aliases.length > 0 && (
            <p className="text-sm mb-2" style={{ color: 'var(--tg-hint)' }}>
              {character.aliases.join(' · ')}
            </p>
          )}
          {character.epigraph && (
            <blockquote
              className="mt-3 px-4 py-3 rounded-xl text-[12px] leading-relaxed italic"
              style={{
                background: 'var(--tg-bg-secondary)',
                borderRight: '3px solid var(--tg-button)',
                color: 'var(--tg-hint)',
              }}
            >
              {character.epigraph}
            </blockquote>
          )}
        </div>

        {/* Infobox */}
        <div
          className="rounded-2xl overflow-hidden mb-4"
          style={{ background: 'var(--tg-bg-secondary)' }}
        >
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {character.role && (
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-[11px] font-medium" style={{ color: 'var(--tg-hint)' }}>نقش</span>
                <span className="text-[12px] font-medium" style={{ color: 'var(--tg-text)' }}>{character.role}</span>
              </div>
            )}
            {character.school && (
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-[11px] font-medium" style={{ color: 'var(--tg-hint)' }}>مدرسه / سازمان</span>
                <span className="text-[12px]" style={{ color: 'var(--tg-text)' }}>{character.school}</span>
              </div>
            )}
            {character.period && (
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-[11px] font-medium" style={{ color: 'var(--tg-hint)' }}>دوره فعالیت</span>
                <span className="text-[12px]" style={{ color: 'var(--tg-text)' }}>{character.period}</span>
              </div>
            )}
            {metaEntries.map(([key, value]) => (
              <div key={key} className="flex justify-between items-center px-4 py-3">
                <span className="text-[11px] font-medium" style={{ color: 'var(--tg-hint)' }}>{key}</span>
                <span className="text-[12px]" style={{ color: 'var(--tg-text)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

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

        {/* Full content */}
        {wiki.content ? (
          <article className="character-content mt-4" style={{ color: 'var(--tg-text)' }}>
            <Markdown
              components={{
                h2: ({ children }) => (
                  <h2 className="text-base font-bold mt-8 mb-3" style={{ color: 'var(--tg-text)' }}>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-bold mt-6 mb-2" style={{ color: 'var(--tg-text)' }}>
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-[13px] leading-[2] mb-3" style={{ color: 'var(--tg-text)' }}>
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
                  <a href={href} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--tg-link, #6ab2f2)' }}>
                    {children}
                  </a>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-3 space-y-1 text-[13px] leading-[2]">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-3 space-y-1 text-[13px] leading-[2]">{children}</ol>
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
          <div className="text-center py-8 rounded-2xl" style={{ background: 'var(--tg-bg-secondary)' }}>
            <div className="text-2xl mb-2">📝</div>
            <p className="text-sm" style={{ color: 'var(--tg-hint)' }}>
              محتوای تکمیلی موجود نیست
            </p>
          </div>
        )}
      </main>
      <NavBar />
    </div>
  );
}
