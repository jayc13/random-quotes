import { promises as fs } from 'fs';
import { QuotesCollection, getRandomQuote } from '../../../src/services/quote.service';
import { GetCategoryOptions } from "../../../src/services/category.service.ts";
import {DEFAULT_LANG, validateLanguage, translateText} from "../../../src/services/translate.service.ts";

const mockQuotes: QuotesCollection = {
  category1: [
    { quote: 'Quote 1', author: 'Author 1' },
    { quote: 'Quote 2', author: 'Author 1' },
    { quote: 'Quote 3', author: 'Author 2' },
  ],
  category2: [
    { quote: 'Quote 4', author: 'Author 3' },
    { quote: 'Quote 5', author: 'Author 4' },
  ],
}

jest.mock("../../../src/services/category.service.ts", () => {
  return {
    getCategory: async (options?: GetCategoryOptions) => {
      const { expectedCategory } = options || {};
      return {
        id: expectedCategory || 'category1',
        name: 'Category Mock Name',
      };
    },
  }
});

jest.mock("../../../src/services/translate.service.ts", () => {
  const original = jest.requireActual("../../../src/services/translate.service.ts");
  return {
    ...original,
    translateText: jest.fn(),
    validateLanguage: jest.fn(),
  };
});

describe('getRandomQuote', () => {

  beforeEach(() => {
    jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify(mockQuotes));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns a random quote when no author is specified', async () => {
    const result = await getRandomQuote();
    expect(result).toBeDefined();
  });

  it('returns a random quote by the specified author', async () => {
    jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify(mockQuotes));

    const result = await getRandomQuote({ author: 'Author 4', category: 'category2' });
    expect(result).toEqual({ quote: 'Quote 5', author: 'Author 4' });
  });

  it('throws an error if no quotes are found', async () => {
    jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify([]));

    await expect(getRandomQuote()).rejects.toThrow('No quotes found');
  });

  it('throws an error if no quotes are found for the specified author', async () => {
    jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify(mockQuotes));

    await expect(getRandomQuote({ author: 'Author 2', category: 'category2' })).rejects.toThrow('No quotes found');
  });

  it('returns a random quote when multiple quotes by the specified author exist', async () => {
    jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify(mockQuotes));

    const result = await getRandomQuote({ author: 'Author 1', category: 'category1' });
    expect(['Quote 1', 'Quote 2']).toContain(result.quote);
  });

  it('handle exception when the quotes json is bad-formatted', async () => {
    jest.spyOn(fs, 'readFile').mockResolvedValue(`Random file content`);
    await expect(getRandomQuote()).rejects.toThrow('No quotes found');

  });

  it('returns a translated quote for non\-default language', async () => {

    const translateTextMock = translateText.mockImplementation(() => ('Cita traducida'));
    validateLanguage.mockImplementation(() => {});

    const result = await getRandomQuote({ author: 'Author 1', category: 'category1', lang: 'es' });

    expect(translateTextMock).toHaveBeenCalledWith({
      sourceLang: DEFAULT_LANG,
      targetLang: 'es',
      text: expect.any(String),
    });
    expect(result.quote).toEqual('Cita traducida');
  });

  it('throws an error when the provided language is invalid', async () => {
    validateLanguage.mockImplementation(() => {throw new Error('Invalid language');});

    await expect(getRandomQuote({ lang: 'invalid' })).rejects.toThrow('Invalid language');
  });
});