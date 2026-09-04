'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { hapticFeedback } from '@/lib/twa';
import { cn } from 'cn';

const TABS = [
  { href: '/', icon: 'home', label: 'خانه' },
  { href: '/library', icon: 'local_library', label: 'کتابخانه' },
  { href: '/quiz', icon: 'quiz', label: 'کوییز' },
  { href: '/profile', icon: 'badge', label: 'شناسنامه' },
  { href: '/leaderboard', icon: 'leaderboard', label: 'رتبه' },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 backdrop-blur-xl border-t border-white/[0.06]"
      style={{
        background: 'color-mix(in srgb, var(--tg-bg-secondary) 85%, transparent)',
        paddingBottom: 'max(0px, var(--safe-bottom))',
      }}>
      <div className="flex items-center justify-around max-w-lg mx-auto h-[60px]">
        {TABS.map((tab) => {
          const active = pathname === tab.href ||
            (tab.href !== '/' && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={() => hapticFeedback('light')}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[52px]',
                active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground/70'
              )}
            >
              <span className={cn(
                'material-symbols-outlined text-[22px] transition-transform duration-200',
                active && 'scale-110'
              )}>
                {tab.icon}
              </span>
              <span className={cn(
                'text-[10px] transition-all duration-200',
                active ? 'font-semibold' : 'font-normal'
              )}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
