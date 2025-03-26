import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../../../pages/index';
import { act } from 'react-dom/test-utils';

// Mock the fetch function
global.fetch = jest.fn();

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('HomePage', () => {
  it('renders loading state initially', () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ quote: '', author: '' })
    ) as jest.Mock;
    render(<HomePage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('fetches and displays quote', async () => {
    const fakeQuote = { quote: 'Test Quote', author: 'Test Author' };

    // Mock fetch response
    global.fetch = jest.fn(() => Promise.resolve(fakeQuote) as jest.Mock;

    await act(async () => {
      render(<HomePage />);
    });

    const quoteElement = await screen.findByText(/Test Quote/i);
    expect(quoteElement).toBeInTheDocument();

    const authorElement = await screen.findByText(/Test Author/i);
    expect(authorElement).toBeInTheDocument();
  });

  it('renders error message on failed fetch', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Failed to fetch quote'))
    ) as jest.Mock;
    await act(async () => {
      render(<HomePage />);
    });
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch quote')).toBeInTheDocument();
    });
  });
});
