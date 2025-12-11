import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MentalHealthEvaluation } from '../types/mentalHealth.types';

interface MentalHealthState {
  evaluation: MentalHealthEvaluation | null;
  lastUpdated: string | null;
  setEvaluation: (evaluation: MentalHealthEvaluation) => void;
  clearEvaluation: () => void;
}

export const useMentalHealthStore = create<MentalHealthState>()(
  persist(
    (set) => ({
      evaluation: null,
      lastUpdated: null,

      setEvaluation: (evaluation) =>
        set(() => ({
          evaluation,
          lastUpdated: new Date().toISOString(),
        })),

      clearEvaluation: () =>
        set(() => ({
          evaluation: null,
          lastUpdated: null,
        })),
    }),
    {
      name: 'mental-health-storage',
      partialize: (state) => ({
        evaluation: state.evaluation,
        lastUpdated: state.lastUpdated,
      }),
    },
  ),
);
