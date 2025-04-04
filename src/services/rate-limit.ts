import { NextApiRequest } from 'next';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export default function rateLimit(options?: Options) {
  const tokenCache = new Map();

  const uniqueTokenPerInterval = options?.uniqueTokenPerInterval ?? 500;

  return {
    check: async (req: NextApiRequest) => {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const tokenKey = Array.isArray(ip) ? ip[0] : ip;

      if (!tokenKey) {
        return;
      }

      if (tokenCache.has(tokenKey)) {
        const tokensRemaining = tokenCache.get(tokenKey) as number;
        if (tokensRemaining > 0) {
          tokenCache.set(tokenKey, tokensRemaining - 1);
        } else {
          throw new Error('Rate limit exceeded');
        }
      } else {
        tokenCache.set(tokenKey, uniqueTokenPerInterval - 1);
      }
    },
  };
}
