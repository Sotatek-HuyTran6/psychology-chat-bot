import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import axiosInstance from '../../config/axios.config';
import { useAuthStore } from '../../stores/authStore';
import type { ApiResponse, User } from '../../types/auth.types';

// API endpoints
const USER_ENDPOINT = '/users';

// Query keys
export const userKeys = {
  all: ['user'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  me: () => [...userKeys.all, 'me'] as const,
};

// Update user payload type
export interface UpdateUserPayload {
  name?: string;
  avatar?: string;
  phoneNumber?: string;
}

// API functions
const userApi = {
  // Get current user profile
  getMe: async (): Promise<User | undefined> => {
    const response = await axiosInstance.get<ApiResponse<User>>(`/auth/profile`);
    return response.data.data;
  },

  // Get user by ID
  getById: async (id: string): Promise<User> => {
    const response = await axiosInstance.get<User>(`${USER_ENDPOINT}/${id}`);
    return response.data;
  },

  // Update current user profile
  updateMe: async (payload: UpdateUserPayload): Promise<User> => {
    const response = await axiosInstance.put<User>(`${USER_ENDPOINT}/me`, payload);
    return response.data;
  },

  // Update user by ID
  updateById: async ({
    id,
    payload,
  }: {
    id: string;
    payload: UpdateUserPayload;
  }): Promise<User> => {
    const response = await axiosInstance.put<User>(`${USER_ENDPOINT}/${id}`, payload);
    return response.data;
  },
};

// React Query hooks

/**
 * Hook to fetch current user profile
 */
export const useGetMe = (enabled = true) => {
  const setUser = useAuthStore((state) => state.setUser);

  const query = useQuery({
    queryKey: userKeys.me(),
    queryFn: userApi.getMe,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  // Sync user data với auth store khi fetch thành công
  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  return query;
};

/**
 * Hook to fetch a user by ID
 */
export const useGetUser = (id: string, enabled = true) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to update current user profile
 */
export const useUpdateMe = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: userApi.updateMe,
    onSuccess: (updatedUser) => {
      // Update the current user in cache
      queryClient.setQueryData(userKeys.me(), updatedUser);

      // Sync user data với auth store
      setUser(updatedUser);

      // Invalidate to refetch and ensure consistency
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
    onError: (error) => {
      console.error('Error updating user profile:', error);
    },
  });
};

/**
 * Hook to update user by ID
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.updateById,
    onSuccess: (updatedUser) => {
      // Update the specific user in cache
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);

      // Invalidate to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.detail(updatedUser.id) });
    },
    onError: (error) => {
      console.error('Error updating user:', error);
    },
  });
};

/**
 * Hook to update current user profile with optimistic update
 */
export const useUpdateMeOptimistic = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: userApi.updateMe,
    onMutate: async (payload) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: userKeys.me() });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData<User>(userKeys.me());

      // Optimistically update
      if (previousUser) {
        const updatedUser: User = {
          ...previousUser,
          ...payload,
          updatedAt: new Date().toISOString(),
        };

        queryClient.setQueryData(userKeys.me(), updatedUser);
        // Sync với auth store
        setUser(updatedUser);
      }

      return { previousUser };
    },
    onError: (error, _payload, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(userKeys.me(), context.previousUser);
        // Rollback auth store
        setUser(context.previousUser);
      }
      console.error('Error updating user profile:', error);
    },
    onSettled: () => {
      // Refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
};
