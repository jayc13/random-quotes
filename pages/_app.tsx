import ThemeProvider from '../src/providers/ThemeProvider.tsx';
import LanguageProvider from '../src/context/LanguageContext';
import Index from './index';

export default function RandomQuotes() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Index/>
      </ThemeProvider>
    </LanguageProvider>
  );
}