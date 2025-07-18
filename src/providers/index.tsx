'use client';

import { ThemeProvider } from './ThemeProvider';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};

export * from './ThemeProvider';
