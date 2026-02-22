# Visual improvement tickets — app windows

Per-window tickets for readability, visual appeal, and light animation. All windows use the shared `.window-content` base; each app gets targeted improvements.

---

## [About Me]
- **Readability**: Ensure section headings and list text have sufficient contrast and line-height.
- **Visual**: Hero already has gradient card; add subtle bottom border to sections.
- **Animation**: Confirm stagger (app-about-stagger) applies; add 0.3s ease-out.

---

## [Resume]
- **Readability**: Slightly reduce gap between section cards on small viewports; ensure list line-height ≥ 1.5.
- **Visual**: Subtle box-shadow on section cards on hover; keep download button prominent.
- **Animation**: Section cards already have app-resume-section; ensure delays feel smooth.

---

## [Experience]
- **Readability**: Make exp-toggle buttons larger tap targets; clearer active/focus state.
- **Visual**: Timeline sections as light cards; experience-update-card with soft border and hover.
- **Animation**: Stagger timeline sections and update cards (already present); add 0.35s ease-out.

---

## [Skills]
- **Readability**: Filter buttons with clearer active state; meter labels slightly larger.
- **Visual**: Meters as small cards with soft shadow; progress bar with smooth fill transition.
- **Animation**: Add entrance stagger for filter-row + meter-stack (opacity + translateY).

---

## [Power / Extracurricular]
- **Readability**: Clear h2/h3 hierarchy; muted text at 0.9rem.
- **Visual**: Wrap sections in light cards; photo with border-radius and shadow; KG/LB toggle styled.
- **Animation**: Add app-resume-section–style entrance for sections.

---

## [LeetCode]
- **Readability**: LeetCodeStatsWidget and insight titles at consistent size; small text ≥ 0.8rem.
- **Visual**: Practice bar and insights in light card; routine stability as a small panel.
- **Animation**: Stagger stats, practice bar, and insight cards on open.

---

## [Projects]
- **Readability**: repo-summary and project-controls with clear labels; card text line-height 1.5.
- **Visual**: project-controls as a single toolbar (input + select); github-pulse as a compact card.
- **Animation**: Cards already have app-card-enter; add short delay for github-pulse.

---

## [Contributions]
- **Readability**: Lighter background for panel so text isn’t on dark; gauges with clear labels.
- **Visual**: contribution-gauges and highlights as light cards inside panel; keep one accent color.
- **Animation**: Stagger gauges and highlight cards.

---

## [Contact]
- **Readability**: Add “Get in touch” or “Contact” heading; group Copy Email + links.
- **Visual**: Single card container; primary (Copy Email) vs secondary (links) button style.
- **Animation**: Fade-in for .cards (opacity + translateY 6px).

---

## [Chatbot / Assist.chat]
- **Readability**: Header h2 1.1rem; placeholder and send button clearly visible.
- **Visual**: Chat area with rounded message bubbles; distinct bot vs user colors.
- **Animation**: Messages fade-in (or slide) when added; form and header with short entrance.

---

## [Help]
- **Readability**: “Keyboard Shortcuts” as clear h2; list with kbd + description.
- **Visual**: Wrap in a light card; kbd as pill (border-radius, background, padding).
- **Animation**: List items stagger (opacity + translateX) on open.

---

*Implementation: CSS in `src/styles.css` (per-app classes, keyframes, reduced-motion overrides); minimal JSX only where structure is needed (e.g. wrappers).*
