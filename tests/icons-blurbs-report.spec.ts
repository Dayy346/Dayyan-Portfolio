import { test, type Page } from '@playwright/test';
import path from 'node:path';

const SHOTS = path.resolve('docs/qa-icons-round2');

const sampleRepos = [
  { name: 'collablab-platform', language: 'Vue', stargazers_count: 12, description: 'EdTech platform — Vue + Node, AWS Fargate.', html_url: 'https://github.com/dayy346/collablab-platform', fork: false },
  { name: 'rag-bench', language: 'Python', stargazers_count: 9, description: 'RAG retrieval benchmarking with Azure AI Search.', html_url: 'https://github.com/dayy346/rag-bench', fork: false },
  { name: 'nfl-pass-rush', language: 'Python', stargazers_count: 5, description: 'NFL tracking-data ML pipeline.', html_url: 'https://github.com/dayy346/nfl-pass-rush', fork: false },
  { name: 'nn-from-scratch', language: 'Python', stargazers_count: 3, description: 'A neural-net trainer in pure NumPy.', html_url: 'https://github.com/dayy346/nn-from-scratch', fork: false }
];

async function stubGitHub(page: Page) {
  await page.route('https://api.github.com/users/dayy346/repos*', (route) =>
    route.fulfill({ status: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sampleRepos) })
  );
}

async function bootAndLogin(page: Page) {
  await stubGitHub(page);
  await page.goto('');
  const bootCancel = page.getByTestId('boot-cancel');
  if ((await bootCancel.count()) > 0) {
    for (let i = 0; i < 6; i++) {
      const visible = await bootCancel.isVisible().catch(() => false);
      const disabled = await bootCancel.isDisabled().catch(() => true);
      if (visible && !disabled) {
        await bootCancel.click().catch(() => {});
        break;
      }
      await page.waitForTimeout(300);
    }
    await page.getByTestId('boot-dialog').waitFor({ state: 'detached', timeout: 7_000 }).catch(() => {});
  }
  const loginDialog = page.getByTestId('login-dialog');
  if ((await loginDialog.count()) > 0) {
    const loginButton = page.getByTestId('login-button');
    await loginButton.waitFor({ state: 'visible', timeout: 10_000 });
    await page.waitForTimeout(400);
    for (let attempt = 0; attempt < 5; attempt++) {
      await loginButton.dispatchEvent('click');
      await page.waitForTimeout(700);
      const stillThere = await loginDialog.count();
      if (stillThere === 0) break;
    }
  }
  await page.getByTestId('desktop').waitFor({ state: 'visible', timeout: 20_000 });
  await page.waitForTimeout(900);
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function openApp(page: Page, label: string) {
  const startBtn = page.getByTestId('start-button');
  await startBtn.click();
  const menu = page.getByTestId('start-menu');
  await menu.waitFor({ state: 'visible' });
  const item = menu.getByRole('menuitem', { name: new RegExp(`^${escapeRe(label)}\\b`) });
  await item.first().click();
  await page.waitForSelector(`section.window[aria-label="${label} window"]`, { timeout: 8000 });
  await page.waitForTimeout(500);
}

async function closeWindow(page: Page, label: string) {
  const win = page.locator(`section.window[aria-label="${label} window"]`);
  await win.locator('button[aria-label*="Close"], button[title*="Close"]').first().click().catch(() => {});
}

test.describe('Round-2 icons + blurbs', () => {
  test.setTimeout(120_000);

  test('desktop overview + icons close-up', async ({ page }) => {
    await bootAndLogin(page);
    await page.screenshot({ path: path.join(SHOTS, '00-desktop-overview.png') });
    const grid = page.locator('[data-testid="desktop-icon-grid"], .desktop-icons').first();
    if (await grid.isVisible().catch(() => false)) {
      await grid.screenshot({ path: path.join(SHOTS, '01-desktop-icons-closeup.png') });
    }
  });

  test('start menu icons', async ({ page }) => {
    await bootAndLogin(page);
    await page.getByTestId('start-button').click();
    await page.getByTestId('start-menu').waitFor();
    await page.waitForTimeout(350);
    await page.screenshot({ path: path.join(SHOTS, '02-start-menu.png') });
  });

  test('github widget close-up', async ({ page }) => {
    await bootAndLogin(page);
    await page.waitForTimeout(2200);
    const gh = page.locator('.desktop-widget-github').first();
    if (await gh.isVisible().catch(() => false)) {
      await gh.screenshot({ path: path.join(SHOTS, '03-github-widget.png') });
    }
  });

  const apps: Array<{ label: string; file: string }> = [
    { label: 'About.me', file: '04-about.png' },
    { label: 'Projects.dir', file: '05-projects.png' },
    { label: 'Resume.pdf', file: '06-resume.png' },
    { label: 'Experience.log', file: '07-experience.png' },
    { label: 'Skills.cfg', file: '08-skills.png' },
    { label: 'Contributions.log', file: '09-contributions.png' },
    { label: 'Extracurricular.log', file: '10-power.png' },
    { label: 'LeetCode.trn', file: '11-leetcode.png' },
    { label: 'Contact.net', file: '12-contact.png' },
    { label: 'Assist.chat', file: '13-chatbot.png' }
  ];

  for (const app of apps) {
    test(`window — ${app.file}`, async ({ page }) => {
      await bootAndLogin(page);
      await openApp(page, app.label);
      const win = page.locator(`section.window[aria-label="${app.label} window"]`);
      await win.screenshot({ path: path.join(SHOTS, app.file) });
      await closeWindow(page, app.label);
    });
  }
});
