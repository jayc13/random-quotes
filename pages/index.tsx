import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

type Quote = {
  quote: string;
  author: string;
  error?: string;
};

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
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <Card sx={{ width: '100%', textAlign: 'center', boxShadow: 3 }}>
        <CardContent>
          {quote.error ? (
            <Typography color="error">{quote.error}</Typography>
          ) : (
            <>
              <Typography variant="h6" fontStyle="italic" marginBottom="10px">
                "{quote.quote}"
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                - {quote.author}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default HomePage
