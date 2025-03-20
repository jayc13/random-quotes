import { useState, useEffect } from 'react';

type Quote = {
  quote: string;
  author: string;
};

function HomePage() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    async function fetchQuote() {
      const response = await fetch('/api/quote');
      const data: Quote = await response.json();
      setQuote(data);
    }
    fetchQuote();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsDarkMode(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (!quote) {
    return <div>Loading...</div>;
  }

  return (
    <div className={isDarkMode ? 'dark-mode-container' : 'light-mode-container'}>
      <label className="theme-toggle">
        <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
        Dark Mode
      </label>
      <div className="quote-box">
        <p className="quote-text">
          "{quote.quote}"
        </p>
        <p className="author-text">
          - {quote.author}
        </p>
      </div>
      <style jsx>{`
        .light-mode-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          font-family: Arial, sans-serif;
          background-color: #fff;
          color: #000;
        }

        .dark-mode-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          font-family: Arial, sans-serif;
          background-color: #333;
          color: #fff;
        }

        .theme-toggle {
          position: absolute;
          top: 20px;
          right: 20px;
          cursor: pointer;
        }

        .theme-toggle input {
          margin-right: 5px;
        }

        .quote-box {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 20px;
          max-width: 600px;
          text-align: center;
          background-color: #f9f9f9;
        }

        .dark-mode-container .quote-box {
          background-color: #555;
        }

        .quote-text {
          font-size: 1.5em;
          font-style: italic;
          margin-bottom: 10px;
        }

        .author-text {
          font-size: 1.2em;
          color: #555;
        }

        .dark-mode-container .author-text {
          color: #ccc;
        }
      `}</style>
    </div>
  );
}

export default HomePage
