import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'آرشیو تاریخی — وبلاگ جامعه جادوگری فارسی',
  description: 'مطالب و نوشته‌های تاریخی جامعه جادوگری فارسی.',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
