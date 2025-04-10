import {createMocks} from 'node-mocks-http';
import handlerQuoteSVG from '../../pages/api/quote.svg.ts';


describe('GET /api/quote.svg', () => {

  afterAll(() => {
    clearInterval(globalThis.cleanupInterval);
  });


  it('should return 404 when author is not found', async () => {
    const author = 'Unknown Author';
    const {req, res} = createMocks({
      method: 'GET',
      url: `/api/quote.svg?author=${author}`,
    });

    await handlerQuoteSVG(req, res);

    expect(res.statusCode).toBe(404);
    const svg = res._getData();
    expect(svg).toContain(`No quotes found for author: ${author}`);
  });

  it('should return a 200 status code and an SVG image with default theme when no theme is provided', async () => {
    const {req, res} = createMocks({
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
    const {req, res} = createMocks({
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
    const {req, res} = createMocks({
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
    const {req, res} = createMocks({
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
    const {req, res} = createMocks({
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
    const {req, res} = createMocks({
      method: 'GET',
      url: `/api/quote.svg?theme=${theme}`,
    });

    await handlerQuoteSVG(req, res);
    expect(res.statusCode).toBe(200);
    const svg = res._getData();
    expect(svg).toContain('fill="#f0f0f0"'); // Default background color
    expect(svg).toContain('fill="#333"');    // Default text color
  });

  describe('Categories', () => {
    it('should return a quote from a specific category', async () => {
      const category = 'technology';
      const { req, res } = createMocks({
        method: 'GET',
        url: `/api/quote.svg?category=${category}`,
        query: {
          category
        }
      });

      await handlerQuoteSVG(req, res);
      expect(res.statusCode).toBe(200);
    });

    it('should return a quote by a specific author from a specific category', async () => {
      const author = 'Steve Jobs';
      const category = 'motivation';
      const { req, res } = createMocks({
        method: 'GET',
        url: `/api/quote.svg?author=${author}&category=${category}`,
        query: {
          author,
          category
        }
      });

      await handlerQuoteSVG(req, res);

      expect(res.statusCode).toBe(200);
      const svg = res._getData();
      expect(svg).toContain(author);
    });

    it('should return a 404 when the author doesn\'t exist from a specific category', async () => {
      const author = 'NonExistentAuthor';
      const category = 'motivation';
      const { req, res } = createMocks({
        method: 'GET',
        url: `/api/quote.svg?author=${author}&category=${category}`,
        query: {
          author,
          category
        }
      });

      await handlerQuoteSVG(req, res);

      expect(res.statusCode).toBe(404);
      const data = JSON.parse(res._getData());
      expect(data).toHaveProperty('error', `No quotes found for author: ${author}`);
    });

    it('should return a random category when category doesn\'t exist', async () => {
      const category = 'NonExistentCategory';
      const { req, res } = createMocks({
        method: 'GET',
        url: `/api/quote.svg?category=${category}`,
        query: {
          category
        }
      });

      await handlerQuoteSVG(req, res);

      expect(res.statusCode).toBe(200);
    });

    it('should return 404 when author is not found in the specific category', async () => {
      const author = 'Steve Jobs';
      const category = 'love';
      const { req, res } = createMocks({
        method: 'GET',
        url: `/api/quote.svg?author=${author}&category=${category}`,
        query: {
          author,
          category
        }
      });

      await handlerQuoteSVG(req, res);

      expect(res.statusCode).toBe(404);
      const svg = res._getData();
      expect(svg).toContain(`No quotes found for author: ${author}`);
    });
  });
});
