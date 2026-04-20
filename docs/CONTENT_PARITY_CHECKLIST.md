# Content Parity Checklist

This document maps every section and item from the **original portfolio** (https://dayy346.github.io/Dayyan-Portfolio/) to the current React + Vite + TypeScript repo. Use it to ensure no content is removed or omitted when refactoring.

**Source of truth (old site):** Dayy346/Dayyan-Portfolio (GitHub Pages).  
**Current implementation:** `src/App.tsx`, `src/data.ts`, `src/components/win95/`, `src/components/widgets/`.

---

## Hero & Identity

| Old site item | Current location | Status |
|---------------|------------------|--------|
| Title: "Dayyan Hamid - Software Engineer & Data Engineer" | `App.tsx` → `WindowContent` for `appId === 'about'`: `<h1>Dayyan Hamid</h1>` + subtitle "Software Engineer • Data + Frontend Builder • Rutgers CS '25" | ☐ Preserve both title and subtitle |
| Tagline / role summary | About window: "I build polished frontend systems with strong backend integration..." | ☐ Keep |
| Profile image/headshot | About window: `<img src="/assets/headshot.jpg" alt="Dayyan Hamid" />` | ☐ Keep |
| Chips: React, TypeScript, Nuxt, Python/FastAPI, Azure | About window: `.chips` | ☐ Keep |
| Stat row: Frontend Systems, Cross-stack Delivery | About window: `.stat-row` | ☐ Keep |

---

## Technical Skills & Expertise

| Old site item | Current location | Status |
|---------------|------------------|--------|
| Section heading "Technical Skills & Expertise" / "A comprehensive overview..." | `App.tsx` → Skills window (`appId === 'skills'`) + Help.txt; desktop copy | ☐ Preserve section intent |
| **Frontend:** React, JavaScript, HTML5, CSS3, TypeScript | `App.tsx` → Skills.cfg (filter "frontend") + `skills` array: React + TS Design Systems, Nuxt, Accessibility | ☐ Ensure React, JS, HTML5, CSS3, TS are represented (labels or data) |
| **Backend:** Node.js, Express.js, Python, Java, REST APIs | Skills.cfg filter "backend": Node + FastAPI, etc. Resume: `data.ts` resumeSections Leadership & Skills bullets | ☐ Keep Node, Express, Python, Java, REST APIs visible |
| **Data & Cloud:** Power BI, SharePoint, Power Platform, SQL, Data Analysis | Skills.cfg "cloud" + resume bullets (Power BI, SharePoint, Azure) | ☐ Keep Power BI, SharePoint, Power Platform, SQL, Data Analysis |
| **Tools:** Git, GitHub, VS Code, Docker, Agile | Resume section "Leadership & Skills" + contribution highlights | ☐ Keep Git, GitHub, VS Code, Docker, Agile |

---

## Featured Projects

| Old site item | Current location | Status |
|---------------|------------------|--------|
| Section "Featured Projects" / "Showcasing my best work..." | `App.tsx` → Projects.dir window (`appId === 'projects'`): "Top GitHub Projects" | ☐ Keep heading and project list |
| Individual project entries (from old site) | Projects window: `filteredRepos` from GitHub API; fallback when API fails | ☐ Do not remove; ensure fallback/cache shows projects |
| Project cards: name, language, stars, description, repo link, live site link | `.project-card` with repo name, language, stargazers_count, description, html_url, homepage | ☐ Keep all fields |
| "Browse GitHub" link | Projects window: `<a href="https://github.com/dayy346">` | ☐ Keep |
| Filter + Sort (repositories) | `.project-controls`: filter input, sort (stars/name) | ☐ Keep |
| GitHub contributions decorative block in Projects | `.github-pulse` with totalStars, repos.length, contributionScore bar | ☐ Keep |

---

## Professional Experience

| Old site item | Current location | Status |
|---------------|------------------|--------|
| Section "Professional Experience" / "My journey in software engineering..." | `App.tsx` → Experience.log window | ☐ Keep |
| **Software Engineer — CollabLab 2024 - Present** | Experience timeline: "Junior AI Engineer — Olixir New York" + "Part-time Engineering Manager — CollabLab" + EXPERIENCE_UPDATES (CollabLab Leadership, Junior AI Engineer) | ☐ Ensure CollabLab 2024-Present with bullets (security, EC2, etc.) is present |
| CollabLab bullets: scalable backend/frontend, security & infrastructure, EC2, secrets management | Experience.log expandable sections + EXPERIENCE_UPDATES bullets | ☐ Preserve all bullets |
| **QA Junior Document Control Analyst — Regeneron Jun 2025 - Present** | Resume `data.ts` resumeSections Technical Experience; Experience.log "Regeneron Roles" | ☐ Keep role, date, GxP, OpenText, myQumas, TrackWise, SharePoint |
| **QA IRM Developer Intern — Regeneron 2023 - 2024** | Resume + Experience.log Regeneron section | ☐ Keep Power Platform, SharePoint, PowerBI, extension, recognition |
| Experience updates cards (CollabLab Leadership, Junior AI Engineer, Powerlifting, Kaggle, GitHub) | `EXPERIENCE_UPDATES` in App.tsx, `.experience-updates-grid` | ☐ Keep all cards and links (e.g. Kaggle notebook) |

---

## Collegiate Powerlifting

| Old site item | Current location | Status |
|---------------|------------------|--------|
| Section "Collegiate Powerlifting" | `App.tsx` → Power.stats window (`appId === 'power'`) | ☐ Keep |
| Text: Dec 2024, 6th place, discipline/dedication, "skills that translate to software engineering" | Power.stats: "Placed 6th in Dec 2024 collegiate championships" + EXPERIENCE_UPDATES powerlifting card | ☐ Keep narrative |
| Link "View Competition Results" → openpowerlifting.org | Add or verify link to https://www.openpowerlifting.org/u/dayyanhamid in Power.stats or data | ☐ Ensure link exists |
| Squat / Bench / Deadlift (e.g. 215kg, 145kg, 250kg) | Power.stats: stats array (215, 145, 250 kg) + KG/LB toggle | ☐ Keep |

---

## Ask About My Projects (AI Chatbot)

| Old site item | Current location | Status |
|---------------|------------------|--------|
| Section "Ask About My Projects" / "Use the AI chatbot below..." | `App.tsx` → Assist.chat window (`appId === 'chatbot'`) | ☐ Keep |
| Chat UI: input, send, message list | `.chatbot-shell`, `.chat-window`, `.chatbot-form` | ☐ Keep |
| Bot responses (resume, LeetCode, contributions, boot, chatbot) | `generateBotResponse` in App.tsx | ☐ Keep logic and copy |
| SearX search link | Login + Chatbot: `SEARX_URL` link | ☐ Keep |

---

## LeetCode Profile & Problem Solving

| Old site item | Current location | Status |
|---------------|------------------|--------|
| Section "💻 LeetCode Profile & Problem Solving" / "Demonstrating my algorithmic thinking..." | `App.tsx` → LeetCode.trn window + `LeetCodeStatsWidget` | ☐ Keep |
| LeetCode stats: problems solved, rating, streak, acceptance, easy/medium/hard | `LeetCodeStatsWidget.tsx` + `data.ts` leetCodeStats, FALLBACK_STATS | ☐ Keep; never render blank (cache/snapshot) |
| LeetCode insights / research notes | `leetCodeInsights` in data.ts, rendered in LeetCode window | ☐ Keep |
| Routine stability bar | `.leetcode-practice` bar in App.tsx | ☐ Keep |
| Link to LeetCode profile | Contact window: `https://leetcode.com/dayy345` | ☐ Keep |

---

## GitHub Activity & Contributions

| Old site item | Current location | Status |
|---------------|------------------|--------|
| Section "📈 GitHub Activity & Contributions" / "Showcasing my coding activity..." | Desktop `.contributions-widget` + Contributions.log window + `GitHubContributionFeed` | ☐ Keep |
| Contributions chart or feed | `GitHubContributionFeed.tsx`: events API + fallback FALLBACK_FEED, cache (localStorage) | ☐ Keep; never blank (cached/snapshot + "last updated") |
| Repo list / recent repos | Desktop contribution widget + Contributions window: recentRepos, contributionHighlights | ☐ Keep |
| GitHub link | Contact + Projects + Start menu: https://github.com/dayy346 | ☐ Keep |

---

## Let's Connect / Contact

| Old site item | Current location | Status |
|---------------|------------------|--------|
| Section "📞 Let's Connect" / "I'm always open to discussing..." | `App.tsx` → Contact.net window | ☐ Keep |
| Email (mailto) | Contact: `mailto:dh820@scarletmail.rutgers.edu` + Copy Email button | ☐ Keep |
| LinkedIn link | Contact: https://www.linkedin.com/in/dayyan-hamid/ | ☐ Keep |
| GitHub link | Contact: https://github.com/dayy346 | ☐ Keep |
| Buttons/links: "Email Me", "LinkedIn", "GitHub" | Contact window: Copy Email, Email, LinkedIn, GitHub (and LeetCode) | ☐ Keep all buttons/links |

---

## Resume / PDF

| Old site item | Current location | Status |
|---------------|------------------|--------|
| Resume download or view | Start menu: `<a href="/assets/resume.pdf" download>`; recruiter "View Profiles" / "View Resume" | ☐ Keep |
| Resume content (education, experience, projects, skills) | `data.ts` resumeSections + Resume.pdf window | ☐ Keep resumeSections in sync with PDF intent |

---

## Global UI Elements

| Old site item | Current location | Status |
|---------------|------------------|--------|
| Start button / taskbar | `header.taskbar`, `.start-btn` | ☐ Keep |
| Desktop icon grid (all apps) | `.desktop-icon-grid`, `apps` from data.ts | ☐ Keep all 14 apps; no overlapping icons |
| Window strip (open windows) | `footer.window-strip` | ☐ Keep |
| Clock | `.clock` in taskbar | ☐ Keep |
| Mood/theme toggle | `.mood-btn` (studio / archive / night) | ☐ Keep |
| Keyboard shortcuts (Alt+Tab, Ctrl+M, Esc, etc.) | Help.txt + Start menu "Keyboard shortcuts" + HeroSignalRail | ☐ Keep KEYBOARD_SHORTCUTS and Help content |

---

## Boot & Login

| Old site item | Current location | Status |
|---------------|------------------|--------|
| Boot / loading experience | Replaced by **Win9x Boot Dialog** (file transfer style); previous: `BootSequence.tsx` | ☐ New boot must not remove ability to reach desktop with all content |
| Login screen (Win95 style) | `Win95Login.tsx` after boot completes | ☐ Keep; show after new boot dialog completes |
| Skip boot / Continue | New boot: Cancel → "Cancelling…" then resume or complete; Open when done | ☐ Preserve skip/continue behavior |

---

## Widgets (GitHub + LeetCode)

| Old site item | Current location | Status |
|---------------|------------------|--------|
| GitHub contributions widget visible in OS UI | Desktop `.contributions-widget` + Contributions.log window embeds `GitHubContributionFeed` | ☐ Keep visible; never blank (cache + "last updated" label) |
| LeetCode stats widget visible in OS UI | LeetCode.trn window embeds `LeetCodeStatsWidget`; desktop can show summary | ☐ Keep visible; never blank (snapshot/cache/fallback) |
| Cached last-good data (localStorage) | GitHubContributionFeed: CACHE_KEY, CACHE_TTL; LeetCodeStatsWidget: CACHE_KEY, CACHE_TTL | ☐ Keep; add "snapshot mode" / last updated label when using cache |
| Graceful fallback when CORS/rate limit | Both widgets: FALLBACK_FEED / FALLBACK_STATS + status 'error' shows cached | ☐ Ensure fallback UI shows "last updated" and never empty state |

---

## Notes for Implementers

- **Do NOT delete** any of the sections or entries above when refactoring.
- **Restructure only if** every item is preserved (e.g. move copy to data.ts but keep it rendered).
- **Adding** new content is fine; **removing or omitting** is not.
- After any change, run through this checklist and tick boxes; fix any unchecked items before merging.
