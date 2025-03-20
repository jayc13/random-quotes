import { test, expect } from '@playwright/test';

test.describe('Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should return a quote', async ({ page }) => {
    const response = await page.request.get('/api/quote');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('quote');
    expect(typeof data.quote).toBe('string');
    expect(data).toHaveProperty('author');
    expect(typeof data.author).toBe('string');
  });

  test('should return a quote by a specific author', async ({ page }) => {
    const author = 'Steve Jobs';
    const response = await page.request.get(`/api/quote?author=${author}`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('quote');
    expect(typeof data.quote).toBe('string');
    expect(data).toHaveProperty('author', author);
  });

  test('should return a random quote when author is not found', async ({ page }) => {
    const author = 'Unknown Author';
    const response = await page.request.get(`/api/quote?author=${author}`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('quote');
    expect(typeof data.quote).toBe('string');
    expect(data).toHaveProperty('author');
    expect(typeof data.author).toBe('string');
  });

  test('should toggle between light and dark themes', async ({ page }) => {
    const themeToggle = page.locator('label.theme-toggle');
    const body = page.locator('html');

    // Initial theme should be light (assuming system preference is light)
    await expect(body).toHaveClass('light-mode-container');

    // Toggle to dark theme
    await themeToggle.click();
    await expect(body).toHaveClass('dark-mode-container');

    // Toggle back to light theme
    await themeToggle.click();
    await expect(body).toHaveClass('light-mode-container');
  });

  // This test will be skipped as it requires manual system theme change during the test
  test.skip('should apply system theme on initial load', async ({ page }) => {
    const body = page.locator('html');

    // Check if the initial background color matches the system preference
    // This assertion needs to be adjusted based on the actual system theme
    await expect(body).toHaveClass('dark-mode-container'); 
  });
});
