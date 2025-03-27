import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import Head from 'next/head';
import ThemeProvider from '../src/components/ThemeProvider';
import Loading from '../src/components/Loading';

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

const QuoteContainer = styled(Box)(() => ({
  position: 'relative',
  padding: '16px',
  maxWidth: '600px',
  textAlign: 'center',
  backgroundColor: 'background.paper',
  color: 'text.primary',
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
  cursor: disabled ? 'default' : 'pointer'
}));

const Tagline = styled("div")(() => ({
  marginBottom: '20px',
  fontSize: '1.2em',
  fontWeight: 'bold',
  fontFamily: 'Open Sans, sans-serif',
  color: 'text.primary',
}));

const delay = (durationMs: number) => {
  return new Promise(resolve => setTimeout(resolve, durationMs));
}

const HomePage = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchNewQuote() {
    setLoading(true);
    try {
      const response = await fetch('/api/quote');
      if (!response.ok) {
        throw new Error('Failed to fetch quote');
      }
      const data = await response.json();
      setQuote(data);
      await delay(3 * 1000); // Add a loading of 3 seconds
    } catch (error) {
      setQuote({ quote: '', author: '', error: 'Failed to fetch quote' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNewQuote();
  }, []);
  
  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      alert('Quote copied!');
      console.log('Quote copied to clipboard!');
      // You can add a toast notification or other visual feedback here
    } catch (err) {
      console.error('Failed to copy quote: ', err);
      // Handle error (e.g., show error message to the user)
    }
  }

  if (loading) {
    return (
      <ThemeProvider>
        <Head>
          <title>Quote of the Day</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <MainContainer>
          <Loading />
        </MainContainer>
      </ThemeProvider>
    );
  }

  if (!quote) {
    return null; // or a different fallback if needed
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
              <Tagline>Your daily dose of inspiration.</Tagline>
              <Box
                sx={{
                  position: 'relative'
                }}>
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-30px',
                    margin: 0
                  }}
                  onClick={() => copyToClipboard(`${quote.quote} - ${quote.author}`)}
                  data-testid="copy-quote-btn"
                >
                  <FileCopyIcon fontSize="small" />
                </IconButton>
                <QuoteText id="quote">&ldquo;{quote.quote}&rdquo;</QuoteText>
              </Box>
              <AuthorText id="author">- {quote.author}</AuthorText>
              <IconButton onClick={() => fetchNewQuote()} disabled={loading}>
                <RotateRightIcon />
              </IconButton>
            </>
          )}
        </QuoteContainer>
      </MainContainer>
    </ThemeProvider>
  );
}

export default HomePage;
