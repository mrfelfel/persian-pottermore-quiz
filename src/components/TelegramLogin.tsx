'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TelegramLoginWidget?: {
      TelegramAuth: (user: TelegramUser) => void;
    };
  }
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface Props {
  onAuth: (user: TelegramUser) => void;
}

export default function TelegramLogin({ onAuth }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Set global callback
    window.TelegramLoginWidget = {
      TelegramAuth: (user: TelegramUser) => {
        onAuth(user);
      },
    };

    // Create script
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', 'HogwartsQuizBot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'TelegramLoginWidget.TelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    script.async = true;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [onAuth]);

  return <div ref={containerRef} className="flex justify-center" />;
}
