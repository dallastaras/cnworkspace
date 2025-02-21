import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { KPI, KPIValue, School, User } from '../types';

interface CachedProfile {
  email: string;
  name: string;
  avatar_url?: string;
}

interface CustomDateRange {
  start: Date;
  end: Date;
}

interface State {
  user: User | null;
  schools: School[];
  kpis: KPI[];
  kpiValues: KPIValue[];
  selectedTimeframe: 'prior-day' | 'day' | 'week' | 'last-week' | 'month' | 'last-month' | 'year' | 'prior-year' | 'all-years' | 'custom';
  customDateRange: CustomDateRange | null;
  darkMode: boolean;
  cachedProfile: CachedProfile | null;
  setUser: (user: User | null) => void;
  setSchools: (schools: School[]) => void;
  setKPIs: (kpis: KPI[]) => void;
  setKPIValues: (values: KPIValue[]) => void;
  setSelectedTimeframe: (timeframe: 'prior-day' | 'day' | 'week' | 'last-week' | 'month' | 'last-month' | 'year' | 'prior-year' | 'all-years' | 'custom') => void;
  setCustomDateRange: (range: CustomDateRange | null) => void;
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
      customDateRange: null,
      darkMode: false,
      cachedProfile: null,
      setUser: (user) => set({ user }),
      setSchools: (schools) => set({ schools }),
      setKPIs: (kpis) => set({ kpis }),
      setKPIValues: (kpiValues) => set({ kpiValues }),
      setSelectedTimeframe: (selectedTimeframe) => set({ selectedTimeframe }),
      setCustomDateRange: (range) => set({ customDateRange: range }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setCachedProfile: (profile) => set({ cachedProfile: profile }),
    }),
    {
      name: 'schoolcafe-storage',
      partialize: (state) => ({ 
        darkMode: state.darkMode,
        cachedProfile: state.cachedProfile,
        selectedTimeframe: state.selectedTimeframe,
        customDateRange: state.customDateRange
      }),
    }
  )
);