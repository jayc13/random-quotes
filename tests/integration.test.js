const request = require('supertest');
const app = require('../server'); // Assuming server.js exports the app

describe('Integration Tests', () => {
  it('should return a quote', async () => {
    const response = await request(app).get('/quote');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('quote');
    expect(response.body).toHaveProperty('author');
  });

  it('should return a quote by a specific author', async () => {
    const author = 'Steve Jobs';
    const response = await request(app).get(`/quote?author=${author}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('quote');
    expect(response.body).toHaveProperty('author', author);
  });

  it('should return a random quote when author is not found', async () => {
    const author = 'Unknown Author';
    const response = await request(app).get(`/quote?author=${author}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('quote');
    expect(response.body).toHaveProperty('author');
  });
});
