# Portfolio UI — QA Visual Audit Round 2 (Thorough)

**All screenshots and tickets live in this repo.** Screenshots are in `docs/qa-screenshots/`. This document references them explicitly so you can see exactly what looks bad and fix it.

**Capture command:** `npx playwright test tests/qa-screenshots.spec.ts` (run from repo root; dev server starts automatically).  
**Total screenshots:** 25 (shell, all app windows, mobile, stress states).

---

## Evidence index (screenshot → what it shows)

| File | Content |
|------|--------|
| `01-boot-screen.png` | Boot dialog full page — progress, folders, doc icons, Cancel, From/To |
| `02-login-screen.png` | XP login full page — Welcome, user tile, quick actions |
| `03-desktop-taskbar.png` | Desktop + taskbar + About window + widgets + icons |
| `04-start-menu.png` | Start menu open — program list, shortcuts, footer |
| `05-taskbar-quick-launch.png` | Taskbar only — Start, quick launch icons, tray |
| `06-window-about.png` | About window only (cropped to window) |
| `07-window-resume.png` | Resume window |
| `08-window-projects.png` | Projects window |
| `09-window-experience.png` | Experience window |
| `10-window-skills.png` | Skills window |
| `11-window-power.png` | Power/Extracurricular window |
| `12-window-leetcode.png` | LeetCode window |
| `13-window-contributions.png` | Contributions window |
| `14-window-contact.png` | Contact window |
| `15-window-chatbot.png` | Chatbot window |
| `16-window-help.png` | Help window |
| `17-desktop-with-about-only.png` | Desktop with only About open |
| `18-desktop-multiple-windows.png` | Desktop with several windows open |
| `19-taskbar-many-windows.png` | Taskbar with many window buttons + overlap |
| `20-desktop-icons-closeup.png` | Desktop icon grid only |
| `21-mobile-390-login.png` | Mobile 390px — login screen |
| `22-mobile-390-lite.png` | Mobile 390px — Mobile Lite content |
| `23-mobile-320-lite.png` | Mobile 320px — Mobile Lite |
| `24-window-title-bar-buttons.png` | Window title bar + min/max/close buttons |
| `25-window-about-content-area.png` | About window content area only |

---

## TICKET-R201: Boot — pixelated document icons and path backslash

