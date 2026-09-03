'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from './AuthProvider';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (element: HTMLElement, config: {
            theme?: string;
            size?: string;
            width?: number;
            text?: string;
            shape?: string;
          }) => void;
        };
      };
    };
  }
}

export default function GoogleLogin() {
  const { login, user, logout } = useAuth();
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user || !window.google) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => login(response.credential),
    });

    if (buttonRef.current) {
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'filled_black',
        size: 'large',
        width: 300,
        text: 'signin_with',
        shape: 'pill',
      });
    }
  }, [user, login]);

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <img
          src={user.picture}
          alt={user.name}
          className="w-10 h-10 rounded-full border-2 border-amber-500"
        />
        <span className="text-white text-sm">{user.name}</span>
        <button
          onClick={logout}
          className="text-xs text-amber-400/70 hover:text-amber-400 transition-colors mr-2"
        >
          خروج
        </button>
      </div>
    );
  }

  return <div ref={buttonRef} />;
}
