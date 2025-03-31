import { NextApiRequest, NextApiResponse } from 'next';
import rateLimit from '../../src/services/rate-limit';
import {
  GetRandomQuoteQuery,
  getRandomQuote, Quote,
} from '../../src/services/quote.service.ts';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 50, // Max 50 requests per minute for SVG
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await limiter.check(req);
  } catch {
    return res.status(429).send('Rate limit exceeded');
  }

  const filters: GetRandomQuoteQuery = {
    author: req.query.author as string,
    category: req.query.category as string,
  };

  let quote: Quote;

  try {
    quote = await getRandomQuote(filters);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }

  // Extract theme from query parameters and validate
  const themeParam = req.query.theme as string;

  const themes = {
    light: {
      backgroundColor: '#f0f0f0',
      textColor: '#333'
    },
    dark: {
      backgroundColor: '#333',
      textColor: '#f0f0f0'
    },
  };

  const { backgroundColor, textColor } = themes[themeParam] || themes.light;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200">
       <rect fill="${backgroundColor}"/>
      <text x="20" y="40" font-family="Arial" font-size="16" fill="${textColor}" text-anchor="start">
        <tspan x="20" dy="0">${quote.quote}</tspan>
      </text>
      <text x="780" y="8em" font-family="Arial" font-size="14" fill="${themeParam === 'dark' ? '#f0f0f0' : '#777'}" text-anchor="end">
        - ${quote.author}
      </text>
    </svg>
  `;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.status(200).send(svg);
};

export default handler;
