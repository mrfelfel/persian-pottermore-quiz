'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { getHouse, HOUSES } from '@/lib/houses';
import { HouseResult } from '@/lib/quiz';
import Link from 'next/link';

export default function ResultPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [results, setResults] = useState<HouseResult[] | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    const saved = localStorage.getItem('hp_results');
    if (saved) {
      setResults(JSON.parse(saved));
      // Animate details after a delay
      setTimeout(() => setShowDetails(true), 1500);
    } else {
      router.push('/quiz');
    }
  }, [user, router]);

  if (!results || !user) return null;

  const topHouse = getHouse(results[0].house);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      {/* Main result */}
      <div className="text-center max-w-lg w-full">
        {/* House reveal */}
        <div
          className="mb-8 animate-fade-in"
          style={{ animation: 'fadeInUp 1s ease-out' }}
        >
          <div className="text-6xl mb-4">{topHouse.emoji}</div>
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ color: topHouse.colorBg }}
          >
            {topHouse.name}
          </h1>
          <p className="text-lg text-gray-300">{topHouse.trait}</p>
        </div>

        {/* Score circle */}
        <div className="relative w-40 h-40 mx-auto mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60" cy="60" r="50"
              fill="none" stroke="#1f2937" strokeWidth="10"
            />
            <circle
              cx="60" cy="60" r="50"
              fill="none"
              stroke={topHouse.colorBg}
              strokeWidth="10"
              strokeDasharray={`${results[0].percentage * 3.14} 314`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold" style={{ color: topHouse.colorBg }}>
              %{results[0].percentage}
            </span>
          </div>
        </div>

        {/* Description */}
        <div
          className={`bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/10 transition-all duration-700 ${
            showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-white/80 leading-relaxed">{topHouse.description}</p>
        </div>

        {/* All houses bar chart */}
        <div
          className={`space-y-4 mb-8 transition-all duration-700 delay-300 ${
            showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h3 className="text-lg font-bold text-white/60 mb-4">نتیجه کامل</h3>
          {results.map((r, i) => {
            const house = getHouse(r.house);
            return (
              <div key={r.house} className="flex items-center gap-3">
                <span className="text-xl w-8">{house.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-white/80">{house.name}</span>
                    <span className="text-sm font-bold" style={{ color: house.colorBg }}>
                      %{r.percentage}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: showDetails ? `${r.percentage}%` : '0%',
                        backgroundColor: house.colorBg,
                        transitionDelay: `${i * 150}ms`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div
          className={`space-y-4 transition-all duration-700 delay-500 ${
            showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Link
            href="/quiz"
            className="inline-block px-8 py-3 bg-gradient-to-l from-amber-600 to-red-700 hover:from-amber-500 hover:to-red-600 rounded-full font-bold transition-all hover:scale-105"
          >
            دوباره امتحان کن 🔄
          </Link>
          <Link
            href="/"
            className="block text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
