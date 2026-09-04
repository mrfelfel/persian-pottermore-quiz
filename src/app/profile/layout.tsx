import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'شناسنامه — وزارت سحر و جادو',
  description: 'شناسنامه جادویی خود را مشاهده و مدیریت کن.',
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
