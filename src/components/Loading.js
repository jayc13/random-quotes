import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from './ThemeProvider'; // Import useTheme

const theme = {
  light: {
    color: '#333',
  },
  dark: {
    color: '#fff',
  },
};

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const LoadingText = styled.p`
  font-size: 1.5em;
  color: ${({ theme }) => theme.color};
`;

const Loading = () => {
  const { theme: currentTheme } = useTheme();
  const selectedTheme = currentTheme === 'dark' ? theme.dark : theme.light;

  return (
    <ThemeProvider theme={selectedTheme}>
      <LoadingContainer id="loading">
        <LoadingText>Loading...</LoadingText>
      </LoadingContainer>
    </ThemeProvider>
  );
};

export default Loading;
