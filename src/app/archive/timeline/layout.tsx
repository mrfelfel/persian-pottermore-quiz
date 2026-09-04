import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'خط زمانی ۱۳۹۰–۱۴۰۵ — جامعه جادوگری فارسی',
  description: 'رویدادهای مهم جامعه جادوگری فارسی از سال ۱۳۹۰ تا ۱۴۰۵ شمسی.',
};

export default function TimelineLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
