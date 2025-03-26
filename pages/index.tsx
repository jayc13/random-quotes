import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import Loading from '../src/components/Loading';
import ThemeProvider, { useTheme } from '../src/components/ThemeProvider';
import Image from 'next/image';

type Quote = {
  quote: string;
  author: string;
  error?: string;
};

const MainContainer = styled("div")(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  width: '100vw',
  fontFamily: 'sans-serif',
  backgroundColor: 'background.default',
  color: 'secondary.contrastText',
}));

const QuoteContainer = styled("div")(() => ({
  padding: '16px',
  maxWidth: '600px',
  textAlign: 'center',
  backgroundColor: 'background.paper',
  color: 'text.primary'
}));

const ErrorMessage = styled("div")(() => ({
  color: '#d32f2f',
  fontWeight: 'bold',
}));

const QuoteText = styled("p")(() => ({
  fontSize: '1.4em',
  fontStyle: 'italic',
  marginBottom: '10px',
  fontFamily: 'Lora, serif',
  color: 'text.primary',
}));

const AuthorText = styled("p")(() => ({
  fontSize: '1.1em',
  fontFamily: 'Open Sans, sans-serif',
  color: 'text.secondary',
}));

const NewQuoteButton = styled("button")<{ disabled?: boolean }>(({ disabled }) => ({
  marginTop: '20px',
  padding: '10px 20px',
  fontSize: '1em',
  color: 'primary.contrastText',
  backgroundColor: disabled ? 'gray' : 'secondary.main',
  border: 'none',
  borderRadius: '5px',
  cursor: disabled ? 'default' : 'pointer',
}));

const Tagline = styled("div")(() => ({
  marginBottom: '20px',
  fontSize: '1.2em',
  fontWeight: 'bold',
  fontFamily: 'Open Sans, sans-serif',
  color: 'text.primary',
}));

const QuoteImage = styled(Image)(() => ({
  maxWidth: '100%',
  height: 'auto',
}));

const HomePage = () => {
  const [quote, setQuote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    async function fetchQuote() {
      try {
        const response = await fetch(`/api/quote.svg?theme=${theme}`);
        if (!response.ok) {
          throw new Error('Failed to fetch quote');
        }
        const svg = await response.text();
        setQuote(svg);
      } catch (error: any) {
        setQuote(`<div id="error">Failed to fetch quote: ${error.message}</div>`);
      }
    }
    fetchQuote();
  }, [theme]);

  async function fetchNewQuote() {
    setLoading(true);
    try {
      const response = await fetch(`/api/quote.svg?theme=${theme}`);
      if (!response.ok) {
        throw new Error('Failed to fetch quote');
      }
      const svg = await response.text();
      setQuote(svg);
    } catch (error) {
      setQuote(`<div id="error">Failed to fetch new quote: ${error}</div>`);
    } finally {
      setLoading(false);
    }
  }

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
          <Tagline>Your daily dose of inspiration.</Tagline>
          <div dangerouslySetInnerHTML={{ __html: quote }} />
          <NewQuoteButton onClick={() => fetchNewQuote()} disabled={loading}>
            New Quote
          </NewQuoteButton>
        </QuoteContainer>
      </MainContainer>
    </ThemeProvider>
  );
}

export default HomePage;
