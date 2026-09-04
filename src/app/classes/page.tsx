'use client';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { useTWA } from '@/components/TWAInit';
import { hapticFeedback, TG_EMOJI } from '@/lib/twa';
import { MAGIC_CLASSES, ClassId } from '@/lib/ministry/types';
import { getProfile, completeClass, addCurrency } from '@/lib/ministry/store';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from 'cn';

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
            <Card className="mb-4 border-0" style={{ background: 'var(--tg-bg-secondary)' }}>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl mb-3">
                  {MAGIC_CLASSES[activeClass].emoji}
                </div>
                <h2 className="text-base font-medium mb-1"
                  style={{ color: 'var(--tg-text)' }}>
                  {MAGIC_CLASSES[activeClass].name}
                </h2>
                <p className="text-[12px] mb-4"
                  style={{ color: 'var(--tg-hint)' }}>
                  {MAGIC_CLASSES[activeClass].description}
                </p>

                {!lessonDone ? (
                  <Button onClick={handleComplete} className="w-full">
                    {TG_EMOJI.sparkle} تکمیل درس
                  </Button>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-2xl mb-2">{TG_EMOJI.trophy}</div>
                    <div className="text-sm font-medium mb-1" style={{ color: 'var(--tg-button)' }}>
                      درس تمام شد!
                    </div>
                    <Badge variant="secondary" className="mt-1">{result}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              variant="ghost"
              className="w-full"
              style={{ color: 'var(--tg-hint)' }}
              onClick={() => { setActiveClass(null); setLessonDone(false); }}
            >
              بازگشت به لیست کلاس‌ها
            </Button>
          </div>
        ) : (
          /* Class list */
          <div className="space-y-2">
            {Object.values(MAGIC_CLASSES).map((cls) => {
              const times = profile.completedClasses?.[cls.id] || 0;
              return (
                <Card
                  key={cls.id}
                  className="border-0 py-3 cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ background: 'var(--tg-bg-secondary)' }}
                  onClick={() => handleStartLesson(cls.id)}
                >
                  <CardContent className="pt-0 px-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl shrink-0">{cls.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate"
                          style={{ color: 'var(--tg-text)' }}>{cls.name}</div>
                        <div className="text-[11px]" style={{ color: 'var(--tg-hint)' }}>
                          +{cls.xpPerLesson} XP • {times > 0 ? `${times} بار تکمیل شده` : 'جدید'}
                        </div>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {times > 0 ? `${times}×` : 'جدید'}
                      </Badge>
                      <span className="text-xs shrink-0" style={{ color: 'var(--tg-hint)' }}>←</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <NavBar />
    </div>
  );
}
