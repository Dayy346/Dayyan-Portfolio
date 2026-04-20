# Portfolio UI — QA Visual Audit (Win95/XP-Inspired)

Implementation-ready tickets from a full UI audit. Goal: clean, readable, usable site with a coherent Windows 95/XP–inspired design system.

**How to capture evidence:** Run `npx playwright test tests/qa-screenshots.spec.ts` (it starts the dev server automatically). Screenshots are saved to `docs/qa-screenshots/`. Manually capture additional states (e.g. other app windows, taskbar overflow) as needed.

---

## TICKET-001: Taskbar tray uses Lucide Cloud icon (style mismatch)

- **Severity:** Medium
- **Area:** Taskbar / system tray
- **Environment:** Desktop, all browsers
- **Steps to Reproduce:**
  1. Boot and log in.
  2. Look at the taskbar right side (tray area).
  3. Compare the Cloud icon with the WiFi SVG and the volume emoji.
- **Expected:** All tray icons share the same visual language (e.g. XP-style 16×16 SVG, same stroke/weight).
- **Actual:** Cloud is from `lucide-react` (different stroke weight and proportions); WiFi is inline SVG; volume is emoji (🔊). Inconsistent look.
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/03-desktop-taskbar.png`
  - Code: `App.tsx` line ~469: `<Cloud size={20} strokeWidth={2} />`
- **Root Cause (hypothesis):** Tray icons were added from different sources (Lucide, custom SVG, emoji) without a unified icon set.
- **Proposed Fix:** Replace Lucide Cloud and emoji with XP-style inline SVGs in a small `TrayIcons.tsx` (or extend XPIcons) so tray icons match the rest of the shell.
- **Acceptance Criteria:**
  - [ ] Tray uses only XP-style SVGs (or a single consistent set).
  - [ ] Cloud and volume icons match WiFi icon weight and size (e.g. 16×16 or 20×20).
  - [ ] No Lucide or emoji in the taskbar tray.

---

## TICKET-002: Window title bar buttons use Unicode/emoji instead of XP-style icons

- **Severity:** High
- **Area:** Window chrome (minimize, maximize, close)
- **Environment:** Desktop, all browsers
- **Steps to Reproduce:**
  1. Open any app window (e.g. About Me).
  2. Look at the title bar right: — (minimize), 🗗/🗖 (maximize), ✕ (close).
- **Expected:** Beveled XP-style buttons with clear minus/square/X glyphs (aligned with Win95/XP look).
- **Actual:** Text/Unicode characters (—, 🗗, ✕) that render differently across OS/browsers and don’t match the beveled button style.
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/05-window-about.png`
  - Code: `App.tsx` lines ~519–521: `—`, `{state.maximized ? '🗗' : '🗖'}`, `✕`
- **Root Cause (hypothesis):** Quick implementation with Unicode; no SVG or icon component for title bar actions.
- **Proposed Fix:** Add three small SVG icons (minus, restore/maximize, X) in `XPIcons.tsx` or a `WindowChromeIcons.tsx`, and use them in `.window-actions button` with proper sizing (e.g. 12×12 or 14×14 inside the 28×26 button).
- **Acceptance Criteria:**
  - [ ] Minimize, maximize, and close are drawn as SVGs.
  - [ ] Icons are crisp at 1x and 2x; consistent with XP beveled style.
  - [ ] Buttons retain current hit targets and aria-labels.

---

## TICKET-003: Desktop icon focus ring has low contrast

- **Severity:** High (Accessibility)
- **Area:** Desktop icon grid
- **Environment:** Desktop, all browsers
- **Steps to Reproduce:**
  1. Log in to desktop.
  2. Tab to a desktop icon.
  3. Observe the focus indicator.
- **Expected:** Visible focus ring (e.g. 2px solid) that meets WCAG 2.1 non-text contrast (≥3:1 against background).
- **Actual:** `.desktop-icon:focus-visible` uses the same style as hover: `background: rgba(0, 0, 120, 0.2)` with no outline. Keyboard users get only a light blue tint, which can be hard to see on the desktop background.
- **Evidence:**
  - Screenshot: Capture with Tab focus on a desktop icon.
  - Code: `src/styles.css` ~1660–1665: `.desktop-icon:focus-visible` shares rule with `:hover`.
