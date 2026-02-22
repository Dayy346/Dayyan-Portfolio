import { useEffect, useMemo, useRef, useState, type ComponentType, type CSSProperties, type FormEvent } from 'react';
import {
  AppId,
  apps,
  bootStages,
  contributionHighlights,
  leetCodeInsights,
  researchBriefNotes,
  resumeSections,
  type BootStage
} from './data';

const BASE = import.meta.env.BASE_URL;

import { Win9xBootDialog } from './components/Win9xBoot/Win9xBootDialog';
import { Win95Login } from './components/win95/Win95Login';
import { type Credential } from './components/win95/win95Types';
import { GitHubContributionFeed } from './components/widgets/GitHubContributionFeed';
import { LeetCodeStatsWidget } from './components/widgets/LeetCodeStatsWidget';
import { DesktopGitHubWidget } from './components/widgets/DesktopGitHubWidget';
import { DesktopLeetCodeWidget } from './components/widgets/DesktopLeetCodeWidget';
import {
  User,
  FileText,
  FolderOpen,
  Briefcase,
  Settings,
  Dumbbell,
  Mail,
  MessageCircle,
  HelpCircle,
  BarChart3,
  Puzzle,
  Cloud,
  type LucideIcon,
} from 'lucide-react';
import {
  UserIcon,
  DocumentTextIcon,
  FolderOpenIcon,
  ChartBarIcon,
  BriefcaseIcon,
  Cog6ToothIcon,
  FireIcon,
  PuzzlePieceIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/solid';

const APP_ICONS: Record<AppId, LucideIcon> = {
  about: User,
  resume: FileText,
  projects: FolderOpen,
  contributions: BarChart3,
  experience: Briefcase,
  skills: Settings,
  power: Dumbbell,
  leetcode: Puzzle,
  contact: Mail,
  chatbot: MessageCircle,
  help: HelpCircle
};

const APP_ICONS_SOLID: Record<AppId, ComponentType<{ className?: string; style?: CSSProperties }>> = {
  about: UserIcon,
  resume: DocumentTextIcon,
  projects: FolderOpenIcon,
  contributions: ChartBarIcon,
  experience: BriefcaseIcon,
  skills: Cog6ToothIcon,
  power: FireIcon,
  leetcode: PuzzlePieceIcon,
  contact: EnvelopeIcon,
  chatbot: ChatBubbleLeftRightIcon,
  help: QuestionMarkCircleIcon
};

const APP_ICON_COLORS: Record<AppId, string> = {
  about: '#1e40af',
  resume: '#b45309',
  projects: '#15803d',
  contributions: '#0ea5e9',
  experience: '#0369a1',
  skills: '#4b5563',
  power: '#dc2626',
  leetcode: '#ca8a04',
  contact: '#2563eb',
  chatbot: '#0891b2',
  help: '#6b7280'
};

function AppIcon({ appId, size = 28, className = '', colored = false }: { appId: AppId; size?: number; className?: string; colored?: boolean }) {
  if (colored) {
    const SolidIcon = APP_ICONS_SOLID[appId];
    const color = APP_ICON_COLORS[appId];
    return SolidIcon ? <SolidIcon className={className} style={{ width: size, height: size, color }} aria-hidden /> : null;
  }
  const Icon = APP_ICONS[appId];
  return Icon ? <Icon size={size} className={className} strokeWidth={2} aria-hidden /> : null;
}

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

/** Same project list as server.js /chat so fallback matches live site */
const ASSIST_PROJECT_DATA: { name: string; description: string }[] = [
  { name: 'LeNet5Tool', description: 'A personal project using a modified version of the LeNet-5 structure to develop machine learning models for any labeled datasets.' },
  { name: 'AI_final', description: 'Comparison between Perceptron and Naïve Bayes algorithms, analyzing their performance on classification tasks.' },
  { name: 'Price Tracker Extension', description: 'A Chrome extension that tracks product prices and notifies users when a price drop occurs. Uses React for the frontend, Puppeteer for web scraping, and Node.js for the backend.' },
  { name: 'NFC Attendance System', description: 'An NFC tag reader connected via USB to track attendance. When an NFC tag is scanned, the system records attendance and stores the data in a spreadsheet. Built in Java.' },
  { name: 'EmailSpamChecker', description: 'A machine learning-based email spam checker that classifies emails as \'spam\' or \'ham\' (legitimate). Provides an automated solution for spam detection.' },
  { name: 'DiscordMusicBot', description: 'A simple Discord bot that joins voice channels, plays audio from YouTube URLs, and controls playback. Uses `discord.py` and `yt-dlp` for streaming.' },
  { name: 'Portfolio Website', description: 'A personal portfolio showcasing projects, GitHub activity, and problem-solving skills. Features an interactive chatbot, GitHub contributions, LeetCode statistics, and a powerlifting section.' }
];

const INITIAL_POSITIONS: Record<AppId, { x: number; y: number }> = {
  about: { x: 78, y: 78 },
  resume: { x: 150, y: 78 },
  projects: { x: 294, y: 78 },
  contributions: { x: 78, y: 148 },
  experience: { x: 150, y: 148 },
  skills: { x: 222, y: 148 },
  power: { x: 78, y: 218 },
  leetcode: { x: 150, y: 218 },
  contact: { x: 222, y: 218 },
  chatbot: { x: 294, y: 218 },
  help: { x: 222, y: 288 }
};

const LOGIN_CREDENTIALS: Credential[] = [
  { label: 'Username', value: 'Dayyan', hint: 'Junior AI Engineer' },
  { label: 'Password', value: '********', hint: 'Retro secure vault' },
  { label: 'Session', value: 'Premium verified', hint: 'Boot-level token' }
];

const totalBootLines = bootStages.reduce((sum, stage) => sum + stage.lines.length, 0);

const PREMIUM_HIGHLIGHTS = [
  'Tactile windows, measured pops, and layered gradients keep the experience premium.',
  'The Missive board curates signals, acknowledges notes, and lets you queue thoughtful replies.',
  'Keyboard-first controls (Alt+Tab, Ctrl+M, Enter) stay at the forefront of operations.',
  'Mood states cycle between studio, archive, and night while retaining retro warmth.',
  'Taskbar health indicators whisper network and sync status instead of yelling alerts.'
];

const KEYBOARD_SHORTCUTS = [
  { id: 'alt-tab', combo: 'Alt + Tab', detail: 'Cycle focus between open windows while the hero signal glows.' },
  { id: 'ctrl-m', combo: 'Ctrl + M', detail: 'Minimize the focused window without reaching for the mouse.' },
  { id: 'enter', combo: 'Enter', detail: 'Launch icons, confirm login, or trigger the start menu action.' },
  { id: 'space', combo: 'Space', detail: 'Toggle the recruiter signal detail rail or quick peek an icon.' },
  { id: 'esc', combo: 'Esc', detail: 'Skip boot, close menus, or replay the narrative log.' }
] as const;

/** Desktop icons exclude GitHub and LeetCode; those live as top-right widgets. */
const DESKTOP_ICON_APPS = apps.filter((a) => a.id !== 'leetcode' && a.id !== 'contributions');

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
  const [taskbarDate, setTaskbarDate] = useState('');
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
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginPhase, setLoginPhase] = useState<'idle' | 'animating'>('idle');
  const [defaultWindowsApplied, setDefaultWindowsApplied] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setTaskbarDate(d.toLocaleDateString([], { weekday: 'short', month: 'numeric', day: 'numeric' }));
    };
    tick();
    const id = setInterval(tick, 1000);
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
    const stageDuration = Math.max(1400, Math.floor(stage.durationMs * 0.55));
    const msPerLine = Math.max(120, Math.floor(stageDuration / stage.lines.length));
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
        }, 220);
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

  useEffect(() => {
    if (!loggedIn || defaultWindowsApplied) return;
    setFocused('about');
    setDefaultWindowsApplied(true);
  }, [loggedIn, defaultWindowsApplied]);

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
  const recruiterSignalCount = Math.max(3, Math.min(5, runningApps.length + 2));

  const loginDataStatus = `Secure contributions telemetry · ${shellStatus.highlightCopy}`;

  const totalStars = useMemo(() => repos.reduce((sum, repo) => sum + repo.stargazers_count, 0), [repos]);
  const contributionScore = useMemo(() => {
    const base = Math.max(1, (repos.length || 1) * 18);
    return Math.min(100, Math.round((totalStars / base) * 100));
  }, [repos.length, totalStars]);
  const signalRefresh = Math.max(10, 14 - bootStageIndex);
  const recentRepos = useMemo(() => repos.slice(0, 3), [repos]);

  function skipBoot() {
    setBootStageIndex(bootStages.length - 1);
    setBootLineIndex(bootStages[bootStages.length - 1].lines.length);
    setBootTransitioning(true);
    window.setTimeout(() => {
      setBootDone(true);
      setBootTransitioning(false);
    }, reducedMotion ? 0 : 160);
  }

  function playWindows95Sound() {
    if (typeof window === 'undefined') return;
    const AudioCtor = (window.AudioContext || (window as any).webkitAudioContext);
    if (!AudioCtor) return;
    const ctx = new AudioCtor();
    const gain = ctx.createGain();
    gain.gain.value = 0.22;
    gain.connect(ctx.destination);
    const notes = [520, 440, 620];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      const start = ctx.currentTime + index * 0.18;
      osc.frequency.setValueAtTime(freq, start);
      osc.connect(gain);
      osc.start(start);
      osc.stop(start + 0.18);
    });
    window.setTimeout(() => {
      ctx.close().catch(() => undefined);
    }, 1400);
  }

  function handleLogin() {
    if (!bootDone || loginPhase !== 'idle') return;
    setLoginPhase('animating');
    setStartMenuOpen(false);
    playWindows95Sound();
    window.setTimeout(() => {
      setLoggedIn(true);
      setLoginPhase('idle');
    }, 1400);
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

  if (isMobile && bootDone && loggedIn) {
    return <MobileLite repos={repos} clock={clock} shellStatus={shellStatus} experienceHighlights={EXPERIENCE_UPDATES} />;
  }

  return (
    <>
      <div className={`os-shell ${bootDone ? 'ready' : 'preboot'} mood-${shellMood}`}>
        <main className="desktop" data-testid="desktop" onClick={() => setStartMenuOpen(false)}>
          <div className="desktop-widgets" aria-label="GitHub and LeetCode widgets">
            <DesktopGitHubWidget />
            <DesktopLeetCodeWidget />
          </div>
          <p className="desktop-hint" data-testid="desktop-hint">Double-click <strong>About Me</strong> to find out about me.</p>
          <section className="desktop-icon-grid" role="grid" aria-label="Desktop icons" data-testid="desktop-icon-grid">
              {DESKTOP_ICON_APPS.map((app, idx) => {
                const row = Math.floor(idx / 4) + 1;
                const col = (idx % 4) + 1;
                return (
                  <button
                    key={app.id}
                    className="desktop-icon"
                    data-app={app.id}
                    data-grid-pos={`${row}-${col}`}
                    data-testid={`desktop-icon-${app.id}`}
                    aria-label={`Icon: ${app.label}`}
                    title={app.label}
                    onDoubleClick={() => openWindow(app.id)}
                    onClick={() => setFocused(app.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openWindow(app.id);
                      }
                    }}
                  >
                    <span className="desktop-icon-svg">
                      <AppIcon appId={app.id} size={44} colored />
                    </span>
                    <small>{app.label}</small>
                  </button>
                );
              })}
          </section>

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
                <WindowContent appId={app.id} repos={repos} repoStatus={repoStatus} lastRepoSync={lastRepoSync} recruiterSignalCount={recruiterSignalCount} recruiterHighlight={shellStatus.highlightCopy} />
              </Window>
            );
          })}
        </main>

        {startMenuOpen && bootDone && (
          <aside className="start-menu" role="menu" aria-label="Start Menu" data-testid="start-menu">
            <div className="start-menu-grid">
              <div className="start-menu-panel start-menu-status-panel" data-testid="start-menu-header">
                <h4>Status</h4>
                <p className="start-menu-status" aria-live="polite" data-testid="start-menu-status">{shellStatus.startMenuStatus}</p>
                <p className="start-menu-subtitle">Stories · Running · Ready</p>
              </div>
              <div className="start-menu-panel start-menu-running-panel" role="list" data-testid="running-section">
                <h4>Running now</h4>
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
                        data-testid={`running-app-${app.id}`}
                      >
                        <span aria-hidden="true" className="running-icon"><AppIcon appId={app.id} size={16} /></span>
                        <span className="running-label">{app.label}</span>
                        <small>{statusLabel}</small>
                      </button>
                    );
                  })
                ) : (
                  <p className="muted">No programs active yet. Launch one below.</p>
                )}
              </div>
              <div className="start-menu-panel start-menu-launch-panel">
                <h4>Launch programs</h4>
                <div className="launch-grid">
                  {apps.map((app) => (
                    <button
                      key={app.id}
                      role="menuitem"
                      className="launch-btn"
                      onClick={() => openWindow(app.id)}
                      data-testid={`start-menu-app-${app.id}`}
                    >
                      <span className="start-menu-app-icon"><AppIcon appId={app.id} size={18} /></span>
                      <span>{app.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="start-menu-panel start-menu-shortcuts-panel" data-testid="start-menu-shortcuts">
                <h4>Shortcuts</h4>
                <ul>
                  {KEYBOARD_SHORTCUTS.map((shortcut) => (
                    <li key={shortcut.id} data-testid={`shortcut-${shortcut.id}`}>
                      <kbd>{shortcut.combo}</kbd>
                      <span>{shortcut.detail}</span>
                    </li>
                  ))}
                </ul>
                <a className="resume-link" href={`${BASE}assets/resume.pdf`} download data-testid="start-menu-resume-link">⬇ Resume.pdf</a>
              </div>
            </div>
          </aside>
        )}

        <header className="taskbar" data-testid="taskbar">
          <button className="start-btn" onClick={() => setStartMenuOpen((v) => !v)} aria-haspopup="menu" aria-expanded={startMenuOpen} data-testid="start-button">Start</button>
          <div className="taskbar-windows" aria-label="Open windows">
            {apps.filter((a) => windowMap[a.id].isOpen).map((app) => {
              const isFocused = focused === app.id && !windowMap[app.id].minimized;
              return (
                <button
                  key={app.id}
                  type="button"
                  className={`taskbar-window-btn ${isFocused ? 'active' : ''}`}
                  data-app={app.id}
                  data-testid={`window-strip-${app.id}`}
                  onClick={() => (isFocused ? minimizeWindow(app.id) : openWindow(app.id))}
                  aria-pressed={isFocused}
                >
                  <span className="taskbar-window-btn-icon"><AppIcon appId={app.id} size={20} /></span>
                  {app.label}
                </button>
              );
            })}
          </div>
          <div className="taskbar-tray" aria-hidden="true">
            <span className="taskbar-tray-icon taskbar-tray-cloud" title="Cloud" aria-hidden="true">
              <Cloud size={20} strokeWidth={2} aria-hidden="true" />
            </span>
            <span className="taskbar-tray-icon taskbar-tray-wifi" title="Network" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0-2a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1zm0-6c-2.5 0-4.5 1.5-5.5 3.5l1 1c.8-1.5 2.3-2.5 4-2.5s3.2 1 4 2.5l1-1C12.5 5.5 10.5 4 8 4zm0 3c-1.7 0-3 1-3.5 2.2l1 .8c.4-.8 1.2-1.3 2.5-1.3s2.1.5 2.5 1.3l1-.8C11 8 9.7 7 8 7z"/></svg>
            </span>
            <span className="taskbar-tray-icon" title="Volume">🔊</span>
          </div>
          <div className="taskbar-tray-date-time">
            <span className="taskbar-date" aria-hidden="true">{taskbarDate}</span>
            <p className="clock" aria-live="off" data-testid="taskbar-clock">{clock}</p>
          </div>
        </header>

      </div>

      {!bootDone && (
        <Win9xBootDialog
          onComplete={() => setBootDone(true)}
          reducedMotion={reducedMotion}
          durationMs={5000}
          onBootStart={playWindows95Sound}
        />
      )}

      {bootDone && !loggedIn && (
        <Win95Login
          animating={loginPhase === 'animating'}
          onLogin={handleLogin}
          reducedMotion={reducedMotion}
          credentials={LOGIN_CREDENTIALS}
          dataStatus={loginDataStatus}
          recruiterScore={contributionScore}
          signalRefresh={signalRefresh}
        />
      )}

      {isMobile && !bootDone && <div className="mobile-boot-hint">Tip: press S, Enter, or Skip to load Mobile Lite.</div>}
    </>
  );
}

