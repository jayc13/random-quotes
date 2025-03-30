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
    await expect(page.locator('#error')).toHaveText('Failed to fetch quote. Please try again');
  });

  test('should refresh the quote when the refresh button is clicked', async ({ page }) => {
    // Wait for the initial quote to load
    await expect(page.locator('#loading')).toBeHidden();

    // Get the initial quote and author
    const initialQuote = await page.locator('#quote').textContent() || '';
    const initialAuthor = await page.locator('#author').textContent() || '';

    // Click the refresh button (assuming it's the IconButton containing RotateRightIcon)
    await page.locator('[data-testid="refresh-quote-btn"]').click();

    // Wait for the quote and author to update (you might need to adjust the timeout)
    await expect(page.locator('#loading')).toBeHidden();
    await expect(page.locator('#quote')).not.toHaveText(initialQuote, { timeout: 5000 });
    await expect(page.locator('#author')).not.toHaveText(initialAuthor, { timeout: 5000 });

    // Verify that the new quote and author are not empty
    const newQuote = await page.locator('#quote').textContent();
    const newAuthor = await page.locator('#author').textContent();
    expect(newQuote).toBeTruthy();
    expect(newAuthor).toBeTruthy();
  });

  test('should handle an empty quote list', async ({ page }) => {
    // Mock the /api/quote endpoint to return an empty list
    await page.route('/api/quote', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ quote: '', author: '' }),
      });
    });

    // Reload the page to trigger the API call with the mock response
    await page.reload();

    // Wait for the loading indicator to disappear
    await expect(page.locator('#loading')).toBeHidden();

    // Verify that the quote and author are displayed as empty strings
    await expect(page.locator('#quote')).toHaveText('“”');
    await expect(page.locator('#author')).toHaveText('- ');
  });
});
