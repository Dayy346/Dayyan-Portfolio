/**
 * QA screenshot capture for visual audit — Round 2 (thorough).
 * Run: npx playwright test tests/qa-screenshots.spec.ts
 * Run with browser visible: npx playwright test tests/qa-screenshots.spec.ts --headed
 * Screenshots saved to docs/qa-screenshots/
 */
import { test } from '@playwright/test';
import path from 'path';

const SCREENSHOT_DIR = 'docs/qa-screenshots';

async function loginAndWaitForDesktop(page: import('@playwright/test').Page) {
  await page.goto('');
  await page.waitForSelector('[data-testid="login-dialog"]', { timeout: 20000 });
  await page.getByRole('button', { name: /log on as dayyan/i }).click();
  await page.waitForSelector('[data-testid="desktop"]', { timeout: 10000 });
}

async function openWindow(page: import('@playwright/test').Page, appId: string) {
  await page.getByTestId('start-button').click();
  await page.waitForSelector('[data-testid="start-menu"]', { timeout: 2000 });
  await page.getByTestId(`start-menu-app-${appId}`).click();
  await page.waitForSelector(`[data-testid="window-${appId}"]`, { timeout: 5000 });
}

test.describe('QA Round 2 — Shell & flow', () => {
  test('01-boot-screen', async ({ page }) => {
    await page.goto('');
    await page.waitForSelector('.win9x-boot-dialog', { timeout: 15000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-boot-screen.png'), fullPage: true });
  });

  test('02-login-screen', async ({ page }) => {
    await page.goto('');
    await page.waitForSelector('[data-testid="login-dialog"]', { timeout: 20000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-login-screen.png'), fullPage: true });
  });

  test('03-desktop-taskbar', async ({ page }) => {
    await loginAndWaitForDesktop(page);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-desktop-taskbar.png'), fullPage: false });
  });

  test('04-start-menu', async ({ page }) => {
    await loginAndWaitForDesktop(page);
    await page.getByTestId('start-button').click();
    await page.waitForSelector('[data-testid="start-menu"]', { timeout: 3000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-start-menu.png'), fullPage: false });
  });

  test('05-taskbar-quick-launch', async ({ page }) => {
    await loginAndWaitForDesktop(page);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-taskbar-quick-launch.png'), fullPage: false });
  });
});

test.describe('QA Round 2 — App windows', () => {
  test('06-window-about', async ({ page }) => {
    await loginAndWaitForDesktop(page);
    await page.waitForSelector('[data-testid="window-about"]', { timeout: 8000 });
    await page.locator('[data-testid="window-about"]').screenshot({ path: path.join(SCREENSHOT_DIR, '06-window-about.png') });
  });

  test('07-window-resume', async ({ page }) => {
    await loginAndWaitForDesktop(page);
    await openWindow(page, 'resume');
    await page.locator('[data-testid="window-resume"]').screenshot({ path: path.join(SCREENSHOT_DIR, '07-window-resume.png') });
  });

  test('08-window-projects', async ({ page }) => {
    await loginAndWaitForDesktop(page);
    await openWindow(page, 'projects');
    await page.locator('[data-testid="window-projects"]').screenshot({ path: path.join(SCREENSHOT_DIR, '08-window-projects.png') });
  });

  test('09-window-experience', async ({ page }) => {
    await loginAndWaitForDesktop(page);
    await openWindow(page, 'experience');
    await page.locator('[data-testid="window-experience"]').screenshot({ path: path.join(SCREENSHOT_DIR, '09-window-experience.png') });
  });

  test('10-window-skills', async ({ page }) => {
    await loginAndWaitForDesktop(page);
    await openWindow(page, 'skills');
    await page.locator('[data-testid="window-skills"]').screenshot({ path: path.join(SCREENSHOT_DIR, '10-window-skills.png') });
  });

  test('11-window-power', async ({ page }) => {
    await loginAndWaitForDesktop(page);
    await openWindow(page, 'power');
    await page.locator('[data-testid="window-power"]').screenshot({ path: path.join(SCREENSHOT_DIR, '11-window-power.png') });
  });

  test('12-window-leetcode', async ({ page }) => {
    await loginAndWaitForDesktop(page);
    await openWindow(page, 'leetcode');
    await page.locator('[data-testid="window-leetcode"]').screenshot({ path: path.join(SCREENSHOT_DIR, '12-window-leetcode.png') });
  });

  test('13-window-contributions', async ({ page }) => {
    await loginAndWaitForDesktop(page);
    await openWindow(page, 'contributions');
    await page.locator('[data-testid="window-contributions"]').screenshot({ path: path.join(SCREENSHOT_DIR, '13-window-contributions.png') });
  });

  test('14-window-contact', async ({ page }) => {
    await loginAndWaitForDesktop(page);
    await openWindow(page, 'contact');
    await page.locator('[data-testid="window-contact"]').screenshot({ path: path.join(SCREENSHOT_DIR, '14-window-contact.png') });
  });

  test('15-window-chatbot', async ({ page }) => {
    await loginAndWaitForDesktop(page);
    await openWindow(page, 'chatbot');
    await page.locator('[data-testid="window-chatbot"]').screenshot({ path: path.join(SCREENSHOT_DIR, '15-window-chatbot.png') });
  });

  test('16-window-help', async ({ page }) => {
    await loginAndWaitForDesktop(page);
    await openWindow(page, 'help');
    await page.locator('[data-testid="window-help"]').screenshot({ path: path.join(SCREENSHOT_DIR, '16-window-help.png') });
  });
});

test.describe('QA Round 2 — Full page & stress', () => {
  test('17-desktop-with-about-only', async ({ page }) => {
    await loginAndWaitForDesktop(page);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '17-desktop-with-about-only.png'), fullPage: false });
  });

  test('18-desktop-multiple-windows', async ({ page }) => {
    await loginAndWaitForDesktop(page);
    await openWindow(page, 'resume');
    await openWindow(page, 'projects');
    await openWindow(page, 'contact');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '18-desktop-multiple-windows.png'), fullPage: false });
  });

  test('19-taskbar-many-windows', async ({ page }) => {
    await loginAndWaitForDesktop(page);
    await openWindow(page, 'resume');
    await openWindow(page, 'projects');
    await openWindow(page, 'experience');
    await openWindow(page, 'skills');
    await openWindow(page, 'contact');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '19-taskbar-many-windows.png'), fullPage: false });
  });

  test('20-desktop-icons-closeup', async ({ page }) => {
    await loginAndWaitForDesktop(page);
    await page.locator('.desktop-icon-grid').screenshot({ path: path.join(SCREENSHOT_DIR, '20-desktop-icons-closeup.png') });
  });
});

