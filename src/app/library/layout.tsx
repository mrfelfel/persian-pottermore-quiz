import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'کتابخانه — تاریخ جامعه جادویی فارسی',
  description: 'مرور جلدها، شخصیت‌ها و رویدادهای تاریخچه جامعه جادوگری فارسی.',
};

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
