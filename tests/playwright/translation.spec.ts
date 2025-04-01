import { test, expect } from '@playwright/test';

test.describe('Translation E2E Tests', () => {
  test('should translate the application content when language is changed', async ({ page }) => {
    await page.goto('/');

    // Assert default language is English
    await expect(page.locator('h1')).toHaveText('Quote of the Day');
    await expect(page.locator('div').getByText('Your daily dose of inspiration.')).toBeVisible();
    await expect(page.locator('button[data-testid="copy-quote-btn"]')).toHaveAttribute('title', 'Copy quote');
    await expect(page.locator('button[data-testid="refresh-quote-btn"]')).toHaveAttribute('title', 'Refresh quote');
    // Category Selector
    await expect(page.locator('#category-select-label')).toHaveText('Select Category');

    // Change language to French
    await page.locator('#language-select').click();
    await page.locator('li[data-value="fr"]').click();

    // Assert content is translated to French
    await expect(page.locator('h1')).toHaveText('Citation du Jour');
    await expect(page.locator('div').getByText('Votre dose quotidienne d\'inspiration.')).toBeVisible();
    await expect(page.locator('button[data-testid="copy-quote-btn"]')).toHaveAttribute('title', 'Copier la citation');
    await expect(page.locator('button[data-testid="refresh-quote-btn"]')).toHaveAttribute('title', 'Rafraîchir la citation');
  });
});