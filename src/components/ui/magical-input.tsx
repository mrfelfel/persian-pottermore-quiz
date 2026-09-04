'use client';

import { cn } from 'cn';
import { Input } from '@/components/ui/input';
import type { ComponentProps } from 'react';

export function MagicalInput({
  className,
  ...props
}: ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn(
        'bg-[#14121e]',
        'border-[rgba(201,168,76,0.15)]',
        'text-[#e8dcc8]',
        'placeholder:text-[#6b6252]',
        'focus:border-[rgba(201,168,76,0.4)]',
        'focus:ring-[rgba(201,168,76,0.2)]',
        'transition-all duration-300',
        className
      )}
      {...props}
    />
  );
}
