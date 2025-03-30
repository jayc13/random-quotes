import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import rateLimit from '../../src/services/rate-limit';

type Quote = {
  quote: string;
  author: string;
};

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

  const filePath = path.join(process.cwd(), 'pages/api/quotes.json');
  const jsonData = await fs.readFile(filePath, 'utf8');
  const quotes: Quote[] = JSON.parse(jsonData);

  if (req.query.author) {
    const author = req.query.author as string;
    const filteredQuotes = quotes.filter((quote) => quote.author === author);

    if (filteredQuotes.length === 0) {
      return res
        .status(404)
        .json({ error: `No quotes found for author: ${author}` });
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const selectedQuote: Quote = filteredQuotes[randomIndex];
    return res.status(200).json(selectedQuote);
  } else {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote: Quote = quotes[randomIndex];
    return res.status(200).json(selectedQuote);
  }
}
