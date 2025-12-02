import { useState, useEffect } from 'react';
import { authApi } from '../api/auth.api';
import type { User, SignInRequest, SignUpRequest } from '../types/auth.types';
import { useAuthContext } from '../contexts/AuthContext';

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
  const { user, setUser, setAccessToken, logout } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Kiểm tra authentication khi component mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authApi.isAuthenticated()) {
          // Nếu đã có user trong context, không cần fetch lại
          if (user) {
            setIsLoading(false);
            return;
          }

          // Fetch user mới từ API
          const currentUser = await authApi.getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
        // Nếu fetch fail, clear auth state
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
      setAccessToken(response.access_token);
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
      const response = await authApi.signUp(data);
      console.log('Sign up response:', response);
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
