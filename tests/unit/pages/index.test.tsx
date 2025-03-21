import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../../pages/index';

// Mock the fetch function
global.fetch = jest.fn();

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', {
      name: /hello/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('renders loading state initially', () => {
    fetch.mockReturnValueOnce({
      json: async () => ({ quote: '', author: '' }),
    });
    render(<Home />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders quote and author on successful fetch', async () => {
    const mockQuote = { quote: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' };
    fetch.mockReturnValueOnce({
      json: async () => mockQuote,
    });
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText(mockQuote.quote)).toBeInTheDocument();
      expect(screen.getByText(`- ${mockQuote.author}`)).toBeInTheDocument();
    });
  });

  it('renders error message on failed fetch', async () => {
    fetch.mockReturnValueOnce(new Error('Failed to fetch quote'));
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch quote')).toBeInTheDocument();
    });
  });
});
