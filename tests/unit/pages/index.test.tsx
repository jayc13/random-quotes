describe('HomePage', () => {
  it('renders loading state initially', () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ quote: '', author: '' })
      })
    ) as jest.Mock;
    render(<HomePage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('fetches and displays quote', async () => {
    const fakeQuote = { quote: 'Test Quote', author: 'Test Author' };

    // Mock fetch response to include ok: true
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(fakeQuote)
      })
    ) as jest.Mock;

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
      Promise.resolve({
        ok: false,
        json: () => Promise.reject(new Error('Failed to fetch quote'))
      })
    ) as jest.Mock;

    await act(async () => {
      render(<HomePage />);
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch quote')).toBeInTheDocument();
    });
  });
});
