import React, { createContext, useState, useEffect, useContext } from 'react';
import { Theme, ThemeProvider as MuiThemeProvider, createTheme, PaletteMode } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import { 
  DarkMode as DarkModeIcon, 
  LightMode as LightModeIcon, 
  AutoMode as AutoModeIcon
} from '@mui/icons-material';

interface ThemeContextProps {
  theme?: PaletteMode;
  setTheme: (theme: PaletteMode) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const systemTheme = (): PaletteMode => {
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDarkMode ? 'dark' : 'light';
};

const getInitialTheme = (): PaletteMode | undefined => {
  const storedTheme = localStorage.getItem('theme') as PaletteMode | null;
  return storedTheme || undefined;
};

interface ThemeProviderProps {
  children?: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<PaletteMode | undefined>(getInitialTheme);

  useEffect(() => {
    const initialTheme = getInitialTheme();
    if (initialTheme === undefined) {
      setTheme(systemTheme());
    } else {
      setTheme(initialTheme);
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === undefined) {
        setTheme(systemTheme());
      }
    };
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  useEffect(() => {
    if(theme === undefined) {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      let newTheme: PaletteMode;
      switch (prevTheme) {
        case 'light':
          newTheme = 'dark';
          break;
        case 'dark':
          newTheme = undefined;
          break;
        case undefined:
          newTheme = 'light';
          break;
      }
      return newTheme;
    });
  };

  const muiTheme: Theme = createTheme({
    palette: {
      mode: theme === undefined ? systemTheme() : theme as PaletteMode,
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
