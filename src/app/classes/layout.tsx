import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'کلاس‌های جادویی — وزارت سحر و جادو',
  description: 'کلاس‌ها و دروس جادویی موجود در جامعه جادوگری فارسی.',
};

export default function ClassesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
