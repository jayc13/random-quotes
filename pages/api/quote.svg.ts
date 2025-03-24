import { NextApiRequest, NextApiResponse } from 'next';
import quotes from './quotes.json';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const { quote, author } = quotes[randomIndex];

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0" />
      <text x="20" y="80" font-family="Arial" font-size="16" fill="#333" text-anchor="start">
        <tspan x="20" dy="0">${quote}</tspan>
      </text>
      <text x="380" y="160" font-family="Arial" font-size="14" fill="#777" text-anchor="end">
        - ${author}
      </text>
    </svg>
  `;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.status(200).send(svg);
};

export default handler;
