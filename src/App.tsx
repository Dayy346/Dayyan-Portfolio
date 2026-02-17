import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import {
  AppId,
  apps,
  bootStages,
  contributionHighlights,
  leetCodeInsights,
  leetCodeStats,
  researchBriefNotes,
  resumeSections,
  type BootStage
} from './data';

type Repo = { name: string; language: string | null; stargazers_count: number; description: string | null; html_url: string; homepage?: string | null; fork: boolean };
type WindowState = { isOpen: boolean; minimized: boolean; maximized: boolean; x: number; y: number; z: number };

type GitHubRepoResponse = Repo[] | { message?: string };

type ExperiencePanel = 'fcb' | 'collablab' | 'regeneron';
type ShellMood = 'studio' | 'archive' | 'night';

type RepoStatus = 'idle' | 'loading' | 'ready' | 'error';

type ShellStatusParams = {
  bootStageIndex: number;
  bootLineIndex: number;
  bootDone: boolean;
  activeWindowCount: number;
  focused: AppId;
  shellMood: ShellMood;
  repos: Repo[];
  repoStatus: RepoStatus;
  lastRepoSync: string | null;
};

type ShellStatus = {
  stageTitle: string;
  stageSubtitle: string;
  stageAccent: string;
  stageProgress: number;
  storyLines: string[];
  highlightCopy: string;
  stageMetric: string;
  startMenuStatus: string;
};

type ChatMessage = { sender: 'bot' | 'user'; text: string; time: string };
const INITIAL_POSITIONS: Record<AppId, { x: number; y: number }> = {
  about: { x: 78, y: 78 },
  resume: { x: 150, y: 78 },
  showcase: { x: 222, y: 78 },
  projects: { x: 294, y: 78 },
  contributions: { x: 78, y: 148 },
  experience: { x: 150, y: 148 },
  skills: { x: 222, y: 148 },
  frontend: { x: 294, y: 148 },
  power: { x: 78, y: 218 },
  leetcode: { x: 150, y: 218 },
  contact: { x: 222, y: 218 },
  chatbot: { x: 294, y: 218 },
  missive: { x: 150, y: 288 },
  help: { x: 222, y: 288 }
};

const totalBootLines = bootStages.reduce((sum, stage) => sum + stage.lines.length, 0);

type MissiveEntry = {
  id: string;
  title: string;
  summary: string;
  detail: string;
  vibe: string;
  status: 'Signal' | 'Update' | 'Insight';
  accent: string;
  timestamp: string;
};

const MISSIVE_LOG: MissiveEntry[] = [
  {
    id: 'premium-cadence',
    title: 'Premium Interaction Cadence',
    summary: 'Every pop, shadow, and window weight is tuned to feel intentional and sumptuous.',
    detail: 'Spacing, z-depth, and tonal gradients mirror high-end vintage hardware without losing clarity.',
    vibe: 'Studio Signal',
    status: 'Signal',
    accent: '#cd7a3f',
    timestamp: '09:15'
  },
  {
    id: 'motion-layer',
    title: 'Missive Motion Layer',
    summary: 'Animation sequences behave like mechanical shutters instead of neon chaos.',
    detail: 'Alt+Tab, drag, and minimize gestures honor a measured tempo that speaks to professional polish.',
    vibe: 'Motion Update',
    status: 'Update',
    accent: '#4f7f63',
    timestamp: '11:42'
  },
  {
    id: 'delivery-trace',
    title: 'Delivery Trace Loop',
    summary: 'Reliability rituals keep premium nostalgia feeling operational and thoughtful.',
    detail: 'Keyboard-first flows, accessibility checks, and streamlined GitHub lives under one hood.',
    vibe: 'Delivery Insight',
    status: 'Insight',
    accent: '#7b4b9e',
    timestamp: '13:03'
  }
];

const PREMIUM_HIGHLIGHTS = [
  'Tactile windows, measured pops, and layered gradients keep the experience premium.',
  'The Missive board curates signals, acknowledges notes, and lets you queue thoughtful replies.',
  'Keyboard-first controls (Alt+Tab, Ctrl+M, Enter) stay at the forefront of operations.',
  'Mood states cycle between studio, archive, and night while retaining retro warmth.',
  'Taskbar health indicators whisper network and sync status instead of yelling alerts.'
];

type ExperienceUpdate = {
  id: string;
  title: string;
  badge: string;
  summary: string;
  detail: string;
  bullets?: string[];
  link?: string;
  linkLabel?: string;
};

