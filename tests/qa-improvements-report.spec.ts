/**
 * Key screenshots for docs/QA-IMPROVEMENTS-BRANCH.md
 * Run: npx playwright test tests/qa-improvements-report.spec.ts
 */
import { test } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const OUT = 'docs/qa-improvements-branch';

test.beforeAll(() => {
  fs.mkdirSync(OUT, { recursive: true });
});

async function loginDesktop(page: import('@playwright/test').Page) {
  await page.goto('');
  await page.waitForSelector('[data-testid="login-dialog"]', { timeout: 20000 });
  await page.getByRole('button', { name: /log on as dayyan/i }).click();
  await page.waitForSelector('[data-testid="desktop"]', { timeout: 10000 });
}

test('sc-01-login', async ({ page }) => {
  await page.goto('');
  await page.waitForSelector('[data-testid="login-dialog"]', { timeout: 20000 });
  await page.screenshot({ path: path.join(OUT, 'sc-01-login.png'), fullPage: true });
});

test('sc-02-desktop-widgets-icons', async ({ page }) => {
  await loginDesktop(page);
  await page.screenshot({ path: path.join(OUT, 'sc-02-desktop.png'), fullPage: false });
});

test('sc-03-about-window', async ({ page }) => {
  await loginDesktop(page);
  await page.waitForSelector('[data-testid="window-about"]', { timeout: 8000 });
  await page.locator('[data-testid="window-about"]').screenshot({ path: path.join(OUT, 'sc-03-about.png') });
});

test('sc-04-projects-window', async ({ page }) => {
  await loginDesktop(page);
  await page.getByTestId('start-button').click();
  await page.getByTestId('start-menu-app-projects').click();
  await page.waitForSelector('[data-testid="window-projects"]', { timeout: 8000 });
  await page.locator('[data-testid="window-projects"]').screenshot({ path: path.join(OUT, 'sc-04-projects.png') });
});

test('sc-05-contact-window', async ({ page }) => {
  await loginDesktop(page);
  await page.getByTestId('start-button').click();
  await page.getByTestId('start-menu-app-contact').click();
  await page.waitForSelector('[data-testid="window-contact"]', { timeout: 5000 });
  await page.locator('[data-testid="window-contact"]').screenshot({ path: path.join(OUT, 'sc-05-contact.png') });
});

test('sc-06-contributions-feed', async ({ page }) => {
  await loginDesktop(page);
  await page.getByTestId('start-button').click();
  await page.getByTestId('start-menu-app-contributions').click();
  await page.waitForSelector('[data-testid="window-contributions"]', { timeout: 15000 });
  await page.locator('[data-testid="window-contributions"]').screenshot({ path: path.join(OUT, 'sc-06-contributions.png') });
});
