import {createMocks} from 'node-mocks-http';
import handlerQuoteJSON from '../../pages/api/quote.ts';
import handlerQuoteSVG from '../../pages/api/quote.svg.ts';
import handlerCategories from '../../pages/api/categories.ts';

jest.mock('../../src/services/rate-limit.ts', () => {
  return jest.fn().mockImplementation(() => ({
    check: jest.fn().mockImplementation(() => {
      throw new Error('Rate limit exceeded');
    }),
  }));
});

describe('Rate Limit', () => {
  it('Quote API - returns 429 if rate limit exceeded', async () => {

    const { req, res } = createMocks({
      method: 'GET',
    });

    // Simulate rate limit exceeded
    await handlerQuoteJSON(req, res);

    expect(res._getStatusCode()).toBe(429);
    const data = JSON.parse(res._getData());
    expect(data.error).toBe('Rate limit exceeded');
  });

  it('Quote SVG - returns 429 if rate limit exceeded', async () => {

    const { req, res } = createMocks({
      method: 'GET',
    });

    // Simulate rate limit exceeded
    await handlerQuoteSVG(req, res);

    expect(res._getStatusCode()).toBe(429);
    const data: string = res._getData().toString();
    expect(data).toBe('Rate limit exceeded');
  });

  it('Categories - returns 429 if rate limit exceeded', async () => {

    const { req, res } = createMocks({
      method: 'GET',
    });

    // Simulate rate limit exceeded
    await handlerCategories(req, res);

    expect(res._getStatusCode()).toBe(429);
    const data = JSON.parse(res._getData());
    expect(data.error).toBe('Rate limit exceeded');
  });
});