import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, PaletteMode } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';

const getStoredTheme = (): PaletteMode | undefined => {
  if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem('theme') as PaletteMode;
    if (storedTheme) {
      return storedTheme;
    }
  }
  return undefined;
};

const systemTheme = (): PaletteMode | undefined => {
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

interface ThemeContextType {
  theme: PaletteMode | undefined;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children?: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, ...props }) => {
  const [theme, setTheme] = useState<PaletteMode | undefined>(props.initialTheme || getStoredTheme() || systemTheme());

  useEffect(() => {
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
      localStorage.setItem('theme', e.matches ? 'dark' : 'light');
    };

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      darkModeMediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
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
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MuiThemeProvider theme={muiTheme} {...props}>
        <CssBaseline />
        {children}
        <IconButton
          onClick={toggleTheme}
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          data-testid="theme-toggle-btn"
        >
          {getThemeIcon()}
        </IconButton>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
