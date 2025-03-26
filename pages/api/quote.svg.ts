import { NextApiRequest, NextApiResponse } from 'next';
import quotes from './quotes.json';
import rateLimit from './rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 50, // Max 50 requests per minute for SVG
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await limiter.check(req, res);
  } catch {
    return res.status(429).send('Rate limit exceeded');
  }

  const theme = (req.query.theme as string) || 'light';
  const isDark = theme === 'dark';

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const { quote, author } = quotes[randomIndex];

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200">
      <rect fill="${isDark ? '#333' : '#f0f0f0'}"/>
      <text x="20" y="40" font-family="Arial" font-size="16" fill="${isDark ? '#f0f0f0' : '#333'}" text-anchor="start">
        <tspan x="20" dy="0">${quote}</tspan>
      </text>
      <text x="780" y="8em" font-family="Arial" font-size="14" fill="${isDark ? '#ccc' : '#777'}" text-anchor="end">
        - ${author}
      </text>
    </svg>
  `;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.status(200).send(svg);
};

export default handler;
