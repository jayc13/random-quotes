import React, {act} from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MediaQueryListEvent} from "mock-match-media";
import ThemeProvider, { useTheme } from '../../../src/providers/ThemeProvider.tsx';
import LanguageProvider from '../../../src/context/LanguageContext.tsx';

const TestComponent: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeProvider', () => {

  it('should throw error if useTheme is used outside of ThemeProvider', () => {
    expect(() => render(<TestComponent />)).toThrow("useTheme must be used within a ThemeProvider");
  });

  it('should provide theme context when used within ThemeProvider', () => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      dispatchEvent: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    render(
      <LanguageProvider>
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      </LanguageProvider>
    );

    const themeElement = screen.getByTestId('theme');
    expect(themeElement).toBeInTheDocument();
  });

  it('should initialize with system preference if no theme is stored - default light theme', () => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      dispatchEvent: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    render(
      <LanguageProvider>
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      </LanguageProvider>
    );

    const themeToggleBtn = screen.getByTestId('theme-toggle-btn');
    expect(themeToggleBtn).toHaveTextContent('🖥️');
  });

  it('should initialize with stored theme from localStorage - light theme', () => {
    localStorage.setItem('theme', 'light');

    render(
      <LanguageProvider>
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      </LanguageProvider>
    );

    const themeToggleBtn = screen.getByTestId('theme-toggle-btn');
    expect(themeToggleBtn).toHaveTextContent('🌞');
  });

  it('should initialize with stored theme from localStorage - dark theme', () => {
    localStorage.setItem('theme', 'dark');

    render(
      <LanguageProvider>
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      </LanguageProvider>
    );

    const themeToggleBtn = screen.getByTestId('theme-toggle-btn');
    expect(themeToggleBtn).toHaveTextContent('🌜');
  });

  it('should toggle theme between light and dark', () => {
    render(
      <LanguageProvider>
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      </LanguageProvider>
    );

    const themeToggleBtn = screen.getByTestId('theme-toggle-btn');
    expect(themeToggleBtn).toHaveTextContent('🌜');

    fireEvent.click(themeToggleBtn);
    expect(themeToggleBtn).toHaveTextContent('🖥️');

    fireEvent.click(themeToggleBtn);
    expect(themeToggleBtn).toHaveTextContent('🌞');

    fireEvent.click(themeToggleBtn);
    expect(themeToggleBtn).toHaveTextContent('🌜');
  });

  it('should remove event listener on unmount', () => {
    const removeEventListenerMock = jest.fn();
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      addEventListener: jest.fn(),
      removeEventListener: removeEventListenerMock,
    }));

    const { unmount } = render(
      <LanguageProvider>
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      </LanguageProvider>
    );

    unmount();
    expect(removeEventListenerMock).toHaveBeenCalled();
  });

  it('should update theme when system theme changes to light', async () => {
    localStorage.removeItem('theme');

    let mockListener: (e: MediaQueryListEvent) => void;

    const mockAddEventListener = (eventName: string, callback: (e: MediaQueryListEvent) => void) => {
      mockListener = callback;
    };

    Object.defineProperty(window, 'matchMedia', {
      value: () => {
        return {
          matches: false,
          addEventListener: mockAddEventListener,
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        };
      }
    })

    await act(async () => {
      render(
        <LanguageProvider>
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        </LanguageProvider>
      );
    });

    const themeToggleBtn = screen.getByTestId('theme-toggle-btn');

    expect(themeToggleBtn).toHaveTextContent('🖥️');

    act(() => {
      mockListener(new MediaQueryListEvent("change", {matches: false}));
    });

    expect(themeToggleBtn).toHaveTextContent('🌞');

  });
  it('should update theme when system theme changes to dark', async () => {
    localStorage.removeItem('theme');

    let mockListener: (e: MediaQueryListEvent) => void;

    const mockAddEventListener = (eventName: string, callback: (e: MediaQueryListEvent) => void) => {
      mockListener = callback;
    };

    Object.defineProperty(window, 'matchMedia', {
      value: () => {
        return {
          matches: false,
          addEventListener: mockAddEventListener,
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        };
      }
    })

    await act(async () => {
      render(
        <LanguageProvider>
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        </LanguageProvider>
      );
    });

    const themeToggleBtn = screen.getByTestId('theme-toggle-btn');

    expect(themeToggleBtn).toHaveTextContent('🖥️');

    act(() => {
      mockListener(new MediaQueryListEvent("change", { matches: true }));
    });

    expect(themeToggleBtn).toHaveTextContent('🌜');
  });
  it('system default theme is dark', async () => {
    localStorage.removeItem('theme');
    Object.defineProperty(window, 'matchMedia', {
      value: () => {
        return {
          matches: true,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        };
      }
    })

    await act(async () => {
      render(
        <LanguageProvider>
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        </LanguageProvider>
      );
    });

    const themeToggleBtn = screen.getByTestId('theme-toggle-btn');

    expect(themeToggleBtn).toHaveTextContent('🖥️');
  });
  it('system default theme is light', async () => {
    localStorage.removeItem('theme');
    Object.defineProperty(window, 'matchMedia', {
      value: () => {
        return {
          matches: false,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        };
      }
    })

    await act(async () => {
      render(
        <LanguageProvider>
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        </LanguageProvider>
      );
    });

    const themeToggleBtn = screen.getByTestId('theme-toggle-btn');

    expect(themeToggleBtn).toHaveTextContent('🖥️');
  });
});