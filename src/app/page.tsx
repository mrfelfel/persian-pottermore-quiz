'use client';

import { useState, useEffect } from 'react';
import { useTWA } from '@/components/TWAInit';
import { hapticFeedback } from '@/lib/twa';
import { getProfile, createProfile } from '@/lib/ministry/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from 'cn';
import Link from 'next/link';
import NavBar from '@/components/NavBar';

const HOUSES = [
  { image: '/assets/house-gryffindor.svg', name: 'گریفیندور', color: '#ae0001' },
  { image: '/assets/house-ravenclaw.svg', name: 'ریونکلاو', color: '#222f5b' },
  { image: '/assets/house-hufflepuff.svg', name: 'هاگلپاف', color: '#ecb939' },
  { image: '/assets/house-slytherin.svg', name: 'اسلیترین', color: '#2a623d' },
];

const QUICK_LINKS = [
  { href: '/library', image: '/assets/pixel-scroll.svg', icon: 'local_library', label: 'کتابخانه' },
  { href: '/bank', image: '/assets/pixel-coin.svg', icon: 'account_balance', label: 'گرینگوتس' },
  { href: '/classes', image: '/assets/pixel-spell.svg', icon: 'science', label: 'کلاس‌ها' },
  { href: '/departments', image: '/assets/pixel-shield.svg', icon: 'corporate_fare', label: 'ادارات' },
  { href: '/quiz', image: '/assets/pixel-wizard.svg', icon: 'quiz', label: 'کوییز' },
];

