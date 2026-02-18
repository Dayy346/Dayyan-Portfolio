import { test, expect, type Page } from '@playwright/test';

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

async function skipBootToDesktop(page: Page) {
  await page.goto('/');
  const bootDialog = page.getByRole('dialog', { name: /Dayyan OS.*boot/i });
  await expect(bootDialog).toBeVisible();
  await page.getByRole('button', { name: /skip boot|continue/i }).click();
  const loginDialog = page.getByRole('dialog', { name: /Windows 95 login/i });
  await expect(loginDialog).toBeVisible();
  await page.getByRole('button', { name: /press to log on/i }).click();
  await expect(loginDialog).toHaveCount(0);
  await expect(page.locator('main.desktop')).toBeVisible();
  await expect(page.locator('.login-overlay')).toHaveCount(0);
  await expect(page.getByText('Session Active')).toBeVisible();
}

async function openStartMenu(page: Page) {
  const startBtn = page.getByRole('button', { name: '⏻ START' });
  await startBtn.click();
  const menu = page.locator('aside.start-menu[role="menu"]');
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

test.describe('Dayyan.OS QA experience flows', () => {
  test.beforeEach(async ({ page }) => {
    await stubRepos(page);
  });

  test('boot sequence reaches the desktop and start menu toggles', async ({ page }) => {
    await skipBootToDesktop(page);
    const startMenu = page.locator('aside.start-menu[role="menu"]');
    const startBtn = page.getByRole('button', { name: '⏻ START' });
    await startBtn.click();
    await expect(startMenu).toBeVisible();
    await page.locator('main.desktop').click();
    await expect(startMenu).toHaveCount(0);
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
    await page.keyboard.down('Alt');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Alt');
    await expect(page.locator(windowSelector('About.me'))).toHaveClass(/focused/);
    await page.keyboard.down('Control');
    await page.keyboard.press('m');
    await page.keyboard.up('Control');
    await expect(page.locator(windowSelector('About.me'))).toHaveCount(0);
  });

  test('desktop story widget surfaces the hero signal updates', async ({ page }) => {
    await skipBootToDesktop(page);
    const heroWidget = page.locator('section.desktop-story-widget');
    const heroSignals = [
      'CollabLab Leadership',
      'Junior AI Engineer',
      'Kaggle Notebook · Retro Signals',
      'GitHub Contributions'
    ];
    for (const signal of heroSignals) {
      await expect(heroWidget).toContainText(signal);
    }
  });

  test('window strip badges expose repo status and mood tokens', async ({ page }) => {
    await skipBootToDesktop(page);
    const windowStrip = page.locator('footer.window-strip');
    await expect(windowStrip).toContainText(/GitHub feed/i);
    await expect(windowStrip).toContainText(/mood/i);
  });

  test('mobile view renders the Lite experience after boot', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 800 });
    await page.goto('/');
    await page.getByRole('button', { name: /skip boot|continue/i }).click();
    await expect(page.getByRole('heading', { name: 'Dayyan.OS Mobile Lite' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Featured Repositories' })).toBeVisible();
    await expect(page.getByText(sampleRepos[0].name)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Download Resume' })).toBeVisible();
  });
});
