import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'کوییز گروه‌بندی هاگوارتز',
  description: 'با شرکت در کوییز جذاب گروه‌بندی هاگوارتز، گروه خود را پیدا کن!',
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
