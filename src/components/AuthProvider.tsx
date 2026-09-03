'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  login: (credential: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('hp_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem('hp_user');
      }
    }
  }, []);

  const login = (credential: string) => {
    try {
      const payload = JSON.parse(atob(credential.split('.')[1]));
      const u: User = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      };
      setUser(u);
      localStorage.setItem('hp_user', JSON.stringify(u));
    } catch (e) {
      console.error('Auth failed:', e);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hp_user');
    localStorage.removeItem('hp_quiz_state');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
