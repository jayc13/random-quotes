import React from 'react';
import { FormControl, Select, MenuItem, OutlinedInput } from '@mui/material';
import { useLanguage } from '../context/LanguageContext';
import {styled} from "@mui/material/styles";

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
        data-testId="language-select"
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
