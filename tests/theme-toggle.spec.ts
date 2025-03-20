import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should toggle between light and dark themes', async ({ page }) => {
    const themeToggle = page.locator('label.theme-toggle');
    const body = page.locator('body');

    // Initial theme should be light (assuming system preference is light)
    await expect(body).toHaveCSS('background-color', 'rgb(255, 255, 255)');

    // Toggle to dark theme
    await themeToggle.click();
    await expect(body).toHaveCSS('background-color', 'rgb(51, 51, 51)');

    // Toggle back to light theme
    await themeToggle.click();
    await expect(body).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  });

  // This test will be skipped as it requires manual system theme change during the test
  test.skip('should apply system theme on initial load', async ({ page }) => {
    const body = page.locator('body');

    // Check if the initial background color matches the system preference
    // This assertion needs to be adjusted based on the actual system theme
    await expect(body).toHaveCSS('background-color', 'rgb(51, 51, 51)'); 
  });
});
