import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../config/axios.config';
import type { Test, CreateTestPayload, UpdateTestPayload } from '../../types';

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
}

// API endpoints
const TESTS_ENDPOINT = '/tests';

// Query keys
export const testsKeys = {
  all: ['tests'] as const,
  lists: () => [...testsKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...testsKeys.lists(), params] as const,
  details: () => [...testsKeys.all, 'detail'] as const,
  detail: (id: number) => [...testsKeys.details(), id] as const,
};

// API functions
const testsApi = {
  // Get all tests with pagination
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<Test>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const url = queryParams.toString() ? `${TESTS_ENDPOINT}?${queryParams}` : TESTS_ENDPOINT;
    const response = await axiosInstance.get<PaginatedResponse<Test>>(url);
    return response.data;
  },

  // Get single test by ID
  getById: async (id: number): Promise<Test> => {
    const response = await axiosInstance.get<Test>(`${TESTS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Create new test
  create: async (payload: CreateTestPayload): Promise<Test> => {
    const response = await axiosInstance.post<Test>(TESTS_ENDPOINT, payload);
    return response.data;
  },

  // Update test
  update: async ({ id, payload }: { id: number; payload: UpdateTestPayload }): Promise<Test> => {
    const response = await axiosInstance.put<Test>(`${TESTS_ENDPOINT}/${id}`, payload);
    return response.data;
  },

  // Delete test
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${TESTS_ENDPOINT}/${id}`);
  },
};

// React Query hooks

/**
 * Hook to fetch all tests with pagination
 */
export const useGetTests = (params?: PaginationParams) => {
  return useQuery({
    queryKey: testsKeys.list(params),
    queryFn: () => testsApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single test by ID
 */
export const useGetTest = (id: number, enabled = true) => {
  return useQuery({
    queryKey: testsKeys.detail(id),
    queryFn: () => testsApi.getById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to create a new test
 */
export const useCreateTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: testsApi.create,
    onSuccess: (newTest) => {
      // Invalidate all paginated lists
      queryClient.invalidateQueries({ queryKey: testsKeys.lists() });

      // Optionally set the new test in cache
      queryClient.setQueryData(testsKeys.detail(newTest.id), newTest);
    },
    onError: (error) => {
      console.error('Error creating test:', error);
    },
  });
};

/**
 * Hook to update an existing test
 */
export const useUpdateTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: testsApi.update,
    onSuccess: (updatedTest) => {
      // Update the specific test in cache
      queryClient.setQueryData(testsKeys.detail(updatedTest.id), updatedTest);

      // Invalidate all paginated lists to refetch
      queryClient.invalidateQueries({ queryKey: testsKeys.lists() });
    },
    onError: (error) => {
      console.error('Error updating test:', error);
    },
  });
};

/**
 * Hook to delete a test
 */
export const useDeleteTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: testsApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove the test from cache
      queryClient.removeQueries({ queryKey: testsKeys.detail(deletedId) });

      // Invalidate all paginated lists to refetch
      queryClient.invalidateQueries({ queryKey: testsKeys.lists() });
    },
    onError: (error) => {
      console.error('Error deleting test:', error);
    },
  });
};

// Optional: Optimistic update hooks for better UX

/**
 * Hook to create a test with optimistic update
 */
export const useCreateTestOptimistic = (params?: PaginationParams) => {
  const queryClient = useQueryClient();
  const queryKey = testsKeys.list(params);

  return useMutation({
    mutationFn: testsApi.create,
    onMutate: async (newTest) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: testsKeys.lists() });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<PaginatedResponse<Test>>(queryKey);

      // Optimistically update
      if (previousData) {
        const optimisticTest: Test = {
          id: Date.now(), // Temporary ID
          ...newTest,
          userId: 0, // Will be set by server
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const updatedData: PaginatedResponse<Test> = {
          ...previousData,
          data: [...previousData.data, optimisticTest],
          pagination: {
            ...previousData.pagination,
            total: previousData.pagination.total + 1,
          },
        };

        queryClient.setQueryData<PaginatedResponse<Test>>(queryKey, updatedData);
      }

      return { previousData };
    },
    onError: (error, _newTest, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      console.error('Error creating test:', error);
    },
    onSettled: () => {
      // Refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: testsKeys.lists() });
    },
  });
};

