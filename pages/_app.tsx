import ThemeProvider from '../src/providers/ThemeProvider.tsx';
import LanguageContext from '../src/context/LanguageContext';
import Index from './index';

export default function RandomQuotes() {
  return (
    <LanguageContext>
      <ThemeProvider>
        <Index/>
      </ThemeProvider>
    </LanguageContext>
  );
}