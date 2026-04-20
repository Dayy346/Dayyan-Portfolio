/**
 * Live production audit — https://dayy346.github.io/Dayyan-Portfolio/
 * Run: npx playwright test tests/live-site-audit.spec.ts -c playwright.live.config.ts
 */
import { test } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const OUT = 'docs/qa-screenshots-live-main';

test.beforeAll(() => {
  fs.mkdirSync(OUT, { recursive: true });
});

async function loginDesktop(page: import('@playwright/test').Page) {
  await page.goto('');
  await page.waitForSelector('[data-testid="login-dialog"]', { timeout: 25000 });
  await page.getByRole('button', { name: /log on as dayyan/i }).click();
  await page.waitForSelector('[data-testid="desktop"]', { timeout: 15000 });
}

test.describe('Live site — console & network', () => {
  test('capture console errors and screenshot boot', async ({ page }) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    page.on('console', (msg) => {
      const t = msg.text();
      if (msg.type() === 'error') errors.push(t);
      if (msg.type() === 'warning') warnings.push(t);
    });
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));

    await page.goto('');
    await page.waitForSelector('.win9x-boot-dialog', { timeout: 25000 });
    await page.screenshot({ path: path.join(OUT, 'live-01-boot.png'), fullPage: true });

    const report = { url: page.url(), errors, warnings, failedRequests: [] as string[] };
    page.on('requestfailed', (req) => {
      report.failedRequests.push(`${req.url()} — ${req.failure()?.errorText}`);
    });
    await page.waitForTimeout(2000);

    fs.writeFileSync(
      path.join(OUT, 'live-console-boot.json'),
      JSON.stringify(report, null, 2),
      'utf8'
    );
    // Log-only: production may have third-party or CORS noise; see live-console-boot.json
    if (errors.length) console.log('Boot-stage console errors count:', errors.length);
  });
});

test.describe('Live site — shell', () => {
  test('login and desktop', async ({ page }) => {
    await page.goto('');
    await page.waitForSelector('[data-testid="login-dialog"]', { timeout: 25000 });
    await page.screenshot({ path: path.join(OUT, 'live-02-login.png'), fullPage: true });
    await loginDesktop(page);
    await page.screenshot({ path: path.join(OUT, 'live-03-desktop.png'), fullPage: false });
  });

  test('start menu', async ({ page }) => {
    await loginDesktop(page);
    await page.getByTestId('start-button').click();
    await page.waitForSelector('[data-testid="start-menu"]', { timeout: 5000 });
    await page.screenshot({ path: path.join(OUT, 'live-04-start-menu.png'), fullPage: false });
  });
});

test.describe('Live site — windows sample', () => {
  test('about, projects, contributions', async ({ page }) => {
    await loginDesktop(page);

    await page.waitForSelector('[data-testid="window-about"]', { timeout: 10000 });
    await page.locator('[data-testid="window-about"]').screenshot({
      path: path.join(OUT, 'live-05-window-about.png')
    });

    await page.getByTestId('start-button').click();
    await page.waitForSelector('[data-testid="start-menu"]', { timeout: 3000 });
    await page.getByTestId('start-menu-app-projects').click();
    await page.waitForSelector('[data-testid="window-projects"]', { timeout: 8000 });
    await page.locator('[data-testid="window-projects"]').screenshot({
      path: path.join(OUT, 'live-06-window-projects.png')
    });

    await page.getByTestId('start-button').click();
    await page.getByTestId('start-menu-app-contributions').click();
    await page.waitForSelector('[data-testid="window-contributions"]', { timeout: 15000 });
    await page.locator('[data-testid="window-contributions"]').screenshot({
      path: path.join(OUT, 'live-07-window-contributions.png')
    });
  });
});

test.describe('Live site — mobile', () => {
  test('mobile lite', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('');
    await page.waitForSelector('[data-testid="login-dialog"]', { timeout: 25000 });
    await page.getByRole('button', { name: /log on as dayyan/i }).click();
    await page.waitForSelector('.mobile-lite', { timeout: 15000 });
    await page.screenshot({ path: path.join(OUT, 'live-08-mobile-lite.png'), fullPage: true });
  });
});
