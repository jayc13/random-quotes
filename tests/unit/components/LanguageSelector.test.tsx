import React from 'react';
import {render, screen, fireEvent, within} from '@testing-library/react';
import '@testing-library/jest-dom';
import LanguageProvider, {useLanguage} from '../../../src/context/LanguageContext';
import LanguageSelector from '../../../src/components/LanguageSelector';

describe('LanguageSelector', () => {
  it('should render the language selector with the default language selected', () => {
    render(
      <LanguageProvider>
        <LanguageSelector />
      </LanguageProvider>
    );

    expect(screen.getByRole('combobox')).toHaveTextContent('🇬🇧');
  });

  it.each([
    [1, 'es', '🇪🇸'],
    [2, 'de', '🇩🇪'],
    [3, 'pt', '🇵🇹'],
    [4, 'fr', '🇫🇷'],
    [5, 'it', '🇮🇹'],
    [0, 'en', '🇬🇧'],
  ])('should update the selected language when a new language is selected', (index: number, lang: string, flag: string) => {
    const TestComponent = () => {
      const { language } = useLanguage();
      return (
        <div>
          <p data-testid="language">{language}</p>
        </div>
      );
    };

    render(
      <LanguageProvider>
        <TestComponent />
        <LanguageSelector />
      </LanguageProvider>
    );

    const languageSelect = screen.getByTestId('language-select');

    const combobox = within(languageSelect).getByRole('combobox');
    fireEvent.mouseDown(combobox);

    const options = screen.getAllByRole('option');

    fireEvent.click(options[index]);

    expect(screen.getByTestId('language')).toHaveTextContent(lang);

    expect(screen.getByRole('combobox')).toHaveTextContent(flag);
  });
});