export default function Home() {
  const { user, isInTelegram, logout } = useTWA();
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
    if (user && !getProfile()) {
      createProfile(user.first_name, user.username, user.photo_url);
    }
  }, [user]);

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: 'var(--tg-bg)' }}>

      <main className="flex-1 flex flex-col items-center justify-center px-6 sm:px-8">

        {/* Hero icon */}
        <div className="animate-scale-in mb-6">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full blur-2xl opacity-40"
              style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.4) 0%, transparent 70%)' }}
            />
            <img
              src="/assets/logo-gold.png"
              alt="وزارت سحر و جادو"
              className="relative w-20 h-20 object-contain animate-float"
            />
          </div>
        </div>

        {/* Title */}
        <h1
          className="animate-slide-up text-xl sm:text-2xl font-bold text-center mb-2"
          style={{ color: 'var(--tg-text)' }}
        >
          وزارت سحر و جادو
        </h1>

        <p
          className="animate-slide-up text-sm text-center leading-relaxed mb-10 sm:mb-12"
          style={{ color: 'var(--tg-hint)', animationDelay: '0.05s' }}
        >
          جامعه جادوگری فارسی
        </p>

        {user ? (
          <div
            className="w-full max-w-sm animate-slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            {/* User greeting card */}
            <Card
              className="mb-6 border-0"
              style={{ background: 'var(--tg-bg-secondary)' }}
            >
              <CardContent className="flex items-center gap-3.5 px-4 py-4">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 overflow-hidden border-2"
                  style={{ borderColor: 'rgba(201,168,76,0.3)', background: 'var(--tg-bg)' }}
                >
                  <img src="/assets/pixel-wizard.svg" alt="" className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-[15px] font-medium truncate"
                    style={{ color: 'var(--tg-text)' }}
                  >
                    {user.first_name}
                  </div>
                  <div
                    className="text-[13px]"
                    style={{ color: 'var(--tg-hint)' }}
                  >
                    جادوگر آماده
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="shrink-0 border-0 text-gold-gradient font-bold"
                  style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c' }}
                >
                  <img src="/assets/pixel-crown.svg" alt="" className="w-3.5 h-3.5" style={{ filter: 'brightness(1.5)' }} />
                  فعال
                </Badge>
              </CardContent>
            </Card>

            {/* Start button */}
            <Link href="/quiz" onClick={() => hapticFeedback('medium')} className="block">
              <Button
                className="w-full h-auto py-4 text-[15px] font-semibold rounded-xl shimmer-gold"
                size="lg"
              >
                <img src="/assets/pixel-wizard.svg" alt="" className="w-5 h-5" style={{ filter: 'invert(1)' }} />
                گروه‌بندی هاگوارتز
              </Button>
            </Link>

            {/* Quick links */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => hapticFeedback('light')}
                >
                  <Card
                    className="border-ornate transition-all active:scale-[0.97] cursor-pointer h-full hover:border-[rgba(201,168,76,0.3)]"
                    style={{ background: 'linear-gradient(145deg, #14121e, #1a1528)' }}
                  >
                    <CardContent className="flex flex-col items-center gap-1.5 px-2 py-3 text-center">
                      <img
                        src={link.image}
                        alt={link.label}
                        className="w-7 h-7 object-contain"
                        style={{ filter: 'brightness(1.2) saturate(1.2)' }}
                      />
                      <span
                        className="text-[12px] font-medium leading-tight"
                        style={{ color: 'var(--tg-text)' }}
                      >
                        {link.label}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Logout */}
            {!isInTelegram && (
              <Button
                variant="ghost"
                onClick={() => {
                  hapticFeedback('light');
                  logout();
                }}
                className="w-full mt-4 text-[13px]"
                style={{ color: 'var(--tg-hint)' }}
              >
                خروج
              </Button>
            )}
          </div>
        ) : (
          <div
            className="w-full max-w-sm animate-slide-up space-y-4"
            style={{ animationDelay: '0.1s' }}
          >
            <Card
              className="border-0"
              style={{ background: 'var(--tg-bg-secondary)' }}
            >
              <CardContent className="px-5 py-5">
                <div
                  className="flex items-center gap-2 text-[15px] font-medium mb-1.5"
                  style={{ color: 'var(--tg-text)' }}
                >
                  <span className="material-symbols-outlined text-lg">lock</span>
                  ورود با تلگرام
                </div>
                <div
                  className="text-[13px] leading-relaxed"
                  style={{ color: 'var(--tg-hint)' }}
                >
                  با اکانت تلگرامت وارد شو تا نتیجهت ذخیره بشه
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full h-auto py-4 text-[15px] font-semibold rounded-xl shimmer-gold"
              size="lg"
              onClick={() => {
                hapticFeedback('medium');
                document.getElementById('tg-login')?.style.setProperty('display', 'block');
              }}
            >
              <img src="/assets/pixel-wizard.svg" alt="" className="w-5 h-5" style={{ filter: 'invert(1)' }} />
              ورود با تلگرام
            </Button>

            <div
              id="tg-login"
              style={{ display: 'none' }}
              className="flex justify-center pt-2"
            >
              <iframe
                src={`https://oauth.telegram.org/auth?bot_id=VezaratJadooQuizBot&origin=${encodeURIComponent(origin)}&embed=1&request_access=write`}
                width="260"
                height="380"
                frameBorder="0"
                className="rounded-xl w-full max-w-[260px]"
              />
            </div>
          </div>
        )}
      </main>

      {/* Houses grid */}
      <footer
        className="px-6 sm:px-8 pb-20 pt-6 animate-fade-in"
        style={{ animationDelay: '0.3s' }}
      >
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          {HOUSES.map((h) => (
            <div
              key={h.name}
              className="flex items-center gap-3 p-3.5 rounded-xl border-ornate"
              style={{ background: 'linear-gradient(145deg, #14121e, #1a1528)' }}
            >
              <img
                src={h.image}
                alt={h.name}
                className="w-10 h-10 object-contain"
              />
              <Badge
                variant="outline"
                className="border-0 px-1.5 py-0.5 text-xs sm:text-sm font-medium"
                style={{ color: h.color, background: `${h.color}20` }}
              >
                {h.name}
              </Badge>
            </div>
          ))}
        </div>
      </footer>
      <NavBar />
    </div>
  );
}
