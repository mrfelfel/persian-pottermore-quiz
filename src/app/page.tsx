'use client';

import { useTWA } from '@/components/TelegramProvider';
import { hapticFeedback, TG_EMOJI } from '@/lib/twa';
import TGButton from '@/components/TGButton';
import Link from 'next/link';

export default function Home() {
  const { user, isInTelegram, logout } = useTWA();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--tg-bg)' }}>
      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-24">

        {/* Hero icon */}
        <div className="animate-scale-in mb-6 text-[64px] leading-none select-none">
          {TG_EMOJI.wizard}
        </div>

        {/* Title */}
        <h1 className="animate-slide-up text-[22px] font-bold text-center mb-2" style={{ color: 'var(--tg-text)' }}>
          گروه‌بندی هاگوارتز
        </h1>

        <p className="animate-slide-up text-[15px] text-center leading-relaxed mb-10" style={{ color: 'var(--tg-hint)', animationDelay: '0.05s' }}>
          کدوم گروه هاگوارتزی تو هستی؟
        </p>

        {user ? (
          /* Logged in — show greeting */
          <div className="w-full max-w-[340px] animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {/* User card */}
            <div
              className="flex items-center gap-3 p-4 rounded-[16px] mb-8"
              style={{ background: 'var(--tg-bg-secondary)' }}
            >
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-[22px] shrink-0"
                style={{ background: 'var(--tg-button)' }}>
                {TG_EMOJI.sparkle}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-medium truncate" style={{ color: 'var(--tg-text)' }}>
                  {user.first_name}
                </div>
                <div className="text-[13px]" style={{ color: 'var(--tg-hint)' }}>
                  آماده‌ای؟
                </div>
              </div>
            </div>

            {/* Start button */}
            <Link href="/quiz" onClick={() => hapticFeedback('light')}>
              <TGButton onClick={() => hapticFeedback('medium')}>
                {TG_EMOJI.wand} شروع کوییز
              </TGButton>
            </Link>

            {!isInTelegram && (
              <button
                onClick={() => { hapticFeedback('light'); logout(); }}
                className="w-full mt-4 py-3 text-[13px] text-center"
                style={{ color: 'var(--tg-hint)' }}
              >
                خروج
              </button>
            )}
          </div>
        ) : (
          /* Not logged in — Login button */
          <div className="w-full max-w-[340px] animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {/* Browser login */}
            <div className="p-5 rounded-[16px] mb-6" style={{ background: 'var(--tg-bg-secondary)' }}>
              <div className="text-[15px] font-medium mb-1" style={{ color: 'var(--tg-text)' }}>
                {TG_EMOJI.lock} ورود با تلگرام
              </div>
              <div className="text-[13px] mb-4" style={{ color: 'var(--tg-hint)' }}>
                با اکانت تلگرامت وارد شو تا نتیجهت ذخیره بشه
              </div>
              <TGButton onClick={() => {
                // For browser — use Telegram Login Widget
                hapticFeedback('medium');
                const container = document.getElementById('tg-login');
                if (container) {
                  container.style.display = 'block';
                }
              }}>
                {TG_EMOJI.key} ورود
              </TGButton>
            </div>

            {/* Telegram Login Widget container (hidden by default) */}
            <div id="tg-login" style={{ display: 'none' }} className="mb-4">
              <TGLoginWidget />
            </div>
          </div>
        )}
      </div>

      {/* Houses preview — bottom */}
      <div className="px-5 pb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="grid grid-cols-2 gap-3 max-w-[340px] mx-auto">
          {[
            { emoji: TG_EMOJI.lion, name: 'گریفیندور', color: '#ae0001' },
            { emoji: TG_EMOJI.eagle, name: 'ریونکلاو', color: '#222f5b' },
            { emoji: TG_EMOJI.badger, name: 'هاگلپاف', color: '#ecb939' },
            { emoji: TG_EMOJI.snake, name: 'اسلیترین', color: '#2a623d' },
          ].map((h) => (
            <div
              key={h.name}
              className="flex items-center gap-3 p-3 rounded-[12px]"
              style={{ background: 'var(--tg-bg-secondary)' }}
            >
              <span className="text-[24px]">{h.emoji}</span>
              <span className="text-[14px] font-medium" style={{ color: h.color }}>
                {h.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Inline Telegram Login Widget for browser */
function TGLoginWidget() {
  return (
    <div className="flex justify-center">
      <TelegramLoginWidgetInline />
    </div>
  );
}

function TelegramLoginWidgetInline() {
  const containerRef = { current: null } as any;
  const { user } = useTWA();

  if (user) return null;

  return (
    <div className="flex justify-center">
      <iframe
        src="https://oauth.telegram.org/auth?bot_id=HogwartsQuizBot&origin=https://persian-pottermore-quiz.vercel.app&embed=1&request_access=write"
        width="300"
        height="400"
        frameBorder="0"
        className="rounded-[12px]"
        style={{ background: 'var(--tg-bg-secondary)' }}
      />
    </div>
  );
}
