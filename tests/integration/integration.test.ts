import { createMocks } from 'node-mocks-http'
import handler from '../../pages/api/quote'; // Import your API route

describe('Integration Tests', () => {

  afterAll(() => {
    clearInterval(global.cleanupInterval);
  });
  
  it('should return a quote', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      url: '/api/quote',
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    console.log(res._getData());
    const data = JSON.parse(res._getData());
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
    const data = JSON.parse(res._getData());
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
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('error', `No quotes found for author: ${author}`);
  });

  it('should return 405 for non-GET requests', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      url: '/api/quote',
    });

    await handler(req, res);

    expect(res.statusCode).toBe(405);
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('error', 'Method Not Allowed');
  });
});

describe('GET /api/quote.svg', () => {
  it('should return a 200 status code and an SVG image without theme', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      url: '/api/quote.svg',
    });

    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.getHeader('Content-Type')).toBe('image/svg+xml');
  });

  it('should return a 200 status code and an SVG image with light theme', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      url: '/api/quote.svg?theme=light',
    });

    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.getHeader('Content-Type')).toBe('image/svg+xml');
    const svg = res._getData().toString();
    expect(svg).toContain('<rect fill="#f0f0f0"');
    expect(svg).toContain('<text fill="#333"');
    expect(svg).toContain('<text fill="#777"');
  });

  it('should return a 200 status code and an SVG image with dark theme', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      url: '/api/quote.svg?theme=dark',
    });

    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.getHeader('Content-Type')).toBe('image/svg+xml');
    const svg = res._getData().toString();
    expect(svg).toContain('<rect fill="#333"');
    expect(svg).toContain('<text fill="#f0f0f0"');
    expect(svg).toContain('<text fill="#ccc"');
  });
});
