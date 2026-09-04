import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'بانک گرینگوتس — وزارت سحر و جادو',
  description: 'سیستم اقتصادی جامعه جادوگری فارسی.',
};

export default function BankLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
