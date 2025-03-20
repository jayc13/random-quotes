import { useState, useEffect } from 'react';
import Loading from '../src/components/Loading';

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
    return <Loading />;
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        maxWidth: '600px',
        textAlign: 'center',
      }}>
        {quote.error ? (
          <div style={{ color: 'red' }}>{quote.error}</div>
        ) : (
          <>
            <p style={{ fontSize: '1.5em', fontStyle: 'italic', marginBottom: '10px' }}>
              "{quote.quote}"
            </p>
            <p style={{ fontSize: '1.2em', color: '#555' }}>
              - {quote.author}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage
