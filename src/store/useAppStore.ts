import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemePreference = 'light' | 'dark' | 'system';

interface AppState {
  // Theme State
  themePreference: ThemePreference;
  setThemePreference: (theme: ThemePreference) => void;

  // Auth State
  isAuthenticated: boolean;
  userRole: 'student' | 'employer' | 'university' | null;
  login: (role: 'student' | 'employer' | 'university') => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Default theme preference
      themePreference: 'system',
      setThemePreference: (theme) => set({ themePreference: theme }),

      // Default auth state
      isAuthenticated: false,
      userRole: null,
      login: (role) => set({ isAuthenticated: true, userRole: role }),
      logout: () => set({ isAuthenticated: false, userRole: null }),
    }),
    {
      name: 'internlink-storage', // unique name for AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
