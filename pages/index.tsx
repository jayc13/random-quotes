import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Loading from '../src/components/Loading';

type Quote = {
  quote: string;
  author: string;
  error?: string;
};

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  font-family: sans-serif;
  background-color: #f0f0f0;
`;

const QuoteContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  max-width: 600px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-weight: bold;
`;

const QuoteText = styled.p`
  font-size: 1.4em;
  font-style: italic;
  margin-bottom: 10px;
  color: #333;
`;

const AuthorText = styled.p`
  font-size: 1.1em;
  color: #777;
`;

function HomePage() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    async function fetchQuote() {
      try {
        const response = await fetch('/api/quote');
        if (!response.ok) {
          throw new Error(`Failed to fetch quote: ${response.status}`);
        }
        const data: Quote = await response.json();
        setQuote(data);
      } catch (error: any) {
        setQuote({ quote: '', author: '', error: error.message });
      }
    }
    fetchQuote();
  }, []);

  if (!quote) {
    return <Loading />;
  }

  return (
    <MainContainer>
      <QuoteContainer>
        {quote.error ? (
          <ErrorMessage id="error">{quote.error}</ErrorMessage>
        ) : (
          <>
            <QuoteText id="quote">&ldquo;{quote.quote}&rdquo;</QuoteText>
            <AuthorText id="author">- {quote.author}</AuthorText>
          </>
        )}
      </QuoteContainer>
    </MainContainer>
  );
}

export default HomePage
