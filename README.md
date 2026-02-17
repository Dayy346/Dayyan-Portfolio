# Dayyan.OS v3 — Retro Frontend Portfolio

React + Vite + TypeScript rebuild of the portfolio as a retro desktop OS experience.

## What this version includes

- React + Vite + TypeScript app shell
- Boot sequence with:
  - Skip button
  - Reduced-motion auto-shortcut support
- Desktop UI with:
  - Taskbar + Start menu
  - Desktop icons
  - Window manager (open / close / minimize / maximize)
  - Z-index focus stacking
  - Draggable windows
- Frontend-heavy content and showcase emphasis
- FCB Health highlight bullets integrated in experience content
- Live GitHub repo section (top non-fork projects)
- Mobile OS-lite fallback view
- Keyboard support:
  - `Alt + Tab`: cycle focused window
  - `Ctrl + M`: minimize focused window
  - `Esc`: close Start menu
- Reduced-motion accessibility handling

## Quick start

```bash
npm install
npm run dev
```

Then open the local Vite URL (usually `http://localhost:5173`).

## Build + preview

```bash
npm run build
npm run preview
```

## Notes

- Static assets are served from `/assets`.
- The old static HTML/CSS/JS implementation has been replaced by the React app entry at `src/main.tsx`.
