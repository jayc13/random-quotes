import React from 'react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const LoadingText = styled.p`
  font-size: 1.5em;
  color: #333;
`;

const Loading = () => {
  return (
    <LoadingContainer>
      <LoadingText>Loading...</LoadingText>
    </LoadingContainer>
  );
};

export default Loading;
