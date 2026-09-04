import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'شخصیت‌ها — جامعه جادوگری فارسی',
  description: 'فهرست تمام شخصیت‌های ثبت‌شده در تاریخ جامعه جادوگری فارسی.',
};

export default function CharactersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
