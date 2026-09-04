import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-6"
      style={{ background: 'var(--tg-bg)' }}>
      <Card className="w-full max-w-sm border-0 text-center" style={{ background: 'var(--tg-bg-secondary)' }}>
        <CardContent className="pt-8 pb-6">
          <div className="mb-4">
            <span className="text-6xl">🔮</span>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--tg-text)' }}>
            صفحه یافت نشد
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--tg-hint)' }}>
            به نظر میاد این صفحه با طلسم ناپدید شده! اما نگران نباش، راه‌های دیگه‌ای هم هست.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/" className={buttonVariants({ variant: 'default', size: 'lg' })}>
              بازگشت به خانه
            </Link>
            <Link
              href="/library"
              className={buttonVariants({ variant: 'secondary', size: 'lg' })}
            >
              کتابخانه
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
