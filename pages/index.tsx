import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import Head from 'next/head';
import ThemeProvider from '../src/components/ThemeProvider';
import Loading from '../src/components/Loading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  maxWidth: '80%',
  textAlign: 'center',
  backgroundColor: 'background.paper',
  color: 'text.primary',
}));

const ErrorMessage = styled("div")(() => ({
  color: '#d32f2f',
  fontWeight: 'bold',
}));

const QuoteText = styled("p")(() => ({
  fontSize: '3em',
  fontStyle: 'italic',
  marginBottom: '10px',
  fontFamily: 'Lora, serif',
  color: 'text.primary',
}));

const AuthorText = styled("p")(() => ({
  fontSize: '1.4em',
  fontFamily: 'Open Sans, sans-serif',
  color: 'text.secondary',
}));

const Tagline = styled("div")(() => ({
  marginBottom: '20px',
  fontSize: '1em',
  fontWeight: 'bold',
  fontFamily: 'Open Sans, sans-serif',
  color: 'text.primary',
}));

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
    } catch {
      setQuote({ quote: '', author: '', error: 'Failed to fetch quote' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNewQuote().then();
  }, []);
  
  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    toast.success('Quote copied!', {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      theme: 'colored',
    });
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

  return (
    <ThemeProvider>
      <Head>
        <title>Quote of the Day</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainContainer>
        <QuoteContainer>
          {(!quote || quote.error) ? (
            <ErrorMessage id="error">Failed to fetch quote. Please try again</ErrorMessage>
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
                  onClick={() => copyToClipboard(`"${quote.quote}" - ${quote.author}`)}
                  data-testid="copy-quote-btn"
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
                <QuoteText id="quote">&ldquo;{quote.quote}&rdquo;</QuoteText>
              </Box>
              <AuthorText id="author">- {quote.author}</AuthorText>
              <IconButton 
                onClick={() => fetchNewQuote()} 
                disabled={loading}
                data-testid="refresh-quote-btn"
              >
                <RotateRightIcon />
              </IconButton>
            </>
          )}
        </QuoteContainer>
        <ToastContainer />
      </MainContainer>
    </ThemeProvider>
  );
}

export default HomePage;
