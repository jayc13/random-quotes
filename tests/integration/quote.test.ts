import {createMocks} from 'node-mocks-http'
import handlerQuoteJSON from '../../pages/api/quote.ts'; // Import your API route


declare global {
  const requestCounts: Map<string, number[]> | undefined;
  const cleanupInterval: NodeJS.Timeout;
}


describe('GET /api/quote', () => {

  afterAll(() => {
    clearInterval(globalThis.cleanupInterval);
  });

  it('should return a quote', async () => {
    const {req, res} = createMocks({
      method: 'GET',
      url: '/api/quote',
    });

    await handlerQuoteJSON(req, res);

    expect(res.statusCode).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('quote');
    expect(typeof data.quote).toBe('string');
    expect(data).toHaveProperty('author');
    expect(typeof data.author).toBe('string');
  });

  it('should return a quote by a specific author', async () => {
    const author = 'Steve Jobs';
    const {req, res} = createMocks({
      method: 'GET',
      url: `/api/quote?author=${author}`,
    });

    await handlerQuoteJSON(req, res);

    expect(res.statusCode).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('quote');
    expect(typeof data.quote).toBe('string');
    expect(data).toHaveProperty('author');
    expect(data.author).toBe(author);
  });

  it('should return 404 when author is not found', async () => {
    const author = 'Unknown Author';
    const {req, res} = createMocks({
      method: 'GET',
      url: `/api/quote?author=${author}`,
    });

    await handlerQuoteJSON(req, res);

    expect(res.statusCode).toBe(404);
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('error', `No quotes found for author: ${author}`);
  });

  it('should return 405 for non-GET requests', async () => {
    const {req, res} = createMocks({
      method: 'POST',
      url: '/api/quote',
    });

    await handlerQuoteJSON(req, res);

    expect(res.statusCode).toBe(405);
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('error', 'Method Not Allowed');
  });
});
