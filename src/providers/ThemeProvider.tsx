import React, {createContext, useCallback, useState, useEffect, useContext, ReactNode} from 'react';
import {ThemeProvider as MuiThemeProvider, createTheme, PaletteMode} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import { Tooltip } from '@mui/material';
import {useLanguage} from '../context/LanguageContext.tsx';

interface ThemeContextType {
  theme: PaletteMode | 'system' | undefined;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children?: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({children, ...props}) => {
  const [theme, setTheme] = useState<PaletteMode | 'system'>('system');
  const {translate} = useLanguage();

  const systemTheme = useCallback((): PaletteMode => {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  useEffect(() => {
    const getStoredTheme = (): PaletteMode | 'system' => {
      return (localStorage.getItem('theme') as PaletteMode | 'system') || 'system';
    };

    const storedTheme = getStoredTheme();
    setTheme(storedTheme);

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (getStoredTheme() === 'system') {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      darkModeMediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [systemTheme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const themeTransitions: { [key in PaletteMode | 'system']: PaletteMode | 'system' } = {
        light: 'dark',
        dark: 'system',
        system: 'light',
      };
      const newTheme = themeTransitions[prevTheme];
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  const muiTheme = createTheme({
    palette: {
      mode: theme === 'system' ? systemTheme() : theme,
    },
  });

  const getThemeIcon = () => {
    const icons = {
      light: '🌞', // Sun icon for light theme
      dark: '🌜', // Moon icon for dark theme
      system: '🖥️', // Computer icon for system theme
    };
    return icons[theme];
  };

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      <MuiThemeProvider theme={muiTheme} {...props}>
        <CssBaseline/>
        {children}
        <Tooltip title={translate('Change theme')} placement="left" arrow>
          <IconButton
            onClick={toggleTheme}
            sx={{position: 'fixed', bottom: 16, right: 16}}
            data-testid="theme-toggle-btn"
          >
            {getThemeIcon()}
          </IconButton>
        </Tooltip>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return themeContext;
};

export default ThemeProvider;