# Dayyan-Portfolio Content Strategy

## Sources
- **Resume (PDF)**: Provided hard details on the CollabLab full-stack feature work (camera-required enforcement, stack), Regeneron QA/document-control roles, current QA Junior Document Control Analyst title, personal powerlifting stats (67.5 kg class, East Coast competition, nationals qualifier), and machine-learning/Kaggle experimentation.
- **Old static site**: Emphasized technical skills, GitHub activity, collegiate powerlifting, and the data narrative around security/infrastructure insights that we reused for the `experience` updates and keywords.
- **LinkedIn**: Not reachable through the loader (403/999), so all copy leans on the supported resume/old site data.

## Highlight Goals
1. Make the **CollabLab promotion** and active mentoring visible through a dedicated updates section that blends leadership context with delivery notes.
2. Elevate the **new junior AI engineer role** by calling it out as part of the signal-first content board, showing what the role produces (prompt scaffolds, telemetry, instrumentation).
3. Showcase the **Kaggle notebook** by surfacing the link and position it as continuing the data storytelling from older versions.
4. Celebrate **GitHub contributions** by naming the API feed, adding a text summary/link in the projects window, and reinforcing that data on mobile too.
5. Highlight **competitive lifting** by linking the power window to the resume’s 6th place finish, specific lifts, and how training mirrors engineering discipline.

## Execution Plan
- Built a reusable `EXPERIENCE_UPDATES` array that now contains cards for CollabLab leadership, the junior AI engineer arc, the collegiate powerlifting milestone, the Kaggle notebook, and the live GitHub feed, then surfaced them in the `experience` window with new grid styling.
- Updated the `desktop-story-widget` to consume `useShellStatus` so the list now describes boot progress, focus, window counts, and repo sync state while the marquee blends `shellStatus.stageMetric` with the premium highlight rotation.
- Passed `repoStatus` and `lastRepoSync` into `WindowContent` so the projects window can show a `repo-summary` paragraph and a direct link to the GitHub org while still rendering the filtered repo grid.
- Extended the mobile fallback (`MobileLite`) to show shell telemetry plus the experience updates list, keeping the Kaggle/GitHub/powerlifting narrative alive on handheld viewports.
- Added supporting CSS for the new grids, cards, and summary text so the content hierarchy feels cohesive with the existing retro OS chrome.

## Next Steps
- Confirm any LinkedIn-specific wording or media the user wants migrated once the profile is accessible.
- Verify the Kaggle notebook link and update the card text if there are more recent insights or a preferred badge.
- Monitor the live GitHub API feed for rate limits and fallback messaging so the repo summary stays accurate in the long run.
