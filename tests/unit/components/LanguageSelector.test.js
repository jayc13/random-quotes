import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LanguageProvider from '../../src/context/LanguageContext';
import LanguageSelector from '../../src/components/LanguageSelector';

describe('LanguageSelector', () => {
  it('should render the language selector with the default language selected', () => {
    render(
      <LanguageProvider>
        <LanguageSelector />
      </LanguageProvider>
    );

    expect(screen.getByRole('combobox')).toHaveValue('en');
  });

  it('should update the selected language when a new language is selected', () => {
    render(
      <LanguageProvider>
        <LanguageSelector />
      </LanguageProvider>
    );

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'fr' } });

    expect(screen.getByRole('combobox')).toHaveValue('fr');
  });
});
