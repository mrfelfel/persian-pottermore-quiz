'use client';

import { cn } from 'cn';
import { Button } from '@/components/ui/button';
import type { ComponentProps } from 'react';

export function MagicalButton({
  className,
  children,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn(
        'relative overflow-hidden font-semibold tracking-wide',
        'bg-gradient-to-r from-[#c9a84c] to-[#a8893a]',
        'text-[#0a0a0f]',
        'hover:from-[#d4b45c] hover:to-[#b8994a]',
        'shadow-[0_2px_15px_rgba(201,168,76,0.3)]',
        'hover:shadow-[0_4px_25px_rgba(201,168,76,0.4)]',
        'transition-all duration-300',
        'active:scale-[0.98]',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
