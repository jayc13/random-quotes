import { test, expect } from '@playwright/test';

test.describe('Translation E2E Tests', () => {
  test('should translate the application content when language is changed', async ({ page }) => {
    await page.goto('/');

    // Assert default language is English
    await expect(page.locator('[data-testid="title"]')).toHaveText('Your daily dose of inspiration.')
    await expect(page.locator('button[data-testid="copy-quote-btn"]')).toHaveAttribute('aria-label', 'Copy quote');
    await expect(page.locator('button[data-testid="refresh-quote-btn"]')).toHaveAttribute('aria-label', 'Refresh quote');

    // Change language to French
    await page.locator('#language-select').click();
    await page.locator('li[data-value="fr"]').click();

    // Assert content is translated to French
    await expect(page.locator('[data-testid="title"]')).toHaveText('Votre dose quotidienne d\'inspiration.')
    await expect(page.locator('button[data-testid="copy-quote-btn"]')).toHaveAttribute('aria-label', 'Copier la citation');
    await expect(page.locator('button[data-testid="refresh-quote-btn"]')).toHaveAttribute('aria-label', 'Rafraîchir la citation');
  });
});