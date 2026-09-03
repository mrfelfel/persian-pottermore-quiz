'use client';

import { useAuth } from '@/components/AuthProvider';
import GoogleLogin from '@/components/GoogleLogin';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Hero */}
      <div className="text-center max-w-lg">
        <div className="text-6xl mb-6">⚡</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-l from-amber-400 via-red-500 to-purple-600 bg-clip-text text-transparent">
          گروه‌بندی هاگوارتز
        </h1>
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          کدوم گروه هاگوارتزی تو هستی؟<br />
          ۸ سوال جادویی منتظرته...
        </p>

        {/* Auth */}
        <div className="mb-8">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 mb-6">
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-12 h-12 rounded-full border-2 border-amber-500"
                />
                <span className="text-white">{user.name}</span>
              </div>
              <Link
                href="/quiz"
                className="inline-block px-10 py-4 bg-gradient-to-l from-amber-600 to-red-700 hover:from-amber-500 hover:to-red-600 rounded-full text-lg font-bold transition-all hover:scale-105 shadow-lg shadow-amber-900/30"
              >
                شروع کوییز ⚡
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-500 text-sm mb-4">برای شروع وارد حساب گوگل شو</p>
              <div className="flex justify-center">
                <GoogleLogin />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Houses preview */}
      <div className="grid grid-cols-4 gap-3 max-w-md w-full mt-8">
        {[
          { name: 'گریفیندور', emoji: '🦁', color: 'from-red-800 to-red-900' },
          { name: 'ریونکلاو', emoji: '🦅', color: 'from-blue-800 to-blue-900' },
          { name: 'هاگلپاف', emoji: '🦡', color: 'from-yellow-700 to-yellow-800' },
          { name: 'اسلیترین', emoji: '🐍', color: 'from-green-800 to-green-900' },
        ].map((h) => (
          <div
            key={h.name}
            className={`bg-gradient-to-b ${h.color} rounded-xl p-4 text-center opacity-60 hover:opacity-100 transition-opacity`}
          >
            <div className="text-3xl mb-2">{h.emoji}</div>
            <div className="text-xs text-white/80">{h.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
