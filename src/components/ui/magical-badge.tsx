'use client';

import { cn } from 'cn';
import { Badge } from '@/components/ui/badge';
import type { ComponentProps } from 'react';

export function MagicalBadge({
  className,
  children,
  ...props
}: ComponentProps<typeof Badge>) {
  return (
    <Badge
      className={cn(
        'bg-[rgba(201,168,76,0.1)]',
        'text-[#c9a84c]',
        'border border-[rgba(201,168,76,0.2)]',
        'font-medium',
        className
      )}
      {...props}
    >
      {children}
    </Badge>
  );
}
