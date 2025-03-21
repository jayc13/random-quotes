import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Random Quote/);
});

test('get started link', async ({ page }) => {
  await page.goto('/');

  // Expect an element with the text 'Get started' to be visible.
  await expect(page.locator('h1')).toBeVisible();
});
