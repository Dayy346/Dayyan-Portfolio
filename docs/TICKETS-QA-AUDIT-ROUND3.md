# Portfolio UI — QA Visual Audit Round 3 (Polish / recruiter-readiness)

This round is less about functional bugs and more about whether the site feels like a polished professional portfolio instead of an overly clever fake desktop shell.

Primary goal: keep the retro OS concept, but make the first impression calmer, clearer, and more credible.

---

## R301: The fake OS shell is still doing too much of the work

- Severity: High
- Area: Overall landing experience
- Why it matters: The site currently reads as a retro desktop demo first and a portfolio second. That makes the brand memorable, but not yet recruiter-first.
- What to fix:
  - Reduce the visual weight of the shell chrome where possible.
  - Make the hero/overview state feel more like a portfolio landing page and less like an interactive prank.
  - Use the OS flavor as framing, not the entire story.
- Acceptance criteria:
  - The page immediately communicates who Dayyan is, what he does, and what the visitor should click next.
  - The OS theme feels intentional and restrained rather than dominant.

---

## R302: File-transfer / download dialog reads as noise

- Severity: High
- Area: Boot/login flow or first-run visual state
- Why it matters: A fake transfer dialog is easy to misread as an error, ad, or unfinished debug artifact.
- What to fix:
  - Either remove it entirely or restyle it into a clearly intentional onboarding/intro element.
  - If it stays, make the purpose obvious and visually calmer.
- Acceptance criteria:
  - No dialog looks like a random download or file-transfer state.
  - Any introductory motion feels like part of the brand, not a broken system message.

---

## R303: About window is too tall and too dense for an opening impression

- Severity: High
- Area: About window
- Why it matters: The About panel has good content, but it is long enough to push the most important parts below the fold. That weakens the first impression and makes the window feel heavy.
- What to fix:
  - Tighten the hero copy.
  - Convert some of the content into shorter proof bullets or compact cards.
  - Reduce vertical rhythm so the key message is visible sooner.
- Acceptance criteria:
  - The top of the About window clearly communicates name, role, current focus, and credibility in one glance.
  - The section feels polished and editorial, not like a wall of content inside a big gray box.

---

## R304: Desktop composition needs more breathing room and clearer hierarchy

- Severity: Medium
- Area: Desktop layout
- Why it matters: The desktop still feels a little crowded near the top-left/top-right balance between widgets, icons, and the window.
- What to fix:
  - Revisit spacing around the GitHub and LeetCode widgets.
  - Check edge padding for desktop icons.
  - Make sure the window stack doesn’t fight the background composition.
- Acceptance criteria:
  - The page has a clearer focal point.
  - No zone of the desktop feels jammed against the edge of the viewport.

---

## R305: Copy still needs a final professional pass

- Severity: High
- Area: All major surfaces
- Why it matters: Some labels and microcopy have already been cleaned up, but the site still needs one final pass to make sure nothing feels playful, vague, or gadget-y.
- What to fix:
  - Reduce playful labels where they weaken trust.
  - Make section titles feel like portfolio sections, not file formats.
  - Keep voice confident and concise.
- Acceptance criteria:
  - The tone is consistent across boot, desktop, windows, and taskbar.
  - A recruiter can understand the site in seconds without learning the metaphor.

---

## R306: More editorial hierarchy inside content windows

- Severity: Medium
- Area: Projects / Experience / Skills / Contact windows
- Why it matters: The windows should feel like polished case-study surfaces, not generic containers.
- What to fix:
  - Strengthen typographic hierarchy.
  - Use short lead paragraphs and proof bullets.
  - Avoid large empty gray areas or placeholder-looking separators.
- Acceptance criteria:
  - Each window has a clear content rhythm: title, summary, proof, action.
  - No area feels like accidental empty space.

---

## R307: Responsive polish should preserve the professional tone

- Severity: High
- Area: Mobile and narrower breakpoints
- Why it matters: A visually dense desktop shell can break down quickly on smaller screens.
- What to fix:
  - Make sure the hierarchy remains clear on tablet/mobile.
  - Avoid cramped controls and excessive vertical scrolling.
  - Keep the OS flavor, but don’t force desktop metaphors where they stop helping.
- Acceptance criteria:
  - The mobile experience feels intentionally designed, not like a scaled-down desktop screenshot.
  - CTAs remain obvious and readable at smaller sizes.

---

## Suggested implementation order

1. Reduce or remove the fake transfer dialog.
2. Tighten the About panel so the opening view feels more executive-summary-like.
3. Add spacing/hierarchy polish to the desktop composition.
4. Do a final copy pass across labels and section headings.
5. Re-run visual QA on desktop, tablet, and mobile.

---

## Notes for the implementation agent

- Use this document as a living ticket list for the next iteration.
- Focus on design quality first, then verify with browser screenshots.
- The site should still feel like Dayyan’s brand, but more premium and less vibe-coded.
