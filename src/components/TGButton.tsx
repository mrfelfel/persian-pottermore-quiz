'use client';

import { ReactNode, MouseEventHandler } from 'react';

interface Props {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: 'primary' | 'secondary' | 'destructive';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function TGButton({
  children,
  onClick,
  variant = 'primary',
  fullWidth = true,
  disabled = false,
  className = '',
}: Props) {
  const base =
    'ripple inline-flex items-center justify-center gap-2 rounded-[12px] px-4 py-[14px] text-[15px] font-semibold transition-all active:scale-[0.97] select-none';

  const variants = {
    primary: 'bg-[var(--tg-button)] text-[var(--tg-button-text)]',
    secondary: 'bg-[var(--tg-bg-secondary)] text-[var(--tg-text)]',
    destructive: 'bg-[var(--tg-destructive)] text-white',
  };

  const width = fullWidth ? 'w-full' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${width} ${disabled ? 'opacity-40 pointer-events-none' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
