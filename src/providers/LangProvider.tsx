import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import IconButton from '@mui/material/IconButton';
import { Tooltip } from '@mui/material';

type Language = 'en' | 'es' | 'fr' | 'auto';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children?: ReactNode;
}

const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('auto');

  const getBrowserLanguage = (): Language => {
    if (typeof navigator === 'undefined') return 'en';

    const browserLang = navigator.language.split('-')[0];
    return (['en', 'es', 'fr'].includes(browserLang) ? browserLang : 'en') as Language;
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as Language;
    setLanguage(storedLanguage || 'auto');
  }, []);

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => {
      const languageTransitions: { [key in Language]: Language } = {
        en: 'es',
        es: 'fr',
        fr: 'auto',
        auto: 'en',
      };
      const newLanguage = languageTransitions[prevLanguage];
      localStorage.setItem('language', newLanguage);
      return newLanguage;
    });
  };

  const getLanguageIcon = () => {
    const icons = {
      en: '🇬🇧',
      es: '🇪🇸',
      fr: '🇫🇷',
      auto: '🌐',
    };
    return icons[language];
  };

  const handleSetLanguage = (lang: Language) => {
    localStorage.setItem('language', lang);
    setLanguage(lang);
  };

  const currentLanguage = language === 'auto' ? getBrowserLanguage() : language;

  return (
    <LanguageContext.Provider
      value={{
        language: currentLanguage,
        toggleLanguage,
        setLanguage: handleSetLanguage
      }}
    >
      {children}
      <Tooltip title="Change language" placement="left" arrow>
        <IconButton

          onClick={toggleLanguage}
          sx={{ position: 'fixed', bottom: 16, right: 70 }}
          data-testid="language-toggle-btn"
        >
          {getLanguageIcon()}
        </IconButton>
      </Tooltip>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const languageContext = useContext(LanguageContext);
  if (!languageContext) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return languageContext;
};

export default LanguageProvider;