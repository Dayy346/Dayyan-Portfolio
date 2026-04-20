# QA Report — `improvements` branch

This report lists **issues observed**, **evidence (screenshots)**, and **what changed on this branch** so you can prioritize merges into `main`.

---

## How this was tested

| Method | Scope |
|--------|--------|
| **Chrome DevTools MCP** | Live production site — full-page capture + console messages |
| **Playwright** | Local dev (`baseURL` includes `/Dayyan-Portfolio/`) — window-level screenshots |

**Note:** Cursor’s Chrome MCP runs outside your machine; it cannot open `localhost`. Production was used for MCP; local Playwright covers post-change UI.

---

## Screenshot index

### Chrome MCP (production, pre-merge snapshot)

| File | What it shows |
|------|----------------|
| `docs/qa-improvements-mcp/mcp-01-boot-login-view.png` | Boot / login viewport on **live** GitHub Pages |

### Playwright (`improvements` branch — local)

| File | What it shows |
|------|----------------|
| `docs/qa-improvements-branch/sc-01-login.png` | XP login shell |
| `docs/qa-improvements-branch/sc-02-desktop.png` | Desktop with **compact GitHub widget**, LeetCode widget, **new Lucide tile icons** |
| `docs/qa-improvements-branch/sc-03-about.png` | About window — updated copy |
| `docs/qa-improvements-branch/sc-04-projects.png` | Projects window — intro + repositories |
| `docs/qa-improvements-branch/sc-05-contact.png` | Contact window — card grid + primary Gmail |
| `docs/qa-improvements-branch/sc-06-contributions.png` | Contributions + GitHub activity feed |

**Regenerate Playwright captures:**  
`npx playwright test tests/qa-improvements-report.spec.ts`

---

## Issues still broken / risky (prioritize)

### P0 — Functional

| ID | Issue | Evidence / notes |
|----|---------|-------------------|
| **Q-01** | **LeetCode stats API** (`leetcode-stats-api.herokuapp.com`) blocked by **CORS** on GitHub Pages | Chrome MCP console: CORS error + failed fetch. Widget falls back but live stats fail in production. |
| **Q-02** | **`tests/qa.spec.ts` is outdated** — expects removed `boot-sequence-dialog`, old mobile headings, wrong boot flow | Running `npx playwright test tests/qa.spec.ts` fails — not updated for Win9x boot + current shell. Needs rewrite or archive. |

### P1 — UX / polish

| ID | Issue | Notes |
|----|---------|-------|
| **Q-03** | **Favicon** | `index.html` icon path casing fixed toward `/Dayyan-Portfolio/assets/favicon.ico` — **asset file may still be missing** (404 until you add `public/assets/favicon.ico`). |
| **Q-04** | **Contributions feed** depends on **GitHub public API rate limits** | Anonymous requests can fail under load; feed uses localStorage cache + fallback copy. |
| **Q-05** | **Taskbar / tray** still mixes Lucide **Cloud** + emoji volume (from earlier audits) | Not redesigned on this branch — still in `docs/TICKETS-QA-AUDIT-ROUND2.md`. |

### P2 — Content / design

| ID | Issue | Notes |
|----|---------|-------|
| **Q-06** | **Assist.chat** `/chat` may 404 locally — falls back to rule-based replies | Expected for static hosting unless API is wired. |
| **Q-07** | **21st.dev** | This branch uses **card-style panels** (`app-panel-frame`), **contact grid**, **Lucide icons** — aligned with modern component patterns; not a literal copy-paste from 21st.dev registry. |

---

## What changed on branch `improvements`

- **Resume-driven copy** in `src/data.ts`, About, Experience panels, Assist project list — aligned to **Resume_Dayyan_2026** (PDF text extraction).
- **`public/assets/resume.pdf`** — copy of your downloaded PDF for the Download / View links.
- **Desktop icons** — `AppShellIcon` (**Lucide**) in XP-style tiles (`src/components/icons/AppShellIcon.tsx`).
- **GitHub desktop widget** — **no longer ~770px wide**; compact width + **`object-fit: contain`** heatmap (`DesktopGitHubWidget.tsx`, `styles.css`).
- **App windows** — `app-panel-frame`, projects intro, **contact card grid** (primary **dayyan6093@gmail.com**), phone link.
- **Playwright** — `baseURL` fixed to **`…/Dayyan-Portfolio/`** and navigation uses **`page.goto('')`** where needed (`playwright.config.ts`, `tests/qa.spec.ts`, `tests/qa-screenshots.spec.ts`).

---

## Recommended merge order into `main`

1. **Playwright base URL + screenshot tests** — prevents wrong-route tests.
2. **Resume PDF + `data.ts` copy** — single source of truth for recruiters.
3. **GitHub widget + icons + panel chrome** — visible UX win.
4. **LeetCode CORS fix** — separate PR (proxy, serverless, or remove client fetch).
5. **Rewrite or quarantine `tests/qa.spec.ts`** — align with Win9x boot or delete obsolete cases.

---

*Generated for branch `improvements` — keep this file updated when you fix Q-01–Q-07.*
