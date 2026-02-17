# QA Automation Report

**Project:** Dayyan-Portfolio (branch `redesign/retro-os-v3-frontend`)
**Date:** 2026-02-17

## Scope
Automated Playwright scenarios were added to exercise the primary Dayyan.OS shell flows:
- Dayyan BIOS boot experience (skip + transition to desktop)
- Desktop interactions (START menu, window controls, window content)
- Window operations (minimize, maximize, close)
- App-specific content for every window (About, Showcase, Projects, Experience, Skills, Frontend, Power, Contact, Help)
- Keyboard shortcuts (Alt+Tab + Ctrl+M)
- Mobile fallback (Lite view when viewport < 920px)

## Findings
- Latest runs (2026-02-17 20:12 UTC) are failing because Playwright can't bring up the start menu (`aside.start-menu[role="menu"]`) after clicking ⏻ START, so the boot and subsequent window flows abort before interacting with the desktop.
- That failure cascades into the windows/minimize/content/keyboard shortcut suites; traces are captured under `test-results/qa-Dayyan-OS-QA-experience-*/trace.zip`. We're re-running QA every ~20 s so the Continuous QA Log captures the latest behavior.

## Artifacts
- Playwright configuration and tests were added under `playwright.config.ts` and `tests/qa.spec.ts` to enable future QA automation.
- A dedicated `test:qa` npm script now runs the suite (`npx playwright test`).

## Next Steps
- Investigate why the start menu (`aside.start-menu[role="menu"]`) no longer becomes visible when ⏻ START is toggled after skipping boot; resolving that will unblock the desktop interaction coverage.
- Keep the continuous runner (`scripts/continuous-qa-loop.sh`) executing `npm run test:qa` through 22:00 UTC so the log captures whether the failure resolves or persists.

## Continuous QA Log
- 2026-02-17 20:05 UTC — `npm run test:qa` (Playwright) → 5 tests passed (boot, windows, content, shortcuts, mobile lite). No regressions observed.
- 2026-02-17 20:06 UTC — `npm run test:qa` (Playwright) → 5 tests passed again; flows remain stable on reruns.
- 2026-02-17 20:07 UTC — `npm run test:qa` (Playwright) → 5 tests passed; repeated stability confirmed.
- 2026-02-17 20:12 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:13 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:14 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:15 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:16 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:17 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:18 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:19 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:20 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:21 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:22 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:22 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:23 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:24 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:25 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:26 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:27 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:28 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:29 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:30 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:31 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:31 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:32 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:33 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:36 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:37 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:38 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:39 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:40 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:40 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:41 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:42 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:43 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:44 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:45 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:46 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:47 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:47 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:48 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:49 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:50 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:51 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:52 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:53 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:54 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:55 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:56 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:57 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:58 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:58 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 20:59 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 21:00 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 21:01 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 21:02 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 21:03 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 21:04 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
- 2026-02-17 21:05 UTC — npm run test:qa (Playwright) → FAILED (check Playwright output)
