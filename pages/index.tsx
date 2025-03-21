import { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Head from 'next/head';
import Loading from '../src/components/Loading';
import { useTheme } from '../src/components/ThemeProvider'; // Import useTheme

type Quote = {
  quote: string;
  author: string;
  error?: string;
};

const theme = {
  light: {
    backgroundColor: '#f0f0f0',
    color: '#333',
    quoteBackground: '#fff',
  },
  dark: {
    backgroundColor: '#333',
    color: '#fff',
    quoteBackground: '#222',
  },
};

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: sans-serif;
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.color};
`;

const QuoteContainer = styled.div`
  background-color: ${({ theme }) => theme.quoteBackground};
  padding: 20px;
  max-width: 600px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
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
  const { theme: currentTheme } = useTheme(); // Use the useTheme hook
  const selectedTheme = currentTheme === 'dark' ? theme.dark : theme.light;


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
    <ThemeProvider theme={selectedTheme}> {/* Pass the theme object */}
      <Head>
        <title>Quote of the Day</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
    </ThemeProvider>
  );
}

export default HomePage
