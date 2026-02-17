import { useEffect, useMemo, useRef, useState } from 'react';
import { AppId, apps, bootLines } from './data';

type Repo = { name: string; language: string | null; stargazers_count: number; description: string | null; html_url: string; homepage?: string | null; fork: boolean };
type WindowState = { isOpen: boolean; minimized: boolean; maximized: boolean; x: number; y: number; z: number };

const INITIAL_POSITIONS: Record<AppId, { x: number; y: number }> = {
  about: { x: 90, y: 84 },
  showcase: { x: 140, y: 100 },
  projects: { x: 190, y: 116 },
  experience: { x: 230, y: 96 },
  skills: { x: 160, y: 130 },
  frontend: { x: 120, y: 148 },
  power: { x: 200, y: 140 },
  contact: { x: 260, y: 118 },
  help: { x: 280, y: 88 }
};

const createInitialWindowMap = () =>
  apps.reduce((acc, app, i) => {
    acc[app.id] = {
      isOpen: app.id === 'about',
      minimized: false,
      maximized: false,
      z: i + 1,
      x: INITIAL_POSITIONS[app.id].x,
      y: INITIAL_POSITIONS[app.id].y
    };
    return acc;
  }, {} as Record<AppId, WindowState>);

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const m = window.matchMedia(query);
    const onChange = () => setMatches(m.matches);
    m.addEventListener('change', onChange);
    return () => m.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export default function App() {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isMobile = useMediaQuery('(max-width: 920px)');
  const [clock, setClock] = useState('');
  const [bootIndex, setBootIndex] = useState(reducedMotion ? bootLines.length : 0);
  const [bootDone, setBootDone] = useState(reducedMotion);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [focused, setFocused] = useState<AppId>('about');
  const zRef = useRef(20);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [windowMap, setWindowMap] = useState<Record<AppId, WindowState>>(createInitialWindowMap);

  useEffect(() => {
    const renderClock = () => setClock(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    renderClock();
    const id = setInterval(renderClock, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setBootIndex(bootLines.length);
      setBootDone(true);
      return;
    }
    if (bootDone) return;
    const id = setInterval(() => {
      setBootIndex((curr) => {
        const next = curr + 1;
        if (next >= bootLines.length) {
          clearInterval(id);
          setBootDone(true);
          return bootLines.length;
        }
        return next;
      });
    }, 450);
    return () => clearInterval(id);
  }, [bootDone, reducedMotion]);

  useEffect(() => {
    fetch('https://api.github.com/users/dayy346/repos?sort=updated&per_page=100')
      .then((r) => r.json())
      .then((items: Repo[]) => {
        const top = items
          .filter((r) => !r.fork && r.name !== 'Dayyan-Portfolio')
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 10);
        setRepos(top);
      })
      .catch(() => setRepos([]));
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!bootDone || isMobile) return;
      if (e.key === 'Escape') setStartMenuOpen(false);
      if (e.altKey && e.key.toLowerCase() === 'tab') {
        e.preventDefault();
        const open = apps.filter((a) => windowMap[a.id].isOpen && !windowMap[a.id].minimized);
        if (!open.length) return;
        const idx = open.findIndex((w) => w.id === focused);
        const next = open[(idx + 1) % open.length].id;
        focusWindow(next);
      }
      if (e.ctrlKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setWindowMap((curr) => ({
          ...curr,
          [focused]: { ...curr[focused], minimized: true }
        }));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [bootDone, isMobile, focused, windowMap]);

  const visibleBootLines = useMemo(() => bootLines.slice(0, bootIndex), [bootIndex]);

  function focusWindow(appId: AppId) {
    zRef.current += 1;
    setFocused(appId);
    setWindowMap((curr) => ({ ...curr, [appId]: { ...curr[appId], z: zRef.current, minimized: false, isOpen: true } }));
  }

  function openWindow(appId: AppId) {
    focusWindow(appId);
    setStartMenuOpen(false);
  }

  function closeWindow(appId: AppId) {
    setWindowMap((curr) => ({ ...curr, [appId]: { ...curr[appId], isOpen: false } }));
  }

  function minimizeWindow(appId: AppId) {
    setWindowMap((curr) => ({ ...curr, [appId]: { ...curr[appId], minimized: true } }));
  }

  function maximizeWindow(appId: AppId) {
    focusWindow(appId);
    setWindowMap((curr) => ({ ...curr, [appId]: { ...curr[appId], maximized: !curr[appId].maximized } }));
  }

  function dragWindow(appId: AppId, x: number, y: number) {
    setWindowMap((curr) => ({ ...curr, [appId]: { ...curr[appId], x, y } }));
  }

  if (!bootDone) {
    return (
      <div className="boot-screen" role="dialog" aria-live="polite" aria-label="Dayyan OS boot sequence">
        <div className="boot-terminal">
          <p className="boot-title">DAYYAN BIOS v3.0 // Frontend Edition</p>
          <div className="boot-log">{visibleBootLines.map((line) => <p key={line}>{line}</p>)}</div>
          <div className="progress-wrap"><div className="progress" style={{ width: `${(bootIndex / bootLines.length) * 100}%` }} /></div>
          <button onClick={() => { setBootDone(true); setBootIndex(bootLines.length); }}>Skip Boot</button>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return <MobileLite repos={repos} clock={clock} />;
  }

  return (
    <div className="os-shell">
      <header className="taskbar">
        <button className="start-btn" onClick={() => setStartMenuOpen((v) => !v)} aria-haspopup="menu" aria-expanded={startMenuOpen}>⏻ START</button>
        <p className="taskbar-title">DAYYAN.OS // RETRO FRONTEND SHELL</p>
        <p className="clock" aria-live="off">{clock}</p>
      </header>

      {startMenuOpen && (
        <aside className="start-menu" role="menu" aria-label="Start Menu">
          <p>Launch Programs</p>
          {apps.map((app) => (
            <button role="menuitem" key={app.id} onClick={() => openWindow(app.id)}>{app.icon} {app.label}</button>
          ))}
          <a href="/assets/resume.pdf" download>⬇ Resume.pdf</a>
        </aside>
      )}

      <main className="desktop" onClick={() => setStartMenuOpen(false)}>
        {apps.map((app) => (
          <button key={app.id} className="desktop-icon" onDoubleClick={() => openWindow(app.id)} onClick={() => setFocused(app.id)}>
            <span>{app.icon}</span>
            <small>{app.label}</small>
          </button>
        ))}

        {apps.map((app) => {
          const state = windowMap[app.id];
          if (!state.isOpen || state.minimized) return null;
          return (
            <Window
              key={app.id}
              appId={app.id}
              title={app.label}
              focused={focused === app.id}
              state={state}
              onFocus={() => focusWindow(app.id)}
              onClose={() => closeWindow(app.id)}
              onMinimize={() => minimizeWindow(app.id)}
              onMaximize={() => maximizeWindow(app.id)}
              onDrag={(x, y) => dragWindow(app.id, x, y)}
            >
              <WindowContent appId={app.id} repos={repos} />
            </Window>
          );
        })}
      </main>

      <footer className="window-strip" aria-label="Opened windows">
        {apps.filter((a) => windowMap[a.id].isOpen).map((app) => (
          <button key={app.id} className={focused === app.id ? 'active' : ''} onClick={() => openWindow(app.id)}>
            {app.icon} {app.label}
          </button>
        ))}
      </footer>
    </div>
  );
}

function Window({ appId, title, focused, state, onFocus, onClose, onMinimize, onMaximize, onDrag, children }: { appId: AppId; title: string; focused: boolean; state: WindowState; onFocus: () => void; onClose: () => void; onMinimize: () => void; onMaximize: () => void; onDrag: (x: number, y: number) => void; children: JSX.Element }) {
  function onMouseDown(e: React.MouseEvent<HTMLElement>) {
    if ((e.target as HTMLElement).closest('.window-actions')) return;
    onFocus();
    const startX = e.clientX;
    const startY = e.clientY;
    const initX = state.x;
    const initY = state.y;

    const move = (ev: MouseEvent) => {
      if (state.maximized) return;
      const nx = Math.max(8, initX + ev.clientX - startX);
      const ny = Math.max(52, initY + ev.clientY - startY);
      onDrag(nx, ny);
    };

    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }

  return (
    <section
      className={`window ${focused ? 'focused' : ''} ${state.maximized ? 'maxed' : ''}`}
      style={{ left: state.x, top: state.y, zIndex: state.z }}
      onMouseDown={onFocus}
      role="dialog"
      aria-label={`${title} window`}
    >
      <header className="window-title" onMouseDown={onMouseDown}>
        <p>{title}</p>
        <div className="window-actions">
          <button aria-label={`Minimize ${title}`} onClick={onMinimize}>—</button>
          <button aria-label={`Maximize ${title}`} onClick={onMaximize}>{state.maximized ? '🗗' : '🗖'}</button>
          <button aria-label={`Close ${title}`} onClick={onClose}>✕</button>
        </div>
      </header>
      <div className="window-content" data-app={appId}>{children}</div>
    </section>
  );
}

function WindowContent({ appId, repos }: { appId: AppId; repos: Repo[] }) {
  if (appId === 'about') return <article className="about-grid"><img src="/assets/headshot.jpg" alt="Dayyan Hamid" className="profile" /><div><h1>Dayyan Hamid</h1><p className="muted">Software Engineer • Data + Frontend Builder • Rutgers CS '25</p><p>I build polished frontend systems with strong backend integration. This shell is designed to feel nostalgic, fast, and intentional.</p><div className="chips"><span>React</span><span>TypeScript</span><span>Nuxt</span><span>Python/FastAPI</span><span>Azure</span></div></div></article>;
  if (appId === 'showcase') return <article className="cards"><div><h3>Frontend Systems</h3><p>Building reusable components, desktop-grade interactions, and purposeful motion.</p></div><div><h3>Product Mindset</h3><p>Translate business asks into intuitive UI flows that users trust.</p></div><div><h3>Cross-stack Delivery</h3><p>Frontend-first execution backed by practical APIs and cloud deployment.</p></div></article>;
  if (appId === 'experience') return <article className="timeline"><section><h3>Software Engineer — FCB Health</h3><ul><li>Built Nuxt frontend for production-facing user workflows.</li><li>Implemented Python + FastAPI backend services.</li><li>Integrated Azure AI Search for retrieval-driven functionality.</li><li>Hosted on Azure App Service with stable deployment pipelines.</li></ul></section><section><h3>Part-time Engineering Manager — CollabLab</h3><p><strong>Promoted internally</strong> while continuing to contribute hands-on as an engineer.</p><p>Leading delivery across frontend-focused initiatives, mentoring contributors, and improving execution quality across full-stack features.</p></section><section><h3>Regeneron Roles</h3><p>Delivered QA/document-control workflows and Power Platform solutions for process reliability.</p></section></article>;
  if (appId === 'skills') return <article className="cards"><div><h3>Frontend</h3><p>React, TypeScript, Nuxt, accessibility, interaction design, CSS systems.</p></div><div><h3>Backend</h3><p>Node.js, Express, Python/FastAPI, API architecture.</p></div><div><h3>Data + Cloud</h3><p>Azure App Service, Azure AI Search, SQL, Power BI.</p></div></article>;
  if (appId === 'frontend') return <article><h2>Frontend Focus Highlights</h2><ul><li>Reusable patterns: card systems, window primitives, state-driven UI shells.</li><li>Performance-first rendering and measured animation.</li><li>Keyboard + screen-reader support as first-class UX concerns.</li></ul></article>;
  if (appId === 'power') return <article className="about-grid"><img src="/assets/powerlifting.jpg" className="profile" alt="Powerlifting meet" /><div><h2>Collegiate Powerlifting</h2><p>Placed 6th in Dec 2024 championships. I bring the same consistency and focus into product execution.</p></div></article>;
  if (appId === 'projects') return <article><h2>Top GitHub Projects</h2><div className="project-grid">{repos.length ? repos.map((repo) => (<section key={repo.name} className="project-card"><h3>{repo.name}</h3><p className="muted">{repo.language || 'Multi'} • ★ {repo.stargazers_count}</p><p>{repo.description || 'Built to solve real-world problems with practical engineering.'}</p><a href={repo.html_url} target="_blank" rel="noreferrer">Open repo ↗</a></section>)) : <p className="muted">GitHub data loading unavailable right now.</p>}</div></article>;
  if (appId === 'contact') return <article className="cards"><a href="mailto:dh820@scarletmail.rutgers.edu">Email</a><a href="https://www.linkedin.com/in/dayyan-hamid/" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://github.com/dayy346" target="_blank" rel="noreferrer">GitHub</a><a href="https://leetcode.com/dayy345" target="_blank" rel="noreferrer">LeetCode</a></article>;
  return <article><h2>Keyboard Shortcuts</h2><ul><li><kbd>Alt</kbd> + <kbd>Tab</kbd>: cycle focused window</li><li><kbd>Ctrl</kbd> + <kbd>M</kbd>: minimize focused window</li><li><kbd>Esc</kbd>: close Start menu</li><li>Double-click desktop icons to open apps</li></ul></article>;
}

function MobileLite({ repos, clock }: { repos: Repo[]; clock: string }) {
  return (
    <div className="mobile-lite">
      <header>
        <h1>Dayyan.OS Mobile Lite</h1>
        <p>{clock}</p>
      </header>
      <section>
        <h2>Frontend-first Engineer</h2>
        <p>Retro desktop experience is optimized for larger screens. Mobile gets a clean, fast summary of highlights.</p>
      </section>
      <section>
        <h3>FCB Health Highlights</h3>
        <ul><li>Nuxt frontend development for production workflows</li><li>Python + FastAPI backend services</li><li>Azure AI Search integration</li><li>Deployment on Azure App Service</li></ul>
      </section>
      <section>
        <h3>Featured Repositories</h3>
        <ul>{repos.slice(0, 4).map((repo) => <li key={repo.name}><a href={repo.html_url} target="_blank" rel="noreferrer">{repo.name}</a></li>)}</ul>
      </section>
      <footer><a href="/assets/resume.pdf" download>Download Resume</a></footer>
    </div>
  );
}
