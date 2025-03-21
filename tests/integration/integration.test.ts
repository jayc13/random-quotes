import { createMocks } from 'node-mocks-http'
import handler from '../../src/pages/api/quote'; // Import your API route

describe('Integration Tests', () => {
  it('should return a quote', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      url: '/api/quote',
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data).toHaveProperty('quote');
    expect(typeof data.quote).toBe('string');
    expect(data).toHaveProperty('author');
    expect(typeof data.author).toBe('string');
  });

  it('should return a quote by a specific author', async () => {
    const author = 'Steve Jobs';
    const { req, res } = createMocks({
      method: 'GET',
      url: `/api/quote?author=${author}`,
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data).toHaveProperty('quote');
    expect(typeof data.quote).toBe('string');
    expect(data).toHaveProperty('author');
    expect(data.author).toBe(author);
  });

  it('should return 404 when author is not found', async () => {
    const author = 'Unknown Author';
    const { req, res } = createMocks({
      method: 'GET',
      url: `/api/quote?author=${author}`,
    });

    await handler(req, res);

    expect(res.statusCode).toBe(404);
    const data = res._getJSONData();
    expect(data).toHaveProperty('error', `No quotes found for author: ${author}`);
  });

  it('should return 405 for non-GET requests', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      url: '/api/quote',
    });

    await handler(req, res);

    expect(res.statusCode).toBe(405);
    const data = res._getJSONData();
    expect(data).toHaveProperty('error', 'Method Not Allowed');
  });
});
