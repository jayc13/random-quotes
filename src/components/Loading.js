import React from 'react';
import styled, { keyframes } from 'styled-components';
import ThemeProvider from './ThemeProvider';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const shuffleAnimation = keyframes`
  0% {
    content: '...';
  }
  10% {
    content: '#1%';
  }
  20% {
    content: '@9&';
  }
  30% {
    content: '!z?';
  }
  40% {
    content: '^8-';
  }
  50% {
    content: '*a+';
  }
  100% {
    content: 'Loading...';
  }
`;

const LoadingText = styled.p`
  font-size: 1.6em;
  font-weight: bold;
  &::before {
    content: 'Loading...';
    animation: shuffleAnimation 0.5s infinite;
  }
`;

const Loading = () => {
  return (
    <ThemeProvider>
      <LoadingContainer id="loading">
        <LoadingText></LoadingText>
      </LoadingContainer>
    </ThemeProvider>
  );
};

export default Loading;
