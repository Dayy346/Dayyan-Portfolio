import { useEffect, useMemo, useRef, useState } from 'react';
import { AppId, apps, bootStages } from './data';

type Repo = { name: string; language: string | null; stargazers_count: number; description: string | null; html_url: string; homepage?: string | null; fork: boolean };
type WindowState = { isOpen: boolean; minimized: boolean; maximized: boolean; x: number; y: number; z: number };

type GitHubRepoResponse = Repo[] | { message?: string };

type ExperiencePanel = 'fcb' | 'collablab' | 'regeneron';
type ShellMood = 'studio' | 'archive' | 'night';

const INITIAL_POSITIONS: Record<AppId, { x: number; y: number }> = {
  about: { x: 90, y: 84 },
  showcase: { x: 152, y: 104 },
  projects: { x: 208, y: 122 },
  experience: { x: 250, y: 96 },
  skills: { x: 172, y: 138 },
  frontend: { x: 132, y: 154 },
  power: { x: 216, y: 146 },
  contact: { x: 274, y: 124 },
  help: { x: 298, y: 88 }
};

const totalBootLines = bootStages.reduce((sum, stage) => sum + stage.lines.length, 0);

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

const getVisibleOpenApps = (map: Record<AppId, WindowState>) =>
  apps.filter((a) => map[a.id].isOpen && !map[a.id].minimized);

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
  const [bootStageIndex, setBootStageIndex] = useState(reducedMotion ? bootStages.length - 1 : 0);
  const [bootLineIndex, setBootLineIndex] = useState(reducedMotion ? bootStages[bootStages.length - 1].lines.length : 0);
  const [bootTransitioning, setBootTransitioning] = useState(false);
  const [bootDone, setBootDone] = useState(reducedMotion);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [focused, setFocused] = useState<AppId>('about');
  const [shellMood, setShellMood] = useState<ShellMood>('studio');
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
      setBootStageIndex(bootStages.length - 1);
      setBootLineIndex(bootStages[bootStages.length - 1].lines.length);
      setBootDone(true);
      return;
    }
    if (bootDone) return;

    const stage = bootStages[bootStageIndex];
    const msPerLine = Math.max(200, Math.floor(stage.durationMs / stage.lines.length));
    const timer = setInterval(() => {
      setBootLineIndex((curr) => {
        const nextLine = curr + 1;
        if (nextLine <= stage.lines.length) return nextLine;
        clearInterval(timer);
        if (bootStageIndex < bootStages.length - 1) {
          setBootStageIndex((s) => s + 1);
          return 0;
        }
        setBootTransitioning(true);
        window.setTimeout(() => {
          setBootDone(true);
          setBootTransitioning(false);
        }, 320);
        return stage.lines.length;
      });
    }, msPerLine);

    return () => clearInterval(timer);
  }, [bootDone, bootStageIndex, reducedMotion]);

  useEffect(() => {
    const controller = new AbortController();
    fetch('https://api.github.com/users/dayy346/repos?sort=updated&per_page=100', { signal: controller.signal })
      .then((r) => r.json())
      .then((payload: GitHubRepoResponse) => {
        if (!Array.isArray(payload)) {
          setRepos([]);
          return;
        }
        const top = payload
          .filter((r) => !r.fork && r.name !== 'Dayyan-Portfolio')
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 12);
        setRepos(top);
      })
      .catch(() => setRepos([]));

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!bootDone || isMobile) return;
      if (e.key === 'Escape') setStartMenuOpen(false);
      if (e.altKey && e.key.toLowerCase() === 'tab') {
        e.preventDefault();
        const open = getVisibleOpenApps(windowMap);
        if (!open.length) return;
        const idx = open.findIndex((w) => w.id === focused);
        const next = open[(idx >= 0 ? idx + 1 : 0) % open.length].id;
        focusWindow(next);
      }
      if (e.ctrlKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        if (!windowMap[focused].isOpen) return;
        minimizeWindow(focused);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [bootDone, isMobile, focused, windowMap]);

  const currentStage = bootStages[bootStageIndex];
  const visibleBootLines = useMemo(() => currentStage.lines.slice(0, bootLineIndex), [currentStage.lines, bootLineIndex]);
  const completedLines = useMemo(() => {
    const priorStagesLines = bootStages.slice(0, bootStageIndex).reduce((sum, stage) => sum + stage.lines.length, 0);
    return priorStagesLines + bootLineIndex;
  }, [bootStageIndex, bootLineIndex]);

  const activeWindowCount = useMemo(() => apps.filter((a) => windowMap[a.id].isOpen && !windowMap[a.id].minimized).length, [windowMap]);

  function skipBoot() {
    setBootStageIndex(bootStages.length - 1);
    setBootLineIndex(bootStages[bootStages.length - 1].lines.length);
    setBootTransitioning(true);
    window.setTimeout(() => {
      setBootDone(true);
      setBootTransitioning(false);
    }, reducedMotion ? 0 : 180);
  }

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
    const nextMap = { ...windowMap, [appId]: { ...windowMap[appId], isOpen: false, minimized: false } };
    if (focused === appId) {
      const visible = getVisibleOpenApps(nextMap);
      setFocused((visible[visible.length - 1]?.id as AppId | undefined) ?? 'about');
    }
    setWindowMap(nextMap);
  }

  function minimizeWindow(appId: AppId) {
    const nextMap = { ...windowMap, [appId]: { ...windowMap[appId], minimized: true } };
    if (focused === appId) {
      const visible = getVisibleOpenApps(nextMap);
      setFocused((visible[visible.length - 1]?.id as AppId | undefined) ?? 'about');
    }
    setWindowMap(nextMap);
  }

  function maximizeWindow(appId: AppId) {
    focusWindow(appId);
    setWindowMap((curr) => ({ ...curr, [appId]: { ...curr[appId], maximized: !curr[appId].maximized } }));
  }

  function dragWindow(appId: AppId, x: number, y: number) {
    setWindowMap((curr) => ({ ...curr, [appId]: { ...curr[appId], x, y } }));
  }

  if (isMobile && bootDone) {
    return <MobileLite repos={repos} clock={clock} />;
  }

  return (
    <>
      <div className={`os-shell ${bootDone ? 'ready' : 'preboot'} mood-${shellMood}`}>
        <header className="taskbar">
          <button className="start-btn" onClick={() => setStartMenuOpen((v) => !v)} aria-haspopup="menu" aria-expanded={startMenuOpen}>⏻ START</button>
          <p className="taskbar-title">DAYYAN.OS // RETRO FRONTEND SHELL</p>
          <div className="taskbar-status">
            <button className="mood-btn" onClick={() => setShellMood((curr) => (curr === 'studio' ? 'archive' : curr === 'archive' ? 'night' : 'studio'))} aria-label="Cycle desktop mood">
              Theme: {shellMood}
            </button>
            <p className="clock" aria-live="off">{clock}</p>
          </div>
        </header>

        {startMenuOpen && bootDone && (
          <aside className="start-menu" role="menu" aria-label="Start Menu">
            <p>Launch Programs</p>
            {apps.map((app) => (
              <button role="menuitem" key={app.id} onClick={() => openWindow(app.id)}>{app.icon} {app.label}</button>
            ))}
            <a href="/assets/resume.pdf" download>⬇ Resume.pdf</a>
          </aside>
        )}

        <main className="desktop" onClick={() => setStartMenuOpen(false)}>
          <section className="desktop-story-widget" aria-label="Session status">
            <p>Session Active</p>
            <h2>Designing modern products with vintage UX DNA.</h2>
            <ul>
              <li>{activeWindowCount} windows active</li>
              <li>Alt+Tab enabled</li>
              <li>Reduced motion aware</li>
            </ul>
          </section>

          {apps.map((app) => (
            <button
              key={app.id}
              className="desktop-icon"
              onDoubleClick={() => openWindow(app.id)}
              onClick={() => setFocused(app.id)}
              onKeyDown={(e) => e.key === 'Enter' && openWindow(app.id)}
            >
              <span>{app.icon}</span>
              <small>{app.label}</small>
            </button>
          ))}

          {apps.map((app) => {
            const state = windowMap[app.id];
            if (!state.isOpen || state.minimized || !bootDone) return null;
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
          {apps.filter((a) => windowMap[a.id].isOpen).map((app) => {
            const isFocused = focused === app.id && !windowMap[app.id].minimized;
            return (
              <button
                key={app.id}
                className={isFocused ? 'active' : ''}
                onClick={() => (isFocused ? minimizeWindow(app.id) : openWindow(app.id))}
                aria-pressed={isFocused}
              >
                {app.icon} {app.label}
              </button>
            );
          })}
        </footer>
      </div>

      {!bootDone && (
        <BootSequence
          stage={currentStage}
          stageIndex={bootStageIndex}
          stageCount={bootStages.length}
          visibleLines={visibleBootLines}
          progress={completedLines / totalBootLines}
          transitioning={bootTransitioning}
          onSkip={skipBoot}
          reducedMotion={reducedMotion}
        />
      )}

      {isMobile && !bootDone && <div className="mobile-boot-hint">Tip: press S, Enter, or Skip to load Mobile Lite.</div>}
    </>
  );
}

function BootSequence({
  stage,
  stageIndex,
  stageCount,
  visibleLines,
  progress,
  transitioning,
  onSkip,
  reducedMotion
}: {
  stage: { id: string; title: string; subtitle: string; accent: string };
  stageIndex: number;
  stageCount: number;
  visibleLines: string[];
  progress: number;
  transitioning: boolean;
  onSkip: () => void;
  reducedMotion: boolean;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 's' || e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') onSkip();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onSkip]);

  return (
    <div className={`boot-screen ${transitioning ? 'fade-out' : ''}`} role="dialog" aria-live="polite" aria-label="Dayyan OS boot sequence">
      <div className="boot-terminal" style={{ '--stage-accent': stage.accent } as React.CSSProperties}>
        <p className="boot-title">DAYYAN BIOS v3.2 // Frontend Edition</p>
        <div className="boot-stagebar" aria-label="Boot stage progress">
          {Array.from({ length: stageCount }).map((_, i) => (
            <span key={i} className={i <= stageIndex ? 'active' : ''} />
          ))}
        </div>
        <p className="boot-stage-title">Stage {stageIndex + 1} / {stageCount}: {stage.title} <strong>{Math.round(progress * 100)}%</strong></p>
        <p className="boot-subtitle">{stage.subtitle}</p>
        <div className="boot-log">{visibleLines.map((line) => <p key={line}>{line}</p>)}</div>
        <div className="progress-wrap"><div className="progress" style={{ width: `${progress * 100}%` }} /></div>
        <div className="boot-footer">
          <small>Press <kbd>S</kbd>, <kbd>Esc</kbd>, <kbd>Enter</kbd>, or <kbd>Space</kbd> to skip</small>
          <button onClick={onSkip}>{reducedMotion ? 'Continue' : 'Skip Boot'}</button>
        </div>
      </div>
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
      const maxX = Math.max(8, window.innerWidth - 240);
      const maxY = Math.max(52, window.innerHeight - 180);
      const nx = Math.min(maxX, Math.max(8, initX + ev.clientX - startX));
      const ny = Math.min(maxY, Math.max(52, initY + ev.clientY - startY));
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
      <header className="window-title" onMouseDown={onMouseDown} onDoubleClick={onMaximize}>
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
  const [showcaseTab, setShowcaseTab] = useState<'systems' | 'motion' | 'delivery'>('systems');
  const [experiencePanel, setExperiencePanel] = useState<ExperiencePanel>('fcb');
  const [skillFilter, setSkillFilter] = useState<'all' | 'frontend' | 'backend' | 'cloud'>('all');
  const [projectQuery, setProjectQuery] = useState('');
  const [sortMode, setSortMode] = useState<'stars' | 'name'>('stars');
  const [useLbs, setUseLbs] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const filteredRepos = useMemo(() => {
    const base = repos.filter((repo) => repo.name.toLowerCase().includes(projectQuery.toLowerCase()));
    return base.sort((a, b) => (sortMode === 'stars' ? b.stargazers_count - a.stargazers_count : a.name.localeCompare(b.name)));
  }, [repos, projectQuery, sortMode]);

  const skills = [
    { label: 'React + TS Design Systems', value: 93, lane: 'frontend' },
    { label: 'Nuxt App Architecture', value: 88, lane: 'frontend' },
    { label: 'Node + FastAPI Services', value: 85, lane: 'backend' },
    { label: 'Azure App Service + AI Search', value: 84, lane: 'cloud' },
    { label: 'Accessibility + Keyboard UX', value: 90, lane: 'frontend' }
  ] as const;

  const shownSkills = skills.filter((item) => skillFilter === 'all' || item.lane === skillFilter);

  async function copyText(label: string, value: string) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1400);
    } catch {
      setCopied(null);
    }
  }

  if (appId === 'about') {
    return (
      <article className="about-grid">
        <img src="/assets/headshot.jpg" alt="Dayyan Hamid" className="profile" />
        <div>
          <h1>Dayyan Hamid</h1>
          <p className="muted">Software Engineer • Data + Frontend Builder • Rutgers CS '25</p>
          <p>I build polished frontend systems with strong backend integration. This shell blends nostalgic interaction models with modern execution quality.</p>
          <div className="chips"><span>React</span><span>TypeScript</span><span>Nuxt</span><span>Python/FastAPI</span><span>Azure</span></div>
          <div className="stat-row">
            <div><strong>Frontend Systems</strong><small>Desktop-grade interactions + reusable primitives</small></div>
            <div><strong>Cross-stack Delivery</strong><small>UI, APIs, deployment, and reliability</small></div>
          </div>
        </div>
      </article>
    );
  }

  if (appId === 'showcase') {
    const tabs = [
      { id: 'systems', label: 'UI Systems' },
      { id: 'motion', label: 'Interaction + Motion' },
      { id: 'delivery', label: 'Product Delivery' }
    ] as const;

    const onTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentId: typeof tabs[number]['id']) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const idx = tabs.findIndex((t) => t.id === currentId);
      const nextIdx = e.key === 'ArrowRight' ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
      setShowcaseTab(tabs[nextIdx].id);
    };

    return (
      <article>
        <div className="tab-strip" role="tablist" aria-label="Showcase tabs">
          {tabs.map((tab) => (
            <button key={tab.id} role="tab" aria-selected={showcaseTab === tab.id} className={showcaseTab === tab.id ? 'active' : ''} onClick={() => setShowcaseTab(tab.id)} onKeyDown={(e) => onTabKeyDown(e, tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>
        {showcaseTab === 'systems' && <div className="cards"><div><h3>Window Manager Primitives</h3><p>Movable, minimizable, stack-aware windows with keyboard focus logic.</p></div><div><h3>Design Token Layer</h3><p>Retro contour + modern spacing, contrast, and readable hierarchy.</p></div></div>}
        {showcaseTab === 'motion' && <div className="cards"><div><h3>Measured Motion</h3><p>Boot sequencing and window transitions tuned for intent over spectacle.</p></div><div><h3>Reduced Motion Compliance</h3><p>Respects user preferences while preserving flow and functionality.</p></div></div>}
        {showcaseTab === 'delivery' && <div className="cards"><div><h3>Product Thinking</h3><p>Translates requirements into interface affordances users can trust quickly.</p></div><div><h3>Engineering Discipline</h3><p>Builds with accessibility, maintainability, and runtime performance in mind.</p></div></div>}
      </article>
    );
  }

  if (appId === 'experience') {
    return (
      <article className="timeline">
        <section>
          <h3><button className="exp-toggle" onClick={() => setExperiencePanel('fcb')} aria-expanded={experiencePanel === 'fcb'}>Software Engineer — FCB Health</button></h3>
          {experiencePanel === 'fcb' && <ul><li>Built Nuxt frontend modules for production-facing healthcare workflows.</li><li>Implemented Python + FastAPI services supporting operational integrations.</li><li>Integrated Azure AI Search for retrieval-driven user assistance and data lookup.</li><li>Deployed and maintained services on Azure App Service with stable release practices.</li></ul>}
        </section>
        <section>
          <h3><button className="exp-toggle" onClick={() => setExperiencePanel('collablab')} aria-expanded={experiencePanel === 'collablab'}>Part-time Engineering Manager — CollabLab</button></h3>
          {experiencePanel === 'collablab' && <><p><strong>Promoted internally</strong> while continuing hands-on frontend and full-stack engineering contributions.</p><p>Leads execution cadence, mentors contributors, and raises delivery quality across team projects.</p></>}
        </section>
        <section>
          <h3><button className="exp-toggle" onClick={() => setExperiencePanel('regeneron')} aria-expanded={experiencePanel === 'regeneron'}>Regeneron Roles</button></h3>
          {experiencePanel === 'regeneron' && <p>Delivered QA/document-control workflows and Power Platform tooling for process reliability.</p>}
        </section>
      </article>
    );
  }

  if (appId === 'skills') {
    return (
      <article>
        <div className="filter-row" role="toolbar" aria-label="Skill filters">
          {['all', 'frontend', 'backend', 'cloud'].map((key) => (
            <button key={key} className={skillFilter === key ? 'active' : ''} onClick={() => setSkillFilter(key as typeof skillFilter)}>{key}</button>
          ))}
        </div>
        <div className="meter-stack">
          {shownSkills.map((skill) => (
            <div className="meter" key={skill.label}>
              <p>{skill.label}</p>
              <div className="track"><span style={{ width: `${skill.value}%` }} /></div>
            </div>
          ))}
        </div>
      </article>
    );
  }

  if (appId === 'frontend') {
    return <article><h2>Frontend Focus Highlights</h2><ul><li>Reusable patterns: window primitives, tab systems, filters, and state-driven components.</li><li>Performance-first rendering with scoped state and memoized repository transforms.</li><li>Keyboard + screen-reader support as first-class UX concerns.</li><li>Reduced-motion fallbacks preserve function without visual overload.</li></ul></article>;
  }

  if (appId === 'power') {
    const stats = [
      { label: 'Squat', kg: 215 },
      { label: 'Bench', kg: 145 },
      { label: 'Deadlift', kg: 250 }
    ];
    return (
      <article>
        <div className="filter-row">
          <button className={!useLbs ? 'active' : ''} onClick={() => setUseLbs(false)}>KG</button>
          <button className={useLbs ? 'active' : ''} onClick={() => setUseLbs(true)}>LB</button>
        </div>
        <div className="cards">
          {stats.map((s) => {
            const value = useLbs ? Math.round(s.kg * 2.205) : s.kg;
            return <div key={s.label}><h3>{s.label}</h3><p>{value} {useLbs ? 'lb' : 'kg'}</p></div>;
          })}
          <div><h3>Meet Result</h3><p>Placed 6th in Dec 2024 collegiate championships.</p></div>
        </div>
      </article>
    );
  }

  if (appId === 'projects') {
    return (
      <article>
        <h2>Top GitHub Projects</h2>
        <div className="project-controls">
          <input value={projectQuery} onChange={(e) => setProjectQuery(e.target.value)} placeholder="Filter repositories" aria-label="Filter repositories" />
          <select value={sortMode} onChange={(e) => setSortMode(e.target.value as typeof sortMode)} aria-label="Sort repositories">
            <option value="stars">Sort: Stars</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>
        <div className="project-grid">
          {filteredRepos.length ? filteredRepos.map((repo) => (
            <section key={repo.name} className="project-card">
              <h3>{repo.name}</h3>
              <p className="muted">{repo.language || 'Multi'} • ★ {repo.stargazers_count}</p>
              <p>{repo.description || 'Built to solve real-world problems with practical engineering.'}</p>
              <div className="project-links">
                <a href={repo.html_url} target="_blank" rel="noreferrer">Open repo ↗</a>
                {repo.homepage && <a href={repo.homepage} target="_blank" rel="noreferrer">Live site ↗</a>}
              </div>
            </section>
          )) : <p className="muted">No repositories match this filter right now.</p>}
        </div>
      </article>
    );
  }

  if (appId === 'contact') {
    return (
      <article className="cards">
        <button onClick={() => copyText('email', 'dh820@scarletmail.rutgers.edu')}>Copy Email</button>
        <a href="mailto:dh820@scarletmail.rutgers.edu">Email</a>
        <a href="https://www.linkedin.com/in/dayyan-hamid/" target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="https://github.com/dayy346" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://leetcode.com/dayy345" target="_blank" rel="noreferrer">LeetCode</a>
        {copied && <p className="muted">Copied {copied} to clipboard.</p>}
      </article>
    );
  }

  return <article><h2>Keyboard Shortcuts</h2><ul><li><kbd>Alt</kbd> + <kbd>Tab</kbd>: cycle focused window</li><li><kbd>Ctrl</kbd> + <kbd>M</kbd>: minimize focused window</li><li><kbd>Esc</kbd>: close Start menu or skip boot</li><li><kbd>S</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>: skip boot instantly</li><li>Double-click desktop icons or press <kbd>Enter</kbd> to open apps</li></ul></article>;
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
