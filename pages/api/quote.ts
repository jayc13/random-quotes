import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

type Quote = {
  quote: string;
  author: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Quote | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Rate limiting
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const rateLimitWindow = 60 * 1000; // 60 seconds
  const maxRequests = 100;

  if (!global.requestCounts) {
    global.requestCounts = new Map<string, number[]>();
  }

  const now = Date.now();
  const timestamps = global.requestCounts.get(ip as string) || [];
  const recentRequests = timestamps.filter(
    (timestamp) => now - timestamp < rateLimitWindow
  );

  if (recentRequests.length >= maxRequests) {
    return res.status(429).json({ error: 'Too Many Requests' });
  }

  global.requestCounts.set(ip as string, [...recentRequests, now]);

  // Periodically clean up old entries
  if (!global.cleanupInterval) {
    global.cleanupInterval = setInterval(() => {
      const rateLimitWindow = 60 * 1000;
      const now = Date.now();
      if (global.requestCounts) {
        for (const [ip, timestamps] of global.requestCounts.entries()) {
          const recentRequests = timestamps.filter(
            (timestamp) => now - timestamp < rateLimitWindow
          );
          if (recentRequests.length === 0) {
            global.requestCounts.delete(ip);
          } else {
            global.requestCounts.set(ip, recentRequests);
          }
        }
      }
    }, 60 * 1000);
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
