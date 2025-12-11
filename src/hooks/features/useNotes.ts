import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../config/axios.config';
import type { Note, CreateNotePayload, UpdateNotePayload } from '../../types';

// API endpoints
const NOTES_ENDPOINT = '/notes';

// Query keys
export const notesKeys = {
  all: ['notes'] as const,
  lists: () => [...notesKeys.all, 'list'] as const,
  list: (filters?: object) => [...notesKeys.lists(), filters] as const,
  details: () => [...notesKeys.all, 'detail'] as const,
  detail: (id: number) => [...notesKeys.details(), id] as const,
};

// API functions
const notesApi = {
  // Get all notes
  getAll: async (): Promise<Note[]> => {
    const response = await axiosInstance.get<Note[]>(NOTES_ENDPOINT);
    return response.data;
  },

  // Get single note by ID
  getById: async (id: number): Promise<Note> => {
    const response = await axiosInstance.get<Note>(`${NOTES_ENDPOINT}/${id}`);
    return response.data;
  },

  // Create new note
  create: async (payload: CreateNotePayload): Promise<Note> => {
    const response = await axiosInstance.post<Note>(NOTES_ENDPOINT, payload);
    return response.data;
  },

  // Update note
  update: async ({ id, payload }: { id: number; payload: UpdateNotePayload }): Promise<Note> => {
    const response = await axiosInstance.put<Note>(`${NOTES_ENDPOINT}/${id}`, payload);
    return response.data;
  },

  // Delete note
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${NOTES_ENDPOINT}/${id}`);
  },

  // Generate daily schedule using AI
  generateDailySchedule: async (): Promise<Note[]> => {
    const response = await axiosInstance.post<Note[]>(`${NOTES_ENDPOINT}/generate-daily-schedule`);
    return response.data;
  },
};

// React Query hooks

/**
 * Hook to fetch all notes
 */
export const useGetNotes = () => {
  return useQuery({
    queryKey: notesKeys.lists(),
    queryFn: notesApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single note by ID
 */
export const useGetNote = (id: number, enabled = true) => {
  return useQuery({
    queryKey: notesKeys.detail(id),
    queryFn: () => notesApi.getById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to create a new note
 */
export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notesApi.create,
    onSuccess: (newNote) => {
      // Invalidate and refetch notes list
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });

      // Optionally set the new note in cache
      queryClient.setQueryData(notesKeys.detail(newNote.id), newNote);
    },
    onError: (error) => {
      console.error('Error creating note:', error);
    },
  });
};

/**
 * Hook to update an existing note
 */
export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notesApi.update,
    onSuccess: (updatedNote) => {
      // Update the specific note in cache
      queryClient.setQueryData(notesKeys.detail(updatedNote.id), updatedNote);

      // Invalidate notes list to refetch
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
    },
    onError: (error) => {
      console.error('Error updating note:', error);
    },
  });
};

/**
 * Hook to delete a note
 */
export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notesApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove the note from cache
      queryClient.removeQueries({ queryKey: notesKeys.detail(deletedId) });

      // Invalidate notes list to refetch
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
    },
    onError: (error) => {
      console.error('Error deleting note:', error);
    },
  });
};

// Optional: Optimistic update hooks for better UX

/**
 * Hook to create a note with optimistic update
 */
export const useCreateNoteOptimistic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notesApi.create,
    onMutate: async (newNote) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: notesKeys.lists() });

      // Snapshot previous value
      const previousNotes = queryClient.getQueryData<Note[]>(notesKeys.lists());

      // Optimistically update
      if (previousNotes) {
        const optimisticNote: Note = {
          id: Date.now(), // Temporary ID
          ...newNote,
          userId: 0, // Will be set by server
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isAiGenerated: false,
        };

        queryClient.setQueryData<Note[]>(notesKeys.lists(), [...previousNotes, optimisticNote]);
      }

      return { previousNotes };
    },
    onError: (error, _newNote, context) => {
      // Rollback on error
      if (context?.previousNotes) {
        queryClient.setQueryData(notesKeys.lists(), context.previousNotes);
      }
      console.error('Error creating note:', error);
    },
    onSettled: () => {
      // Refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
    },
  });
};

/**
 * Hook to update a note with optimistic update
 */
export const useUpdateNoteOptimistic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notesApi.update,
    onMutate: async ({ id, payload }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: notesKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: notesKeys.lists() });

      // Snapshot previous values
      const previousNote = queryClient.getQueryData<Note>(notesKeys.detail(id));
      const previousNotes = queryClient.getQueryData<Note[]>(notesKeys.lists());

      // Optimistically update
      if (previousNote) {
        const updatedNote: Note = {
          ...previousNote,
          ...payload,
          updatedAt: new Date().toISOString(),
        };

        queryClient.setQueryData(notesKeys.detail(id), updatedNote);

        if (previousNotes) {
          queryClient.setQueryData<Note[]>(
            notesKeys.lists(),
            previousNotes.map((note) => (note.id === id ? updatedNote : note)),
          );
        }
      }

      return { previousNote, previousNotes };
    },
    onError: (error, { id }, context) => {
      // Rollback on error
      if (context?.previousNote) {
        queryClient.setQueryData(notesKeys.detail(id), context.previousNote);
      }
      if (context?.previousNotes) {
        queryClient.setQueryData(notesKeys.lists(), context.previousNotes);
      }
      console.error('Error updating note:', error);
    },
    onSettled: (_, __, { id }) => {
      // Refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: notesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
    },
  });
};

/**
 * Hook to delete a note with optimistic update
 */
export const useDeleteNoteOptimistic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notesApi.delete,
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: notesKeys.lists() });

      // Snapshot previous value
      const previousNotes = queryClient.getQueryData<Note[]>(notesKeys.lists());

      // Optimistically update
      if (previousNotes) {
        queryClient.setQueryData<Note[]>(
          notesKeys.lists(),
          previousNotes.filter((note) => note.id !== id),
        );
      }

      return { previousNotes };
    },
    onError: (error, _id, context) => {
      // Rollback on error
      if (context?.previousNotes) {
        queryClient.setQueryData(notesKeys.lists(), context.previousNotes);
      }
      console.error('Error deleting note:', error);
    },
    onSettled: () => {
      // Refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
    },
  });
};

/**
 * Hook to generate daily schedule using AI
 */
export const useGenerateDailySchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notesApi.generateDailySchedule,
    onSuccess: (newNotes) => {
      // Invalidate and refetch notes list to include new AI-generated notes
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });

      // Optionally cache individual notes
      newNotes.forEach((note) => {
        queryClient.setQueryData(notesKeys.detail(note.id), note);
      });
    },
    onError: (error) => {
      console.error('Error generating daily schedule:', error);
    },
  });
};
