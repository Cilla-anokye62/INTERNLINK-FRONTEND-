import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';
import { useAppStore } from '../store/useAppStore';

type ThemeType = 'light' | 'dark';
type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: ThemeType;
  colors: typeof Colors.light;
  themePreference: ThemePreference;
  setThemePreference: (theme: ThemePreference) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Device theme (light or dark)
  const systemColorScheme = useColorScheme() as ThemeType | null;
  const systemTheme = systemColorScheme || 'light';

  // Persisted user preference (light, dark, system)
  const themePreference = useAppStore((state) => state.themePreference);
  const setThemePreference = useAppStore((state) => state.setThemePreference);

  // Computed active theme
  const activeTheme = themePreference === 'system' ? systemTheme : themePreference;

  const value: ThemeContextValue = {
    theme: activeTheme,
    colors: Colors[activeTheme],
    themePreference,
    setThemePreference,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