/**
 * Hook to update a test with optimistic update
 */
export const useUpdateTestOptimistic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: testsApi.update,
    onMutate: async ({ id, payload }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: testsKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: testsKeys.lists() });

      // Snapshot previous values
      const previousTest = queryClient.getQueryData<Test>(testsKeys.detail(id));
      
      // Get all pagination caches to update
      const cache = queryClient.getQueryCache();
      const previousCaches = new Map();
      
      cache.findAll({ queryKey: testsKeys.lists() }).forEach((query) => {
        const data = query.state.data as PaginatedResponse<Test> | undefined;
        if (data) {
          previousCaches.set(JSON.stringify(query.queryKey), { queryKey: query.queryKey, data });
        }
      });

      // Optimistically update
      if (previousTest) {
        const updatedTest: Test = {
          ...previousTest,
          ...payload,
          updatedAt: new Date().toISOString(),
        };

        queryClient.setQueryData(testsKeys.detail(id), updatedTest);

        // Update all paginated caches
        cache.findAll({ queryKey: testsKeys.lists() }).forEach((query) => {
          const data = query.state.data as PaginatedResponse<Test> | undefined;
          if (data) {
            const updatedData: PaginatedResponse<Test> = {
              ...data,
              data: data.data.map((test) => (test.id === id ? updatedTest : test)),
            };
            queryClient.setQueryData(query.queryKey, updatedData);
          }
        });
      }

      return { previousTest, previousCaches };
    },
    onError: (error, { id }, context) => {
      // Rollback on error
      if (context?.previousTest) {
        queryClient.setQueryData(testsKeys.detail(id), context.previousTest);
      }
      if (context?.previousCaches) {
        context.previousCaches.forEach((cacheInfo) => {
          queryClient.setQueryData(cacheInfo.queryKey, cacheInfo.data);
        });
      }
      console.error('Error updating test:', error);
    },
    onSettled: (_, __, { id }) => {
      // Refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: testsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: testsKeys.lists() });
    },
  });
};

/**
 * Hook to delete a test with optimistic update
 */
export const useDeleteTestOptimistic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: testsApi.delete,
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: testsKeys.lists() });

      // Get all pagination caches to update
      const cache = queryClient.getQueryCache();
      const previousCaches = new Map();
      
      cache.findAll({ queryKey: testsKeys.lists() }).forEach((query) => {
        const data = query.state.data as PaginatedResponse<Test> | undefined;
        if (data) {
          previousCaches.set(JSON.stringify(query.queryKey), { queryKey: query.queryKey, data });
        }
      });

      // Optimistically update all caches
      cache.findAll({ queryKey: testsKeys.lists() }).forEach((query) => {
        const data = query.state.data as PaginatedResponse<Test> | undefined;
        if (data) {
          const updatedData: PaginatedResponse<Test> = {
            ...data,
            data: data.data.filter((test) => test.id !== id),
            pagination: {
              ...data.pagination,
              total: data.pagination.total - 1,
            },
          };
          queryClient.setQueryData(query.queryKey, updatedData);
        }
      });

      return { previousCaches };
    },
    onError: (error, _id, context) => {
      // Rollback on error
      if (context?.previousCaches) {
        context.previousCaches.forEach((cacheInfo) => {
          queryClient.setQueryData(cacheInfo.queryKey, cacheInfo.data);
        });
      }
      console.error('Error deleting test:', error);
    },
    onSettled: () => {
      // Refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: testsKeys.lists() });
    },
  });
};
