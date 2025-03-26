import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeProvider from '../../../src/components/ThemeProvider';

const TestComponent: React.FC = () => {
  return (
    <div>
      <span data-testid="theme">{document.body.classList.contains('dark') ? 'dark' : 'light'}</span>
      <button onClick={() => document.body.classList.toggle('dark', !document.body.classList.contains('dark'))}>
        Toggle Theme
      </button>
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

  it('should initialize with system preference if no theme is stored', () => {
    setupMatchMedia(true);
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');

    setupMatchMedia(false);
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('should toggle theme between light and dark', () => {
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
