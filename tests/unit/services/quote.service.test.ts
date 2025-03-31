import { promises as fs } from 'fs';
import { getRandomQuote, Quote } from '../../../src/services/quote.service';

describe('getRandomQuote', () => {
  it('returns a random quote when no author is specified', async () => {
    const quotes: Quote[] = [
      { quote: 'Quote 1', author: 'Author 1' },
      { quote: 'Quote 2', author: 'Author 2' },
    ];
    jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify(quotes));

    const result = await getRandomQuote();
    expect(quotes).toContainEqual(result);
  });

  it('returns a random quote by the specified author', async () => {
    const quotes: Quote[] = [
      { quote: 'Quote 1', author: 'Author 1' },
      { quote: 'Quote 2', author: 'Author 2' },
    ];
    jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify(quotes));

    const result = await getRandomQuote({ author: 'Author 1' });
    expect(result).toEqual({ quote: 'Quote 1', author: 'Author 1' });
  });

  it('throws an error if no quotes are found', async () => {
    jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify([]));

    await expect(getRandomQuote()).rejects.toThrow('No quotes found');
  });

  it('throws an error if no quotes are found for the specified author', async () => {
    const quotes: Quote[] = [
      { quote: 'Quote 1', author: 'Author 1' },
    ];
    jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify(quotes));

    await expect(getRandomQuote({ author: 'Author 2' })).rejects.toThrow('No quotes found');
  });

  it('returns a random quote when multiple quotes by the specified author exist', async () => {
    const quotes: Quote[] = [
      { quote: 'Quote 1', author: 'Author 1' },
      { quote: 'Quote 2', author: 'Author 1' },
    ];
    jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify(quotes));

    const result = await getRandomQuote({ author: 'Author 1' });
    expect(['Quote 1', 'Quote 2']).toContain(result.quote);
  });

  it('handle exception when the quotes json is bad-formatted', async () => {
    jest.spyOn(fs, 'readFile').mockResolvedValue(`Random file content`);
    await expect(getRandomQuote()).rejects.toThrow('No quotes found');

  });
});