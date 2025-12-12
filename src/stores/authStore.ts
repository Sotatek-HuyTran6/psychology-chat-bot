import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/auth.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken?: string | null;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  logout: () => void;
  setToken: (tokens: { accessToken: string; refreshToken: string }) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      setUser: (user) =>
        set(() => ({
          user,
        })),

      setAccessToken: (token) =>
        set(() => ({
          accessToken: token,
        })),

      setRefreshToken: (token) =>
        set(() => ({
          refreshToken: token,
        })),

      setToken: (value: { accessToken: string; refreshToken: string }) =>
        set(() => ({
          refreshToken: value.refreshToken,
          accessToken: value.accessToken,
        })),

      logout: () =>
        set(() => {
          localStorage.removeItem('user');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('auth-storage');
          localStorage.removeItem('chatbot_conversations');
          localStorage.removeItem('mental-health-storage');
          return {
            user: null,
            accessToken: null,
          };
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
