'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { hapticFeedback } from '@/lib/twa';

const TABS = [
  { href: '/', iconClass: 'icon-home', label: 'خانه' },
  { href: '/quiz', iconClass: 'icon-quiz', label: 'کوییز' },
  { href: '/profile', iconClass: 'icon-badge', label: 'شناسنامه' },
  { href: '/blog', iconClass: 'icon-newspaper', label: 'آرشیو' },
  { href: '/leaderboard', iconClass: 'icon-leaderboard', label: 'رتبه' },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t"
      style={{
        background: 'var(--tg-bg-secondary)',
        borderColor: 'rgba(255,255,255,0.08)',
        paddingBottom: 'max(0px, var(--safe-bottom))',
      }}>
      <div className="flex items-center justify-around max-w-lg mx-auto h-14">
        {TABS.map((tab) => {
          const active = pathname === tab.href ||
            (tab.href !== '/' && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={() => hapticFeedback('light')}
              className="flex flex-col items-center gap-0.5 px-3 py-1"
            >
              <span className={`${tab.iconClass} text-lg ${active ? 'opacity-100' : 'opacity-40'}`}
                style={{ filter: active ? 'none' : 'grayscale(1)' }} />
              <span className={`text-[10px] ${active ? 'font-medium' : ''}`}
                style={{ color: active ? 'var(--tg-button)' : 'var(--tg-hint)' }}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
