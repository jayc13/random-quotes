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
import CategorySelector from '../src/components/CategorySelector'; // Import CategorySelector
import LanguageProvider, { useLanguage } from '../src/context/LanguageContext';
import LanguageSelector from '../src/components/LanguageSelector';

type Quote = {
  quote: string;
  author: string;
  error?: string;
};

const MainContainer = styled("div")(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  width: '100vw',
  fontFamily: 'sans-serif',
  backgroundColor: 'background.default',
  color: 'secondary.contrastText',
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
  const [selectedCategory, setSelectedCategory] = useState('');
  const { translate } = useLanguage();

  async function fetchNewQuote(category?: string) {
    setLoading(true);
    try {
      let url = '/api/quote';
      if (category) {
        url += `?category=${category}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(translate('Failed to fetch quote'));
      }
      const data = await response.json();
      setQuote(data);
    } catch {
      setQuote({quote: '', author: '', error: translate('Failed to fetch quote. Please try again')});
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNewQuote().then();
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    fetchNewQuote(categoryId).then();
  };

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    toast.success(translate('Quote copied!'), {
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
    <LanguageProvider>
      <Head>
        <title>{translate("Quote of the Day")}</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <MainContainer>
        <Box sx={{ position: 'absolute', top: '20px', left: '20px' }}>
          <LanguageSelector />
        </Box>
        <CategorySelectorContainer>
          <CategorySelector onChange={handleCategoryChange}/>
        </CategorySelectorContainer>
        {
          loading && <Loading/>
        }
        {
          !loading &&
          <QuoteContainer>
            {(!quote || quote.error) ? (
              <ErrorMessage id="error">
                {/* Display error from quote object, if available, otherwise use translation */}
                {quote?.error || translate("Failed to fetch quote. Please try again")}
              </ErrorMessage>
            ) : (
              <>
                <Tagline>{translate("Your daily dose of inspiration.")}</Tagline>
                <Box
                  sx={{
                    position: 'relative'
                  }}>
                  <Tooltip title={translate("Copy quote")} placement="top" arrow>
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
        <Tooltip title={loading ? '' : translate('Refresh quote')} placement="right" arrow>
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
    </LanguageProvider>
  );
}

export default HomePage;
