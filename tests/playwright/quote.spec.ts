import { test, expect } from '@playwright/test';

test.describe('Quote App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display a loading indicator initially', async ({ page }) => {
    await page.route('/api/quote', async route => {
      await new Promise(f => setTimeout(f, 100));
      await route.continue();
    });
    await expect(page.locator('#loading')).toBeVisible();
  });

  test('should display a quote and author after loading', async ({ page }) => {
    // Wait for the loading indicator to disappear, implying data is loaded
    await expect(page.locator('#loading')).toBeHidden();

    // Check if quote and author are displayed
    await expect(page.locator('#quote')).toBeVisible();
    await expect(page.locator('#author')).toBeVisible();

    // Check if the quote and author have some text content
    const quoteText = await page.locator('#quote').textContent();
    const authorText = await page.locator('#author').textContent();
    expect(quoteText).toBeTruthy();
    expect(authorText).toBeTruthy();
  });

  test('should handle errors during quote fetching', async ({ page }) => {
    // Mock the API to simulate an error
    await page.route('/api/quote', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Failed to fetch quote' }),
      });
    });

    // Reload the page to trigger the API call with the mock error
    await page.reload();

    // Wait for the loading indicator to disappear
    await expect(page.locator('#loading')).toBeHidden();

    // Check for an error message or fallback content (adjust based on your app's behavior)
    await expect(page.locator('#error')).toHaveText('Failed to fetch quote');
  });
});
