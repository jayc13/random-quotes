import React, {useState, useEffect} from 'react';
import {styled} from '@mui/material/styles';
import {Box, IconButton, Tooltip} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import Head from 'next/head';
import ThemeProvider from '../src/components/ThemeProvider';
import Loading from '../src/components/Loading';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LanguageSelector from '../src/components/LanguageSelector';
import CategorySelector from '../src/components/CategorySelector'; // Import CategorySelector

type Quote = {
  quote: string;
  author: string;
  error?: string;
};

const MainContainer = styled("div")(() => ({
  display: 'flex',
  flexDirection: 'column', // Changed to column
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  width: '100vw',
  fontFamily: 'sans-serif',
  backgroundColor: 'background.default',
  color: 'secondary.contrastText',
}));

const LanguageSelectorContainer = styled(Box)(() => ({
  position: 'absolute',
  top: '20px',
  left: '20px',
}));

const CategorySelectorContainer = styled(Box)(() => ({
  position: 'absolute',
  top: '20px',
  right: '20px',
}));

const RefreshQuoteButton = styled(IconButton)(() => ({
  position: 'absolute',
  bottom: '20px',
  left: '20px',
  root: {
    "&.Mui-disabled": {
      pointerEvents: "auto"
    }
  }
}));

const CopyQuoteButton = styled(IconButton)(() => ({
  position: 'absolute',
  top: '-8px',
  right: '-30px',
  margin: 0
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
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // State for selected language
  const [selectedCategory, setSelectedCategory] = useState(''); // State for selected category

  async function fetchNewQuote(category?: string, lang?: string) { // Modified to accept category and language
    setLoading(true);
    try {
      let url = '/api/quote';
      const params = new URLSearchParams();
      if (category) {
        params.append('category', category);
      }
      if (lang) {
        params.append('lang', lang);
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch quote');
      }
      const data = await response.json();
      setQuote(data);
    } catch {
      setQuote({quote: '', author: '', error: 'Failed to fetch quote'});
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNewQuote(undefined, selectedLanguage).then();
  }, [selectedLanguage]);

  const handleCategoryChange = (categoryId: string) => { // Function to handle category change
    setSelectedCategory(categoryId);
    fetchNewQuote(categoryId, selectedLanguage).then(); // Fetch new quote based on selected category and language
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
  };

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

  return (
    <ThemeProvider>
      <Head>
        <title>Quote of the Day</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <MainContainer>
        <LanguageSelectorContainer>
          <LanguageSelector onChange={handleLanguageChange} value={selectedLanguage} />
        </LanguageSelectorContainer>
        <CategorySelectorContainer>
          <CategorySelector onChange={handleCategoryChange} />
        </CategorySelectorContainer>
        {
          loading && <Loading />
        }
        {
          !loading &&
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
                  <Tooltip title="Copy quote" placement="top" arrow>
                    <CopyQuoteButton
                      size="small"
                      onClick={() => copyToClipboard(`"${quote.quote}" - ${quote.author}`)}
                      data-testid="copy-quote-btn"
                    >
                      <ContentCopyIcon fontSize="small"/>
                    </CopyQuoteButton>
                  </Tooltip>
                  <QuoteText id="quote">&ldquo;{quote.quote}&rdquo;</QuoteText>
                </Box>
                <AuthorText id="author">- {quote.author}</AuthorText>
              </>
            )}
          </QuoteContainer>
        }
        <Tooltip title={loading ? '' : 'Refresh quote'} placement="right" arrow>
          <RefreshQuoteButton
            onClick={() => fetchNewQuote(selectedCategory)}
            disabled={loading}
            data-testid="refresh-quote-btn"
            loading={loading}
          >
            <RotateRightIcon/>
          </RefreshQuoteButton>
        </Tooltip>
        <ToastContainer/>
      </MainContainer>
    </ThemeProvider>
  );
}

export default HomePage;
