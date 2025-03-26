import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../../pages/index';

// Mock the fetch function
global.fetch = jest.fn();

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
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

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', {
      name: /hello/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('renders loading state initially', () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: { quote: '', author: '' },
      }),
    ) as jest.Mock;
    render(<Home />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders quote and author on successful fetch', async () => {
    const mockQuote = { quote: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: mockQuote,
      }),
    ) as jest.Mock;
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText(mockQuote.quote)).toBeInTheDocument();
      expect(screen.getByText(`- ${mockQuote.author}`)).toBeInTheDocument();
    });
  });

  it('renders error message on failed fetch', async () => {
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => new Error('Failed to fetch quote'),
      }),
    ) as jest.Mock;
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch quote')).toBeInTheDocument();
    });
  });
});
