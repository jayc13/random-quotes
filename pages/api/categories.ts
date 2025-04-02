import { NextApiRequest, NextApiResponse } from 'next';
import rateLimit from "../../src/services/rate-limit";
import {
  Category,
  getAllCategories,
} from '../../src/services/category.service';
import {
  validateLanguage,
} from '../../src/services/translate.service';


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

  const lang = req.query.lang as string;

  try {
    validateLanguage(lang);
  } catch {
    return res.status(404).json({ error: `Lang "${lang}" not supported` });
  }

  const categories: Category[] = await getAllCategories(lang);
  res.status(200).json(categories);
}
