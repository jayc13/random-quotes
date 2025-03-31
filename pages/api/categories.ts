import { NextApiRequest, NextApiResponse } from 'next';
import rateLimit from "../../src/services/rate-limit.ts";
import {
  Category,
  getAllCategories,
} from '../../src/services/category.service.ts';


const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 100, // Max 100 requests per minute
});

export default  async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    await limiter.check(req);
  } catch {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }

  const categories: Category[] = await getAllCategories();
  res.status(200).json(categories);
}