test.describe('QA Round 2 — Mobile', () => {
  test('21-mobile-390-login', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('');
    await page.waitForSelector('[data-testid="login-dialog"]', { timeout: 20000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '21-mobile-390-login.png'), fullPage: true });
  });

  test('22-mobile-390-lite', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('');
    await page.waitForSelector('[data-testid="login-dialog"]', { timeout: 20000 });
    await page.getByRole('button', { name: /log on as dayyan/i }).click();
    await page.waitForSelector('.mobile-lite', { timeout: 10000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '22-mobile-390-lite.png'), fullPage: true });
  });

  test('23-mobile-320-lite', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('');
    await page.waitForSelector('[data-testid="login-dialog"]', { timeout: 20000 });
    await page.getByRole('button', { name: /log on as dayyan/i }).click();
    await page.waitForSelector('.mobile-lite', { timeout: 10000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '23-mobile-320-lite.png'), fullPage: true });
  });
});

test.describe('QA Round 2 — Window chrome & focus', () => {
  test('24-window-title-bar-buttons', async ({ page }) => {
    await loginAndWaitForDesktop(page);
    await page.waitForSelector('[data-testid="window-about"]', { timeout: 5000 });
    await page.locator('.window-title').first().screenshot({ path: path.join(SCREENSHOT_DIR, '24-window-title-bar-buttons.png') });
  });

  test('25-window-about-content-area', async ({ page }) => {
    await loginAndWaitForDesktop(page);
    await page.waitForSelector('[data-testid="window-about"]', { timeout: 5000 });
    await page.locator('.window-content.app-about').screenshot({ path: path.join(SCREENSHOT_DIR, '25-window-about-content-area.png') });
  });
});
