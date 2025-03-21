import React, { createContext, useState, useEffect, useContext } from 'react';
import { Theme, ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import { DarkMode as DarkModeIcon, LightMode as LightModeIcon, AutoMode as AutoModeIcon } from '@mui/icons-material';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextProps {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const systemTheme = (): ThemeMode => {
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDarkMode ? 'dark' : 'light';
};

const getInitialTheme = (): ThemeMode => {
  const storedTheme = localStorage.getItem('theme') as ThemeMode | null;
  return storedTheme || 'system';
};

const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    const initialTheme = getInitialTheme();
    if (initialTheme === 'system') {
      setTheme(systemTheme());
    } else {
      setTheme(initialTheme);
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        setTheme(systemTheme());
      }
    };
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      let newTheme: ThemeMode;
      switch (prevTheme) {
        case 'light':
          newTheme = 'dark';
          break;
        case 'dark':
          newTheme = 'system';
          break;
        case 'system':
          newTheme = 'light';
          break;
      }
      return newTheme;
    });
  };

  const muiTheme: Theme = createTheme({
    palette: {
      mode: theme === 'system' ? systemTheme() : theme,
    },
  });

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <LightModeIcon />;
      case 'dark':
        return <DarkModeIcon />;
      case 'system':
        return <AutoModeIcon />;
      default:
        return <AutoModeIcon />;
    }
  };


  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
        <IconButton onClick={toggleTheme} sx={{ position: 'fixed', bottom: 16, right: 16 }}>
          {getThemeIcon()}
        </IconButton>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export { ThemeProvider, useTheme };
