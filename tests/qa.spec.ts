import { test, expect, type Page } from '@playwright/test';
import { apps } from '../src/data';

const sampleRepos = [
  {
    name: 'retro-os-shell',
    language: 'TypeScript',
    stargazers_count: 42,
    description: 'Retro OS shell runtime',
    html_url: 'https://github.com/dayy346/retro-os-shell',
    fork: false
  },
  {
    name: 'vintage-dashboard',
    language: 'Vue',
    stargazers_count: 31,
    description: 'Retro dashboard experience',
    html_url: 'https://github.com/dayy346/vintage-dashboard',
    fork: false
  },
  {
    name: 'botnet-ops',
    language: 'Python',
    stargazers_count: 28,
    description: 'Automation tooling for retro kits',
    html_url: 'https://github.com/dayy346/botnet-ops',
    fork: false
  },
  {
    name: 'azure-shell',
    language: 'Python',
    stargazers_count: 19,
    description: 'Azure automation utilities',
    html_url: 'https://github.com/dayy346/azure-shell',
    fork: false
  }
];

const appChecks = [
  { label: 'About.me', text: 'Dayyan Hamid' },
  { label: 'Showcase.exe', text: 'Window Manager Primitives' },
  { label: 'Projects.dir', text: 'Top GitHub Projects', extra: sampleRepos[0].name },
  { label: 'Experience.log', text: 'Software Engineer — FCB Health' },
  { label: 'Skills.cfg', text: 'React + TS Design Systems' },
  { label: 'Frontend.lab', text: 'Frontend Focus Highlights' },
  { label: 'Power.stats', text: 'Meet Result' },
  { label: 'Contact.net', text: 'Copy Email' },
  { label: 'Help.txt', text: 'Keyboard Shortcuts' }
];

const windowSelector = (label: string) => `section.window[aria-label="${label} window"]`;

function labelForAppId(appId: string) {
  return apps.find((app) => app.id === appId)?.label ?? appId;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function stubRepos(page: Page) {
  await page.route('https://api.github.com/users/dayy346/repos*', (route) =>
    route.fulfill({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sampleRepos)
    })
  );
}

type SkipBootOptions = { expectDesktop?: boolean; expectSessionActive?: boolean; login?: boolean };

async function skipBootToDesktop(page: Page, options?: SkipBootOptions) {
  await page.goto('/');
  const login = options?.login ?? true;
  const expectDesktop = options?.expectDesktop ?? login;
  const expectSessionActive = options?.expectSessionActive ?? login;
  const bootDialog = page.getByTestId('boot-sequence-dialog');
  if ((await bootDialog.count()) > 0) {
    await expect(bootDialog).toBeVisible();
    await page.getByTestId('boot-skip-button').click();
    await expect(bootDialog).toHaveCount(0);
  }
  const loginDialog = page.getByTestId('login-dialog');
  if (login && (await loginDialog.count()) > 0) {
    await expect(loginDialog).toBeVisible();
    const loginOverlay = page.getByTestId('login-overlay');
    await expect(loginOverlay).toBeVisible();
    const loginButton = loginOverlay.getByTestId('login-button');
    await expect(loginButton).toBeEnabled();
    await loginOverlay.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await loginButton.scrollIntoViewIfNeeded({ timeout: 3000 });
    await loginButton.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('login-overlay')).toHaveCount(0);
    await expect(page.getByTestId('login-dialog')).toHaveCount(0);
    await expect(page.getByTestId('login-overlay')).toHaveCount(0);
    await expect(page.getByTestId('login-dialog')).toHaveCount(0);
  }
  if (expectDesktop) {
    await expect(page.getByTestId('desktop')).toBeVisible();
  }
  if (expectSessionActive) {
    await expect(page.getByText('Session Active')).toBeVisible();
  }
}

async function openStartMenu(page: Page) {
  const startBtn = page.getByTestId('start-button');
  await startBtn.click();
  const menu = page.getByTestId('start-menu');
  await expect(menu).toBeVisible();
  return menu;
}

async function openAppWindow(page: Page, label: string) {
  const menu = await openStartMenu(page);
  const menuItem = menu.getByRole('menuitem', { name: new RegExp(`${escapeRegExp(label)}$`) });
  await menuItem.click();
  const window = page.locator(windowSelector(label));
  await expect(window).toBeVisible();
  await expect(menu).toHaveCount(0);
  return window;
}

