import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <FormControl>
      <InputLabel id="language-select-label">Language</InputLabel>
      <Select
        labelId="language-select-label"
        id="language-select"
        value={language}
        label="Language"
        onChange={handleLanguageChange}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="es">Spanish</MenuItem>
        <MenuItem value="pt">Portuguese</MenuItem>
        <MenuItem value="fr">French</MenuItem>
        <MenuItem value="it">Italian</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
