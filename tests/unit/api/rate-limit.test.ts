import rateLimit from '../../../pages/api/rate-limit';
import { NextApiRequest, NextApiResponse } from 'next';

describe('Rate Limiting', () => {
  it('should allow requests within the limit', async () => {
    const limiter = rateLimit({
      interval: 1000, // 1 second
      uniqueTokenPerInterval: 2, // 2 requests per second
    });

    const req = {
      headers: {
        'x-forwarded-for': '127.0.0.1',
      },
      socket: {
        remoteAddress: '127.0.0.1',
      },
    } as NextApiRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      end: jest.fn(),
    } as unknown as NextApiResponse;

    // First request should be allowed
    await limiter.check(req, res);
    expect(res.status).not.toHaveBeenCalledWith(429);
    expect(res.end).not.toHaveBeenCalledWith('Rate limit exceeded');

    // Second request should also be allowed
    await limiter.check(req, res);
    expect(res.status).not.toHaveBeenCalledWith(429);
    expect(res.end).not.toHaveBeenCalledWith('Rate limit exceeded');
  });

  it('should reject requests exceeding the limit', async () => {
    const limiter = rateLimit({
      interval: 1000, // 1 second
      uniqueTokenPerInterval: 1, // 1 request per second
    });

    const req = {
      headers: {
        'x-forwarded-for': '127.0.0.1',
      },
      socket: {
        remoteAddress: '127.0.0.1',
      },
    } as NextApiRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      end: jest.fn(),
    } as unknown as NextApiResponse;

    // First request should be allowed
    await limiter.check(req, res);
    expect(res.status).not.toHaveBeenCalledWith(429);
    expect(res.end).not.toHaveBeenCalledWith('Rate limit exceeded');

    // Second request should be rejected
    await limiter.check(req, res);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.end).toHaveBeenCalledWith('Rate limit exceeded');
  });

  it('should apply rate limits separately for different IP addresses', async () => {
    const limiter = rateLimit({
      interval: 1000, // 1 second
      uniqueTokenPerInterval: 1, // 1 request per second
    });

    const req1 = {
      headers: {
        'x-forwarded-for': '192.168.1.1',
      },
      socket: {
        remoteAddress: '192.168.1.1',
      },
    } as NextApiRequest;

    const req2 = {
      headers: {
        'x-forwarded-for': '192.168.1.2',
      },
      socket: {
        remoteAddress: '192.168.1.2',
      },
    } as NextApiRequest;

    const res1 = {
      status: jest.fn().mockReturnThis(),
      end: jest.fn(),
    } as unknown as NextApiResponse;

    const res2 = {
      status: jest.fn().mockReturnThis(),
      end: jest.fn(),
    } as unknown as NextApiResponse;

    // First request from IP 1 should be allowed
    await limiter.check(req1, res1);
    expect(res1.status).not.toHaveBeenCalledWith(429);
    expect(res1.end).not.toHaveBeenCalledWith('Rate limit exceeded');

    // First request from IP 2 should be allowed
    await limiter.check(req2, res2);
    expect(res2.status).not.toHaveBeenCalledWith(429);
    expect(res2.end).not.toHaveBeenCalledWith('Rate limit exceeded');

    // Second request from IP 1 should be rejected
    await limiter.check(req1, res1);
    expect(res1.status).toHaveBeenCalledWith(429);
    expect(res1.end).toHaveBeenCalledWith('Rate limit exceeded');

    // Second request from IP 2 should be rejected
    await limiter.check(req2, res2);
    expect(res2.status).toHaveBeenCalledWith(429);
    expect(res2.end).toHaveBeenCalledWith('Rate limit exceeded');
  });
});
