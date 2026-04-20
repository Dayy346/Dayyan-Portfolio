import { defineConfig } from '@playwright/test';

// Audits production (GitHub Pages). No local dev server.
export default defineConfig({
  testDir: './tests',
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    // Trailing slash matters: with this baseURL, use page.goto('') not page.goto('/') (/' resets to gh.io root).
    baseURL: 'https://dayy346.github.io/Dayyan-Portfolio/',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15_000,
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry'
  }
});