- **Root Cause (hypothesis):** Focus and hover were styled together; no distinct focus ring was added.
- **Proposed Fix:** Add a dedicated `.desktop-icon:focus-visible` rule with `outline: 2px solid var(--accent)` (or a high-contrast token) and `outline-offset: 2px`. Keep hover as-is; ensure focus is not removed on mouse click.
- **Acceptance Criteria:**
  - [ ] Keyboard focus on desktop icons shows a clear, high-contrast outline (≥3:1).
  - [ ] Focus style is distinct from hover (e.g. outline vs. background tint).
  - [ ] No `outline: none` without a visible replacement.

---

## TICKET-004: Muted text fails contrast on dark panels

- **Severity:** High (Accessibility)
- **Area:** Contributions, LeetCode, and other dark panels
- **Environment:** Desktop and mobile, all browsers
- **Steps to Reproduce:**
  1. Open Contributions or LeetCode window.
  2. Read small/muted text (e.g. “Delivery telemetry”, gauge labels, “decorative”).
- **Expected:** All body and small text meet WCAG AA (4.5:1 for normal text, 3:1 for large).
- **Actual:** `color: var(--muted)` (#555) and `color: rgba(255,255,255,0.7)` on dark backgrounds (e.g. Contributions panel) may fail contrast. `.contribution-gauge small`, `.leetcode-badge`, and similar use light gray on dark blue.
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/` (Contributions and LeetCode windows).
  - Code: `styles.css` — `.muted`, `.contribution-gauge small`, `.contribution-gauges` panel background.
- **Root Cause (hypothesis):** Global `.muted` and panel-specific grays were chosen for light backgrounds; dark panels reuse them or use arbitrary opacity.
- **Proposed Fix:** Define a design token for “muted on dark” (e.g. `--muted-on-dark: rgba(255,255,255,0.85)`) and use it in dark panels. Audit all `.muted` and `small` inside `.contributions-panel`, `.leetcode-scoreboard`, and similar; ensure contrast ≥4.5:1 (or 3:1 for large text).
- **Acceptance Criteria:**
  - [ ] All readable text in dark panels passes WCAG AA contrast.
  - [ ] Muted/secondary text is clearly readable; no #555 on dark blue without override.
  - [ ] Tokens documented (e.g. in :root or design doc).

---

## TICKET-005: Start menu program list overflow and truncation

- **Severity:** Medium
- **Area:** Start menu — Launch / program list
- **Environment:** Desktop, all browsers
- **Steps to Reproduce:**
  1. Open Start menu.
  2. Scroll or inspect the “Launch” program list (About Me, Resume, Projects, etc.).
  3. Resize window to a narrow width.
- **Expected:** Program titles and subtitles wrap or truncate gracefully; no overlap with icon or adjacent columns.
- **Actual:** Long labels (e.g. “Engineering Manager & Full Stack Engineer…”) can overflow or push layout. `.start-menu-program-title` and `.start-menu-program-subtitle` have no explicit overflow/ellipsis; column width can be tight.
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/04-start-menu.png`
  - Code: `App.tsx` ~458 (subtitle text); `styles.css` `.start-menu-program-text`, `.start-menu-col-programs`.
- **Root Cause (hypothesis):** Start menu grid and program list assume fixed content length; no min-width or text truncation.
- **Proposed Fix:** Add `min-width: 0` to the text container so flex children can shrink; apply `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` to `.start-menu-program-title` (and optionally subtitle) with a max-width or flex constraint. Ensure icon column has fixed width so text doesn’t overlap.
- **Acceptance Criteria:**
  - [ ] Long program names truncate with ellipsis; no overflow into adjacent columns.
  - [ ] Layout remains stable at 320px and 1280px viewport.
  - [ ] Tooltip or title attribute shows full name on hover.

---

## TICKET-006: Taskbar window buttons squash when many windows open

- **Severity:** Medium
- **Area:** Taskbar — open windows strip
- **Environment:** Desktop, all browsers
- **Steps to Reproduce:**
  1. Open 6+ app windows.
  2. Look at the taskbar center (window buttons).
- **Expected:** Buttons shrink or scroll in a predictable way; each remains identifiable (icon + short label).
- **Actual:** `.taskbar-windows` uses flex-wrap; buttons have `max-width: 160px` and `text-overflow: ellipsis`. With many windows, the strip can wrap to multiple rows or buttons become very narrow, and the tray/clock can be pushed off-screen or cramped.
- **Evidence:**
  - Screenshot: Desktop with 8+ windows open.
  - Code: `styles.css` ~322–376 (`.taskbar-windows`, `.taskbar-window-btn`).
- **Root Cause (hypothesis):** No max-height or overflow strategy for the window strip; flex-wrap allows unbounded growth.
- **Proposed Fix:** Give `.taskbar-windows` a single row with horizontal overflow: `flex-wrap: nowrap`, `overflow-x: auto`, `min-width: 0`. Optionally show only icons when space is tight (media query or container query) or add a “more windows” overflow menu. Ensure tray and clock always remain visible with `flex-shrink: 0`.
- **Acceptance Criteria:**
  - [ ] Many open windows do not push tray/clock off screen.
  - [ ] Window strip scrolls or collapses in a single row; no multi-row wrap (or intentional two-row with fixed height).
  - [ ] Each button remains at least ~32px wide (icon-only fallback acceptable).

---

## TICKET-007: XP Login quick-action icons are CSS-only (inconsistent with XPIcons)

- **Severity:** Low (Icon)
- **Area:** XP Login screen — Switch user, Shutdown, Change background
- **Environment:** Desktop, all browsers
- **Steps to Reproduce:**
  1. Reach login screen (after boot).
  2. Look at “Switch user”, “Shutdown”, “Change background” icons.
- **Expected:** Icons match the rest of the app (e.g. SVG-based, same style as XPIcons).
- **Actual:** Icons are implemented with CSS (e.g. `.xp-login-icon-user` clip-path, `.xp-login-icon-power` border-radius + background). They look flat and differ from the desktop/start menu XP glyphs.
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/02-login-screen.png`
  - Code: `win9x.css` ~862–875 (`.xp-login-icon-user`, `.xp-login-icon-power`, `.xp-login-icon-picture`).
- **Root Cause (hypothesis):** Login quick actions were styled with CSS shapes for speed; XPIcons are used elsewhere.
- **Proposed Fix:** Add small SVG icons for “user switch”, “power”, and “picture” to `XPIcons.tsx` (or a `LoginIcons.tsx`) and use them in `XPLoginScreen.tsx` instead of the CSS-only boxes. Reuse or mirror the XP color palette (e.g. blue, red, green/blue gradient).
- **Acceptance Criteria:**
  - [ ] All three login quick-action icons are SVG-based.
  - [ ] Visual style is consistent with desktop/start menu icons (stroke, size ~18px).
  - [ ] Accessibility: icons have aria-hidden and buttons have aria-labels.

---

## TICKET-008: Mobile breakpoint hides entire shell (no intermediate layout)

- **Severity:** High (Mobile)
- **Area:** Shell / layout
- **Environment:** Mobile, viewport &lt; 920px
- **Steps to Reproduce:**
  1. Resize browser to 919px width (or use device toolbar).
  2. Boot and log in.
- **Expected:** Either a responsive desktop (e.g. simplified taskbar, stacked icons) or a clear transition to “mobile mode.”
- **Actual:** At `max-width: 920px`, `.os-shell { display: none }` hides the full desktop. Only `MobileLite` is shown. There is no intermediate layout; 921px shows full desktop, 920px shows only mobile lite.
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/06-mobile-lite.png` (mobile); capture at 920px and 921px.
  - Code: `styles.css` ~3725; `App.tsx` ~399–401 (isMobile → MobileLite).
- **Root Cause (hypothesis):** Mobile was implemented as a separate view; single breakpoint used for simplicity.
- **Proposed Fix:** Consider a second breakpoint (e.g. 768px) for “tablet” with a simplified shell (e.g. taskbar with icons only, single-column start menu), or document the 920px cutoff as intentional. If keeping current behavior, ensure the transition isn’t jarring (e.g. no flash of desktop then switch). Optionally add a visible “Desktop / Mobile” toggle for testing.
- **Acceptance Criteria:**
  - [ ] At 920px and below, only the intended mobile experience is shown; no duplicate or broken shell.
  - [ ] Breakpoint (and any second one) is documented in code or design doc.
  - [ ] No layout “flash” on load at boundary widths.

---

## TICKET-009: Mobile Lite has no dedicated layout or typography styles

- **Severity:** High (Mobile)
- **Area:** Mobile Lite view
- **Environment:** Mobile, &lt; 920px
- **Steps to Reproduce:**
  1. Open site on a narrow viewport (or 390×844).
  2. Log in to see Mobile Lite.
- **Expected:** Clear spacing, readable font sizes, and touch-friendly tap targets.
- **Actual:** The root element has class `mobile-lite` but there are no rules for `.mobile-lite` in the stylesheets. Layout relies on default block flow and global typography; padding and hierarchy may be inconsistent. No safe-area or max-width for content.
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/06-mobile-lite.png`
  - Code: `App.tsx` ~851–909 (MobileLite JSX); no `.mobile-lite` in styles.css/win9x.css.
- **Root Cause (hypothesis):** MobileLite was added without a dedicated CSS block; styles were not scoped.
- **Proposed Fix:** Add a `.mobile-lite` section in `styles.css`: padding (e.g. 1rem + env(safe-area-inset)), max-width for content, consistent heading scale (h1 1.5rem, h2 1.2rem, etc.), and list/link spacing. Ensure buttons and links have min-height/tap target ≥44px where appropriate.
- **Acceptance Criteria:**
  - [ ] `.mobile-lite` has defined padding and max-width (e.g. 90vw or 28rem).
  - [ ] Heading and body font sizes are consistent and readable (e.g. 1rem body).
  - [ ] Touch targets for links and buttons are at least 44×44px where possible.

---

## TICKET-010: Mobile boot and login hints may be cramped or clipped

- **Severity:** Medium (Mobile)
- **Area:** Boot screen, Login screen (mobile)
- **Environment:** Mobile, small viewports
- **Steps to Reproduce:**
  1. Open site at 390px width.
  2. Observe boot screen and login screen; read “Tip: press S, Enter…” and “Tip: click your name…”.
- **Expected:** Hints are fully visible and readable; no overlap with logo or buttons.
- **Actual:** `.mobile-boot-hint` and the login hint live in fixed or absolute flows; on very small screens they can overlap the main content or get clipped. Font size may be too small for mobile.
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/06-mobile-lite.png` and login at 390px.
  - Code: `App.tsx` ~408, ~471; styles for `.mobile-boot-hint` (if any).
- **Root Cause (hypothesis):** Hints were positioned for desktop; mobile viewport wasn’t tested at 320–400px.
- **Proposed Fix:** Ensure hints use relative positioning and margin so they don’t overlap the main CTA. Use a minimum font size (e.g. 0.875rem) and ensure sufficient contrast. On very narrow viewports, consider shortening copy or moving the hint below the main action.
- **Acceptance Criteria:**
  - [ ] Boot and login hints are fully visible at 320px and 390px width.
  - [ ] No overlap with logo, user tile, or primary buttons.
  - [ ] Text is readable (size and contrast).

---

## TICKET-011: About window “Back/Forward/Stop” buttons are non-functional

- **Severity:** Low
- **Area:** About Me window
- **Environment:** Desktop, all browsers
- **Steps to Reproduce:**
  1. Open About Me window.
  2. Click “← Back”, “Forward →”, or “Stop”.
- **Expected:** Buttons either perform navigation (e.g. history) or are disabled/hidden if not applicable; affordance matches behavior.
- **Actual:** Buttons are present (IE-style chrome) but have no onClick or behavior; they look clickable but do nothing.
- **Evidence:**
  - Code: `App.tsx` ~596–598: `about-ie-nav-btn` with aria-labels but no handlers.
- **Root Cause (hypothesis):** Purely decorative IE-style toolbar; behavior was not implemented.
- **Proposed Fix:** Either (a) wire Back/Forward to a simple in-window history (e.g. tab or step state) or (b) make them disabled and style as disabled with `aria-disabled="true"` and `cursor: not-allowed`, or (c) remove them and keep only the address bar for the “about:Dayyan” chrome. Prefer (b) or (c) if there’s no real navigation.
- **Acceptance Criteria:**
  - [ ] Buttons are either functional or clearly disabled (visual + aria).
  - [ ] No misleading clickable affordance for actions that do nothing.

---

## TICKET-012: Skills window tab labels are confusing (Core / Tools / Soft)

- **Severity:** Low
- **Area:** Skills window — filter tabs
- **Environment:** Desktop, all browsers
- **Steps to Reproduce:**
  1. Open Skills window.
  2. Look at tabs: “Core”, “Tools”, “Tools”, “Tools”, “Soft” (for all, frontend, backend, cloud, data).
- **Expected:** Tab labels clearly describe the filter (e.g. “All”, “Frontend”, “Backend”, “Cloud”, “Data”).
- **Actual:** `tabLabels` map: all→“Core”, frontend/backend/cloud→“Tools”, data→“Soft”. So three tabs all say “Tools,” which is confusing.
- **Evidence:**
  - Code: `App.tsx` ~669: `tabLabels: Record<typeof skillFilter, string> = { all: 'Core', frontend: 'Tools', backend: 'Tools', cloud: 'Tools', data: 'Soft' }`.
- **Root Cause (hypothesis):** Labels were intended as categories (Core vs Tools vs Soft) but the filter values are by domain (frontend/backend/cloud/data); mapping conflates the two.
- **Proposed Fix:** Use filter value as label (e.g. “All”, “Frontend”, “Backend”, “Cloud”, “Data”) or define a clear category system and use distinct labels (e.g. “All”, “Front-end”, “Back-end”, “Cloud”, “Data”) so each tab is unique and understandable.
- **Acceptance Criteria:**
  - [ ] Each tab has a distinct, meaningful label.
  - [ ] Users can predict which tab shows which skill set.

---

## TICKET-013: Window content overflow and min-height

- **Severity:** Medium
- **Area:** All app windows
- **Environment:** Desktop, all browsers
- **Steps to Reproduce:**
  1. Open About, Resume, or Projects.
  2. Resize the window to a small height (e.g. 300px).
  3. Scroll the content.
- **Expected:** Content area scrolls smoothly; title bar stays fixed; no content hidden without scroll.
- **Actual:** `.window-content` has `overflow-y: auto` and `overflow-x: hidden`; some panels (e.g. About two-column, Contributions) have complex grids that can cause horizontal overflow or cramped vertical layout when the window is short. Min-height on the window is not enforced.
- **Evidence:**
  - Code: `styles.css` ~1871–1885 (`.window-content`); window has `min-width: 280px` but no min-height.
- **Root Cause (hypothesis):** Windows are freely resizable; content assumes a minimum height that isn’t set on the container.
- **Proposed Fix:** Set a reasonable `min-height` on `.window` (e.g. 200px or 240px) so the content area never collapses. Ensure each `.window-content` has `min-height: 0` in the flex/block context so overflow scroll works. Audit About two-column and Contributions for horizontal overflow and add `min-width: 0` or overflow hidden on flex children where needed.
- **Acceptance Criteria:**
  - [ ] Window has a minimum height; content area remains scrollable.
  - [ ] No horizontal scroll unless intentional (e.g. wide table).
  - [ ] Title bar always visible when window is open.

---

## TICKET-014: Help panel keyboard list not in tab order / no skip link

- **Severity:** Medium (Accessibility)
- **Area:** Help panel, global
- **Environment:** Desktop, keyboard users
- **Steps to Reproduce:**
  1. Open Help window.
  2. Use Tab to move focus through the page.
  3. Check if there is a “Skip to main content” or equivalent at the very start of the app.
- **Expected:** Keyboard users can reach main content and the Help shortcuts list; focus order is logical.
- **Actual:** Help lists shortcuts (Alt+Tab, Ctrl+M, Esc, etc.) but the app may not expose a skip link. Modal/login and desktop have complex focus management; focus trap on login is good, but after login the first focusable element and order may not be documented or tested.
- **Evidence:**
  - Code: `App.tsx` Help panel content; no `<a href="#main">Skip to main</a>` in index or App.
- **Root Cause (hypothesis):** Single-page shell; skip link was not added; focus order not audited.
- **Proposed Fix:** Add a “Skip to desktop” or “Skip to main content” link at the top of the shell (visible on focus) that moves focus to the desktop or first desktop icon. Ensure Help panel and all windows are reachable by Tab in a logical order. Document focus flow in the Help panel (e.g. “Tab through desktop icons, then taskbar, then open windows”).
- **Acceptance Criteria:**
  - [ ] Skip link is present and visible when focused; target is the main desktop or first interactive element.
  - [ ] Tab order: boot skip → login → desktop icons → taskbar → open windows (or documented equivalent).
  - [ ] Help text reflects actual keyboard behavior.

---

## TICKET-015: Boot screen “Skip” affordance and reduced motion

- **Severity:** Low
- **Area:** Boot (Win9xBootDialog)
- **Environment:** Desktop, all browsers; users with prefers-reduced-motion
- **Steps to Reproduce:**
  1. Load the app; boot dialog appears.
  2. Look for a “Skip” or “Cancel” control.
  3. Enable “Reduce motion” in OS and reload.
- **Expected:** Skip/Cancel is easy to find and use; when reduced motion is on, boot either skips immediately or shows a short static state without flashing animation.
- **Actual:** Skip may be present (e.g. via Win9xBootDialog) but placement or visibility might be unclear. Reduced-motion path sets boot to complete quickly; need to confirm no animation flicker when `prefers-reduced-motion: reduce` is set.
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/01-boot-screen.png`
  - Code: `Win9xBootDialog.tsx`, `App.tsx` reducedMotion and boot state.
- **Root Cause (hypothesis):** Boot was designed for full animation; reduced-motion is handled but not fully QA’d.
- **Proposed Fix:** Ensure one clear “Skip” or “Cancel” button is visible and keyboard-focusable in the boot dialog. In CSS, ensure `@media (prefers-reduced-motion: reduce)` (and any `.reduced-motion` class) disables or shortens the file-transfer and progress animations so there’s no flash. Test with “Reduce motion” on.
- **Acceptance Criteria:**
  - [ ] Skip/Cancel is visible and works with mouse and keyboard.
  - [ ] With reduced motion, boot completes without flashing or long animation.
  - [ ] No `animation` or long `transition` when user prefers reduced motion.

---

## Summary: Implementation order

### 1) Quick Wins (1–2 hours)

- **TICKET-003:** Desktop icon focus ring (add outline for `:focus-visible`).
- **TICKET-012:** Skills tab labels (change to All / Frontend / Backend / Cloud / Data).
- **TICKET-011:** About window nav buttons (disable and style, or remove).
- **TICKET-015:** Boot skip visibility and reduced-motion check.

### 2) High Impact Refactors

- **TICKET-002:** Window title bar SVG icons (minimize/maximize/close).
- **TICKET-004:** Muted text contrast on dark panels (tokens + audit).
- **TICKET-009:** Mobile Lite layout and typography (`.mobile-lite` CSS).
- **TICKET-006:** Taskbar window strip overflow (single row, scroll or collapse).
- **TICKET-005:** Start menu program list overflow (truncation + min-width).

### 3) Visual Consistency Pass

- **TICKET-001:** Taskbar tray icons (unify to XP-style SVGs).
- **TICKET-007:** Login quick-action icons (SVG instead of CSS-only).
- **TICKET-013:** Window min-height and content overflow audit.
- **TICKET-008:** Document or adjust 920px breakpoint; consider tablet layout.
- **TICKET-010:** Mobile boot/login hint placement and readability.
- **TICKET-014:** Skip link and keyboard focus order documentation and implementation.

---

*Screenshots: run `npx playwright test tests/qa-screenshots.spec.ts --project=chromium` after `npm run dev` (ensure base URL/port matches your config). Add any manual captures to `docs/qa-screenshots/` and reference them in the Evidence section.*
