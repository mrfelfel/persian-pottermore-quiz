import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ادارات وزارت سحر و جادو',
  description: 'ادارات و بخش‌های مختلف وزارت سحر و جادوی ایران.',
};

export default function DepartmentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
