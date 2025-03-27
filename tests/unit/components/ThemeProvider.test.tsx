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
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    const toggleButton = screen.getByTestId('theme-toggle-btn');
    expect(toggleButton).toHaveTextContent('🌜'); // Assert initial icon for dark theme
  });

  it('should initialize with system preference if no theme is stored - default light theme', () => {
    setupMatchMedia(false); // Mock system preference as light
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    const toggleButton = screen.getByTestId('theme-toggle-btn');
    expect(toggleButton).toHaveTextContent('🌞'); // Assert initial icon for light theme
  });

  it('should toggle theme between light and dark', () => {
    setupMatchMedia(false); // Ensure initial state is light
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('theme-toggle-btn');
    expect(screen.getByTestId('theme')).toHaveTextContent('light'); // Assuming system preference is light
    expect(toggleButton).toHaveTextContent('🌞'); // Assert initial icon for light theme

    fireEvent.click(toggleButton);
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(toggleButton).toHaveTextContent('🌜');

    fireEvent.click(toggleButton);
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(toggleButton).toHaveTextContent('🌞');
  });

  it('should initialize with stored theme from localStorage', () => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'dark'),
      },
      writable: true,
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('should remove event listener on unmount', () => {
    const removeEventListenerMock = jest.fn();
    const addEventListenerMock = jest.fn();
    setupMatchMedia(false); // Mock system preference as light initially

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: addEventListenerMock,
        removeEventListener: removeEventListenerMock,
        dispatchEvent: jest.fn(),
      })),
    });


    const { unmount } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));

    unmount();

    expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should handle system theme change to dark', () => {
    const setItemMock = jest.fn();
    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: setItemMock,
        getItem: jest.fn(),
      },
      writable: true,
    });

    const dispatchEventMock = jest.fn();
    setupMatchMedia(false); // Start with light theme
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: dispatchEventMock,
      })),
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Simulate system theme change to dark
  const event = new Event('change') as any;
  event.matches = true;
  // Ensure dispatchEventMock has been called before accessing its calls
  expect(dispatchEventMock).toHaveBeenCalled();
  dispatchEventMock.mock.calls[0][0](event);

  expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  expect(setItemMock).toHaveBeenCalledWith('theme', 'dark');
  });

  it('should handle system theme change to light', () => {
    const setItemMock = jest.fn();
    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: setItemMock,
        getItem: jest.fn(),
      },
      writable: true,
    });

    const dispatchEventMock = jest.fn();
    setupMatchMedia(true); // Start with dark theme
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: dispatchEventMock,
      })),
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Simulate system theme change to light
    const event = new Event('change') as any;
    event.matches = false;
    // Ensure dispatchEventMock has been called before accessing its calls
    expect(dispatchEventMock).toHaveBeenCalled();
    dispatchEventMock.mock.calls[0][0](event);

    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(setItemMock).toHaveBeenCalledWith('theme', 'light');
  });
});
