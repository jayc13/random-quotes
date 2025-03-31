import { promises as fs } from 'fs';
import { QuotesCollection, getRandomQuote } from '../../../src/services/quote.service';


const mockQuotes: QuotesCollection = {
  'Category 1': [
    { quote: 'Quote 1', author: 'Author 1' },
    { quote: 'Quote 2', author: 'Author 2' },
  ],
  'Category 2': [
    { quote: 'Quote 3', author: 'Author 4' },
    { quote: 'Quote 4', author: 'Author 5' },
  ],
}

jest.mock("../../../src/services/category.service.ts", () => {
  return {
    getCategory: async (category) => ({name: category || 'Category 1'}),
  }
});

describe('getRandomQuote', () => {

  beforeAll(() => {
  })

  it('returns a random quote when no author is specified', async () => {
    jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify(mockQuotes));

    const result = await getRandomQuote();
    expect(result).toBeDefined();
  });

  it('returns a random quote by the specified author', async () => {
    jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify(mockQuotes));

    const result = await getRandomQuote({ author: 'Author 1' });
    expect(result).toEqual({ quote: 'Quote 1', author: 'Author 1' });
  });

  it('throws an error if no quotes are found', async () => {
    jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify([]));

    await expect(getRandomQuote()).rejects.toThrow('No quotes found');
  });

  it('throws an error if no quotes are found for the specified author', async () => {
    jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify(mockQuotes));

    await expect(getRandomQuote({ author: 'Author 2', category: 'Category 2' })).rejects.toThrow('No quotes found');
  });

  it('returns a random quote when multiple quotes by the specified author exist', async () => {
    jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify(mockQuotes));

    const result = await getRandomQuote({ author: 'Author 1' });
    expect(['Quote 1', 'Quote 2']).toContain(result.quote);
  });

  it('handle exception when the quotes json is bad-formatted', async () => {
    jest.spyOn(fs, 'readFile').mockResolvedValue(`Random file content`);
    await expect(getRandomQuote()).rejects.toThrow('No quotes found');

  });
});