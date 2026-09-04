'use client';

import { useState } from 'react';

import { BLOG_POSTS, ERAS } from '@/lib/ministry/content';
import NavBar from '@/components/NavBar';
import { hapticFeedback } from '@/lib/twa';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from 'cn';

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
          <span className="icon-newspaper" /> آرشیو تاریخی
        </h1>
        <p className="text-xs mb-4" style={{ color: 'var(--tg-hint)' }}>
          {BLOG_POSTS.length} پست از تاریخچه جامعه جادوگری فارسی
        </p>

        {/* Era filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 -mx-1 px-1"
          style={{ scrollbarWidth: 'none' }}>
          <Badge
            variant={activeEra === null ? 'default' : 'secondary'}
            className="shrink-0 cursor-pointer text-[11px]"
            style={activeEra === null ? { background: 'var(--tg-button)' } : {}}
            onClick={() => setActiveEra(null)}
          >
            همه ({BLOG_POSTS.length})
          </Badge>
          {Object.entries(ERAS).map(([key, era]) => {
            const count = BLOG_POSTS.filter((p) => p.era === key).length;
            if (count === 0) return null;
            return (
              <Badge
                key={key}
                variant={activeEra === key ? 'default' : 'secondary'}
                className="shrink-0 cursor-pointer text-[11px]"
                style={activeEra === key ? { background: 'var(--tg-button)' } : {}}
                onClick={() => setActiveEra(activeEra === key ? null : key)}
              >
                {era.label} ({count})
              </Badge>
            );
          })}
        </div>

        {/* Posts */}
        <div className="space-y-3">
          {[...filtered].reverse().map((post) => (
            <Card
              key={post.id}
              className="border-0 overflow-hidden"
              style={{ background: 'var(--tg-bg-secondary)' }}
            >
              <button
                onClick={() => { hapticFeedback('light'); setExpanded(expanded === post.id ? null : post.id); }}
                className="w-full text-right p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="text-base shrink-0 mt-0.5"
                    style={{ color: 'var(--tg-button)' }}>
                    📰
                  </span>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-medium mb-1" style={{ color: 'var(--tg-text)' }}>
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-2 text-[11px]"
                      style={{ color: 'var(--tg-hint)' }}>
                      📅 {post.dateJalali}
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: 'var(--tg-hint)' }}>
                      👤 {post.author}
                    </div>
                  </div>
                  <span className="text-lg shrink-0"
                    style={{
                      color: 'var(--tg-hint)',
                      transform: expanded === post.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}>
                    ▾
                  </span>
                </div>
              </button>

              {expanded === post.id && (
                <CardContent className="px-4 pb-4 pt-0 animate-fade-in">
                  <div className="rounded-xl p-4 mb-3"
                    style={{ background: 'var(--tg-bg)' }}>
                    <p className="text-[13px] leading-[1.8] whitespace-pre-line"
                      style={{ color: 'var(--tg-text)' }}>
                      {post.body}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px]"
                    style={{ color: 'var(--tg-hint)' }}>
                    🔗 منبع: {post.source}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[10px]">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: 'var(--tg-hint)' }}>
            <div className="text-3xl mb-2">🔍</div>
            پستی در این دوره یافت نشد
          </div>
        )}
      </main>
      <NavBar />
    </div>
  );
}
