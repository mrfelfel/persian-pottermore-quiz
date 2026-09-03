'use client';

import { useState, useEffect } from 'react';
import { useTWA } from '@/components/TelegramProvider';
import { hapticFeedback, TG_EMOJI } from '@/lib/twa';
import { getProfile, createProfile } from '@/lib/ministry/store';
import TGButton from '@/components/TGButton';
import Link from 'next/link';
import NavBar from '@/components/NavBar';

const HOUSES = [
  { emoji: TG_EMOJI.lion, name: 'گریفیندور', color: '#ae0001' },
  { emoji: TG_EMOJI.eagle, name: 'ریونکلاو', color: '#222f5b' },
  { emoji: TG_EMOJI.badger, name: 'هاگلپاف', color: '#ecb939' },
  { emoji: TG_EMOJI.snake, name: 'اسلیترین', color: '#2a623d' },
];

export default function Home() {
  const { user, isInTelegram, logout } = useTWA();
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
    // Create profile if user exists and no profile yet
    if (user && !getProfile()) {
      createProfile(user.first_name, user.username, user.photo_url);
    }
  }, [user]);

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: 'var(--tg-bg)' }}>

      <main className="flex-1 flex flex-col items-center justify-center px-6 sm:px-8">

        {/* Hero icon */}
        <div className="animate-scale-in text-5xl sm:text-6xl mb-6 select-none">
          {TG_EMOJI.wizard}
        </div>

        {/* Title */}
        <h1 className="animate-slide-up text-xl sm:text-2xl font-bold text-center mb-2"
          style={{ color: 'var(--tg-text)' }}>
          گروه‌بندی هاگوارتز
        </h1>

        <p className="animate-slide-up text-sm text-center leading-relaxed mb-10 sm:mb-12"
          style={{ color: 'var(--tg-hint)', animationDelay: '0.05s' }}>
          کدوم گروه هاگوارتزی تو هستی؟
        </p>

        {user ? (
          <div className="w-full max-w-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>

            {/* Greeting card */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl mb-7"
              style={{ background: 'var(--tg-bg-secondary)' }}>
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl shrink-0"
                style={{ background: 'var(--tg-button)' }}>
                {TG_EMOJI.sparkle}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-medium truncate"
                  style={{ color: 'var(--tg-text)' }}>
                  {user.first_name}
                </div>
                <div className="text-[13px]"
                  style={{ color: 'var(--tg-hint)' }}>
                  آماده‌ای؟
                </div>
              </div>
            </div>

            {/* Start button */}
            <Link href="/quiz" onClick={() => hapticFeedback('medium')}>
              <TGButton>{TG_EMOJI.wand} شروع کوییز</TGButton>
            </Link>

            {!isInTelegram && (
              <button
                onClick={() => { hapticFeedback('light'); logout(); }}
                className="w-full mt-6 py-3 text-[13px] text-center"
                style={{ color: 'var(--tg-hint)' }}>
                خروج
              </button>
            )}
          </div>
        ) : (
          <div className="w-full max-w-sm animate-slide-up space-y-4" style={{ animationDelay: '0.1s' }}>

            {/* Login card */}
            <div className="p-5 rounded-2xl"
              style={{ background: 'var(--tg-bg-secondary)' }}>
              <div className="text-[15px] font-medium mb-1.5"
                style={{ color: 'var(--tg-text)' }}>
                {TG_EMOJI.lock} ورود با تلگرام
              </div>
              <div className="text-[13px] leading-relaxed"
                style={{ color: 'var(--tg-hint)' }}>
                با اکانت تلگرامت وارد شو تا نتیجهت ذخیره بشه
              </div>
            </div>

            {/* Login button — OUTSIDE the card */}
            <TGButton onClick={() => {
              hapticFeedback('medium');
              document.getElementById('tg-login')?.style.setProperty('display', 'block');
            }}>
              {TG_EMOJI.key} ورود با تلگرام
            </TGButton>

            {/* Telegram Login Widget */}
            <div id="tg-login" style={{ display: 'none' }} className="flex justify-center pt-2">
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
      <footer className="px-6 sm:px-8 pb-20 pt-6 animate-fade-in"
        style={{ animationDelay: '0.3s' }}>
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          {HOUSES.map((h) => (
            <div key={h.name}
              className="flex items-center gap-3 p-3.5 rounded-xl"
              style={{ background: 'var(--tg-bg-secondary)' }}>
              <span className="text-xl sm:text-2xl shrink-0">{h.emoji}</span>
              <span className="text-xs sm:text-sm font-medium truncate" style={{ color: h.color }}>
                {h.name}
              </span>
            </div>
          ))}
        </div>
      </footer>
      <NavBar />
    </div>
  );
}
