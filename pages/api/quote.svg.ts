import { NextApiRequest, NextApiResponse } from 'next';
import quotes from './quotes.json';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const { quote, author } = quotes[randomIndex];

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200">
       <rect fill="#f0f0f0"/>
      <text x="20" y="40" font-family="Arial" font-size="16" fill="#333" text-anchor="start" textLength="360">
        <tspan x="20" dy="0">${quote.substring(0, quote.length / 2)}</tspan>
        <tspan x="20" dy="1.2em">${quote.substring(quote.length / 2)}</tspan>
      </text>
      <text x="100%" y="12em" font-family="Arial" font-size="14" fill="#777" text-anchor="end">
        - ${author}
      </text>
    </svg>
  `;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.status(200).send(svg);
};

export default handler;