test.describe('Portfolio QA experience flows', () => {
  test.beforeEach(async ({ page }) => {
    await stubRepos(page);
  });

  test('boot sequence reaches the desktop and start menu toggles', async ({ page }) => {
    await skipBootToDesktop(page);
    const startMenu = page.getByTestId('start-menu');
    const startBtn = page.getByTestId('start-button');
    await startBtn.click();
    await expect(startMenu).toBeVisible();
    await page.getByTestId('desktop').click();
    await expect(startMenu).toHaveCount(0);
  });

  test('Win95 file transfer boot dialog surfaces telemetry and controls', async ({ page }) => {
    await page.goto('/');
    const bootDialog = page.getByTestId('boot-sequence-dialog');
    await expect(bootDialog).toBeVisible();
    const transferDialog = bootDialog.getByTestId('file-transfer-dialog');
    await expect(transferDialog).toBeVisible();
    await expect(transferDialog.getByTestId('file-transfer-status')).toContainText(/Transferring|Transfer paused/);
    const toggle = transferDialog.getByTestId('file-transfer-toggle');
    await expect(toggle).toHaveText('Pause');
    await toggle.click();
    await expect(toggle).toHaveText('Resume');
    const logToggle = transferDialog.getByTestId('file-transfer-log-toggle');
    await logToggle.click();
    await expect(transferDialog.getByTestId('file-transfer-log')).toBeVisible();
    await expect(transferDialog.getByTestId('file-transfer-log')).toContainText('Preparing');
    await expect(transferDialog.getByTestId('file-transfer-queue')).toContainText('SignalKernel.sys');
    await expect(transferDialog.getByTestId('file-transfer-note')).toContainText(/Frame-accurate|Static/);
  });

  test('login overlay surfaces telemetry and search link', async ({ page }) => {
    await skipBootToDesktop(page, { login: false, expectDesktop: false, expectSessionActive: false });
    const overlay = page.getByTestId('login-overlay');
    await expect(overlay).toBeVisible();
    await expect(overlay.getByTestId('login-data-status')).toContainText('Secure contributions telemetry');
    await expect(overlay.getByTestId('view-resume-link')).toHaveAttribute('href', '/assets/resume.pdf');
    const loginButton = overlay.getByTestId('login-button');
    await expect(loginButton).toHaveText('OK');
  });

  test('desktop transitions from boot to login to hero ready state', async ({ page }) => {
    await page.goto('/');
    const bootDialog = page.getByTestId('boot-sequence-dialog');
    await expect(bootDialog).toBeVisible();
    await page.getByTestId('boot-skip-button').click();
    await expect(bootDialog).toHaveCount(0);
    const loginOverlay = page.getByTestId('login-overlay');
    await expect(loginOverlay).toBeVisible();
    const loginButton = loginOverlay.getByTestId('login-button');
    await loginButton.click();
    await expect(page.getByTestId('login-overlay')).toHaveCount(0);
    await expect(page.getByTestId('desktop')).toBeVisible();
    await expect(page.locator('.os-shell')).toHaveClass(/ready/);
    await expect(page.getByTestId('window-strip')).toBeVisible();
    await expect(page.getByTestId('desktop-story-widget')).toContainText('Session Active');
  });

  test('windows can be minimized, maximized, and closed via controls', async ({ page }) => {
    await skipBootToDesktop(page);
    const aboutWindow = await openAppWindow(page, 'About.me');
    await aboutWindow.locator('button[aria-label="Minimize About.me"]').click();
    await expect(page.locator(windowSelector('About.me'))).toHaveCount(0);

    const reopened = await openAppWindow(page, 'About.me');
    const maximize = reopened.locator('button[aria-label="Maximize About.me"]');
    await maximize.click();
    await expect(reopened).toHaveClass(/maxed/);
    await maximize.click();
    await expect(reopened).not.toHaveClass(/maxed/);

    await reopened.locator('button[aria-label="Close About.me"]').click();
    await expect(page.locator(windowSelector('About.me'))).toHaveCount(0);
  });

  test('each app window surfaces its intended content', async ({ page }) => {
    await skipBootToDesktop(page);
    for (const descriptor of appChecks) {
      const window = await openAppWindow(page, descriptor.label);
      await expect(window).toContainText(descriptor.text);
      if (descriptor.extra) {
        await expect(window).toContainText(descriptor.extra);
      }
      await window.locator(`button[aria-label="Close ${descriptor.label}"]`).click();
      await expect(page.locator(windowSelector(descriptor.label))).toHaveCount(0);
    }
  });

  test('keyboard shortcuts navigate windows and minimize', async ({ page }) => {
    await skipBootToDesktop(page);
    await openAppWindow(page, 'About.me');
    await openAppWindow(page, 'Showcase.exe');
    const windowStrip = page.getByTestId('window-strip');
    const getFocusedAppId = async () => {
      const focusedBtn = windowStrip.locator('button[aria-pressed="true"]').first();
      await expect(focusedBtn).toBeVisible();
      const appId = await focusedBtn.getAttribute('data-app');
      expect(appId).toBeTruthy();
      return appId!;
    };
    const initialFocus = await getFocusedAppId();
    await page.keyboard.down('Alt');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Alt');
    const nextFocus = await getFocusedAppId();
    expect(nextFocus).not.toBe(initialFocus);
    await page.keyboard.down('Control');
    await page.keyboard.press('m');
    await page.keyboard.up('Control');
    const minimizedLabel = labelForAppId(nextFocus);
    await expect(page.locator(windowSelector(minimizedLabel))).toHaveCount(0);
    const minimizedBtn = windowStrip.getByTestId(`window-strip-${nextFocus}`);
    await expect(minimizedBtn).toHaveAttribute('aria-pressed', 'false');
  });

  test('desktop story widget surfaces the hero signal updates', async ({ page }) => {
    await skipBootToDesktop(page);
    const heroWidget = page.getByTestId('desktop-story-widget');
    const heroSignals = ['Focused:', 'GitHub feed', 'Desktop is online'];
    for (const signal of heroSignals) {
      await expect(heroWidget).toContainText(signal);
    }
  });

  test('window strip badges expose repo status and mood tokens', async ({ page }) => {
    await skipBootToDesktop(page);
    const windowStrip = page.getByTestId('window-strip');
    await expect(windowStrip).toContainText('About.me');
    const statusHub = page.locator('.status-hub');
    await expect(statusHub).toContainText('Network ready');
    await expect(statusHub).toContainText('Premium sync');
    const moodButton = page.getByRole('button', { name: /Cycle desktop mood/i });
    await expect(moodButton).toContainText('Theme:');
  });

  test('mobile view renders the Lite experience after boot', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 800 });
    await skipBootToDesktop(page, { expectDesktop: false, expectSessionActive: false });
    await expect(page.getByRole('heading', { name: 'Portfolio · Mobile' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Featured Repositories' })).toBeVisible();
    await expect(page.getByText(sampleRepos[0].name)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Download Resume' })).toBeVisible();
  });
});
