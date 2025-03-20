import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../pages/index';

describe('HomePage', () => {
  it('renders without errors and displays loading message', () => {
    render(<HomePage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  // Add more tests here

  it('displays the quote and author after fetching data', async () => {
    const mockQuote = { quote: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' };
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockQuote),
    } as Response);

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText(mockQuote.quote)).toBeInTheDocument();
      expect(screen.getByText(`- ${mockQuote.author}`)).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  it('applies basic styling', async () => {
    const mockQuote = { quote: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' };
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockQuote),
    } as Response);

    render(<HomePage />);

    await waitFor(() => {
      const quoteElement = screen.querySelector('p[style*="font-size: 1.5em"][style*="font-style: italic"]');
      const authorElement = screen.querySelector('p[style*="font-size: 1.2em"][style*="color: #555"]');

      expect(quoteElement).toBeInTheDocument();
      expect(authorElement).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });
});
