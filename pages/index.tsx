import { useState, useEffect } from 'react';
import Loading from '../src/components/Loading';

type Quote = {
  quote: string;
  author: string;
};

function HomePage() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    async function fetchQuote() {
      const response = await fetch('/api/quote');
      const data: Quote = await response.json();
      setQuote(data);
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
        padding: '20px', 
        maxWidth: '600px', 
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '1.5em', fontStyle: 'italic', marginBottom: '10px' }}>
          "{quote.quote}"
        </p>
        <p style={{ fontSize: '1.2em', color: '#555' }}>
          - {quote.author}
        </p>
      </div>
    </div>
  );
}

export default HomePage
