'use client';

import { cn } from 'cn';
import { Card } from '@/components/ui/card';

export function MagicalCard({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn(
        'bg-magical-card border-ornate rounded-xl',
        'transition-all duration-300',
        'hover:border-[rgba(201,168,76,0.3)]',
        'hover:glow-gold',
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}
