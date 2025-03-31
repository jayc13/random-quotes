import { promises as fs } from 'fs';
import path from 'path';


export type Category = {
  name: string;
};

export async function getAllCategories(): Promise<Category[]> {
  const filePath = path.join(process.cwd(), 'pages/api/categories.json');
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function getCategory(expectedCategory?: string): Promise<Category> {
  const categories = await getAllCategories();

  let category: Category | undefined = undefined;

  if (expectedCategory?.length) {
    category = categories.find((c) => c.name.toLowerCase() === expectedCategory.toLowerCase());
  }

  if (!category) {
    const randomIndex = Math.floor(Math.random() * categories.length);
    category = categories[randomIndex];
  }

  return category;
}