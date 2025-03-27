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
  });

  it('should initialize with system preference if no theme is stored - default light theme', () => {
    setupMatchMedia(false); // Mock system preference as light
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





  it('should have correct initial icon when system preference is dark', () => {
    setupMatchMedia(true); // Ensure initial state is dark
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('theme-toggle-btn');
    expect(screen.getByTestId('theme')).toHaveTextContent('dark'); // Assuming system preference is dark
    expect(toggleButton).toHaveTextContent('🌜'); // Assert initial icon for dark theme
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

  it('should return undefined when localStorage is not available', () => {
    const originalWindow = global.window;
    // @ts-expect-error - we are intentionally deleting window for testing purposes
    delete global.window;

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('light');

    global.window = originalWindow;
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
    dispatchEventMock.mock.calls[0][0](event);

    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(setItemMock).toHaveBeenCalledWith('theme', 'light');
  });

  it('should return correct icon for different themes', () => {
    const { result, rerender } = renderHook(() => useTheme(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider initialTheme="light">{children}</ThemeProvider>
      ),
    });
    expect(result.current.getThemeIcon()).toBe('🌞');

    rerender({ children: <></>, initialTheme: "dark"});
    expect(result.current.getThemeIcon()).toBe('🌜');
  });
});
