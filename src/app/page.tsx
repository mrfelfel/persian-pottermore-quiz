'use client';

import { useTWA } from '@/components/TelegramProvider';
import TelegramLogin from '@/components/TelegramLogin';
import Link from 'next/link';

export default function Home() {
  const { user, isInTelegram, logout } = useTWA();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-lg w-full">
        <div className="text-6xl mb-6">⚡</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-l from-amber-400 via-red-500 to-purple-600 bg-clip-text text-transparent">
          گروه‌بندی هاگوارتز
        </h1>
        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
          کدوم گروه هاگوارتزی تو هستی؟<br />
          ۸ سوال جادویی منتظرته...
        </p>

        {user ? (
          <div className="space-y-6">
            <p className="text-white text-lg">
              سلام <span className="text-amber-400 font-bold">{user.first_name}</span> 👋
            </p>
            <Link
              href="/quiz"
              className="inline-block px-10 py-4 bg-gradient-to-l from-amber-600 to-red-700 hover:from-amber-500 hover:to-red-600 rounded-full text-lg font-bold transition-all hover:scale-105 shadow-lg shadow-amber-900/30"
            >
              شروع کوییز ⚡
            </Link>
            {!isInTelegram && (
              <div>
                <button
                  onClick={logout}
                  className="text-sm text-gray-600 hover:text-gray-400 transition-colors"
                >
                  خروج
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <TelegramLogin onAuth={(u) => {
              localStorage.setItem('hp_tg_user', JSON.stringify(u));
              window.location.reload();
            }} />
            <p className="text-gray-600 text-xs">
              با اکانت تلگرامت وارد شو
            </p>
          </div>
        )}
      </div>

      {/* Houses preview */}
      <div className="grid grid-cols-4 gap-3 max-w-md w-full mt-12">
        {[
          { name: 'گریفیندور', emoji: '🦁', color: 'from-red-800 to-red-900' },
          { name: 'ریونکلاو', emoji: '🦅', color: 'from-blue-800 to-blue-900' },
          { name: 'هاگلپاف', emoji: '🦡', color: 'from-yellow-700 to-yellow-800' },
          { name: 'اسلیترین', emoji: '🐍', color: 'from-green-800 to-green-900' },
        ].map((h) => (
          <div
            key={h.name}
            className={`bg-gradient-to-b ${h.color} rounded-xl p-4 text-center opacity-50 hover:opacity-100 transition-opacity`}
          >
            <div className="text-3xl mb-2">{h.emoji}</div>
            <div className="text-xs text-white/70">{h.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
