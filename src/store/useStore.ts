import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { KPI, KPIValue, School, User } from '../types';

interface CachedProfile {
  email: string;
  name: string;
  avatar_url?: string;
}

interface State {
  user: User | null;
  schools: School[];
  kpis: KPI[];
  kpiValues: KPIValue[];
  selectedTimeframe: 'prior-day' | 'day' | 'week' | 'month' | 'year';
  darkMode: boolean;
  cachedProfile: CachedProfile | null;
  setUser: (user: User | null) => void;
  setSchools: (schools: School[]) => void;
  setKPIs: (kpis: KPI[]) => void;
  setKPIValues: (values: KPIValue[]) => void;
  setSelectedTimeframe: (timeframe: 'prior-day' | 'day' | 'week' | 'month' | 'year') => void;
  toggleDarkMode: () => void;
  setCachedProfile: (profile: CachedProfile | null) => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      user: null,
      schools: [],
      kpis: [],
      kpiValues: [],
      selectedTimeframe: 'month',
      darkMode: false,
      cachedProfile: null,
      setUser: (user) => set({ user }),
      setSchools: (schools) => set({ schools }),
      setKPIs: (kpis) => set({ kpis }),
      setKPIValues: (kpiValues) => set({ kpiValues }),
      setSelectedTimeframe: (selectedTimeframe) => set({ selectedTimeframe }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setCachedProfile: (profile) => set({ cachedProfile: profile }),
    }),
    {
      name: 'schoolcafe-storage',
      partialize: (state) => ({ 
        darkMode: state.darkMode,
        cachedProfile: state.cachedProfile,
        selectedTimeframe: state.selectedTimeframe
      }),
    }
  )
);