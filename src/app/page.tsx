'use client';

import { useState, useEffect } from 'react';
import { useTWA } from '@/components/TelegramProvider';
import { hapticFeedback, TG_EMOJI } from '@/lib/twa';
import TGButton from '@/components/TGButton';
import Link from 'next/link';

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
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: 'var(--tg-bg)' }}>

      {/* Main content — centered vertically */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 sm:px-6">

        {/* Hero icon */}
        <div className="animate-scale-in text-5xl sm:text-6xl mb-5 select-none">
          {TG_EMOJI.wizard}
        </div>

        {/* Title */}
        <h1 className="animate-slide-up text-xl sm:text-2xl font-bold text-center mb-1.5"
          style={{ color: 'var(--tg-text)' }}>
          گروه‌بندی هاگوارتز
        </h1>

        <p className="animate-slide-up text-sm text-center leading-relaxed mb-8 sm:mb-10"
          style={{ color: 'var(--tg-hint)', animationDelay: '0.05s' }}>
          کدوم گروه هاگوارتزی تو هستی؟
        </p>

        {user ? (
          <div className="w-full max-w-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>

            {/* User greeting card */}
            <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl mb-6 sm:mb-8"
              style={{ background: 'var(--tg-bg-secondary)' }}>
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-xl shrink-0"
                style={{ background: 'var(--tg-button)' }}>
                {TG_EMOJI.sparkle}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm sm:text-[15px] font-medium truncate"
                  style={{ color: 'var(--tg-text)' }}>
                  {user.first_name}
                </div>
                <div className="text-xs sm:text-[13px]"
                  style={{ color: 'var(--tg-hint)' }}>
                  آماده‌ای؟
                </div>
              </div>
            </div>

            {/* Start */}
            <Link href="/quiz" onClick={() => hapticFeedback('medium')}>
              <TGButton>{TG_EMOJI.wand} شروع کوییز</TGButton>
            </Link>

            {!isInTelegram && (
              <button
                onClick={() => { hapticFeedback('light'); logout(); }}
                className="w-full mt-4 py-2.5 text-xs sm:text-[13px] text-center"
                style={{ color: 'var(--tg-hint)' }}>
                خروج
              </button>
            )}
          </div>
        ) : (
          <div className="w-full max-w-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="p-4 sm:p-5 rounded-2xl mb-5"
              style={{ background: 'var(--tg-bg-secondary)' }}>
              <div className="text-sm sm:text-[15px] font-medium mb-1"
                style={{ color: 'var(--tg-text)' }}>
                {TG_EMOJI.lock} ورود با تلگرام
              </div>
              <div className="text-xs sm:text-[13px] mb-4"
                style={{ color: 'var(--tg-hint)' }}>
                با اکانت تلگرامت وارد شو
              </div>
              <TGButton onClick={() => {
                hapticFeedback('medium');
                document.getElementById('tg-login')?.style.setProperty('display', 'block');
              }}>
                {TG_EMOJI.key} ورود
              </TGButton>
            </div>

            {/* Telegram Login Widget */}
            <div id="tg-login" style={{ display: 'none' }} className="flex justify-center">
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

      {/* Houses grid — bottom */}
      <footer className="px-5 sm:px-6 pb-6 sm:pb-8 pt-4 animate-fade-in"
        style={{ animationDelay: '0.3s' }}>
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 max-w-sm mx-auto">
          {HOUSES.map((h) => (
            <div key={h.name}
              className="flex items-center gap-2.5 p-3 rounded-xl"
              style={{ background: 'var(--tg-bg-secondary)' }}>
              <span className="text-xl sm:text-2xl shrink-0">{h.emoji}</span>
              <span className="text-xs sm:text-sm font-medium truncate" style={{ color: h.color }}>
                {h.name}
              </span>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
