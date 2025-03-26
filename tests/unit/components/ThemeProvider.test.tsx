import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeProvider, { useTheme } from '../../../src/components/ThemeProvider';

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
  const setupMatchMedia = (matches: boolean) => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  };

  it('should initialize with system preference if no theme is stored - default dark theme', () => {
    setupMatchMedia(true); // Mock system preference as dark
    console.log('debug:', window.matchMedia('(prefers-color-scheme: dark)').matches);
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('should initialize with system preference if no theme is stored - default light theme', () => {
    setupMatchMedia(false); // Mock system preference as light
    console.log('debug:', window.matchMedia('(prefers-color-scheme: dark)').matches);
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('should toggle theme between light and dark', () => {
    setupMatchMedia(false); // Ensure initial state is light
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(screen.getByTestId('theme')).toHaveTextContent('light'); // Assuming system preference is light

    fireEvent.click(toggleButton);
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');

    fireEvent.click(toggleButton);
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });
});
