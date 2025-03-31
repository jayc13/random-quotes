import { test, expect } from '@playwright/test';

test.describe('Quote App', () => {
  test.beforeEach(async ({ page }) => {
    const getQuoteRequest = page.waitForResponse(resp => {
      return resp.url().includes('/api/quote') && resp.status() === 200
    });
    const getCategoriesRequest = page.waitForResponse(resp => {
      return resp.url().includes('/api/categories') && resp.status() === 200
    });
    await page.goto('/');
    await getQuoteRequest;
    await getCategoriesRequest;
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
    const responsePromise = page.waitForResponse(resp => {
      return resp.url().includes('/api/quote') && resp.status() === 200
    });
    await page.locator('[data-testid="refresh-quote-btn"]').click();
    const response = await responsePromise;

    const responseBody = await response.json();

    await expect(page.locator('#loading')).toBeHidden();

    await expect(page.locator('#quote')).toHaveText(`“${responseBody.quote}”`);
    await expect(page.locator('#author')).toHaveText(`- ${responseBody.author}`);
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

  test('should re-fetch a quote after changing the category', async ({ page }) => {
    await page.locator('[data-testid="category-select"]').click();
    const categories = await page.locator('ul[aria-labelledby="category-select"] li').all();
    const texts: string[] = [];
    for (const item of categories) {
      const text = await item.innerText();
      texts.push(text);
    }

    const randomCategory = texts[Math.floor(Math.random() * (texts.length - 1)) + 1];

    const getQuoteRequest = page.waitForResponse(resp => {
      return resp.url().includes('/api/quote') && resp.status() === 200
    });

    await page.locator(`li:has-text("${randomCategory}")`).click();

    const getQuoteResponse = await getQuoteRequest;
    const responseBody = await getQuoteResponse.json();
    const requestedURL = new URL(getQuoteResponse.request().url())

    expect(requestedURL.searchParams.get('category')).toBe(randomCategory.toLowerCase());
    await expect(page.locator('#loading')).toBeHidden();
    await expect(page.locator('#quote')).toHaveText(`“${responseBody.quote}”`);
    await expect(page.locator('#author')).toHaveText(`- ${responseBody.author}`);
  });

  test('refreshing the quote with a category selected', async ({ page }) => {
    await page.locator('[data-testid="category-select"]').click();
    const categories = await page.locator('ul[aria-labelledby="category-select"] li').all();
    const texts: string[] = [];
    for (const item of categories) {
      const text = await item.innerText();
      texts.push(text);
    }

    const randomCategory = texts[Math.floor(Math.random() * (texts.length - 1)) + 1];

    const getQuoteRequest = page.waitForResponse(resp => {
      return resp.url().includes('/api/quote') && resp.status() === 200
    });

    await page.locator(`li:has-text("${randomCategory}")`).click();

    const getQuoteResponse = await getQuoteRequest;
    const responseBody = await getQuoteResponse.json();
    const requestedURL = new URL(getQuoteResponse.request().url())

    expect(requestedURL.searchParams.get('category')).toBe(randomCategory.toLowerCase());
    await expect(page.locator('#loading')).toBeHidden();
    await expect(page.locator('#quote')).toHaveText(`“${responseBody.quote}”`);
    await expect(page.locator('#author')).toHaveText(`- ${responseBody.author}`);


    await page.locator('[data-testid="refresh-quote-btn"]').click();

    const getRefreshQuoteResponse = await getQuoteRequest;
    const responseRefreshBody = await getRefreshQuoteResponse.json();
    const requestedRefreshURL = new URL(getRefreshQuoteResponse.request().url())

    expect(requestedRefreshURL.searchParams.get('category')).toBe(randomCategory.toLowerCase());
    await expect(page.locator('#loading')).toBeHidden();
    await expect(page.locator('#quote')).toHaveText(`“${responseRefreshBody.quote}”`);
    await expect(page.locator('#author')).toHaveText(`- ${responseRefreshBody.author}`);

  });
});
