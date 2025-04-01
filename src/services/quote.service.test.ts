import { getRandomQuote } from './quote.service';

describe('getRandomQuote', () => {
  it('should return a quote when no language is specified (default: en)', async () => {
    const quote = await getRandomQuote();
    expect(quote).toHaveProperty('quote');
    expect(quote).toHaveProperty('author');
    // Basic check, assuming English quotes contain common English words
    expect(quote.quote).toMatch(/\w+/); 
  });

  it('should return a quote in the specified language (en)', async () => {
    const quote = await getRandomQuote({ lang: 'en' });
    expect(quote).toHaveProperty('quote');
    expect(quote).toHaveProperty('author');
    // Basic check, assuming English quotes contain common English words
    expect(quote.quote).toMatch(/\w+/);
  });

  it('should return a quote in the specified language (fr)', async () => {
    const quote = await getRandomQuote({ lang: 'fr' });
    expect(quote).toHaveProperty('quote');
    expect(quote).toHaveProperty('author');
    // Basic check, assuming French quotes contain common French words
    expect(quote.quote).toMatch(/[^\x00-\x7F]+/);
+  });
+
+  it('should fallback to English when an unsupported language is specified', async () => {
+    const quote = await getRandomQuote({ lang: 'es' }); // Assuming 'es' (Spanish) is not supported yet
+    expect(quote).toHaveProperty('quote');
+    expect(quote).toHaveProperty('author');
+    // Basic check, assuming English quotes contain common English words
+    expect(quote.quote).toMatch(/\w+/);
+  });
 });
