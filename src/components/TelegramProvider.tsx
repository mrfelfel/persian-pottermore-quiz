'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TWAUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface TWAContextType {
  user: TWAUser | null;
  isInTelegram: boolean;
  logout: () => void;
}

const TWAContext = createContext<TWAContextType>({
  user: null,
  isInTelegram: false,
  logout: () => {},
});

export function useTWA() {
  return useContext(TWAContext);
}

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TWAUser | null>(null);
  const [isInTelegram, setIsInTelegram] = useState(false);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      setIsInTelegram(true);
      tg.ready();
      tg.expand();

      const u = tg.initDataUnsafe?.user;
      if (u) {
        setUser({
          id: u.id,
          first_name: u.first_name,
          last_name: u.last_name,
          username: u.username,
          photo_url: u.photo_url,
        });
      }
    } else {
      // Not in Telegram — use localStorage fallback
      const saved = localStorage.getItem('hp_tg_user');
      if (saved) {
        try { setUser(JSON.parse(saved)); } catch {}
      }
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hp_tg_user');
    localStorage.removeItem('hp_results');
  };

  return (
    <TWAContext.Provider value={{ user, isInTelegram, logout }}>
      {children}
    </TWAContext.Provider>
  );
}
