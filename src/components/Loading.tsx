import React from 'react';
import styled, { keyframes } from 'styled-components';


const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const SpinnerAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #333;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${SpinnerAnimation} 1s linear infinite;
  margin-bottom: 10px;
`;

const LoadingText = styled.p`
  font-size: 1.2em;
  font-size: 1.5em;
`;

const Loading = () => {
  return (
      <LoadingContainer id="loading">
        <Spinner />
        <LoadingText>Loading...</LoadingText>
      </LoadingContainer>
  );
};

export default Loading;
