import { promises as fs } from 'fs';
import path from 'path';

export type Quote = {
  quote: string;
  author: string;
};

export interface GetRandomQuoteQuery {
  author?: string
}

async function loadQuotes(): Promise<Quote[]> {
  const filePath = path.join(process.cwd(), 'pages/api/quotes.json');
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
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
    author
  } = query || {};

  const quotes = await loadQuotes();
  let filtered = filterByAuthor(quotes, author);
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}