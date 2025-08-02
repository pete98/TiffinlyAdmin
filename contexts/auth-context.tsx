"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface User {
  sub: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (returnTo?: string) => void;
  logout: (returnTo?: string) => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      if (response.status === 200) {
        const user = response.data;
        setAuthState({ user, isLoading: false, error: null });
      } else {
        setAuthState({ user: null, isLoading: false, error: null });
      }
    } catch (error) {
      setAuthState({ user: null, isLoading: false, error: 'Authentication failed' });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (returnTo?: string) => {
    const loginUrl = returnTo ? `/api/auth/login?returnTo=${encodeURIComponent(returnTo)}` : '/api/auth/login';
    router.push(loginUrl);
  };

  const logout = (returnTo?: string) => {
    const logoutUrl = returnTo ? `/api/auth/logout?returnTo=${encodeURIComponent(returnTo)}` : '/api/auth/logout';
    router.push(logoutUrl);
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      checkAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 