- **Severity:** High
- **Area:** Boot screen (Win9xBootDialog)
- **Environment:** Desktop, all browsers
- **Steps to Reproduce:**
  1. Load the app; boot dialog appears.
  2. Look at the flying document icons between the two folder icons.
  3. Look at the "From:" field (e.g. `A:\ResearchPayload\`).
- **Expected:** Document icons are crisp, aligned; path displays as a single backslash (e.g. `A:\ResearchPayload\`).
- **Actual:** Document icons are pixelated and low-resolution; the middle one can look cut off or misaligned. The "From:" path can render with an escaped or doubled backslash (`A:\\ResearchPayload`), looking broken.
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/01-boot-screen.png`
  - Console/Log: (none)
- **Root Cause (hypothesis):** Flying doc elements use small pixel dimensions or low-res assets; path string may be escaped for JS but rendered literally in the UI.
- **Proposed Fix:** Use SVG or higher-resolution assets for the flying documents; ensure path strings are single backslashes when displayed. Add `min-width` / alignment so the three docs line up cleanly.
- **Acceptance Criteria:**
  - [x] Document icons are sharp at 1x and 2x; no visible pixelation.
  - [x] "From:" and "To:" paths show a single backslash; no `\\` or visual gap.

---

## TICKET-R202: Boot — progress bar and bottom buttons not XP-style

- **Severity:** Medium
- **Area:** Boot screen
- **Environment:** Desktop, all browsers
- **Steps to Reproduce:**
  1. Load the app; boot dialog visible.
  2. Inspect the progress bar and the "Open" / "Open Folder" buttons at the bottom.
- **Expected:** Progress bar has a subtle gradient (XP Luna style); buttons are beveled, with disabled state clearly distinct.
- **Actual:** Progress bar is solid blue (more Win95); "Open" (disabled) and "Open Folder" are flat grey; buttons are small and left-aligned with weak padding.
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/01-boot-screen.png`
- **Root Cause (hypothesis):** Styles favor Win95 flat look; no gradient or bevel tokens for boot controls.
- **Proposed Fix:** Add a light gradient to the progress fill; style bottom buttons with Win9x bevel (inset/outset border, padding). Make disabled "Open" clearly greyed (e.g. reduced opacity + cursor not-allowed).
- **Acceptance Criteria:**
  - [x] Progress bar has a subtle gradient consistent with XP-inspired theme.
  - [x] "Open" and "Open Folder" use beveled styling; disabled state is obvious.

---

## TICKET-R203: Taskbar — time shown twice (redundancy)

- **Severity:** Critical
- **Area:** Taskbar / system tray
- **Environment:** Desktop, all browsers
- **Steps to Reproduce:**
  1. Log in; look at the taskbar right side (tray).
  2. Note the time and date.
- **Expected:** Time appears once (e.g. only in the clock + date block, or only in a single pill).
- **Actual:** "11:12 PM" appears twice: once in a pill and again next to the date ("Thu, 3/5 11:12 PM"), causing visual clutter and confusion.
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/03-desktop-taskbar.png`, `05-taskbar-quick-launch.png`
  - Code: `App.tsx` taskbar-extra (pill with clock) and taskbar-tray-date-time (date + clock).
- **Root Cause (hypothesis):** Two separate elements both render the clock (taskbar-pill and .clock in tray).
- **Proposed Fix:** Show time in one place only (e.g. only in `.taskbar-tray-date-time`). Remove the clock from the pill or remove the duplicate pill; keep "Network" and "AC" pills without time.
- **Acceptance Criteria:**
  - [x] Time is displayed once in the taskbar.
  - [x] Date + time block remains readable; no duplicate "11:12 PM".

---

## TICKET-R204: Taskbar — quick launch and tray icons low-quality / style mismatch

- **Severity:** High
- **Area:** Taskbar (quick launch + system tray)
- **Environment:** Desktop, all browsers
- **Steps to Reproduce:**
  1. Log in; look at quick launch icons (person, document, folder, etc.) and tray (cloud, WiFi, speaker).
  2. Compare to the intended Win95/XP look.
- **Expected:** All icons are the same visual language (e.g. XP-style 16×16 or 20×20 SVG), consistent weight and proportions.
- **Actual:** Quick launch icons (e.g. chat bubble, question mark) look pixelated or inconsistent; tray uses Lucide Cloud, inline WiFi SVG, and emoji for volume — mixed styles and quality.
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/03-desktop-taskbar.png`, `05-taskbar-quick-launch.png`, `19-taskbar-many-windows.png`
  - Code: `App.tsx` (Cloud from lucide-react); `XPIcons.tsx` (desktop/start icons).
- **Root Cause (hypothesis):** Icons from multiple sources (Lucide, emoji, custom SVG) with no unified tray set.
- **Proposed Fix:** Introduce a single set of XP-style SVGs for tray and quick launch (e.g. extend `XPIcons` or add `TrayIcons.tsx`). Replace Lucide Cloud and volume emoji with SVGs matching the rest of the shell.
- **Acceptance Criteria:**
  - [x] Quick launch and tray icons are all from one coherent set (e.g. XP-style SVGs).
  - [x] No Lucide or emoji in taskbar; icons are crisp and consistent in size/weight.

---

## TICKET-R205: Start menu — program list labels truncated to single letters

- **Severity:** Critical
- **Area:** Start menu — Launch / program list
- **Environment:** Desktop, all browsers
- **Steps to Reproduce:**
  1. Click Start; look at the "Launch" column (list of apps).
  2. Read the labels next to each icon.
- **Expected:** Each program shows a readable name (e.g. "About Me", "Resume", "Projects").
- **Actual:** Labels are truncated to one or two letters ("R...", "P...", "C...", "E...", "S...", "L...", "A...", "H..."), making the list unusable.
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/04-start-menu.png`
  - Code: `App.tsx` start-menu-program-list; `styles.css` `.start-menu-col-programs`, `.start-menu-program-text`.
- **Root Cause (hypothesis):** Column or text container has fixed or max-width with no min-width; text collapses and ellipsis truncates to almost nothing.
- **Proposed Fix:** Give the program list column a sensible min-width (e.g. 180px); ensure `.start-menu-program-title` does not shrink below readable length. Use `overflow: hidden; text-overflow: ellipsis` only when space is truly limited, with a reasonable max-width so at least "About", "Resume", "Projects" etc. show.
- **Acceptance Criteria:**
  - [x] Every program in the Start menu shows at least a few characters (e.g. "About", "Resume", "Projects"); no "R...", "P..." only.
  - [x] At 1280px viewport the full names are visible; at 320px a sensible truncation (e.g. "About Me", "Resu…") is acceptable.

---

## TICKET-R206: Start menu — "Log Off" button text cut off

- **Severity:** Medium
- **Area:** Start menu footer
- **Environment:** Desktop, all browsers
- **Steps to Reproduce:**
  1. Open Start menu.
  2. Look at the bottom-left: "Log Off" and "Shut Down" buttons.
- **Expected:** "Log Off" is fully visible.
- **Actual:** The top of "Log Off" is cut off at the top edge of the button (padding or line-height issue).
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/04-start-menu.png`
  - Code: `styles.css` `.start-menu-footer-xp`, `.start-menu-footer-btn`.
- **Root Cause (hypothesis):** Button height or padding too small; text overflow hidden or clipped.
- **Proposed Fix:** Increase padding or min-height on `.start-menu-footer-btn`; ensure line-height and overflow allow full text. Use `overflow: visible` if needed.
- **Acceptance Criteria:**
  - [x] "Log Off" and "Shut Down" are fully visible with comfortable padding.
  - [x] Buttons remain tappable and aligned with the footer.

---

## TICKET-R207: About window — instruction text inside content and badge clipping

- **Severity:** Critical
- **Area:** About Me window
- **Environment:** Desktop, all browsers
- **Steps to Reproduce:**
  1. Log in (About opens by default).
  2. Read the content below the address bar and in the left sidebar (badges).
- **Expected:** No "Double-click About Me on the desktop to open" inside the open window; sidebar badges and "CS & Math · Full stack · Data" fully visible.
- **Actual:** "Double-click About Me on the desktop to open." appears inside the About content (below address bar), which is wrong when the window is already open. In the left sidebar, the last badge and the line "CS & Math · Full stack · Data" are clipped; "Data" and part of the text are cut off or duplicated unstyled.
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/03-desktop-taskbar.png`, `06-window-about.png`, `25-window-about-content-area.png`
  - Code: `App.tsx` about-ie-topbar / about-ie-two-col; `styles.css` about-ie-sidebar, about-ie-badges.
- **Root Cause (hypothesis):** Instruction is always rendered; sidebar has overflow hidden or fixed height so badges and meta text get clipped; possible duplicate node for "CS & Math" text.
- **Proposed Fix:** Hide the "Double-click About Me…" line when the About window is open (or remove it from inside the window and show only on desktop). Give the sidebar a scroll or enough height so all badges and "CS & Math · Full stack · Data" are visible; fix any duplicate text in markup.
- **Acceptance Criteria:**
  - [x] "Double-click About Me on the desktop to open" is not shown inside the About window when it is open.
  - [x] All sidebar badges and the "CS & Math · Full stack · Data" line are fully visible with no clipping or duplication.

---

## TICKET-R208: About window — sidebar meta text low contrast

- **Severity:** High (Accessibility)
- **Area:** About Me window — left sidebar
- **Environment:** Desktop, all browsers
- **Steps to Reproduce:**
  1. Open About window.
  2. Read the text below the badges in the left column ("CS & Math · Full stack · Data").
- **Expected:** Text meets WCAG AA (e.g. 4.5:1) against the sidebar background.
- **Actual:** "CS & Math · Full stack · Data" (and similar meta) has very low contrast against the dark blue sidebar, making it hard to read.
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/06-window-about.png`, `25-window-about-content-area.png`
  - Code: `styles.css` `.about-ie-meta`, `.about-ie-sidebar`.
- **Root Cause (hypothesis):** Meta text color is tuned for light backgrounds; sidebar uses dark blue without a lighter text color.
- **Proposed Fix:** Set a dedicated color for sidebar meta text (e.g. `rgba(255,255,255,0.9)` or a light grey) and ensure contrast ≥ 4.5:1 against the sidebar background.
- **Acceptance Criteria:**
  - [x] All sidebar text (including "CS & Math · Full stack · Data") passes WCAG AA contrast.
  - [x] Readability is confirmed on the actual sidebar background.

---

## TICKET-R209: Window title bar — minimize/maximize/close use Unicode; poor icon quality

- **Severity:** High
- **Area:** All app windows — title bar
- **Environment:** Desktop, all browsers
- **Steps to Reproduce:**
  1. Open any window (e.g. About).
  2. Look at the three buttons on the right: minimize (—), maximize (🗗/🗖), close (✕).
- **Expected:** XP-style beveled buttons with clear, crisp SVG glyphs (minus, square(s), X).
- **Actual:** Buttons use Unicode/emoji (—, 🗗, ✕). The minimize line is fine; the maximize is a solid blue square (not the standard XP outline/restore icon); the close X looks stylized or pixelated. Title "ABOUT.ME" can appear pixelated or aliased.
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/24-window-title-bar-buttons.png`, `06-window-about.png`
  - Code: `App.tsx` window-actions: `—`, `{state.maximized ? '🗗' : '🗖'}`, `✕`.
- **Root Cause (hypothesis):** No SVG assets for window chrome; Unicode/emoji used for speed; font rendering or size causes pixelation.
- **Proposed Fix:** Add three small SVGs (minus, maximize, restore, close) in `XPIcons` or `WindowChromeIcons.tsx` and use them in `.window-actions button`. Use a crisp font or SVG for the window title; ensure title bar has enough padding so text doesn’t alias badly.
- **Acceptance Criteria:**
  - [x] Minimize, maximize, restore, and close are drawn with SVGs; no Unicode/emoji.
  - [x] Icons match Win95/XP conventions (outline square for maximize, two squares for restore, clean X for close).
  - [x] Window title text is crisp; no obvious pixelation.

---

## TICKET-R210: Contact window — content area translucent; labels low contrast

- **Severity:** Critical
- **Area:** Contact window
- **Environment:** Desktop, all browsers
- **Steps to Reproduce:**
  1. Open Contact (from Start or desktop).
  2. Look at the content area (Email / LinkedIn / Discord pills and detail panel).
- **Expected:** Window content is opaque; all labels and buttons have readable contrast.
- **Actual:** The Contact window content area is translucent, so the window behind (e.g. Experience/Skills) shows through and makes text hard to read. "Email", "LinkedIn", "Discord" and labels like "Copy Email" have low contrast on the light grey background.
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/14-window-contact.png`, `19-taskbar-many-windows.png`
  - Code: `styles.css` `.contact-outlook-frame`, `.contact-pill`, `.contact-detail-block`.
- **Root Cause (hypothesis):** Content panel has opacity < 1 or a transparent background; button/label colors are too light.
- **Proposed Fix:** Set the Contact window content background to opaque (e.g. solid #fff or #f5f5f5). Increase contrast for pills and labels (darker text or stronger borders) so they meet WCAG AA.
- **Acceptance Criteria:**
  - [x] Contact window content is fully opaque; no see-through to windows behind.
  - [x] All labels and pills have sufficient contrast (≥ 4.5:1 for normal text).

---

## TICKET-R211: Contributions window — empty gray box and placeholder lines

- **Severity:** High
- **Area:** Contributions window
- **Environment:** Desktop, all browsers
- **Steps to Reproduce:**
  1. Open Contributions window.
  2. Look at the main content below the legend pills (GitHub, LeetCode, Assist).
- **Expected:** Content area shows gauges, highlights, or feed; no large empty gray rectangles.
- **Actual:** A large empty light gray box and thin horizontal gradient lines (orange, green–purple) appear with no clear purpose; the layout looks broken or like placeholders that never got content.
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/13-window-contributions.png`
  - Code: `App.tsx` contribution-gauges, contribution-feed-wrapper; `GitHubContributionFeed.tsx`.
- **Root Cause (hypothesis):** Gauges or feed failed to render (loading/error state) or structure is wrong; placeholder elements are visible by default.
- **Proposed Fix:** Ensure contribution gauges and feed render correctly; if data is loading, show a clear loading state instead of an empty box. Remove or hide decorative lines that look like broken UI; if they are intentional, give them a clear role (e.g. separators) and styling.
- **Acceptance Criteria:**
  - [x] No large empty gray box in the Contributions window; content or explicit loading/empty state is shown.
  - [x] Any horizontal lines are clearly intentional (e.g. separators) and styled consistently.

---

## TICKET-R212: Contributions — legend pills and scrollbar not XP-style

- **Severity:** Medium
- **Area:** Contributions window
- **Environment:** Desktop, all browsers
- **Steps to Reproduce:**
  1. Open Contributions window.
  2. Look at the GitHub / LeetCode / Assist pills and the window scrollbar.
- **Expected:** Pills and scrollbar match Win95/XP (beveled, chunky scrollbar).
- **Actual:** Pills are modern flat pill-shapes; "GITHUB" text can look slightly clipped at the bottom. The scrollbar is a thin modern grey strip, not the chunky 3D XP style.
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/13-window-contributions.png`
  - Code: `styles.css` `.contribution-legend-badge`, `.window-content` overflow.
- **Root Cause (hypothesis):** Modern flat design applied; no custom scrollbar styling for theme.
- **Proposed Fix:** Restyle legend pills with a subtle bevel/border to match the theme; ensure pill height accommodates text (no clipping). Optionally add custom scrollbar styling (width, bevel, colors) for `.window-content` to approximate XP.
- **Acceptance Criteria:**
  - [x] Legend pills have consistent height and no text clipping.
  - [x] Scrollbar (if custom styling is in scope) aligns with Win95/XP look; otherwise document as future improvement.

---

## TICKET-R213: Multiple windows — overlap and z-index; widgets covered

- **Severity:** Critical
- **Area:** Desktop layout when many windows open
- **Environment:** Desktop, all browsers
- **Steps to Reproduce:**
  1. Open About, Resume, Projects, Experience, Skills, Contact (via Start).
  2. Look at the desktop: overlapping windows and GitHub/LeetCode widgets.
- **Expected:** Application windows stack above the desktop; widgets either sit on the desktop layer or have a clear z-index so they are not covered by normal windows. Taskbar remains usable.
- **Actual:** Windows pile on top of each other with no clear order; the Contact window can be translucent (see R210). GitHub and LeetCode widgets are partially covered by windows or clipped at the left edge. Taskbar window buttons truncate to "A...", "R...", "Pr..." and feel cramped.
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/18-desktop-multiple-windows.png`, `19-taskbar-many-windows.png`
  - Code: `App.tsx` desktop-widgets z-index; window z-index; `styles.css` .taskbar-window-btn max-width.
- **Root Cause (hypothesis):** Widgets and windows share or conflict on z-index; taskbar strip has no overflow strategy when many windows are open.
- **Proposed Fix:** Set a clear stacking context: desktop (background) → widgets (optional) → windows (above desktop). Ensure widgets are either behind all windows or explicitly in a "desktop only" layer. For taskbar, add horizontal scroll or icon-only mode when many windows are open so labels don’t collapse to "A...", "R...".
- **Acceptance Criteria:**
  - [x] Opening many windows does not obscure widgets in an illogical way; stacking is predictable.
  - [x] Taskbar window buttons remain at least minimally readable (e.g. icon + short label or scroll).

---

## TICKET-R214: Mobile Lite — no Win95/XP styling; flat grey cards

- **Severity:** High (Mobile)
- **Area:** Mobile Lite view
- **Environment:** Mobile, viewport &lt; 920px
- **Steps to Reproduce:**
  1. Resize to 390px or open on a phone; log in.
  2. View the Mobile Lite page (sections: Shell telemetry, Experience updates, FCB highlights, Repos, Download Resume).
- **Expected:** Panels have Win95/XP-inspired borders, title bars, or bevels; typography and spacing feel consistent with the desktop theme.
- **Actual:** The whole page is flat light grey rectangles with no distinctive borders, shadows, or title bars. "Download Resume" is a plain blue link, not a button. Line spacing and padding feel inconsistent; "Shell ready" green text has weak contrast on grey. No icons (e.g. for repos or download) match the retro theme.
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/22-mobile-390-lite.png`, `23-mobile-320-lite.png`
  - Code: `App.tsx` MobileLite JSX; no `.mobile-lite` styles in stylesheets.
- **Root Cause (hypothesis):** Mobile Lite was built without a design pass; no `.mobile-lite` or panel styles; default link styling only.
- **Proposed Fix:** Add a `.mobile-lite` section in `styles.css`: panel borders (e.g. 2px outset/inset), padding, and heading scale. Style "Download Resume" as a primary button (beveled, prominent). Improve contrast for "Shell ready" and any muted text; add optional XP-style icons for sections/links.
- **Acceptance Criteria:**
  - [x] Mobile Lite panels have visible borders or title-bar-like treatment consistent with Win95/XP.
  - [x] "Download Resume" is a clear button; contrast and spacing are improved.
  - [x] At 320px and 390px the layout remains readable and on-theme.

---

## TICKET-R215: Desktop icons — label truncation and edge padding

- **Severity:** Medium
- **Area:** Desktop icon grid
- **Environment:** Desktop, all browsers
- **Steps to Reproduce:**
  1. Log in; look at the desktop icons on the right (e.g. "About.me", "Resume...").
  2. Check distance from the right/top edges of the viewport.
- **Expected:** Labels are readable (e.g. "Resume" or "Resume.pdf"); icons have comfortable padding from the edges.
- **Actual:** "Resume..." shows ellipsis (truncation); icons sit very close to the top and right edges, feeling cramped.
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/03-desktop-taskbar.png`, `20-desktop-icons-closeup.png`
  - Code: `styles.css` `.desktop-icon-grid` (position, padding), `.desktop-icon small` (line-clamp, overflow).
- **Root Cause (hypothesis):** Grid aligned to top-right with minimal padding; label max-width or line-clamp too aggressive.
- **Proposed Fix:** Add padding (e.g. 0.75rem–1rem) to the desktop icon grid from the top and right edges. Allow labels to show at least "Resume" / "About Me" (e.g. increase max-width or use two lines with a sensible clamp).
- **Acceptance Criteria:**
  - [x] Desktop icons have clear spacing from the viewport edges.
  - [x] Labels do not truncate to "Resume..." when space allows; truncation is only when necessary (e.g. narrow viewport).

---

## TICKET-R216: About — Back/Forward/Stop non-functional and styling

- **Severity:** Low
- **Area:** About Me window — IE-style toolbar
- **Environment:** Desktop, all browsers
- **Steps to Reproduce:**
  1. Open About window.
  2. Click "← Back", "Forward →", or "Stop".
- **Expected:** Buttons either do something (e.g. in-window history) or are clearly disabled and styled as such.
- **Actual:** Buttons look clickable but have no behavior; they are neither disabled nor wired. Styling is generic and doesn’t match the intended XP toolbar look.
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/06-window-about.png`
  - Code: `App.tsx` about-ie-navbar buttons (no onClick).
- **Root Cause (hypothesis):** Toolbar is decorative only; no handlers or disabled state.
- **Proposed Fix:** Either (a) add a simple in-window history and wire Back/Forward, or (b) set `disabled` and `aria-disabled="true"` and style as disabled (greyed, cursor not-allowed). Optionally refine button styling to match XP (bevel, padding).
- **Acceptance Criteria:**
  - [x] Back/Forward/Stop are either functional or clearly disabled with appropriate styling and aria.
  - [x] No misleading clickable appearance for actions that do nothing.

---

## TICKET-R217: Global — modern scrollbars in app windows

- **Severity:** Medium
- **Area:** All app windows (`.window-content`)
- **Environment:** Desktop, all browsers
- **Steps to Reproduce:**
  1. Open any window with scrollable content (About, Resume, Contributions, etc.).
  2. Look at the vertical scrollbar on the right.
- **Expected:** Scrollbar matches the Win95/XP theme (e.g. chunky, 3D bevel).
- **Actual:** Scrollbar is a thin, modern grey strip, inconsistent with the rest of the theme.
- **Evidence:**
  - Screenshot: `docs/qa-screenshots/13-window-contributions.png`, `19-taskbar-many-windows.png`
  - Code: `styles.css` `.window-content { overflow-y: auto }`; no scrollbar styling.
- **Root Cause (hypothesis):** Default browser scrollbar used; no custom scrollbar CSS for the theme.
- **Proposed Fix:** Add scrollbar styling for `.window-content` (e.g. `::-webkit-scrollbar` and `scrollbar-color` / `scrollbar-width` for Firefox) with wider, beveled look and theme colors.
- **Acceptance Criteria:**
  - [x] Scrollbars in app windows are styled (width, track/thumb, colors) to approximate Win95/XP.
  - [x] Scrolling still works in Chrome, Firefox, and Safari (with fallback for unsupported browsers).

---

## TICKET-R218: Desktop icon focus — no visible keyboard focus ring

- **Severity:** High (Accessibility)
- **Area:** Desktop icon grid
- **Environment:** Desktop, keyboard users
- **Steps to Reproduce:**
  1. Log in; focus the first desktop icon with Tab.
  2. Observe the focus indicator.
- **Expected:** A clear focus ring (e.g. 2px solid outline) that meets contrast requirements.
- **Actual:** Focus uses the same style as hover (light blue background tint) with no outline; keyboard users may not see which icon is focused.
- **Evidence:**
  - Code: `styles.css` `.desktop-icon:focus-visible` (same as :hover).
- **Root Cause (hypothesis):** Focus and hover were merged for styling; no distinct focus ring.
- **Proposed Fix:** Add `.desktop-icon:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }` (or equivalent high-contrast token). Keep hover as background tint only.
- **Acceptance Criteria:**
  - [x] Keyboard focus on desktop icons shows a clear, high-contrast outline (≥3:1).
  - [x] Focus style is distinct from hover; no outline: none without a visible alternative.

---

## Summary: Implementation order

### 1) Quick wins (1–2 hours)

- **TICKET-R203:** Remove duplicate time in taskbar (show clock once).
- **TICKET-R206:** Fix "Log Off" cut-off in Start menu footer.
- **TICKET-R218:** Add desktop icon focus ring for keyboard users.
- **TICKET-R216:** Disable or wire Back/Forward/Stop in About and style as disabled if not wired.

### 2) High-impact refactors

- **TICKET-R205:** Start menu program labels — fix truncation (min-width, ellipsis only when needed).
- **TICKET-R207:** About — remove in-window instruction text and fix sidebar clipping/duplication.
- **TICKET-R210:** Contact — opaque content and better contrast for labels/pills.
- **TICKET-R211:** Contributions — remove or fix empty gray box and placeholder lines.
- **TICKET-R213:** Multiple windows — fix z-index and taskbar overflow when many windows open.
- **TICKET-R209:** Window chrome — replace Unicode title bar buttons with SVGs.

### 3) Visual consistency pass

- **TICKET-R201:** Boot — crisp document icons and path backslash.
- **TICKET-R202:** Boot — progress bar and buttons XP-style.
- **TICKET-R204:** Taskbar — unified XP-style icons for quick launch and tray.
- **TICKET-R208:** About — sidebar meta text contrast.
- **TICKET-R212:** Contributions — legend pills and scrollbar styling.
- **TICKET-R214:** Mobile Lite — panels and Download Resume button styling.
- **TICKET-R215:** Desktop icons — padding and label truncation.
- **TICKET-R217:** Global — custom scrollbar styling for app windows.

---

*All evidence lives in this repo: screenshots in `docs/qa-screenshots/`, tests in `tests/qa-screenshots.spec.ts`. Re-run `npx playwright test tests/qa-screenshots.spec.ts` to refresh screenshots after changes.*
