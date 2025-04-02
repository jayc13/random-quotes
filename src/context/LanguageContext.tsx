import React, { createContext, useState, useContext, useEffect } from 'react';
import en from '../translations/en.json';
import es from '../translations/es.json';
import pt from '../translations/pt.json';
import fr from '../translations/fr.json';
import it from '../translations/it.json';


export type LanguageType = 'en' | 'es' | 'pt' | 'fr' | 'it';

interface LanguageContextType {
  language: LanguageType;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  translate: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType|undefined>(undefined);

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState<LanguageType>('en'); // Default language is English
  const [translations, setTranslations] = useState(en); // Initialize with English translations

  const translate = (key: string) => translations[key] || key;

  useEffect(() => {
    switch (language) {
      case 'en':
        setTranslations(en);
        break;
      case 'es':
        setTranslations(es);
        break;
      case 'pt':
        setTranslations(pt);
        break;
      case 'fr':
        setTranslations(fr);
        break;
      case 'it':
        setTranslations(it);
        break;
      default:
        setTranslations(en);
    }
  }, [language]);

  const value = {
    language,
    setLanguage,
    translate,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;

export const useLanguage = () => {
  const langContext = useContext(LanguageContext);
  if (!langContext) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return langContext;
};
