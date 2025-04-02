import { promises as fs } from 'fs';
import path from 'path';
import { Category, getCategory } from "./category.service.ts";
import {
  DEFAULT_LANG,
  translateText,
  validateLanguage
} from "./translate.service.ts";

/**
 * Represents a quote with the text and the author.
 */
export type Quote = {
  quote: string;
  author: string;
};

/**
 * Represents a collection of quotes categorized by category.
 */
export type QuotesCollection = {
  [category: string]: Quote[];
};

/**
 * Query parameters for retrieving a random quote.
 */
export interface GetRandomQuoteQuery {
  /**
   * The author of the quote.
   */
  author?: string;
  /**
   * The category of the quote.
   */
  category?: string;
  /**
   * The language code for the quote. Defaults to the default language.
   */
  lang?: string;
}

/**
 * Loads the quotes from the JSON file.
 *
 * @returns {Promise<QuotesCollection>} - A promise that resolves to a collection of quotes.
 */
async function loadQuotes(): Promise<QuotesCollection> {
  const filePath = path.join(process.cwd(), 'pages/api/quotes.json');
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

/**
 * Filters quotes by the specified author.
 *
 * @param {Quote[]} quotes - The array of quotes to filter.
 * @param {string} [author] - The author to filter by.
 * @returns {Quote[]} - The filtered array of quotes.
 * @throws {Error} - If no quotes are found for the specified author.
 */
const filterByAuthor = (quotes: Quote[], author?: string) => {
  if (!author) return quotes;

  const filtered = quotes.filter((q) => q.author === author);

  if (filtered.length === 0) {
    throw new Error(`No quotes found for author: ${author}`);
  }

  return filtered;
};

/**
 * Retrieves a random quote based on the provided query parameters.
 *
 * @param {GetRandomQuoteQuery} [query] - The query parameters for retrieving the quote.
 * @param {string} [query.author] - The author of the quote.
 * @param {string} [query.category] - The category of the quote.
 * @param {string} [query.lang=DEFAULT_LANG] - The language code for the quote.
 * @returns {Promise<Quote>} - A promise that resolves to a random quote.
 * @throws {Error} - If no quotes are found.
 */
export async function getRandomQuote(query?: GetRandomQuoteQuery): Promise<Quote> {
  const {
    author,
    category,
    lang = DEFAULT_LANG,
  } = query || {};

  const quotesCollection: QuotesCollection = await loadQuotes();

  const filteredCategory: Category = await getCategory({
    expectedCategory: category,
  });

  const quotes = quotesCollection[filteredCategory.id] || [];

  let filtered = filterByAuthor(quotes, author);

  if (!filtered.length) {
    throw new Error('No quotes found');
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const selectedQuote = filtered[randomIndex];

  if (lang !== DEFAULT_LANG) {
    validateLanguage(lang);

    selectedQuote.quote = await translateText({
      sourceLang: DEFAULT_LANG,
      targetLang: lang,
      text: selectedQuote.quote,
    });

    console.log({selectedQuote})
  }

  return selectedQuote;
}