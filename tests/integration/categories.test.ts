import {createMocks} from 'node-mocks-http'
import handlerCategories from '../../pages/api/categories.ts'; // Import your API route


declare global {
  const requestCounts: Map<string, number[]> | undefined;
  const cleanupInterval: NodeJS.Timeout;
}


describe('GET /api/categories', () => {

  afterAll(() => {
    clearInterval(globalThis.cleanupInterval);
  });

  it('should return a list of categories', async () => {
    const {req, res} = createMocks({
      method: 'GET',
      url: '/api/categories',
    });

    await handlerCategories(req, res);

    expect(res.statusCode).toBe(200);
    const data = JSON.parse(res._getData());
    expect(Array.isArray(data)).toBe(true);
    expect(data).toEqual(expect.arrayContaining(['inspirational', 'funny', 'motivational']));
  });

  it('should return 405 for non-GET requests', async () => {
    const methods = ['POST', 'PUT', 'DELETE'];

    for (const method of methods) {
      const {req, res} = createMocks({
        method: method,
        url: '/api/categories',
      });

      await handlerCategories(req, res);

      expect(res.statusCode).toBe(405);
    }
  });
});