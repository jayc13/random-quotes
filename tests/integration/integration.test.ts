import { createMocks } from 'node-mocks-http'
import handlerQuoteJSON from '../../pages/api/quote.ts'; // Import your API route
import handlerQuoteSVG from '../../pages/api/quote.svg.ts'; // Import your API route

describe('Integration Tests', () => {

  afterAll(() => {
    clearInterval(global.cleanupInterval);
  });
  
  describe('GET /api/quote', () => {
    it('should return a quote', async () => {
      const { req, res } = createMocks({
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
      const { req, res } = createMocks({
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
      const { req, res } = createMocks({
        method: 'GET',
        url: `/api/quote?author=${author}`,
      });
  
      await handlerQuoteJSON(req, res);
  
      expect(res.statusCode).toBe(404);
      const data = JSON.parse(res._getData());
      expect(data).toHaveProperty('error', `No quotes found for author: ${author}`);
    });
  
    it('should return 405 for non-GET requests', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        url: '/api/quote',
      });
  
      await handlerQuoteJSON(req, res);
  
      expect(res.statusCode).toBe(405);
      const data = JSON.parse(res._getData());
      expect(data).toHaveProperty('error', 'Method Not Allowed');
    });
  });

  describe('GET /api/quote.svg', () => {
    it('should return a 200 status code and an SVG image with default theme when no theme is provided', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/quote.svg',
      });
  
      await handlerQuoteSVG(req, res);
      expect(res.statusCode).toBe(200);
      const svg = res._getData();
      expect(svg).toContain('fill="#f0f0f0"'); // Default background color
      expect(svg).toContain('fill="#333"');    // Default text color
    });
  
    it('should return a 200 status code and an SVG image with light theme', async () => {
      const theme = 'light';
      const { req, res } = createMocks({
        method: 'GET',
        url: `/api/quote.svg?theme=${theme}`,
      });
   
      await handlerQuoteSVG(req, res);
      expect(res.statusCode).toBe(200);
      const svg = res._getData();
      expect(svg).toContain('fill="#f0f0f0"'); // Light background color
      expect(svg).toContain('fill="#333"');    // Light quote text color
      expect(svg).toContain('fill="#777"');    // Light author text color
    });
  
    it('should return a 200 status code and an SVG image with dark theme', async () => {
      const theme = 'dark';
      const { req, res } = createMocks({
        method: 'GET',
        url: `/api/quote.svg?theme=${theme}`,
      });
  
      await handlerQuoteSVG(req, res);
      expect(res.statusCode).toBe(200);
      const svg = res._getData();
      expect(svg).toContain('fill="#333"'); // Dark background color
      expect(svg).toContain('fill="#f0f0f0"');    // Dark quote text color
      expect(svg).toContain('fill="#f0f0f0"');    // Dark author text color
    });
  
    it('should return a 200 status code and an SVG image with default theme for invalid theme', async () => {
      const theme = 'invalid-theme';
      const { req, res } = createMocks({
        method: 'GET',
        url: `/api/quote.svg?theme=${theme}`,
      });
  
      await handlerQuoteSVG(req, res);
      expect(res.statusCode).toBe(200);
      const svg = res._getData();
      expect(svg).toContain('fill="#f0f0f0"'); // Default background color
      expect(svg).toContain('fill="#333"');    // Default text color
    });
  
    it('should return a 200 status code and an SVG image with default theme for empty theme', async () => {
      const theme = '';
      const { req, res } = createMocks({
        method: 'GET',
        url: `/api/quote.svg?theme=${theme}`,
      });
  
      await handlerQuoteSVG(req, res);
      expect(res.statusCode).toBe(200);
      const svg = res._getData();
      expect(svg).toContain('fill="#f0f0f0"'); // Default background color
      expect(svg).toContain('fill="#333"');    // Default text color
    });
  
    it('should return a 200 status code and an SVG image with default theme for theme with numbers', async () => {
      const theme = '123';
      const { req, res } = createMocks({
        method: 'GET',
        url: `/api/quote.svg?theme=${theme}`,
      });
  
      await handlerQuoteSVG(req, res);
      expect(res.statusCode).toBe(200);
      const svg = res._getData();
      expect(svg).toContain('fill="#f0f0f0"'); // Default background color
      expect(svg).toContain('fill="#333"');    // Default text color
    });
  });
});
