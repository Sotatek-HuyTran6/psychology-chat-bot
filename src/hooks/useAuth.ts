import { useEffect, useState } from 'react';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../stores/authStore';
import type { SignInRequest, SignUpRequest, User } from '../types/auth.types';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (data: SignInRequest) => Promise<void>;
  signUp: (data: SignUpRequest) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  error: string | null;
}

export const useAuth = (): UseAuthReturn => {
  const { user, setUser, logout, setToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authApi.isAuthenticated()) {
          if (user) {
            setIsLoading(false);
            return;
          }

          const currentUser = await authApi.getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (data: SignInRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.signIn(data);
      setUser(response.user);
      setToken({ accessToken: response.access_token, refreshToken: response.refresh_token });
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        'Đăng nhập thất bại';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: SignUpRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      await authApi.signUp(data);
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        'Đăng ký thất bại';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await authApi.signOut();
      logout();
    } catch (err: unknown) {
      console.error('Sign out error:', err);
      // Vẫn clear user state dù có lỗi
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    refreshUser,
    error,
  };
};
