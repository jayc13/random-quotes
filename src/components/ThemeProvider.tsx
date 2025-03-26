import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, PaletteMode } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';

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
  
  const [theme, setTheme] = useState<PaletteMode | undefined>(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme') as PaletteMode | undefined;
      return storedTheme || systemTheme();
    }
    return undefined;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme || systemTheme());
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (event: MediaQueryListEvent) => {
        if (theme === undefined) {
          setTheme(event.matches ? "dark" : "light");
        }
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      let newTheme: PaletteMode | undefined;
      switch (prevTheme) {
        case 'light':
          newTheme = 'dark';
          break;
        case 'dark':
          newTheme = 'light';
          break;
        default:
          newTheme = systemTheme() === 'light' ? 'dark' : 'light';
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
      }
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
