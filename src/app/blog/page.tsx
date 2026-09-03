'use client';

import { useState } from 'react';
import { BLOG_POSTS, ERAS } from '@/lib/ministry/content';
import NavBar from '@/components/NavBar';
import { hapticFeedback } from '@/lib/twa';

export default function BlogPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeEra, setActiveEra] = useState<string | null>(null);

  const filtered = activeEra
    ? BLOG_POSTS.filter((p) => p.era === activeEra)
    : BLOG_POSTS;

  return (
    <div className="min-h-[100dvh] pb-20" style={{ background: 'var(--tg-bg)' }}>
      <main className="px-5 pt-6 max-w-lg mx-auto">
        <h1 className="text-lg font-bold mb-1" style={{ color: 'var(--tg-text)' }}>
          <span className="material-symbols-outlined align-middle text-xl">newspaper</span>
          {' '}آرشیو تاریخی
        </h1>
        <p className="text-xs mb-4" style={{ color: 'var(--tg-hint)' }}>
          {BLOG_POSTS.length} پست از تاریخچه جامعه جادوگری فارسی
        </p>

        {/* Era filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 -mx-1 px-1"
          style={{ scrollbarWidth: 'none' }}>
          <button
            onClick={() => setActiveEra(null)}
            className="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium"
            style={{
              background: activeEra === null ? 'var(--tg-button)' : 'var(--tg-bg-secondary)',
              color: activeEra === null ? 'var(--tg-button-text)' : 'var(--tg-hint)',
            }}>
            همه ({BLOG_POSTS.length})
          </button>
          {Object.entries(ERAS).map(([key, era]) => {
            const count = BLOG_POSTS.filter((p) => p.era === key).length;
            if (count === 0) return null;
            return (
              <button key={key}
                onClick={() => setActiveEra(activeEra === key ? null : key)}
                className="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium flex items-center gap-1"
                style={{
                  background: activeEra === key ? 'var(--tg-button)' : 'var(--tg-bg-secondary)',
                  color: activeEra === key ? 'var(--tg-button-text)' : 'var(--tg-hint)',
                }}>
                <span className="material-symbols-outlined text-[14px]">{era.icon}</span>
                {era.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Posts */}
        <div className="space-y-3">
          {[...filtered].reverse().map((post) => (
            <div key={post.id}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'var(--tg-bg-secondary)' }}>
              <button
                onClick={() => { hapticFeedback('light'); setExpanded(expanded === post.id ? null : post.id); }}
                className="w-full text-right p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-xl shrink-0 mt-0.5"
                    style={{ color: 'var(--tg-button)' }}>
                    {ERAS[post.era]?.icon || 'article'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-medium mb-1" style={{ color: 'var(--tg-text)' }}>
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-2 text-[11px]"
                      style={{ color: 'var(--tg-hint)' }}>
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      {post.dateJalali}
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: 'var(--tg-hint)' }}>
                      <span className="material-symbols-outlined text-[14px] align-middle">person</span>
                      {' '}{post.author}
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-lg shrink-0"
                    style={{
                      color: 'var(--tg-hint)',
                      transform: expanded === post.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}>
                    expand_more
                  </span>
                </div>
              </button>

              {expanded === post.id && (
                <div className="px-4 pb-4 animate-fade-in">
                  <div className="rounded-xl p-4 mb-3"
                    style={{ background: 'var(--tg-bg)' }}>
                    <p className="text-[13px] leading-[1.8] whitespace-pre-line"
                      style={{ color: 'var(--tg-text)' }}>
                      {post.body}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px]"
                    style={{ color: 'var(--tg-hint)' }}>
                    <span className="material-symbols-outlined text-[12px]">link</span>
                    منبع: {post.source}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-[10px]"
                        style={{ background: 'var(--tg-bg)', color: 'var(--tg-hint)' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: 'var(--tg-hint)' }}>
            <span className="material-symbols-outlined text-4xl block mb-2">search_off</span>
            پستی در این دوره یافت نشد
          </div>
        )}
      </main>
      <NavBar />
    </div>
  );
}