const TASKBAR_HEIGHT = 30;

function Window({ appId, title, focused, state, onFocus, onClose, onMinimize, onMaximize, onDrag, children }: { appId: AppId; title: string; focused: boolean; state: WindowState; onFocus: () => void; onClose: () => void; onMinimize: () => void; onMaximize: () => void; onDrag: (x: number, y: number) => void; children: JSX.Element }) {
  const winRef = useRef<HTMLElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function onMouseDown(e: React.MouseEvent<HTMLElement>) {
    if ((e.target as HTMLElement).closest('.window-actions')) return;
    onFocus();
    const startX = e.clientX;
    const startY = e.clientY;
    const initX = state.x;
    const initY = state.y;
    const el = winRef.current;
    const w = el ? el.getBoundingClientRect().width : 280;
    const h = el ? el.getBoundingClientRect().height : 200;
    setIsDragging(true);

    const move = (ev: MouseEvent) => {
      if (state.maximized) return;
      const maxX = Math.max(0, window.innerWidth - w);
      const maxY = Math.max(0, window.innerHeight - TASKBAR_HEIGHT - h);
      const nx = Math.min(maxX, Math.max(0, initX + ev.clientX - startX));
      const ny = Math.min(maxY, Math.max(0, initY + ev.clientY - startY));
      onDrag(nx, ny);
    };

    const up = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }

  return (
    <section
      ref={winRef}
      className={`window ${focused ? 'focused' : ''} ${state.maximized ? 'maxed' : ''} ${isDragging ? 'window-dragging' : ''}`}
      style={{ left: state.x, top: state.y, zIndex: state.z }}
      onMouseDown={onFocus}
      role="dialog"
      aria-label={`${title} window`}
      data-testid={`window-${appId}`}
    >
      <header className="window-title" onMouseDown={onMouseDown} onDoubleClick={onMaximize}>
        <p>{title}</p>
        <div className="window-actions">
          <button aria-label={`Minimize ${title}`} onClick={onMinimize} data-testid={`window-minimize-${appId}`}>—</button>
          <button aria-label={`Maximize ${title}`} onClick={onMaximize} data-testid={`window-maximize-${appId}`}>{state.maximized ? '🗗' : '🗖'}</button>
          <button aria-label={`Close ${title}`} onClick={onClose} data-testid={`window-close-${appId}`}>✕</button>
        </div>
      </header>
      <div className={`window-content app-${appId}`} data-app={appId}>{children}</div>
    </section>
  );
}

