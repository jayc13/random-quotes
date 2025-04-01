import { NextApiRequest, NextApiResponse } from 'next';
import rateLimit from '../../src/services/rate-limit';
import {
  Quote,
  getRandomQuote,
  GetRandomQuoteQuery,
} from '../../src/services/quote.service.ts';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 100, // Max 100 requests per minute
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Quote | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    await limiter.check(req);
  } catch {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }

  const filters: GetRandomQuoteQuery = {
    author: req.query.author as string,
    category: req.query.category as string,
    lang: req.query.lang as string,
  };

  let quote: Quote;

  try {
    quote = await getRandomQuote(filters);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }

  return res.status(200).json(quote);
}
