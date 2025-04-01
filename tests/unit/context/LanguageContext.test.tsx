import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LanguageProvider, { useLanguage } from '../../../src/context/LanguageContext';

const TestComponent = () => {
  const { language, setLanguage, translate } = useLanguage();
  return (
    <div>
      <p data-testid="language">{language}</p>
      <button onClick={() => setLanguage('fr')} data-testid="set-language-fr">Set to French</button>
      <p data-testid="translated-text">{translate('Quote of the Day')}</p>
    </div>
  );
};

describe('LanguageContext', () => {
  it('should provide the default language and translations', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('language')).toHaveTextContent('en');
    expect(screen.getByTestId('translated-text')).toHaveTextContent('Quote of the Day');
  });

  it('should update the language and translations when setLanguage is called', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    fireEvent.click(screen.getByTestId('set-language-fr'));

    expect(screen.getByTestId('language')).toHaveTextContent('fr');
    expect(screen.getByTestId('translated-text')).toHaveTextContent('Citation du Jour');
  });

  it('should return the key if translation is not found', () => {

    const TestComponent = () => {
      const { translate } = useLanguage();
      return (
        <div>
          <p data-testid="translated-text">{translate('nonExistentKey')}</p>
        </div>
      );
    }

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('translated-text')).toHaveTextContent('nonExistentKey');
  });
});
