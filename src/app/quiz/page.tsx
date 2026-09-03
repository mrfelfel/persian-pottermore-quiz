'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTWA } from '@/components/TelegramProvider';
import { QuizQuestion, generateQuiz, calculateResult } from '@/lib/quiz';

export default function QuizPage() {
  const { user } = useTWA();
  const router = useRouter();

  const [allQuestions, setAllQuestions] = useState<QuizQuestion[][]>([]);
  const [selected, setSelected] = useState<Omit<QuizQuestion, 'percentage'>[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [pic, setPic] = useState<string>('');

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
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

  const handleAnswer = useCallback(() => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (current + 1 >= selected.length) {
      // Quiz finished — calculate result
      const results = calculateResult(allQuestions, selected, newAnswers);
      localStorage.setItem('hp_results', JSON.stringify(results));
      router.push('/result');
    } else {
      // Next question
      setSelectedAnswer(null);
      setCurrent((c) => c + 1);
      if (selected[current + 1]?.pics) {
        setPic(`/pics/${selected[current + 1].pics}`);
      }
    }
  }, [selectedAnswer, answers, current, selected, allQuestions, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-amber-400 animate-pulse">⚡ در حال بارگذاری...</div>
      </div>
    );
  }

  const question = selected[current];
  const progress = ((current) / selected.length) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/30 backdrop-blur-sm">
        <span className="text-sm text-gray-400">
          سوال {current + 1} از {selected.length}
        </span>
        <span className="text-sm text-amber-400 font-bold">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-800">
        <div
          className="h-full bg-gradient-to-l from-amber-500 to-red-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Background image */}
        {pic && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15 -z-10"
            style={{ backgroundImage: `url(${pic})` }}
          />
        )}

        {/* Question text */}
        <div className="bg-black/50 backdrop-blur-md rounded-2xl p-6 max-w-lg w-full mb-8 border border-white/10">
          <p className="text-lg md:text-xl leading-relaxed text-center text-white/90">
            {question.question}
          </p>
        </div>

        {/* Answers */}
        <div className="max-w-lg w-full space-y-3">
          {question.answers.map((answer, i) => (
            <button
              key={i}
              onClick={() => setSelectedAnswer(i)}
              className={`w-full text-right px-5 py-4 rounded-xl border-2 transition-all duration-200 ${
                selectedAnswer === i
                  ? 'border-amber-500 bg-amber-500/20 text-white'
                  : 'border-white/10 bg-white/5 text-white/80 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              <span className="text-sm md:text-base leading-relaxed">{answer}</span>
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={handleAnswer}
          disabled={selectedAnswer === null}
          className={`mt-8 px-10 py-3 rounded-full text-lg font-bold transition-all ${
            selectedAnswer !== null
              ? 'bg-gradient-to-l from-amber-600 to-red-700 hover:from-amber-500 hover:to-red-600 hover:scale-105 shadow-lg shadow-amber-900/30'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          {current + 1 >= selected.length ? 'مشاهده نتیجه ✨' : 'سوال بعدی →'}
        </button>
      </div>
    </div>
  );
}
