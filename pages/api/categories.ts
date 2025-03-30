import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Read categories from categories.json
    const filePath = path.join(process.cwd(), 'pages', 'api', 'categories.json');
    try {
      const jsonData = fs.readFileSync(filePath, 'utf-8');
      const categories: string[] = JSON.parse(jsonData);
      res.status(200).json(categories);
    } catch (error) {
      console.error('Error reading categories.json:', error);
      res.status(500).json({ error: 'Failed to read categories' });
    }
  } else {
    // Method not allowed
    res.status(405).end();
  }
}
