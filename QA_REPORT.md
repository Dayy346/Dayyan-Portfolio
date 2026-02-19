# QA Automation Report

**Project:** Dayyan-Portfolio (branch `redesign/retro-os-v3-frontend`)
**Date:** 2026-02-18

## Scope
Playwright exercises cover the Win95 boot/login ritual, desktop navigation (start menu, window controls, focus cycling), content windows (About, Showcase, Projects, Experience, Skills, Frontend, Power, Contact, Help), keyboard shortcuts (Alt+Tab, Ctrl+M), hero signal/status widgets, and the mobile-lite fallback.

## Recent Runs
| Timestamp (UTC) | Command | Result | Notes |
| --- | --- | --- | --- |
| 2026-02-19 02:11 | `npm run test:qa` | ✅ Passed | Verified the GitHub and LeetCode widgets plus the windows chrome with the new data-testid coverage. |
| 2026-02-18 23:34 | `npm run test:qa` | ✅ Passed | Validated the transfer dialog boot, login overlay telemetry, and desktop transitions with the new data-testid coverage. |
<<<<<<< HEAD
| 2026-02-18 22:16 | `npm run test:qa` | ✅ Passed | Updated the login expectation to the new “Press Enter to log on” copy, reran the full suite, and confirmed all 8 scenarios pass with the Win95 boot/login refresh. |
=======
| 2026-02-19 02:11 | `npm run test:qa` | ✅ Passed | Verified GitHub + LeetCode widgets and taskbar/windows polish with data-testid coverage.|
>>>>>>> 0d53d37 (P4: add GitHub and LeetCode widgets)
| 2026-02-18 20:17 | `npm run test:qa` | ❌ Failed | Login button was off-screen; skip helper clicked `Press to log on` until the timeout. Trace saved under `test-results/qa-Dayyan-OS-QA-experience-*/trace.zip`. |
| 2026-02-18 20:18 | `npm run test:qa` | ❌ Failed | Same failure repeated after the click helper scroll attempts. |
| 2026-02-18 20:19 | `npm run test:qa` | ✅ Passed | Added keyboard-driven login helper (focus + `Enter`) so Playwright now skips the boot and logs in through the new `BootSequence` + login overlay. All 8 scenarios pass consistently. |

## Artifacts
- `tests/qa.spec.ts` now exposes stable `data-testid` attributes (`boot-sequence-dialog`, `start-button`, `desktop`, `window-strip`, etc.), a smarter `skipBootToDesktop` helper (optional login, keyboard enter), and new tests for the transfer dialog, login overlay, and desktop transitions.
- `npm run test:qa` maps to `npx playwright test` and is the canonical command to re-run the suite.
- Traces from the failing runs are archived under `test-results/` (deleted after reruns but basic history still in filesystem if needed). The latest successful run produced no artifacts beyond the standard Playwright reports.

## Next Steps
1. Keep the login helper key-driven so Playwright doesn’t need to scroll the button; this is stable now but keep an eye on new layout tweaks.
2. Expand tests to cover the Recruiter hero signal and hero/desktop copy once P0 content windows land.
3. Record rerun artifacts (screenshots/traces) only when tests fail so the repo stays clean.
