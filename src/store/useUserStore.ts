import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { backupToIndexedDB } from '../utils/storageSync';

export interface Habit {
  id: string;
  name: string;
  category: string;
  streak: number;
  completedDates: string[]; // ISO Strings (YYYY-MM-DD)
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  items: { id: string; completed: boolean; type: 'habit' | 'task' }[];
}

interface UserState {
  habits: Habit[];
  goals: Goal[];
  dailyLogs: DailyLog[];
  
  // Actions
  addHabit: (habit: Habit) => void;
  toggleHabit: (habitId: string, date: string) => void;
  removeHabit: (habitId: string) => void;
  
  addGoal: (goal: Goal) => void;
  updateGoal: (goalId: string, progress: number) => void;
  removeGoal: (goalId: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      habits: [],
      goals: [],
      dailyLogs: [],

      addHabit: (habit) => set((state) => ({ 
        habits: [...state.habits, habit] 
      })),

      toggleHabit: (habitId, date) => set((state) => {
        const habits = state.habits.map((h) => {
          if (h.id === habitId) {
            const isCompleted = h.completedDates.includes(date);
            const completedDates = isCompleted 
              ? h.completedDates.filter((d) => d !== date)
              : [...h.completedDates, date];
            
            return { ...h, completedDates };
          }
          return h;
        });
        return { habits };
      }),

      removeHabit: (habitId) => set((state) => ({
        habits: state.habits.filter((h) => h.id !== habitId)
      })),

      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, goal]
      })),

      updateGoal: (goalId, progress) => set((state) => ({
        goals: state.goals.map((g) => g.id === goalId ? { ...g, current: Math.min(g.target, Math.max(0, g.current + progress)) } : g)
      })),

      removeGoal: (goalId) => set((state) => ({
        goals: state.goals.filter((g) => g.id !== goalId)
      })),
    }),
    {
      name: 'life-user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Subscribe to changes and backup to IndexedDB for safety
useUserStore.subscribe((state) => {
  const { habits, goals, dailyLogs } = state;
  backupToIndexedDB({ habits, goals, dailyLogs });
});
