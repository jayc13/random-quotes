import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import Loading from '../src/components/Loading';
import ThemeProvider from '../src/components/ThemeProvider';

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
    backgroundColor: '#444',
    color: '#fff',
    quoteBackground: '#333',
  },
};

const MainContainer = styled("div")(({ theme }) => ({
  display: flex,
  justifyContent: center,
  alignItems: center,
  minHeight: '100vh',
  fontFamily: 'sans-serif',
  color: theme.color,
  // backgroundColor: ${({ theme }) => theme[theme.palette.mode].backgroundColor};
}));

const QuoteContainer = styled("div")(({ theme }) => ({
  padding: '20px',
  maxWidth: '600px',
  textAlign: 'center',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  //backgroundColor: ${({ theme }) => theme[theme.palette.mode].quoteBackground};
}));

const ErrorMessage = styled("div")(({ theme }) => ({
  color: '#d32f2f',
  fontWeight: bold,
}));

const QuoteText = styled("p")(({ theme }) => ({
  fontSize: '1.4em',
  fontStyle: 'italic',
  marginBottom: '10px',
}));

const AuthorText = styled("p")(({ theme }) => ({
  fontSize: '1.1em',
}));

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
    <ThemeProvider>
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
