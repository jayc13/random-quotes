import { createMocks } from 'node-mocks-http';
import handler from './quote';

describe('/api/quote', () => {
  it('returns a quote in the default language (en) when no lang parameter is provided', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('quote');
    expect(data).toHaveProperty('author');
    // Basic check for English quote content
    expect(data.quote).toMatch(/\w+/);
+  });
+
+  it('returns a quote in the specified language (fr)', async () => {
+    const { req, res } = createMocks({
+      method: 'GET',
+      query: { lang: 'fr' },
+    });
+
+    await handler(req, res);
+
+    expect(res._getStatusCode()).toBe(200);
+    const data = JSON.parse(res._getData());
+    expect(data).toHaveProperty('quote');
+    expect(data).toHaveProperty('author');
+    // Basic check for French quote content
+    expect(data.quote).toMatch(/[^\x00-\x7F]+/);
+  });
+
+  it('returns a 404 error when no quotes are found for the given criteria', async () => {
+    const { req, res } = createMocks({
+      method: 'GET',
+      query: { lang: 'xx' }, // Assuming 'xx' will not have any quotes
+    });
+
+    await handler(req, res);
+
+    expect(res._getStatusCode()).toBe(404);
+    const data = JSON.parse(res._getData());
+    expect(data).toHaveProperty('error');
+    expect(data.error).toBe('No quotes found');
+  });
 });
