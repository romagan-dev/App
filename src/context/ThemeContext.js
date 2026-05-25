import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark((v) => !v);

  const theme = {
    isDark,
    bg: isDark ? '#0D0D0D' : '#F0F2F5',
    card: isDark ? '#1C1C1E' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#1A1A2E',
    subtext: isDark ? '#AAAAAA' : '#666666',
    border: isDark ? '#333333' : '#E0E0E0',
    primary: '#3F51B5',
    accent: '#FF6B35',
    headerBg: isDark ? '#1A1A2E' : '#3F51B5',
    headerText: '#FFFFFF',
    input: isDark ? '#1C1C1E' : '#FFFFFF',
    inputBorder: isDark ? '#444' : '#E0E0E0',
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);