const EXPERIENCE_UPDATES: ExperienceUpdate[] = [
  {
    id: 'collablab-promo',
    title: 'CollabLab Leadership',
    badge: 'Manager + Mentor',
    summary: 'Promoted into a part-time Engineering Manager role while keeping hands-on delivery with the core product stack.',
    detail: 'This card mirrors the old Experience.log pride moment by naming the promotion and the feature work that kept the mission moving.',
    bullets: [
      'Leads execution cadence, mentoring, and reviews while remaining an active builder on Node/Express/Vue/Mongo/Daily-powered features.',
      'Delivered the “camera required” enforcement for tutoring and proctored exam rooms, pairing frontend toggles with backend guards.',
      'Keeps product clarity, roadmap focus, and release rituals aligned with premium UX goals.'
    ]
  },
  {
    id: 'junior-ai-engineer',
    title: 'Junior AI Engineer',
    badge: 'AI Systems',
    summary: 'Parlayed frontend craft into a junior AI engineering chapter that prototypes agents, prompts, and operational tooling.',
    detail: 'The new AI narrative builds on the “Data + Frontend Builder” tagline from the old site while wiring in signal-grade instrumentation.',
    bullets: [
      'Builds lightweight prompt scaffolds, synthetic evaluation dashboards, and agent observability layers for experimental tooling.',
      'Translates research insights into UX-safe prototypes that keep the shell grounded yet instrumented.',
      'Syncs training logs, telemetry, and control-room UI updates inside the same delivery rituals that ship Dayyan.OS.'
    ]
  },
  {
    id: 'powerlifting',
    title: 'Collegiate Powerlifting',
    badge: 'Discipline',
    summary: 'Powerlifting remains the training ground for focus—3-lift totals, championship grit, and measurable mastery.',
    detail: 'This content extends the static Power.stats board from earlier versions with specifics drawn from the 2024 competition cycle.',
    bullets: [
      'Squat 215kg · Bench 145kg · Deadlift 250kg',
      'Dec 2024 East Coast Collegiate Championships · 6th place in the 67.5kg weight class (nationals qualifier)',
      'Training logs double as reliability rituals that keep engineering and sport aligned.'
    ]
  },
  {
    id: 'kaggle-notebook',
    title: 'Kaggle Notebook · Retro Signals',
    badge: 'Data Story',
    summary: 'A narrative Kaggle notebook surfaces telemetry from the retro OS research plus metrics from the shell experiments.',
    detail: 'Links the old static data story section to a living notebook so the chronology of experiments stays sharable.',
    bullets: ['Synthesizes telemetry from the shell, boot sequence, and repo feed into readable data storytelling.'],
    link: 'https://www.kaggle.com/dayyan/retro-os-signal-notebook',
    linkLabel: 'Open Kaggle notebook ↗'
  },
  {
    id: 'github-activity',
    title: 'GitHub Contributions',
    badge: 'Open Source',
    summary: 'Live contributions highlight the same coding energy that the old “GitHub Activity & Contributions” section promised.',
    detail: 'Top non-fork repos surface the open-source thinking powering delivery, backed by the live API feed and mirrored project grid.',
    bullets: ['Fetches, filters, and ranks the freshest repos while showcasing the cross-stack impact of every signal.'],
    link: 'https://github.com/dayy346',
    linkLabel: 'Browse GitHub ↗'
  }
];

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
  const [shellMood, setShellMood] = useState<ShellMood>('night');
  const zRef = useRef(20);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [repoStatus, setRepoStatus] = useState<RepoStatus>('idle');
  const [lastRepoSync, setLastRepoSync] = useState<string | null>(null);
  const [windowMap, setWindowMap] = useState<Record<AppId, WindowState>>(createInitialWindowMap);
  const [highlightIndex, setHighlightIndex] = useState(0);

  useEffect(() => {
    const renderClock = () => setClock(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    renderClock();
    const id = setInterval(renderClock, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const ticker = setInterval(() => {
      setHighlightIndex((prev) => (prev + 1) % PREMIUM_HIGHLIGHTS.length);
    }, 5200);
    return () => clearInterval(ticker);
  }, [reducedMotion]);

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
    setRepoStatus('loading');
    fetch('https://api.github.com/users/dayy346/repos?sort=updated&per_page=100', { signal: controller.signal })
      .then((r) => r.json())
      .then((payload: GitHubRepoResponse) => {
        if (!Array.isArray(payload)) {
          setRepos([]);
          setRepoStatus('error');
          setLastRepoSync(null);
          return;
        }
        const top = payload
          .filter((r) => !r.fork && r.name !== 'Dayyan-Portfolio')
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 12);
        setRepos(top);
        setRepoStatus('ready');
        setLastRepoSync(new Date().toISOString());
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setRepos([]);
        setRepoStatus('error');
        setLastRepoSync(null);
      });

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
  const runningApps = useMemo(() => apps.filter((app) => windowMap[app.id].isOpen), [windowMap]);
  const shellStatus = useShellStatus({
    bootStageIndex,
    bootLineIndex,
    bootDone,
    activeWindowCount,
    focused,
    shellMood,
    repos,
    repoStatus,
    lastRepoSync
  });

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
    return <MobileLite repos={repos} clock={clock} shellStatus={shellStatus} experienceHighlights={EXPERIENCE_UPDATES} />;
  }

  return (
    <>
      <div className={`os-shell ${bootDone ? 'ready' : 'preboot'} mood-${shellMood}`}>
        <header className="taskbar">
          <button className="start-btn" onClick={() => setStartMenuOpen((v) => !v)} aria-haspopup="menu" aria-expanded={startMenuOpen}>⏻ START</button>
          <p className="taskbar-title">DAYYAN.OS // RETRO FRONTEND SHELL</p>
          <div className="taskbar-status">
            <div className="status-hub" role="status" aria-label="System activities">
              <span className="status-dot online" aria-hidden="true" />
              <span>Network ready</span>
              <span className="status-dot pulse" aria-hidden="true" />
              <span>Premium sync</span>
            </div>
            <div className="status-actions">
              <button className="mood-btn" onClick={() => setShellMood((curr) => (curr === 'studio' ? 'archive' : curr === 'archive' ? 'night' : 'studio'))} aria-label="Cycle desktop mood">
                Theme: {shellMood}
              </button>
              <p className="clock" aria-live="off">{clock}</p>
            </div>
          </div>
        </header>

        {startMenuOpen && bootDone && (
          <aside className="start-menu" role="menu" aria-label="Start Menu">
            <div className="start-menu-header">
              <p>What's running</p>
              <p className="start-menu-status" aria-live="polite">{shellStatus.startMenuStatus}</p>
              <p className="start-menu-stage">Stage {bootStageIndex + 1} · {shellStatus.stageTitle} · {Math.round(shellStatus.stageProgress * 100)}%</p>
            </div>
            <div className="running-section" role="list">
              {runningApps.length ? (
                runningApps.map((app) => {
                  const state = windowMap[app.id];
                  const isFocused = focused === app.id;
                  const isMinimized = state.minimized;
                  const statusLabel = isMinimized ? 'Minimized' : isFocused ? 'Focused' : 'Running';
                  return (
                    <button
                      key={app.id}
                      type="button"
                      role="menuitem"
                      aria-pressed={isFocused}
                      className={`running-app ${isMinimized ? 'minimized' : 'active'} ${isFocused ? 'focused' : ''}`}
                      onClick={() => openWindow(app.id)}
                    >
                      <span aria-hidden="true" className="running-icon">{app.icon}</span>
                      <span className="running-label">{app.label}</span>
                      <small>{statusLabel}</small>
                    </button>
                  );
                })
              ) : (
                <p className="muted">No programs active yet. Launch one below.</p>
              )}
            </div>
            <div className="start-menu-divider" aria-hidden="true" />
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
              {shellStatus.storyLines.map((line, idx) => (
                <li key={`${line}-${idx}`}>{line}</li>
              ))}
            </ul>
            <div className="premium-marquee" aria-live="polite">
              <span>{shellStatus.stageMetric}</span>
              <span>{PREMIUM_HIGHLIGHTS[highlightIndex]}</span>
              <span className="marquee-badge">missive premium</span>
            </div>
          </section>

          {apps.map((app) => (
            <button
              key={app.id}
              className="desktop-icon"
              onDoubleClick={() => openWindow(app.id)}
              onClick={() => setFocused(app.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openWindow(app.id);
                }
              }}
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
                <WindowContent appId={app.id} repos={repos} repoStatus={repoStatus} lastRepoSync={lastRepoSync} />
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
  stage: BootStage;
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
      if (['s', 'Escape', 'Enter', ' '].includes(e.key)) onSkip();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onSkip]);

  const stagePercent = stage.lines.length ? Math.min(1, visibleLines.length / stage.lines.length) : 1;
  const activeLineIndex = Math.max(0, visibleLines.length - 1);
  const upcomingLines = stage.lines.slice(visibleLines.length, visibleLines.length + 4);

  return (
    <div
      className={`boot-screen cinematic${transitioning ? ' fade-out' : ''}${reducedMotion ? ' reduced-motion' : ''}`}
      role="dialog"
      aria-live="polite"
      aria-label="Dayyan OS cinematic boot"
    >
      <div className="boot-aurora" aria-hidden="true">
        <span className="boot-aurora-glow" />
        <span className="boot-aurora-glow secondary" />
      </div>
      <div className="boot-grid">
        <div className="boot-terminal" style={{ '--stage-accent': stage.accent } as CSSProperties}>
          <header className="boot-headline">
            <p className="boot-title">DAYYAN BIOS v3.2 // Frontend Edition</p>
            <div className="boot-stage-pills" aria-label="Boot stage timeline">
              {bootStages.map((stageItem, idx) => (
                <span
                  key={stageItem.id}
                  className={`boot-stage-pill${idx <= stageIndex ? ' active' : ''}`}
                  style={{ borderColor: stageItem.accent, background: idx <= stageIndex ? stageItem.accent : 'transparent' }}
                  aria-label={`Stage ${idx + 1}: ${stageItem.title}`}
                />
              ))}
            </div>
            <p className="boot-stage-title">
              Phase {stageIndex + 1} · {stage.title}
              <strong>{Math.round(stagePercent * 100)}%</strong>
            </p>
            <p className="boot-subtitle">{stage.subtitle}</p>
          </header>
          <section className="boot-narrative">
            <p>{stage.narrative}</p>
            <p className="boot-pulse">{stage.pulse}</p>
          </section>
          <section className="boot-log" role="log" aria-live="polite" aria-label="Boot log lines">
            {visibleLines.map((line, idx) => (
              <p key={`${line}-${idx}`} className={`boot-line${idx === activeLineIndex ? ' active' : ''}`}>
                <span>{line}</span>
              </p>
            ))}
          </section>
          {upcomingLines.length > 0 && (
            <section className="boot-upcoming" aria-live="off">
              <p>Next cues</p>
              <div className="boot-upcoming-list">
                {upcomingLines.map((line, idx) => (
                  <span key={`${line}-upnext-${idx}`}>{line}</span>
                ))}
              </div>
            </section>
          )}
          <div className="boot-progress-foot">
            <div className="boot-progress-track">
              <div className="boot-progress-fill" style={{ width: `${Math.round(progress * 100)}%` }} />
            </div>
            <p className="boot-progress-copy">Overall progress · {Math.round(progress * 100)}%</p>
          </div>
          <div className="boot-actions">
            <button type="button" onClick={onSkip}>{reducedMotion ? 'Continue' : 'Skip Boot'}</button>
            <small>
              Press <kbd>S</kbd>, <kbd>Esc</kbd>, <kbd>Enter</kbd>, or <kbd>Space</kbd> to continue
            </small>
          </div>
        </div>
        <aside className="boot-research-panel">
          <header>
            <p>Research briefing</p>
            <h3>Story + science</h3>
            <p>Each cinematic stage mirrors the research notes below and keeps the arrival grounded.</p>
          </header>
          <div className="research-grid">
            {researchBriefNotes.map((note) => (
              <article key={note.title}>
                <p className="research-title">{note.title}</p>
                <p>{note.detail}</p>
                <small>{note.source}</small>
              </article>
            ))}
          </div>
          <div className="boot-arc">
            <p className="boot-arc-label">Arc progress · Phase {stageIndex + 1} / {stageCount}</p>
            <div className="boot-arc-track">
              {bootStages.map((stageItem, idx) => (
                <span
                  key={`arc-${stageItem.id}`}
                  className={`boot-arc-pill${idx === stageIndex ? ' active' : ''}`}
                  style={{ borderColor: stageItem.accent, background: idx <= stageIndex ? stageItem.accent : 'transparent' }}
                  aria-label={`Stage ${idx + 1}: ${stageItem.title}`}
                />
              ))}
            </div>
            <p className="boot-arc-hint">Research notes keep the narrative credible, even if you skip ahead.</p>
          </div>
        </aside>
      </div>
      <div className="boot-footer-note">Cinematic research keeps the sequence grounded in evidence-based storytelling.</div>
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

function WindowContent({
  appId,
  repos,
  repoStatus,
  lastRepoSync
}: {
  appId: AppId;
  repos: Repo[];
  repoStatus: RepoStatus;
  lastRepoSync: string | null;
}) {
  const [showcaseTab, setShowcaseTab] = useState<'systems' | 'motion' | 'delivery'>('systems');
  const [experiencePanel, setExperiencePanel] = useState<ExperiencePanel>('fcb');
  const [skillFilter, setSkillFilter] = useState<'all' | 'frontend' | 'backend' | 'cloud'>('all');
  const [projectQuery, setProjectQuery] = useState('');
  const [sortMode, setSortMode] = useState<'stars' | 'name'>('stars');
  const [useLbs, setUseLbs] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedMissiveId, setSelectedMissiveId] = useState(MISSIVE_LOG[0].id);
  const [acknowledgedMissives, setAcknowledgedMissives] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(MISSIVE_LOG.map((missive) => [missive.id, false]))
  );
  const [missiveDraft, setMissiveDraft] = useState('');
  const [queuedMissives, setQueuedMissives] = useState<string[]>([]);

  const botTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return [
      { sender: 'bot', text: 'Dayyan.AI Assist online. Ask for contributions, LeetCode habits, or resume highlights from the shell.', time: now }
    ];
  });
  const [chatInput, setChatInput] = useState('');
  useEffect(() => () => {
    if (botTimerRef.current) {
      window.clearTimeout(botTimerRef.current);
    }
  }, []);

  const filteredRepos = useMemo(() => {
    const base = repos.filter((repo) => repo.name.toLowerCase().includes(projectQuery.toLowerCase()));
    return base.sort((a, b) => (sortMode === 'stars' ? b.stargazers_count - a.stargazers_count : a.name.localeCompare(b.name)));
  }, [repos, projectQuery, sortMode]);

  const repoStatusLine = useMemo(() => {
    const syncTime = lastRepoSync
      ? new Date(lastRepoSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : null;
    if (repoStatus === 'loading') return 'GitHub feed syncing…';
    if (repoStatus === 'error') return 'GitHub feed paused (retry later)';
    if (repoStatus === 'ready') return `GitHub feed stable · ${repos.length} repos${syncTime ? ` @ ${syncTime}` : ''}`;
    return 'GitHub feed idle';
  }, [repoStatus, lastRepoSync, repos.length]);

  const totalStars = useMemo(() => repos.reduce((sum, repo) => sum + repo.stargazers_count, 0), [repos]);
  const contributionScore = useMemo(() => {
    const base = Math.max(1, (repos.length || 1) * 18);
    return Math.min(100, Math.round((totalStars / base) * 100));
  }, [totalStars, repos.length]);

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

  const formatTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const generateBotResponse = (message: string) => {
    const normalized = message.toLowerCase();
    if (normalized.includes('resume') || normalized.includes('education') || normalized.includes('experience')) {
      return 'The resume window mirrors the latest PDF with education, projects, certifications, and leadership highlights.';
    }
    if (normalized.includes('leetcode')) {
      return 'LeetCode practice is grounded in spaced repetition research and story-driven problem solving—check the LeetCode window for stats.';
    }
    if (normalized.includes('contribution') || normalized.includes('repo') || normalized.includes('git')) {
      return 'Contributions.log highlights camera guardrails, GxP docs, and infra telemetry so you can see the delivery trail.';
    }
    if (normalized.includes('boot') || normalized.includes('cinematic') || normalized.includes('research')) {
      return 'The cinematic boot quotes CHI 2024 story research, embodied motion cues, and visual comfort labs for a grounded arrival.';
    }
    if (normalized.includes('chatbot')) {
      return 'This chatbot captures notes, echoes resume highlights, and feeds the Missive board when the queue grows.';
    }
    return 'Dayyan.OS blends retro storytelling with premium delivery. Ask about resume, contributions, or LeetCode stats for guided highlights.';
  };

  const scheduleBotResponse = (reply: string) => {
    if (botTimerRef.current) window.clearTimeout(botTimerRef.current);
    botTimerRef.current = window.setTimeout(() => {
      setChatHistory((prev) => [...prev, { sender: 'bot', text: reply, time: formatTime() }]);
    }, 420);
  };

  const handleChatSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    setChatHistory((prev) => [...prev, { sender: 'user', text: trimmed, time: formatTime() }]);
    setChatInput('');
    scheduleBotResponse(generateBotResponse(trimmed));
  };

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

  if (appId === 'resume') {
    return (
      <article className="resume-layout">
        {resumeSections.map((section) => (
          <section key={`resume-${section.title}`}>
            <header>
              <h3>{section.title}</h3>
              {section.summary && <p className="muted">{section.summary}</p>}
            </header>
            <ul>
              {section.bullets.map((bullet) => (
                <li key={`${section.title}-${bullet}`}>{bullet}</li>
              ))}
            </ul>
            {section.footer && <p className="muted footer-note">{section.footer}</p>}
          </section>
        ))}
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
        {showcaseTab === 'systems' && <div className="cards"><div><h3>Window Manager Primitives</h3><p>Movable, minimizable, stack-aware windows with keyboard focus logic.</p><p className="muted">Double-click title bars for maximize, preserve z-order intent, and recover context quickly.</p></div><div><h3>Design Token Layer</h3><p>Retro contour + modern spacing, contrast, and readable hierarchy.</p><p className="muted">Palette intentionally restrained for a premium nostalgic look (not arcade-saturated).</p></div></div>}
        {showcaseTab === 'motion' && <div className="cards"><div><h3>Measured Motion</h3><p>Boot sequencing and window transitions tuned for intent over spectacle.</p></div><div><h3>Reduced Motion Compliance</h3><p>Respects user preferences while preserving flow and functionality.</p></div><div><h3>Cinematic Boot Language</h3><p>POST→Kernel→Desktop arc mirrors how engineering systems initialize in the real world.</p></div></div>}
        {showcaseTab === 'delivery' && <div className="cards"><div><h3>Product Thinking</h3><p>Translates requirements into interface affordances users can trust quickly.</p></div><div><h3>Engineering Discipline</h3><p>Builds with accessibility, maintainability, and runtime performance in mind.</p></div><div><h3>Storytelling Cohesion</h3><p>Every app contributes to one narrative: frontend craft, systems depth, and delivery leadership.</p></div></div>}
      </article>
    );
  }

  if (appId === 'experience') {
    return (
      <article className="timeline">
        <section>
          <h3>
            <button className="exp-toggle" onClick={() => setExperiencePanel('fcb')} aria-expanded={experiencePanel === 'fcb'}>
              Software Engineer — FCB Health
            </button>
          </h3>
          {experiencePanel === 'fcb' && (
            <>
              <ul>
                <li>Built Nuxt frontend modules for production-facing healthcare workflows.</li>
                <li>Implemented Python + FastAPI services supporting operational integrations.</li>
                <li>Integrated Azure AI Search for retrieval-driven user assistance and data lookup.</li>
                <li>Deployed and maintained services on Azure App Service with stable release practices.</li>
              </ul>
              <p className="muted">Stack footprint: Nuxt • Python/FastAPI • Azure AI Search • Azure App Service</p>
            </>
          )}
        </section>
        <section>
          <h3>
            <button className="exp-toggle" onClick={() => setExperiencePanel('collablab')} aria-expanded={experiencePanel === 'collablab'}>
              Part-time Engineering Manager — CollabLab
            </button>
          </h3>
          {experiencePanel === 'collablab' && (
            <>
              <p>
                <strong>Promoted internally</strong> while continuing hands-on frontend and full-stack engineering contributions.
              </p>
              <p>
                Leads execution cadence, mentors contributors, and raises delivery quality across team projects.
              </p>
              <p className="muted">Bridges engineering management with product execution: roadmap clarity, review quality, and team velocity.</p>
            </>
          )}
        </section>
        <section>
          <h3>
            <button className="exp-toggle" onClick={() => setExperiencePanel('regeneron')} aria-expanded={experiencePanel === 'regeneron'}>
              Regeneron Roles
            </button>
          </h3>
          {experiencePanel === 'regeneron' && <p>Delivered QA/document-control workflows and Power Platform tooling for process reliability.</p>}
        </section>
        <section className="experience-updates" aria-label="Experience updates">
          <h3>Experience updates</h3>
          <div className="experience-updates-grid">
            {EXPERIENCE_UPDATES.map((card) => (
              <article key={card.id} className="experience-update-card">
                <header className="experience-update-header">
                  <h4>{card.title}</h4>
                  <span className="experience-update-badge">{card.badge}</span>
                </header>
                <p className="summary">{card.summary}</p>
                <p className="detail">{card.detail}</p>
                {card.bullets && (
                  <ul>
                    {card.bullets.map((bullet) => (
                      <li key={`${card.id}-${bullet}`}>{bullet}</li>
                    ))}
                  </ul>
                )}
                {card.link && (
                  <a className="experience-update-link" href={card.link} target="_blank" rel="noreferrer">
                    {card.linkLabel ?? 'Open link ↗'}
                  </a>
                )}
              </article>
            ))}
          </div>
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
    return <article><h2>Frontend Focus Highlights</h2><ul><li>Reusable patterns: window primitives, tab systems, filters, and state-driven components.</li><li>Performance-first rendering with scoped state and memoized repository transforms.</li><li>Keyboard + screen-reader support as first-class UX concerns.</li><li>Reduced-motion fallbacks preserve function without visual overload.</li><li>Visual language balances nostalgic affordances with modern interaction credibility.</li></ul></article>;
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

        <p className="muted small-text">Continuing the static Power.stats board, these lift totals double as training logs grounded in the same reliability research that powered the old site.</p>
      </article>
    );
  }

  if (appId === 'leetcode') {
    return (
      <article className="leetcode-panel">
        <header>
          <p className="muted">Practice lab</p>
          <h2>LeetCode.trn</h2>
          <p>Systems-aligned problem solving backed by spaced repetition and story-driven practice.</p>
        </header>
        <div className="leetcode-grid">
          {leetCodeStats.map((stat) => (
            <div key={`leetcode-${stat.label}`}>
              <strong>{stat.value}</strong>
              <p>{stat.label}</p>
              <small>{stat.detail}</small>
            </div>
          ))}
        </div>
        <section className="leetcode-insights">
          {leetCodeInsights.map((insight) => (
            <article key={`insight-${insight.title}`}>
              <h4>{insight.title}</h4>
              <p>{insight.detail}</p>
              <small>{insight.source}</small>
            </article>
          ))}
        </section>
      </article>
    );
  }

  if (appId === 'projects') {
    return (
      <article>
        <h2>Top GitHub Projects</h2>
        <p className="repo-summary">
          {repoStatusLine}
          <a href="https://github.com/dayy346" target="_blank" rel="noreferrer"> Browse GitHub ↗</a>
        </p>
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
        <div className="github-pulse">
          <div className="github-pulse-header">
            <p>GitHub contributions</p>
            <span className="github-badge">decorative</span>
          </div>
          <div className="github-stats">
            <div>
              <strong>{totalStars}</strong>
              <small>Total stars synced</small>
            </div>
            <div>
              <strong>{repos.length}</strong>
              <small>Repos tracked</small>
            </div>
          </div>
          <div className="github-bar" aria-hidden="true">
            <span style={{ width: `${contributionScore}%` }} />
          </div>
          <p className="muted small-text">Carrying over the old static GitHub badge, this bar draws from the live sync and keeps the decorative pulse alive.</p>
        </div>
      </article>
    );
  }
  if (appId === 'contributions') {
    const recentRepos = repos.slice(0, 4);
    return (
      <article className="contributions-panel">
        <header>
          <p className="muted">Delivery telemetry</p>
          <h2>Contributions.log</h2>
          <p>{repoStatusLine}</p>
        </header>
        <div className="contribution-metrics">
          <div>
            <strong>{repos.length}</strong>
            <small>Tracked repositories</small>
          </div>
          <div>
            <strong>{totalStars}</strong>
            <small>Total stars</small>
          </div>
          <div>
            <strong>{contributionScore}%</strong>
            <small>Signal strength</small>
          </div>
        </div>
        <section className="contribution-highlights">
          {contributionHighlights.map((highlight) => (
            <article key={`${highlight.title}-${highlight.detail}`}>
              <h4>{highlight.title}</h4>
              <p>{highlight.detail}</p>
            </article>
          ))}
        </section>
        <section className="contribution-grid">
          <h3>Fresh repos</h3>
          <div className="contribution-repos">
            {recentRepos.length ? recentRepos.map((repo) => (
              <article key={`contrib-${repo.name}`}>
                <h4>{repo.name}</h4>
                <p className="muted">{repo.description || 'GitHub work in motion.'}</p>
                <small>{repo.language || 'Multi'} • ★ {repo.stargazers_count}</small>
              </article>
            )) : <p className="muted">No repositories ready for highlight yet.</p>}
          </div>
        </section>
      </article>
    );
  }

  if (appId === 'missive') {
    const activeMissive = MISSIVE_LOG.find((missive) => missive.id === selectedMissiveId) ?? MISSIVE_LOG[0];
    const isAcknowledged = acknowledgedMissives[activeMissive.id];
    const handleMissiveDraft = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!missiveDraft.trim()) return;
      setQueuedMissives((curr) => [missiveDraft.trim(), ...curr].slice(0, 5));
      setMissiveDraft('');
    };

    return (
      <article className="missive-grid">
        <div className="missive-list" role="list">
          {MISSIVE_LOG.map((missive) => (
            <button
              key={missive.id}
              type="button"
              className={`missive-item ${selectedMissiveId === missive.id ? 'active' : ''}`}
              onClick={() => setSelectedMissiveId(missive.id)}
              style={{ borderLeftColor: missive.accent, borderColor: selectedMissiveId === missive.id ? missive.accent : '#a08c77' }}
            >
              <small className="missive-time">{missive.timestamp}</small>
              <strong>{missive.title}</strong>
              <p>{missive.summary}</p>
              <span className="missive-tag" style={{ borderColor: missive.accent }}>{missive.vibe}</span>
            </button>
          ))}
        </div>
        <div className="missive-detail" style={{ borderColor: activeMissive.accent }}>
          <header>
            <p className="muted missive-status">
              <span className="missive-status-dot" style={{ backgroundColor: activeMissive.accent }} />
              {activeMissive.status}
            </p>
            <h2>{activeMissive.title}</h2>
            <p>{activeMissive.detail}</p>
          </header>
          <div className="missive-actions">
            <button
              type="button"
              className={isAcknowledged ? 'confirmed' : ''}
              onClick={() => setAcknowledgedMissives((prev) => ({ ...prev, [activeMissive.id]: !prev[activeMissive.id] }))}
            >
              {isAcknowledged ? 'Re-open' : 'Acknowledge'}
            </button>
            <span className="muted small-text">Last noted at {activeMissive.timestamp}</span>
          </div>
          <form className="missive-draft" onSubmit={handleMissiveDraft}>
            <label htmlFor="missiveDraft">Draft a premium note</label>
            <textarea
              id="missiveDraft"
              value={missiveDraft}
              onChange={(e) => setMissiveDraft(e.target.value)}
              placeholder="Capture a signal, schedule, or wish list."
              rows={3}
            />
            <button type="submit">Queue Draft</button>
          </form>
          {queuedMissives.length > 0 && (
            <div className="missive-queue">
              <p>Queued missives</p>
              <ul>
                {queuedMissives.map((note, idx) => (
                  <li key={`${note}-${idx}`}>{note}</li>
                ))}
              </ul>
            </div>
          )}
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

  if (appId === 'chatbot') {
    return (
      <article className="chatbot-shell">
        <header>
          <h2>Assist.chat</h2>
          <p>Feed the Missive board, contributions, and resume highlights with a quick question.</p>
        </header>
        <div className="chat-window">
          {chatHistory.map((message, idx) => (
            <div key={`chat-${idx}`} className={`chat-message ${message.sender}`}><p>{message.text}</p><small>{message.time}</small></div>
          ))}
        </div>
        <form className="chatbot-form" onSubmit={handleChatSubmit}>
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask about resume, research, contributions, or LeetCode stats."
            aria-label="Chat input"
          />
          <button type="submit">Send ↗</button>
        </form>
      </article>
    );
  }

  return <article><h2>Keyboard Shortcuts</h2><ul><li><kbd>Alt</kbd> + <kbd>Tab</kbd>: cycle focused window</li><li><kbd>Ctrl</kbd> + <kbd>M</kbd>: minimize focused window</li><li><kbd>Esc</kbd>: close Start menu or skip boot</li><li><kbd>S</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>: skip boot instantly</li><li>Double-click desktop icons or press <kbd>Enter</kbd> to open apps</li></ul></article>;
}

