import { translateText, validateLanguage } from '../../../src/services/translate.service';

global.fetch = jest.fn();

describe('translateText', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('translateText()', () => {
    it('translates text successfully with the first endpoint', async () => {
      const options = { sourceLang: 'en', targetLang: 'fr', text: 'Hello' };
      const mockResponse = { translatedText: 'Bonjour' };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await translateText(options);

      expect(result).toEqual(mockResponse);
    });

    it('tries multiple endpoints until one succeeds', async () => {
      const options = { sourceLang: 'en', targetLang: 'fr', text: 'Hello' };
      const mockResponse = { translatedText: 'Bonjour' };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      }).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await translateText(options);

      expect(result).toEqual(mockResponse);
    });

    it('throws an error if all endpoints fail', async () => {
      const options = { sourceLang: 'en', targetLang: 'fr', text: 'Hello' };

      fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(translateText(options)).rejects.toThrow('Translation failed after trying all endpoints.');
    });

    it('throws an error if target language is unsupported', async () => {
      const options = { sourceLang: 'en', targetLang: 'xx', text: 'Hello' };

      await expect(translateText(options)).rejects.toThrow('Unsupported target language: xx');
    });

    it('throws an error if there is a network error', async () => {
      const options = { sourceLang: 'en', targetLang: 'fr', text: 'Hello' };

      fetch.mockRejectedValueOnce(new Error('Network Error'));

      await expect(translateText(options)).rejects.toThrow('Translation failed after trying all endpoints.');
    });
  });

  it('does not throw an error for supported language codes', () => {
    expect(() => validateLanguage('en')).not.toThrow();
    expect(() => validateLanguage('fr')).not.toThrow();
  });

  it('throws an error for unsupported language codes', () => {
    expect(() => validateLanguage('xx')).toThrow('Unsupported target language: xx');
  });
});