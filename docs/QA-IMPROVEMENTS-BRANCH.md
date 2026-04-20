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

### Round-2 captures (`docs/qa-icons-round2/`)

After feedback that the icons looked uniform and the GitHub heatmap had become unreadable, this round replaced the Lucide-on-blue-tile system with **per-app custom SVGs** and widened the GitHub widget.

| File | What it shows |
|------|----------------|
| `00-desktop-overview.png` | Desktop with new icons + readable GitHub heatmap (months + weekday labels visible) |
| `01-desktop-icons-closeup.png` | Vertical strip of all desktop icons — each one a different colored tile + glyph |
| `02-start-menu.png` | Start menu with the same new icon set in 24px form |
| `03-github-widget.png` | GitHub widget close-up — wide enough to read each contribution cell |
| `04-about.png` … `13-chatbot.png` | Each app window with new resume-aligned blurb |

Regenerate: `npx playwright test tests/icons-blurbs-report.spec.ts`

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

### Round 1
- **Resume-driven copy** in `src/data.ts`, About, Experience panels, Assist project list — aligned to **Resume_Dayyan_2026** (PDF text extraction).
- **`public/assets/resume.pdf`** — copy of your downloaded PDF for the Download / View links.
- **Desktop icons (round 1)** — `AppShellIcon` (Lucide-react) in XP-style frosted tiles.
- **GitHub desktop widget (round 1)** — narrowed + `object-fit: contain` heatmap.
- **App windows** — `app-panel-frame`, projects intro, **contact card grid** (primary **dayyan6093@gmail.com**), phone link.
- **Playwright** — `baseURL` fixed to **`…/Dayyan-Portfolio/`** (`playwright.config.ts`, `tests/qa.spec.ts`, `tests/qa-screenshots.spec.ts`).

### Round 2 (icons + blurbs)
- **`AppShellIcon` rebuilt with per-app inline SVGs** — each app now has its own colored tile and glyph (blue badge for About, brown briefcase for Experience, yellow folder for Projects, orange gear for Skills, red barbell for Extracurricular, red envelope with `@` for Contact, teal bot for Assist, etc.). No more uniform Lucide-on-blue look.
- **Desktop label contrast** — switched icon labels to white text + heavy dark drop-shadow so they stay legible on both the sky and the green grass halves of the XP wallpaper.
- **GitHub widget widened to 420px** — chart wrap moved to a light `#ebedf0` GitHub-style backdrop (no more `mix-blend-mode: multiply` washing out faint contributions). Image renders at native ratio so each cell, weekday label, and month is readable.
- **Sharper resume-aligned blurbs** added/rewritten for About, Projects, Contributions, Skills, Extracurricular, LeetCode, Contact, Chatbot, Resume — each window now opens with a 1–3 sentence intro that names concrete tech, employers, and outcomes (Omnicom Health, CollabLab Vue + Node + Fargate, RAG benchmarking, East Coast Powerlifting Championships, etc.) instead of generic copy.
- **`tests/icons-blurbs-report.spec.ts`** — Playwright suite that boots through the Win9x dialog, logs in via the XP screen, and captures the desktop, start menu, GitHub widget close-up, and every app window. Stored in `docs/qa-icons-round2/`.
- **`playwright.config.ts`** — pinned to port `5173` to reuse the long-running Vite dev server instead of spawning a duplicate.

---

## Recommended merge order into `main`

1. **Playwright base URL + screenshot tests** — prevents wrong-route tests.
2. **Resume PDF + `data.ts` copy** — single source of truth for recruiters.
3. **GitHub widget + icons + panel chrome** — visible UX win.
4. **LeetCode CORS fix** — separate PR (proxy, serverless, or remove client fetch).
5. **Rewrite or quarantine `tests/qa.spec.ts`** — align with Win9x boot or delete obsolete cases.

---

*Generated for branch `improvements` — keep this file updated when you fix Q-01–Q-07.*