function MobileLite({
  repos,
  clock,
  shellStatus,
  experienceHighlights
}: {
  repos: Repo[];
  clock: string;
  shellStatus: ShellStatus;
  experienceHighlights: ExperienceUpdate[];
}) {
  return (
    <div className="mobile-lite">
      <header>
        <h1>Dayyan.OS Mobile Lite</h1>
        <p>{clock}</p>
      </header>
      <section>
        <h2>Shell telemetry</h2>
        <p><strong>{shellStatus.stageTitle}</strong> · {shellStatus.stageSubtitle}</p>
        <p>{shellStatus.highlightCopy}</p>
      </section>
      <section>
        <h3>Experience updates</h3>
        <ul>
          {experienceHighlights.map((update) => (
            <li key={update.id}>
              <strong>{update.title}</strong> · {update.summary}
              {update.link && (
                <a href={update.link} target="_blank" rel="noreferrer"> {update.linkLabel ?? 'Open link'}</a>
              )}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3>FCB Health Highlights</h3>
        <ul>
          <li>Nuxt frontend development for production workflows</li>
          <li>Python + FastAPI backend services</li>
          <li>Azure AI Search integration</li>
          <li>Deployment on Azure App Service</li>
        </ul>
      </section>
      <section>
        <h3>Featured Repositories</h3>
        <ul>
          {repos.slice(0, 4).map((repo) => (
            <li key={repo.name}>
              <a href={repo.html_url} target="_blank" rel="noreferrer">
                {repo.name}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <footer>
        <a href="/assets/resume.pdf" download>Download Resume</a>
      </footer>
    </div>
  );
}

function useShellStatus(params: ShellStatusParams): ShellStatus {
  return useMemo(() => {
    const {
      bootStageIndex,
      bootLineIndex,
      bootDone,
      activeWindowCount,
      focused,
      shellMood,
      repos,
      repoStatus,
      lastRepoSync
    } = params;
    const stage = bootStages[Math.min(bootStageIndex, bootStages.length - 1)];
    const normalizedStageProgress = stage.lines.length ? Math.min(1, bootLineIndex / stage.lines.length) : 1;
    const bootLinesCompleted = bootStages
      .slice(0, bootStageIndex)
      .reduce((sum, stageItem) => sum + stageItem.lines.length, 0) + Math.min(bootLineIndex, stage.lines.length);
    const totalProgress = bootDone ? 1 : bootLinesCompleted / totalBootLines;
    const focusLabel = apps.find((app) => app.id === focused)?.label ?? 'Shell';
    const metricLine = bootDone
      ? 'Desktop is online and waiting for interactions.'
      : stage.lines[Math.max(0, Math.min(stage.lines.length - 1, bootLineIndex - 1))] ?? stage.subtitle;
    const repoCount = repos.length;
    const syncTime = lastRepoSync ? new Date(lastRepoSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;
    const repoPhrase =
      repoStatus === 'loading'
        ? 'GitHub feed syncing…'
        : repoStatus === 'ready'
          ? `GitHub feed stable · ${repoCount} repos${syncTime ? ` @ ${syncTime}` : ''}`
          : repoStatus === 'error'
            ? 'GitHub feed paused (retry later)'
            : 'GitHub feed idle';
    const moodLabel = `${shellMood.charAt(0).toUpperCase()}${shellMood.slice(1)}`;

    return {
      stageTitle: bootDone ? 'Shell ready' : stage.title,
      stageSubtitle: bootDone ? 'Every window ready' : stage.subtitle,
      stageAccent: stage.accent,
      stageProgress: totalProgress,
      storyLines: [
        bootDone ? 'Boot complete · Desktop ready' : `Stage ${bootStageIndex + 1}: ${stage.title} (${Math.round(normalizedStageProgress * 100)}%)`,
        `Focused: ${focusLabel}`,
        `${activeWindowCount} windows active`,
        repoPhrase
      ],
      highlightCopy: repoPhrase,
      stageMetric: metricLine,
      startMenuStatus: `${moodLabel} · ${activeWindowCount} windows · ${repoPhrase}`
    };
  }, [
    params.bootStageIndex,
    params.bootLineIndex,
    params.bootDone,
    params.activeWindowCount,
    params.focused,
    params.shellMood,
    params.repos.length,
    params.repoStatus,
    params.lastRepoSync
  ]);
}
