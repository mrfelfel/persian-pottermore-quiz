'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTWA } from '@/components/TelegramProvider';
import {
  hapticFeedback,
  showMainButton,
  hideMainButton,
  showBackButton,
  hideBackButton,
  TG_EMOJI,
} from '@/lib/twa';
import { QuizQuestion, generateQuiz, calculateResult } from '@/lib/quiz';
import TGButton from '@/components/TGButton';

export default function QuizPage() {
  const { user, isInTelegram } = useTWA();
  const router = useRouter();

  const [allQuestions, setAllQuestions] = useState<QuizQuestion[][]>([]);
  const [selected, setSelected] = useState<Omit<QuizQuestion, 'percentage'>[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [pic, setPic] = useState<string>('');
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/'); return; }
    fetch('/quiz.json')
      .then((r) => r.json())
      .then((data: QuizQuestion[][]) => {
        setAllQuestions(data);
        const q = generateQuiz(data, 8);
        setSelected(q);
        if (q[0]?.pics) setPic(`/pics/${q[0].pics}`);
        setLoading(false);
      });
  }, [user, router]);

  useEffect(() => {
    if (isInTelegram && !loading) {
      showBackButton(() => router.push('/'));
      return () => hideBackButton();
    }
  }, [isInTelegram, loading, router]);

  useEffect(() => {
    if (isInTelegram && !loading) {
      const isLast = current + 1 >= selected.length;
      const label = isLast
        ? `${TG_EMOJI.trophy} مشاهده نتیجه`
        : `${TG_EMOJI.sparkle} سوال بعدی`;
      if (selectedAnswer !== null) {
        showMainButton(label, () => handleAnswer());
      } else {
        hideMainButton();
      }
      return () => hideMainButton();
    }
  }, [isInTelegram, loading, selectedAnswer, current, selected.length]);

  const handleAnswer = useCallback(() => {
    if (selectedAnswer === null || animating) return;
    hapticFeedback('light');
    setAnimating(true);
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (current + 1 >= selected.length) {
        hapticFeedback('success');
        const results = calculateResult(allQuestions, selected, newAnswers);
        localStorage.setItem('hp_results', JSON.stringify(results));
        router.push('/result');
      } else {
        setSelectedAnswer(null);
        setCurrent((c) => c + 1);
        if (selected[current + 1]?.pics) setPic(`/pics/${selected[current + 1].pics}`);
        setAnimating(false);
      }
    }, 200);
  }, [selectedAnswer, answers, current, selected, allQuestions, router, animating]);

  if (loading || !user) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center"
        style={{ background: 'var(--tg-bg)' }}>
        <div className="text-base animate-fade-in" style={{ color: 'var(--tg-hint)' }}>
          {TG_EMOJI.wand} در حال بارگذاری...
        </div>
      </div>
    );
  }

  const question = selected[current];
  const progress = (current / selected.length) * 100;

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: 'var(--tg-bg)' }}>

      {/* Progress bar — sticky top */}
      <header className="sticky top-0 z-10 shrink-0" style={{ background: 'var(--tg-bg)' }}>
        <div className="flex items-center justify-between px-4 sm:px-5 pt-2.5 pb-2">
          <span className="text-xs sm:text-[13px] font-medium" style={{ color: 'var(--tg-hint)' }}>
            {TG_EMOJI.book} سوال {current + 1} از {selected.length}
          </span>
          <span className="text-xs sm:text-[13px] font-bold" style={{ color: 'var(--tg-button)' }}>
            %{Math.round(progress)}
          </span>
        </div>
        <div className="h-[3px] mx-4 sm:mx-5 rounded-full overflow-hidden"
          style={{ background: 'var(--tg-bg-secondary)' }}>
          <div className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%`, background: 'var(--tg-button)' }} />
        </div>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-5 pt-6 pb-6">

          {/* Background image */}
          {pic && (
            <div className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
              style={{ backgroundImage: `url(${pic})` }} />
          )}

          {/* Question card */}
          <div className={`rounded-2xl p-5 sm:p-6 mb-7 relative z-10 ${animating ? '' : 'animate-slide-up'}`}
            style={{ background: 'var(--tg-bg-secondary)' }}>
            <p className="text-sm sm:text-base leading-[1.8] text-center"
              style={{ color: 'var(--tg-text)' }}>
              {question.question}
            </p>
          </div>

          {/* Answer options */}
          <div className="space-y-3 relative z-10">
            {question.answers.map((answer, i) => (
              <button
                key={i}
                onClick={() => { hapticFeedback('light'); setSelectedAnswer(i); }}
                className="w-full text-right rounded-xl px-4 sm:px-5 py-4 text-[13px] sm:text-sm leading-[1.7] transition-all duration-150 active:scale-[0.98]"
                style={{
                  background: selectedAnswer === i ? 'var(--tg-button)' : 'var(--tg-bg-secondary)',
                  color: selectedAnswer === i ? 'var(--tg-button-text)' : 'var(--tg-text)',
                  border: `1.5px solid ${selectedAnswer === i ? 'var(--tg-button)' : 'transparent'}`,
                }}>
                {answer}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom — browser only */}
      {!isInTelegram && (
        <footer className="shrink-0 px-4 sm:px-5 pb-6 pt-3"
          style={{ paddingBottom: 'max(24px, var(--safe-bottom))' }}>
          <TGButton onClick={handleAnswer} disabled={selectedAnswer === null}>
            {current + 1 >= selected.length
              ? `${TG_EMOJI.trophy} مشاهده نتیجه`
              : `${TG_EMOJI.sparkle} سوال بعدی`}
          </TGButton>
        </footer>
      )}
    </div>
  );
}
