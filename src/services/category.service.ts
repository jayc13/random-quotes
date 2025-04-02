import { promises as fs } from 'fs';
import path from 'path';
import { validateLanguage } from "./translate.service.ts";


export type Category = {
  id: string;
  name: string;
};

/**
 * Options for retrieving a category.
 */
export interface GetCategoryOptions {
  /**
   * The ID of the expected category.
   */
  expectedCategory?: string;
  /**
   * The language code to filter categories. Defaults to 'en'.
   */
  lang?: string;
}

/**
 * Retrieves all categories for a specified language.
 *
 * @param {string} [lang='en'] - The language code to filter categories.
 * @returns {Promise<Category[]>} - A promise that resolves to an array of categories.
 */
export async function getAllCategories(lang: string = 'en'): Promise<Category[]> {
  validateLanguage(lang);
  const filePath = path.join(process.cwd(), 'pages/api/categories.json');
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data)[lang] || [];
  } catch {
    return [];
  }
}

/**
 * Retrieves a category based on the provided options.
 *
 * @param {GetCategoryOptions} [options] - Options to filter the category.
 * @param {string} [options.expectedCategory] - The ID of the expected category.
 * @param {string} [options.lang='en'] - The language code to filter categories.
 * @returns {Promise<Category>} - A promise that resolves to a category object.
 *
 * The function first fetches all categories for the specified language.
 * If an expected category ID is provided, it attempts to find a category with that ID.
 * If no category is found or no expected category is provided, it returns a random category.
 */
export async function getCategory(options?: GetCategoryOptions): Promise<Category> {
  const {
    expectedCategory,
    lang = 'en',
  } = options || {};

  const categories = await getAllCategories(lang);

  let category: Category | undefined = undefined;

  if (expectedCategory?.length) {
    category = categories.find((c) => c.id.toLowerCase() === expectedCategory.toLowerCase());
  }

  if (!category) {
    const randomIndex = Math.floor(Math.random() * categories.length);
    category = categories[randomIndex];
  }

  return category;
}