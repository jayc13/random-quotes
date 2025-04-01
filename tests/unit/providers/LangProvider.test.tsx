import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LanguageProvider, { useLanguage } from '../../../src/providers/LangProvider';

describe('LanguageProvider', () => {
  const originalLocalStorage = window.localStorage;
  let mockLocalStorage: { [key: string]: string } = {};

  beforeAll(() => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key) => mockLocalStorage[key] || null),
        setItem: jest.fn((key, value) => {
          mockLocalStorage[key] = value;
        }),
        removeItem: jest.fn((key) => {
          delete mockLocalStorage[key];
        }),
        clear: jest.fn(() => {
          mockLocalStorage = {};
        }),
      },
      writable: true,
    });

    // Mock navigator
    Object.defineProperty(window, 'navigator', {
      value: {
        language: 'en-US',
      },
      writable: true,
    });
  });

  afterEach(() => {
    mockLocalStorage = {};
    jest.clearAllMocks();
  });

  afterAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
    });
  });

  it('renders language toggle button with correct icon', () => {
    render(<LanguageProvider />);
    const toggleButton = screen.getByTestId('language-toggle-btn');
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton.textContent).toBe('🌐');
  });

  it('loads language from localStorage', () => {
    mockLocalStorage = { language: 'fr' };
    render(<LanguageProvider />);
    const toggleButton = screen.getByTestId('language-toggle-btn');
    expect(toggleButton.textContent).toBe('🇫🇷');
  });

  it('defaults to auto when localStorage is empty', () => {
    render(<LanguageProvider />);
    const toggleButton = screen.getByTestId('language-toggle-btn');
    expect(toggleButton.textContent).toBe('🌐');
  });

  it('toggles language correctly on button click', () => {
    render(<LanguageProvider />);
    const toggleButton = screen.getByTestId('language-toggle-btn');

    // Auto -> English
    act(() => {
      fireEvent.click(toggleButton);
    });
    expect(toggleButton.textContent).toBe('🇬🇧');
    expect(localStorage.setItem).toHaveBeenCalledWith('language', 'en');

    // English -> Spanish
    act(() => {
      fireEvent.click(toggleButton);
    });
    expect(toggleButton.textContent).toBe('🇪🇸');
    expect(localStorage.setItem).toHaveBeenCalledWith('language', 'es');

    // Spanish -> French
    act(() => {
      fireEvent.click(toggleButton);
    });
    expect(toggleButton.textContent).toBe('🇫🇷');
    expect(localStorage.setItem).toHaveBeenCalledWith('language', 'fr');

    // French -> Auto
    act(() => {
      fireEvent.click(toggleButton);
    });
    expect(toggleButton.textContent).toBe('🌐');
    expect(localStorage.setItem).toHaveBeenCalledWith('language', 'auto');
  });

  it('uses browser language when set to auto', () => {
    // Set browser language to Spanish
    Object.defineProperty(window, 'navigator', {
      value: { language: 'es-ES' },
      writable: true,
    });

    mockLocalStorage = { language: 'auto' };

    const TestComponent = () => {
      const { language } = useLanguage();
      return <div data-testid="current-language">{language}</div>;
    };

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('current-language').textContent).toBe('es');
  });

  it('allows language to be set directly', () => {
    const TestComponent = () => {
      const { setLanguage } = useLanguage();
      return <button data-testid="set-lang-button" onClick={() => setLanguage('fr')}>Set Language</button>;
    };

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('set-lang-button'));
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('language', 'fr');
  });

  it('falls back to English for unsupported browser languages', () => {
    Object.defineProperty(window, 'navigator', {
      value: { language: 'de-DE' },
      writable: true,
    });

    mockLocalStorage = { language: 'auto' };

    const TestComponent = () => {
      const { language } = useLanguage();
      return <div data-testid="current-language">{language}</div>;
    };

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('current-language').textContent).toBe('en');
  });
});