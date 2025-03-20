const request = require('supertest');
const app = require('../../server');
const api = request(app).baseUrl('/api');

describe('Quote API Tests', () => {
  it('should return the fixed quote and author', async () => {
    const response = await api.get('/quote');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      quote: "Your time is limited, so don't waste it living someone else's life.",
      author: "Steve Jobs",
    });
  });
});
