'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TWAUser, getTWA, getTWAUser, getTheme, TWATheme } from '@/lib/twa';

interface TWAContextType {
  user: TWAUser | null;
  theme: TWATheme;
  isInTelegram: boolean;
  logout: () => void;
}

const TWAContext = createContext<TWAContextType>({
  user: null,
  theme: {
    bgColor: '#17212b', textColor: '#f5f5f5', hintColor: '#6d7f8f',
    buttonColor: '#5288c1', buttonTextColor: '#ffffff',
    secondaryBgColor: '#1e2c3a', linkColor: '#6ab2f2',
    destructiveTextColor: '#e53935', colorScheme: 'dark',
  },
  isInTelegram: false,
  logout: () => {},
});

export function useTWA() {
  return useContext(TWAContext);
}

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TWAUser | null>(null);
  const [theme, setTheme] = useState<TWATheme>(getTheme());
  const [isInTelegram, setIsInTelegram] = useState(false);

  useEffect(() => {
    const tg = getTWA();
    if (tg) {
      setIsInTelegram(true);
      tg.ready();
      tg.expand();

      // Apply theme from Telegram
      const t = getTheme();
      setTheme(t);
      document.documentElement.style.setProperty('--tg-bg', t.bgColor);
      document.documentElement.style.setProperty('--tg-text', t.textColor);
      document.documentElement.style.setProperty('--tg-hint', t.hintColor);
      document.documentElement.style.setProperty('--tg-button', t.buttonColor);
      document.documentElement.style.setProperty('--tg-button-text', t.buttonTextColor);
      document.documentElement.style.setProperty('--tg-bg-secondary', t.secondaryBgColor);

      // Get user
      const u = getTWAUser();
      if (u) setUser(u);
    } else {
      // Outside Telegram — check localStorage
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
    <TWAContext.Provider value={{ user, theme, isInTelegram, logout }}>
      {children}
    </TWAContext.Provider>
  );
}
