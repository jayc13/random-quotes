import { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from '../src/components/ThemeProvider';
import ThemeSwitcher from '../src/components/ThemeSwitcher';
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
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
`;

const QuoteContainer = styled.div`
  background-color: ${(props) => props.theme.background};
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
`;

const AuthorText = styled.p`
  font-size: 1.1em;
`;

function HomePage() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    async function fetchQuote() {
      try {
        const response = await fetch('/api/quote');
        if (!response.ok) {
          throw new Error(`Failed to fetch quote`);
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
      <ThemeSwitcher />
    </MainContainer>
  );
}

export default HomePage
