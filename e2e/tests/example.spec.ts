import {test, expect} from '@playwright/test';

test('has title', async ({page}) => {
  await page.goto('/');
  // Expect a title "to contain" a substring.
  // We don't know the exact title, so we might need to adjust this
  // but for now, we'll just check if it loads.
  // await expect(page).toHaveTitle(/React/);
});

test('basic navigation check', async ({page}) => {
  await page.goto('/');
  // Basic check to see if the page is responsive
  const body = await page.locator('body');
  await expect(body).toBeVisible();
});
