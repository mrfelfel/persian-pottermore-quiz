'use client';

import { useState } from 'react';
import { BLOG_POSTS } from '@/lib/ministry/content';
import NavBar from '@/components/NavBar';
import { hapticFeedback } from '@/lib/twa';

export default function BlogPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="min-h-[100dvh] pb-20" style={{ background: 'var(--tg-bg)' }}>
      <main className="px-5 pt-6 max-w-lg mx-auto">
        <h1 className="text-lg font-bold mb-1" style={{ color: 'var(--tg-text)' }}>
          <span className="material-symbols-outlined align-middle text-xl">newspaper</span>
          {' '}آرشیو تاریخی
        </h1>
        <p className="text-xs mb-6" style={{ color: 'var(--tg-hint)' }}>
          مطالب بازیابی‌شده از وبلاگ‌های اصلی جامعه جادوگری فارسی
        </p>

        <div className="space-y-3">
          {[...BLOG_POSTS].reverse().map((post) => (
            <div key={post.id}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'var(--tg-bg-secondary)' }}>
              <button
                onClick={() => { hapticFeedback('light'); setExpanded(expanded === post.id ? null : post.id); }}
                className="w-full text-right p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-xl shrink-0 mt-0.5"
                    style={{ color: 'var(--tg-button)' }}>article</span>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-medium mb-1" style={{ color: 'var(--tg-text)' }}>
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-2 text-[11px]"
                      style={{ color: 'var(--tg-hint)' }}>
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      {post.dateJalali} ({post.dateGregorian})
                    </div>
                    <div className="text-[11px] mt-1" style={{ color: 'var(--tg-hint)' }}>
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

                  {/* Source info */}
                  <div className="flex items-center gap-1.5 text-[10px]"
                    style={{ color: 'var(--tg-hint)' }}>
                    <span className="material-symbols-outlined text-[12px]">link</span>
                    منبع: {post.source}
                  </div>

                  {/* Tags */}
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
      </main>
      <NavBar />
    </div>
  );
}