function WindowContent({
  appId,
  repos,
  repoStatus,
  lastRepoSync,
  recruiterSignalCount,
  recruiterHighlight
}: {
  appId: AppId;
  repos: Repo[];
  repoStatus: RepoStatus;
  lastRepoSync: string | null;
  recruiterSignalCount: number;
  recruiterHighlight: string;
}) {
  const [experiencePanel, setExperiencePanel] = useState<ExperiencePanel>('fcb');
  const [skillFilter, setSkillFilter] = useState<'all' | 'frontend' | 'backend' | 'cloud'>('all');
  const [projectQuery, setProjectQuery] = useState('');
  const [sortMode, setSortMode] = useState<'stars' | 'name'>('stars');
  const [useLbs, setUseLbs] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const botTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return [
      { sender: 'bot', text: 'Hello! I can tell you about my projects. Try asking about a specific project or say \'list projects\' to see all of them.', time: now }
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

  /** Same logic as server.js generateResponse so fallback matches live site */
  const generateLocalResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    if (message.includes('list') && message.includes('project')) {
      return 'Here are my projects:\n' + ASSIST_PROJECT_DATA.map((p) => `- ${p.name}`).join('\n');
    }
    const searchTerms = message.replace(/explain|describe|tell me about|what is/gi, '').trim();
    const project = ASSIST_PROJECT_DATA.find(
      (p) => p.name.toLowerCase().includes(searchTerms) || p.description.toLowerCase().includes(searchTerms)
    );
    if (project) return `${project.name}: ${project.description}`;
    if (message.includes('hello') || message.includes('hi ')) {
      return 'Hello! I can tell you about my projects. Try asking about a specific project or say \'list projects\' to see all of them.';
    }
    return 'I can help you learn about my projects. Try asking about a specific project or say \'list projects\' to see what I\'ve worked on.';
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
    (async () => {
      try {
        const res = await fetch('/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: trimmed })
        });
        const content = res.ok
          ? (await res.json())?.choices?.[0]?.message?.content
          : null;
        scheduleBotResponse(typeof content === 'string' ? content : generateLocalResponse(trimmed));
      } catch {
        scheduleBotResponse(generateLocalResponse(trimmed));
      }
    })();
  };

  if (appId === 'about') {
    return (
      <article className="about-revamp">
        <header className="about-hero">
          <div className="about-hero-avatar">
            <img src={`${BASE}assets/headshot.jpg`} alt="Dayyan Hamid" />
          </div>
          <div className="about-hero-text">
            <h1>Dayyan Hamid</h1>
            <p className="about-tagline">Software Engineer · Rutgers CS ’25</p>
            <p className="about-lead">
              I build frontend systems and full-stack products with a focus on polish, performance, and clear UX.
              This portfolio is a retro Windows–style shell to show how I think about interaction and delivery.
            </p>
          </div>
        </header>
        <section className="about-section">
          <h2>What I do</h2>
          <ul className="about-list">
            <li><strong>Frontend systems</strong> — React, Vue, TypeScript; reusable components, state, and motion</li>
            <li><strong>Backend & APIs</strong> — Node, Python/FastAPI; services and integrations</li>
            <li><strong>Delivery & tooling</strong> — Azure, CI/CD, and keeping things reliable</li>
          </ul>
        </section>
        <section className="about-section">
          <h2>Tech</h2>
          <div className="about-chips">
            <span>React</span><span>TypeScript</span><span>Vue</span><span>Node</span><span>Python</span><span>FastAPI</span><span>Azure</span>
          </div>
        </section>
        <section className="about-section about-links">
          <h2>Connect</h2>
          <p>
<a href="https://github.com/dayy346" target="_blank" rel="noreferrer">GitHub</a>
        {' · '}
        <a href="https://www.linkedin.com/in/dayyanhamid" target="_blank" rel="noreferrer">LinkedIn</a>
        {' · '}
        <a href={`${BASE}assets/resume.pdf`} target="_blank" rel="noreferrer">Resume (PDF)</a>
          </p>
        </section>
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

  if (appId === 'power') {
    const stats = [
      { label: 'Squat', kg: 215 },
      { label: 'Bench', kg: 145 },
      { label: 'Deadlift', kg: 250 }
    ];
    return (
      <article className="extracurricular-panel">
        <h2>Extracurricular Activities</h2>
        <p className="muted">Leadership, competition, and work experience from my resume.</p>

        <section className="extracurricular-section">
          <h3>Collegiate Powerlifting · Rutgers University</h3>
          <div className="extracurricular-powerlifting">
            <div className="extracurricular-photo">
              <img src={`${BASE}assets/powerlifting.jpg`} alt="Powerlifting" />
            </div>
            <div className="extracurricular-stats">
              <div className="filter-row">
                <button className={!useLbs ? 'active' : ''} onClick={() => setUseLbs(false)}>KG</button>
                <button className={useLbs ? 'active' : ''} onClick={() => setUseLbs(true)}>LB</button>
              </div>
              <div className="extracurricular-lifts">
                {stats.map((s) => {
                  const value = useLbs ? Math.round(s.kg * 2.205) : s.kg;
                  return <div key={s.label}><strong>{s.label}</strong><span>{value} {useLbs ? 'lb' : 'kg'}</span></div>;
                })}
              </div>
              <p><a href="https://www.openpowerlifting.org/u/dayyanhamid" target="_blank" rel="noreferrer">View Competition Results ↗</a></p>
              <p className="muted small-text">Placed 6th at Dec 2024 East Coast Collegiate Championships; qualified for nationals. Organize meets and train with the team (Sept 2023 — Present).</p>
            </div>
          </div>
        </section>

        <section className="extracurricular-section">
          <h3>Secretary — Pakistani Student Association</h3>
          <p>Event coordination, communications, and NFC-based attendance system (Sep 2022 — May 2025).</p>
        </section>

        <section className="extracurricular-section">
          <h3>PJ’s Pancake House</h3>
          <p>Key employee & server. Operational oversight, cash handling, rapid promotion from busser to server (Jun 2020 — Aug 2022).</p>
        </section>
      </article>
    );
  }

  if (appId === 'leetcode') {
    const routineValue = 92;
    return (
      <article className="leetcode-panel">
        <LeetCodeStatsWidget recruiterSignalCount={recruiterSignalCount} highlight={recruiterHighlight} />
        <div className="leetcode-practice">
          <p>Routine stability</p>
          <div className="practice-bar">
            <span style={{ width: `${routineValue}%` }} />
          </div>
          <small>Story-driven spaced repetition keeps the routine at {routineValue}% steadiness.</small>
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
    const freshnessPercent = Math.min(100, Math.round((repos.length / 6) * 100));
    return (
      <article className="contributions-panel">
        <header>
          <p className="muted">Delivery telemetry</p>
          <h2>Contributions.log</h2>
          <p>{repoStatusLine}</p>
        </header>
        <div className="contribution-gauges">
          <div className="contribution-gauge">
            <p>Signal strength</p>
            <div className="gauge-track">
              <span style={{ width: `${contributionScore}%` }} />
            </div>
            <small>{contributionScore}% of the delivery signal goal</small>
          </div>
          <div className="contribution-gauge">
            <p>Repo freshness</p>
            <div className="gauge-track secondary">
              <span style={{ width: `${freshnessPercent}%` }} />
            </div>
            <small>{repos.length} repos live · {freshnessPercent}% of refresh capacity</small>
          </div>
        </div>
        <section className="contribution-highlights-grid">
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
        <section className="contribution-feed-wrapper" data-testid="contribution-window-feed">
          <GitHubContributionFeed recruiterSignal={recruiterSignalCount} highlight={recruiterHighlight} />
        </section>
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
        <header className="chatbot-header">
          <h2>Assist.chat</h2>
          <p>Ask about my projects—e.g. &quot;list projects&quot; or &quot;tell me about Price Tracker&quot;.</p>
        </header>
        <div className="chat-window">
          {chatHistory.map((message, idx) => (
            <div key={`chat-${idx}`} className={`chat-message ${message.sender}`}>
              <p className="chat-message-text">{message.text.split('\n').map((line, i, arr) => <span key={i}>{line}{i < arr.length - 1 ? <br /> : null}</span>)}</p>
              <small>{message.time}</small>
            </div>
          ))}
        </div>
        <form className="chatbot-form" onSubmit={handleChatSubmit}>
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask about a project or say 'list projects'"
            aria-label="Chat input"
          />
          <button type="submit">Send</button>
        </form>
      </article>
    );
  }

  return <article><h2>Keyboard Shortcuts</h2><ul><li><kbd>Alt</kbd> + <kbd>Tab</kbd>: cycle focused window</li><li><kbd>Ctrl</kbd> + <kbd>M</kbd>: minimize focused window</li><li><kbd>Esc</kbd>: close Start menu or skip boot</li><li><kbd>S</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>: skip boot instantly</li><li>Double-click desktop icons or press <kbd>Enter</kbd> to open apps</li></ul></article>;
}

type HeroSignalRailProps = {
  shellStatus: ShellStatus;
  recruiterSignalCount: number;
  signalRefresh: number;
};

function HeroSignalRail({ shellStatus, recruiterSignalCount, signalRefresh }: HeroSignalRailProps) {
  const progressValue = Math.round(shellStatus.stageProgress * 100);
  return (
    <section className="hero-signal-rail" data-testid="hero-signal-rail" aria-label="Hero signal rail">
      <article className="rail-card rail-card-signal" data-testid="rail-stage-card">
        <p className="rail-label">Hero signal</p>
        <h3>{shellStatus.stageTitle}</h3>
        <p className="rail-subtitle">{shellStatus.stageSubtitle}</p>
        <div
          className="rail-progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressValue}
        >
          <span style={{ width: `${progressValue}%` }} />
        </div>
        <div className="rail-story" data-testid="rail-story-lines">
          {shellStatus.storyLines.slice(0, 3).map((line, idx) => (
            <p key={`${line}-${idx}`}>{line}</p>
          ))}
        </div>
      </article>
      <article className="rail-card rail-card-recruiter" data-testid="rail-recruiter-card">
        <p className="rail-label">Recruiter signal rail</p>
        <h4>Recruiters: {recruiterSignalCount} live signals</h4>
        <p className="rail-highlight">{shellStatus.highlightCopy}</p>
        <div className="rail-recruiter-metrics">
          <span data-testid="rail-recruiter-progress">Signal progress {progressValue}%</span>
          <span data-testid="rail-recruiter-refresh">Refresh in {signalRefresh}s</span>
        </div>
        <div className="rail-callout-actions">
          <a
            className="hero-rail-link"
            href={`${BASE}assets/resume.pdf`}
            target="_blank"
            rel="noreferrer"
            data-testid="hero-rail-view-resume"
          >
            View Profiles
          </a>
          <span className="rail-callout-badge">Premium recruiter ready</span>
        </div>
      </article>
      <article className="rail-card rail-card-shortcuts" data-testid="rail-shortcuts-card">
        <p className="rail-label">Keyboard shortcuts</p>
        <ul>
          {KEYBOARD_SHORTCUTS.map((shortcut) => (
            <li key={shortcut.id} data-testid={`rail-shortcut-${shortcut.id}`}>
              <kbd>{shortcut.combo}</kbd>
              <span>{shortcut.detail}</span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
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
        <a href={`${BASE}assets/resume.pdf`} download>Download Resume</a>
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
    const stageLine = bootDone
      ? 'Boot complete · Desktop ready'
      : `Stage ${bootStageIndex + 1}: ${stage.title} (${Math.round(normalizedStageProgress * 100)}%)`;
    const metricBase = bootDone
      ? 'Desktop is online and waiting for interactions.'
      : `${stage.metricLabel}: ${stage.metricValue ?? stage.subtitle}`;
    const metricLine = bootDone ? metricBase : `${metricBase} · ${repoPhrase}`;
    const focusLine = `Focused: ${focusLabel} · ${activeWindowCount} windows active`;

    return {
      stageTitle: bootDone ? 'Shell ready' : stage.title,
      stageSubtitle: bootDone ? 'Every window ready' : stage.subtitle,
      stageAccent: stage.accent,
      stageProgress: totalProgress,
      storyLines: [
        stageLine,
        metricLine,
        focusLine,
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
