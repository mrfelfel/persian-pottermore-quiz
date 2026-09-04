import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'رتبه‌بندی — وزارت سحر و جادو',
  description: 'جدول رتبه‌بندی جادوگران بر اساس امتیاز و تجربه.',
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
