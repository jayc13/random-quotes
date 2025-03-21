import React, { createContext, useState, useContext, useMemo } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import useDarkMode from 'use-dark-mode';

// Define theme variables
const lightTheme = {
  background: '#fff',
  text: '#000',
};

const darkTheme = {
  background: '#333',
  text: '#fff',
};

// Create theme context
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

// ThemeProvider component
const ThemeProvider = ({ children }) => {
  const { value, toggle } = useDarkMode(false, {
    storageKey: null,
    onChange: null
  });
  const theme = value ? 'dark' : 'light';

  const toggleTheme = () => {
    toggle();
  };

  const themeValue = useMemo(() => ({ theme, toggleTheme }), [theme]);

  const themeData = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={themeValue}>
      <StyledThemeProvider theme={themeData}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
const useTheme = () => useContext(ThemeContext);

export { ThemeProvider, useTheme };
