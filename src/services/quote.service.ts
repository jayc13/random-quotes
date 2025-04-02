import { promises as fs } from 'fs';
import path from 'path';
import {Category, getCategory} from "./category.service.ts";
import {
  DEFAULT_LANG,
  translateText,
  validateLanguage
} from "./translate.service.ts";

export type Quote = {
  quote: string;
  author: string;
};

export type QuotesCollection = {
  [category: string]: Quote[];
};

export interface GetRandomQuoteQuery {
  author?: string
  category?: string
  lang?: string
}

async function loadQuotes(): Promise<QuotesCollection> {
  const filePath = path.join(process.cwd(), 'pages/api/quotes.json');
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

const filterByAuthor = (quotes: Quote[], author?: string) => {

  if (!author) return quotes

  const filtered = quotes.filter((q) => q.author === author);

  if (filtered.length === 0) {
    throw new Error(`No quotes found for author: ${author}`);
  }

  return filtered;
};

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
  }

  return selectedQuote;
}