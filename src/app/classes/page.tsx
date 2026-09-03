'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTWA } from '@/components/TelegramProvider';
import { hapticFeedback, TG_EMOJI } from '@/lib/twa';
import { MAGIC_CLASSES, ClassId } from '@/lib/ministry/types';
import { getProfile, completeClass, addCurrency } from '@/lib/ministry/store';
import NavBar from '@/components/NavBar';

export default function ClassesPage() {
  const { user } = useTWA();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [activeClass, setActiveClass] = useState<ClassId | null>(null);
  const [lessonDone, setLessonDone] = useState(false);
  const [result, setResult] = useState('');

  useEffect(() => {
    if (!user) { router.push('/'); return; }
    setProfile(getProfile());
  }, [user, router]);

  if (!user || !profile) return null;

  const handleStartLesson = (classId: ClassId) => {
    hapticFeedback('light');
    setActiveClass(classId);
    setLessonDone(false);
  };

  const handleComplete = () => {
    if (!activeClass) return;
    hapticFeedback('success');
    const { xpGained, levelUp, newLevel } = completeClass(activeClass);
    const classData = MAGIC_CLASSES[activeClass];
    // Pay for the lesson
    addCurrency({ galleons: 1, sickles: 0, knuts: 0 });
    setProfile(getProfile());
    setLessonDone(true);
    setResult(`+${xpGained} XP${levelUp ? ` — لول ${newLevel}!` : ''}`);
  };

  return (
    <div className="min-h-[100dvh] pb-20" style={{ background: 'var(--tg-bg)' }}>
      <main className="px-5 pt-6 max-w-lg mx-auto">
        <h1 className="text-lg font-bold mb-5" style={{ color: 'var(--tg-text)' }}>
          {TG_EMOJI.flask} کلاس‌های جادویی
        </h1>

        {activeClass ? (
          /* Lesson view */
          <div className="animate-slide-up">
            <div className="rounded-2xl p-5 mb-4"
              style={{ background: 'var(--tg-bg-secondary)' }}>
              <div className="text-3xl text-center mb-3">
                {MAGIC_CLASSES[activeClass].emoji}
              </div>
              <h2 className="text-center text-base font-medium mb-1"
                style={{ color: 'var(--tg-text)' }}>
                {MAGIC_CLASSES[activeClass].name}
              </h2>
              <p className="text-center text-[12px] mb-4"
                style={{ color: 'var(--tg-hint)' }}>
                {MAGIC_CLASSES[activeClass].description}
              </p>

              {!lessonDone ? (
                <button onClick={handleComplete}
                  className="w-full py-3.5 rounded-xl text-sm font-medium"
                  style={{ background: 'var(--tg-button)', color: 'var(--tg-button-text)' }}>
                  {TG_EMOJI.sparkle} تکمیل درس
                </button>
              ) : (
                <div className="text-center py-4">
                  <div className="text-2xl mb-2">{TG_EMOJI.trophy}</div>
                  <div className="text-sm font-medium mb-1" style={{ color: 'var(--tg-button)' }}>
                    درس تمام شد!
                  </div>
                  <div className="text-xs" style={{ color: 'var(--tg-hint)' }}>{result}</div>
                </div>
              )}
            </div>

            <button onClick={() => { setActiveClass(null); setLessonDone(false); }}
              className="w-full py-3 rounded-xl text-xs"
              style={{ background: 'var(--tg-bg-secondary)', color: 'var(--tg-hint)' }}>
              بازگشت به لیست کلاس‌ها
            </button>
          </div>
        ) : (
          /* Class list */
          <div className="space-y-2">
            {Object.values(MAGIC_CLASSES).map((cls) => {
              const times = profile.completedClasses?.[cls.id] || 0;
              return (
                <button key={cls.id}
                  onClick={() => handleStartLesson(cls.id)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl text-right"
                  style={{ background: 'var(--tg-bg-secondary)' }}>
                  <span className="text-2xl shrink-0">{cls.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate"
                      style={{ color: 'var(--tg-text)' }}>{cls.name}</div>
                    <div className="text-[11px]" style={{ color: 'var(--tg-hint)' }}>
                      +{cls.xpPerLesson} XP • {times > 0 ? `${times} بار تکمیل شده` : 'جدید'}
                    </div>
                  </div>
                  <span className="text-xs shrink-0" style={{ color: 'var(--tg-hint)' }}>←</span>
                </button>
              );
            })}
          </div>
        )}
      </main>
      <NavBar />
    </div>
  );
}
