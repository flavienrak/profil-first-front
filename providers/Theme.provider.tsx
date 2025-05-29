'use client';

import { RootState } from '@/redux/store';
import React from 'react';
import { useSelector } from 'react-redux';

interface ThemeProviderContextType {
  theme: { mode: string };
}

const ThemeContext = React.createContext<ThemeProviderContextType | undefined>(
  undefined,
);

export const useUser = (): ThemeProviderContextType => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mode } = useSelector((state: RootState) => state.persistInfos);

  const theme = { mode };

  return (
    <ThemeContext.Provider value={{ theme }}>
      <div
        className={`w-full h-full ${
          mode === 'light' ? 'lightMode' : 'darkMode'
        }`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
