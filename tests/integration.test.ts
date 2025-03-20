import { createHandler } from 'next-test-api-route-handler';
import handler from '../pages/api/quote.ts'; // Import your API route

describe('Integration Tests', () => {
  it('should return a quote', async () => {
    const { req, res } = createHandler({
      handler,
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
    const { req, res } = createHandler({
      handler,
      url: `/api/quote?author=${author}`,
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data).toHaveProperty('quote');
    expect(typeof data.quote).toBe('string');
    expect(data).toHaveProperty('author', author);
  });

  it('should return a random quote when author is not found', async () => {
    const author = 'Unknown Author';
    const { req, res } = createHandler({
      handler,
      url: `/api/quote?author=${author}`,
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data).toHaveProperty('quote');
    expect(typeof data.quote).toBe('string');
    expect(data).toHaveProperty('author');
    expect(typeof data.author).toBe('string');
  });
});
