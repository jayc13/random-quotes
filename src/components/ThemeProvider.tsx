import React, { createContext, useState, useEffect, useContext } from 'react';
import { Theme, ThemeProvider as NextThemesProvider, createTheme, PaletteMode } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';

// Utility function to get system theme
const systemTheme = (): PaletteMode | undefined => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

interface ThemeProviderProps {
  children?: React.ReactNode;
}

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<PaletteMode | undefined>(systemTheme());

  useEffect(() => {
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      darkModeMediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const muiTheme = createTheme({
    palette: {
      mode: theme,
    },
  });

  const getThemeIcon = () => {
    if (theme === 'light') {
      return '🌞'; // Sun icon for light theme
    }
    return '🌜'; // Moon icon for dark theme
  };

  return (
    <NextThemesProvider theme={muiTheme} {...props}>
      <CssBaseline />
      {children}
      <IconButton
        onClick={toggleTheme}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        {getThemeIcon()}
      </IconButton>
    </NextThemesProvider>
  );
};

export { ThemeProvider };
