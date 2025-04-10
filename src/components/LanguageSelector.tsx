import React from 'react';
import {FormControl, MenuItem, OutlinedInput, Select} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useLanguage} from '../context/LanguageContext';

const LangItem = styled(MenuItem)(() => ({
  justifyContent: 'space-around',
}));

type LangWithFlags = {
  value: string;
  flag: string;
}

const LANGUAGES: LangWithFlags[] = [
  { value: 'en', flag: '🇬🇧' },
  { value: 'es', flag: '🇪🇸' },
  { value: 'de', flag: '🇩🇪' },
  { value: 'pt', flag: '🇵🇹' },
  { value: 'fr', flag: '🇫🇷' },
  { value: 'it', flag: '🇮🇹' },
];


const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <FormControl>
      <Select
        labelId="language-select-label"
        displayEmpty
        input={<OutlinedInput />}
        id="language-select"
        data-testid="language-select"
        value={language}
        label="Language"
        sx={{
          '& [role="combobox"]': {
            paddingX: '16px !important',
            width: '28px',
            textAlign: 'center',
          },
          svg: {display: 'none'}
        }}
        onChange={handleLanguageChange}
      >
        {LANGUAGES.map((lang) => (
          <LangItem key={lang.value} value={lang.value}>
            {lang.flag}
          </LangItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
