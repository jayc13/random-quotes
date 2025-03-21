import React from 'react';
import styled from 'styled-components';
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from './ThemeProvider';

const ThemeButton = styled(IconButton)`
  position: absolute;
  top: 20px;
  right: 20px;
`;

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <ThemeButton onClick={toggleTheme} color="inherit">
      {theme === 'light' ? <Brightness4 /> : <Brightness7 />}
    </ThemeButton>
  );
};

export default ThemeSwitcher;
