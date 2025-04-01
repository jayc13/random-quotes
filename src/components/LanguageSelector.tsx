import React from 'react';
import { FormControl, Select, MenuItem, OutlinedInput } from '@mui/material';
import { useLanguage } from '../context/LanguageContext';

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
        <MenuItem value="en">🇬🇧</MenuItem>
        <MenuItem value="es">🇪🇸</MenuItem>
        <MenuItem value="pt">🇵🇹</MenuItem>
        <MenuItem value="fr">🇫🇷</MenuItem>
        <MenuItem value="it">🇮🇹</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
