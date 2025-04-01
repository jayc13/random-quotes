import React, { createContext, useState, useContext, useEffect } from 'react';
import en from '../translations/en.json';
import es from '../translations/es.json';
import pt from '../translations/pt.json';
import fr from '../translations/fr.json';
import it from '../translations/it.json';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default language is English
  const [translations, setTranslations] = useState(en); // Initialize with English translations

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

  const translate = (key) => translations[key] || key;

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
