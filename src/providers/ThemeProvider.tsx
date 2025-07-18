'use client';

import { createContext, useContext, useEffect } from 'react';
import useAppStore from '@/lib/store/useAppStore';
import { THEMES } from '@/constants';

interface ThemeContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme, toggleTheme } = useAppStore();

  useEffect(() => {
    // Apply theme to document
    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove(THEMES.DARK, THEMES.LIGHT);
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
