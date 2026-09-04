import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'آرشیو تاریخی جامعه جادویی فارسی',
  description: 'مجموعه کامل نوشته‌ها، شخصیت‌ها و رویدادهای تاریخچه جامعه جادوگری فارسی.',
};

export default function ArchiveLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
