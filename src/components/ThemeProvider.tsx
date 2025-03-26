import React, { createContext, useState, useEffect, useContext } from 'react';
import { Theme, ThemeProvider as NextThemesProvider, createTheme, PaletteMode } from '@mui/material/styles';
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
  if (typeof window !== 'undefined') {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDarkMode ? 'dark' : 'light';
  }
  return 'light';
};

interface ThemeProviderProps {
  children?: React.ReactNode;
}

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<PaletteMode | undefined>(systemTheme());

  useEffect(() => {
    if (window) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        setTheme(event.matches ? "dark" : "light");
      });
    }
  }, []);


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
      }
      return newTheme;
    });
  };

  const muiTheme: Theme = createTheme({
    palette: {
      mode: theme === undefined ? systemTheme() : theme as PaletteMode,
      primary: {
        main: '#fff',
        light: '#fff',
        dark: '#333'
      },
      secondary: {
        main: '#f0f0f0',
        light: '#f0f0f0',
        dark: '#444',
      },
    },
  });

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <LightModeIcon />;
      case 'dark':
        return <DarkModeIcon />;
      default:
        return <AutoModeIcon />;
    }
  };

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;

  return (
    <NextThemesProvider value={{ theme: muiTheme, setTheme }}>
        <CssBaseline />
        {children}
        <IconButton onClick={() => toggleTheme()} sx={{ position: 'fixed', bottom: 16, right: 16 }}>
          {getThemeIcon()}
        </IconButton>
    </NextThemesProvider>
  );
};

export default ThemeProvider;
