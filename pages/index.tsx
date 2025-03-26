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

const MainContainer = styled("div")(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  fontFamily: 'sans-serif',
  backgroundColor: 'secondary.main',
  color: 'secondary.contrastText',
  backgroundImage: "url(data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 3L3 1' stroke='%239C92AC' stroke-opacity='0.4'/%3E%3C/svg%3E)",
  backgroundRepeat: 'repeat',
}));

const QuoteContainer = styled("div")(() => ({
  padding: '20px',
  maxWidth: '600px',
  textAlign: 'center',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  borderRadius: '8px',
  backgroundColor: 'primary.main',
  color: 'primary.contrastText'
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
}));

const AuthorText = styled("p")(() => ({
  fontSize: '1.1em',
  fontFamily: 'Open Sans, sans-serif',
}));

function HomePage() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);

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
              <Tagline>Your daily dose of inspiration.</Tagline>
              <QuoteText id="quote">&ldquo;{quote.quote}&rdquo;</QuoteText>
              <AuthorText id="author">- {quote.author}</AuthorText>
              <NewQuoteButton onClick={() => fetchNewQuote()} disabled={loading}>
                New Quote
              </NewQuoteButton>
            </>
          )}
        </QuoteContainer>
      </MainContainer>
    </ThemeProvider>
+  );
+
+  async function fetchNewQuote() {
+    setLoading(true);
+    try {
+      const response = await fetch('/api/quote');
+      if (!response.ok) {
+        throw new Error('Failed to fetch quote');
+      }
+      const data = await response.json();
+      setQuote(data);
+    } catch (error) {
+      setQuote({ quote: '', author: '', error: 'Failed to fetch new quote' });
+    } finally {
+      setLoading(false);
+    }
+  }
+}
+
+const NewQuoteButton = styled("button")<{ disabled?: boolean }>(({ disabled }) => ({
+  marginTop: '20px',
+  padding: '10px 20px',
+  fontSize: '1em',
+  color: 'primary.contrastText',
+  backgroundColor: disabled ? 'gray' : 'secondary.main',
+  border: 'none',
+  borderRadius: '5px',
+  cursor: disabled ? 'default' : 'pointer',
+}));
+
+
+export default HomePage

  );
}

export default HomePage
