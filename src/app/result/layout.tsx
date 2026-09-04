import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'نتیجه کوییز — گروه هاگوارتز',
  description: 'نتیجه کوییز گروه‌بندی هاگوارتز خود را مشاهده کن.',
};

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
