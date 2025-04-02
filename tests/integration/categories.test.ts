import {createMocks, RequestMethod} from 'node-mocks-http'
import handlerCategories from '../../pages/api/categories.ts';


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
    const data = res._getJSONData();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it('should return 405 for non-GET requests', async () => {
    const methods: RequestMethod[] = ['POST', 'PUT', 'DELETE'];

    for (const method of methods) {
      const {req, res} = createMocks({
        method: method,
        url: '/api/categories',
      });

      await handlerCategories(req, res);

      expect(res.statusCode).toBe(405);
    }
  });

  it('should return 404 for unsupported language', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      url: '/api/categories?lang=xx'
    });

    await handlerCategories(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'Lang "xx" not supported' });
  });
});