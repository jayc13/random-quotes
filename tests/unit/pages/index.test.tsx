import React, {act} from 'react';
import {
  cleanup,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../../../pages/index';


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

const delay = (durationMs: number) => {
  return new Promise(resolve => setTimeout(resolve, durationMs));
}

describe('HomePage', () => {
  let writeTextMock: jest.SpyInstance;

  beforeAll(() => {
    // Mock the navigator.clipboard object
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn()
      }
    });
    writeTextMock = jest.spyOn(navigator.clipboard, 'writeText');
    jest.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    // Restore the mock
    writeTextMock.mockRestore();
  });

  it('renders loading state initially', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => {
          await delay(5 * 1000);
          return {quote: '', author: ''};
        }
      })
    ) as jest.Mock;

    await act(async () => {
      render(<HomePage/>);
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    jest.runAllTimers();
  });

  it('fetches and displays quote', async () => {
    const fakeQuote = {quote: 'Test Quote', author: 'Test Author'};

    jest
      .spyOn(global, 'fetch')
      .mockImplementation((url) => {
        if (url === '/api/categories') return {
          ok: true,
          json: () => Promise.resolve([])
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(fakeQuote)
        })
      });

    await act(async () => {
      render(<HomePage/>);
    });

    jest.runAllTimers();

    const quoteElement = await screen.findByText(/Test Quote/i);
    expect(quoteElement).toBeInTheDocument();

    const authorElement = await screen.findByText(/Test Author/i);
    expect(authorElement).toBeInTheDocument();
  });

  it('renders error message on failed fetch', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockImplementation((url) => {
        if (url === '/api/categories') return {
          ok: true,
          json: () => Promise.resolve([])
        }
        return Promise.resolve({
          ok: false,
          json: () => Promise.reject(new Error('Failed to fetch quote.'))
        })
      });

    await act(async () => {
      render(<HomePage/>);
    });

    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch quote. Please try again')).toBeInTheDocument();
    });
  });

  it('copies quote to clipboard on button click', async () => {
    const mockQuote = {quote: 'Test Quote', author: 'Test Author'};

    jest
      .spyOn(global, 'fetch')
      .mockImplementation((url) => {
        if (url === '/api/categories') return {
          ok: true,
          json: () => Promise.resolve([])
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockQuote)
        })
      });

    await act(async () => {
      render(<HomePage/>);
    });

    jest.runAllTimers();
    const copyButton = screen.getByTestId('copy-quote-btn');

    await act(async () => {
      fireEvent.click(copyButton);
    });

    await waitFor(() => {

      expect(writeTextMock).toHaveBeenCalledWith(`"${mockQuote.quote}" - ${mockQuote.author}`);
    });
  });
  it('fetches and displays a new quote on button click', async () => {
    const initialQuote = {quote: 'Initial Quote', author: 'Initial Author'};
    const newQuote = {quote: 'New Quote', author: 'New Author'};

    const quotes = [initialQuote, newQuote];

    let index = 0;

    jest
      .spyOn(global, 'fetch')
      .mockImplementation((url) => {
        if (url === '/api/categories') return {
          ok: true,
          json: () => Promise.resolve([])
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(quotes[index++])
        })
      });

    await act(async () => {
      render(<HomePage/>);
    });

    jest.runAllTimers();

    const initialQuoteElement = await screen.findByText(/Initial Quote/i);
    const initialAuthorElement = await screen.findByText(/Initial Author/i);

    expect(initialQuoteElement).toBeInTheDocument();
    expect(initialAuthorElement).toBeInTheDocument();

    const newQuoteButton = screen.getByTestId('refresh-quote-btn');

    fireEvent.click(newQuoteButton);

    jest.runAllTimers();
    jest.advanceTimersByTime(5000);

    await waitForElementToBeRemoved(() => screen.getByText('Loading...'), {timeout: 5000});

    const newQuoteElement = await screen.findByText(/New Quote/i);
    const newAuthorElement = await screen.findByText(/New Author/i);

    expect(newQuoteElement).toBeInTheDocument();
    expect(newAuthorElement).toBeInTheDocument();
  });
});
