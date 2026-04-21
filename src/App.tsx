import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import {
  AppId,
  apps,
  aboutSignals,
  bootStages,
  contributionHighlights,
  featuredStories,
  leetCodeInsights,
  researchBriefNotes,
  resumeSections,
  skillSpotlights,
  stackBadges,
  type BootStage
} from './data';

const BASE = import.meta.env.BASE_URL;
const POST_LOGIN_YOUTUBE_VIDEO_ID = '7nQ2oiVqKHw';

declare global {
  interface Window {
    YT?: { Player: new (el: string | HTMLElement, opts: { videoId: string; playerVars?: Record<string, number>; events?: { onReady?: (ev: { target: { playVideo: () => void } }) => void } }) => { playVideo: () => void } };
    onYouTubeIframeAPIReady?: () => void;
  }
}

function loadYouTubeIframeAPI(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  return new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    document.head.appendChild(script);
  });
}

import { Win9xBootDialog } from './components/Win9xBoot/Win9xBootDialog';
import { XPLoginScreen } from './components/win95/XPLoginScreen';
import { type Credential } from './components/win95/win95Types';
import { GitHubContributionFeed } from './components/widgets/GitHubContributionFeed';
import { LeetCodeStatsWidget } from './components/widgets/LeetCodeStatsWidget';
import { DesktopGitHubWidget } from './components/widgets/DesktopGitHubWidget';
import { DesktopLeetCodeWidget } from './components/widgets/DesktopLeetCodeWidget';
import { AppShellIcon } from './components/icons/AppShellIcon';
import { FrameworkLogo } from './components/icons/FrameworkLogo';
import { ShutdownOverlay } from './components/ShutdownOverlay/ShutdownOverlay';
import {
  ArrowLeft,
  ChevronRight,
  Cloud,
  FileDown,
  Github,
  LifeBuoy,
  Linkedin,
  LogOut,
  Mail,
  Power,
  Search
} from 'lucide-react';


type Repo = { name: string; language: string | null; stargazers_count: number; description: string | null; html_url: string; homepage?: string | null; fork: boolean };
type WindowState = { isOpen: boolean; minimized: boolean; maximized: boolean; x: number; y: number; z: number };

type GitHubRepoResponse = Repo[] | { message?: string };

type ExperiencePanel = 'olixir' | 'collablab' | 'regeneron';
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
  {
    name: 'JUDGE — NFL Big Data Bowl 2026',
    description:
      'Coverage analysis pipeline: geometric JumpLine features, XGBoost on tracking data, and the JUDGE defensive metric.'
  },
  { name: 'LeNet5Tool', description: 'A personal project using a modified version of the LeNet-5 structure to develop machine learning models for any labeled datasets.' },
  { name: 'AI_final', description: 'Comparison between Perceptron and Naïve Bayes algorithms, analyzing their performance on classification tasks.' },
  { name: 'Price Tracker Extension', description: 'A Chrome extension that tracks product prices and notifies users when a price drop occurs. Uses React for the frontend, Puppeteer for web scraping, and Node.js for the backend.' },
  { name: 'NFC Attendance System', description: 'An NFC tag reader connected via USB to track attendance. When an NFC tag is scanned, the system records attendance and stores the data in a spreadsheet. Built in Java.' },
  { name: 'EmailSpamChecker', description: 'A machine learning-based email spam checker that classifies emails as \'spam\' or \'ham\' (legitimate). Provides an automated solution for spam detection.' },
  { name: 'DiscordMusicBot', description: 'A simple Discord bot that joins voice channels, plays audio from YouTube URLs, and controls playback. Uses `discord.py` and `yt-dlp` for streaming.' },
  { name: 'Big Data Bowl', description: 'NFL Big Data Bowl Kaggle submission: Judge-ing Aggressive vs Defensive Back Coverage. Worked with a partner on coverage analysis. Notebook: https://www.kaggle.com/code/mscoop16/judge-ing-aggressive-defensive-back-coverage/notebook' },
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

const PINNED_START_APP_IDS: AppId[] = ['about', 'projects', 'resume', 'experience', 'chatbot'];
const SECONDARY_START_APP_IDS: AppId[] = ['skills', 'contributions', 'leetcode', 'power', 'contact'];

const APP_SUBTITLES: Record<AppId, string> = {
  about: 'A quick intro to who I am',
  resume: 'Download the latest PDF',
  projects: 'Live repos + case studies',
  contact: 'Say hi, send a message',
  experience: 'Roles, dates, and impact',
  skills: 'Stack, proof, and depth',
  power: 'What I do outside of work',
  leetcode: 'Daily practice telemetry',
  contributions: 'GitHub activity timeline',
  chatbot: 'Ask anything about my work',
  help: 'Keyboard shortcuts + tips'
};

const RECENT_APPS_STORAGE_KEY = 'dayyan.portfolio.recentApps.v1';
const MAX_RECENT_APPS = 4;

const readRecentApps = (): AppId[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(RECENT_APPS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const known = new Set(apps.map((a) => a.id));
    return parsed.filter((id): id is AppId => typeof id === 'string' && known.has(id as AppId)).slice(0, MAX_RECENT_APPS);
  } catch {
    return [];
  }
};

const writeRecentApps = (ids: AppId[]) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(RECENT_APPS_STORAGE_KEY, JSON.stringify(ids.slice(0, MAX_RECENT_APPS)));
  } catch {
    // ignore quota/storage errors
  }
};

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
    title: 'Promoted to Engineering Manager — CollabLab',
    badge: 'Part-time',
    summary: 'Promoted to part-time Engineering Manager at CollabLab under Troy Tutors; leading full-stack engineers while staying hands-on.',
    detail: 'Engineering management and leadership; execution cadence, mentoring, delivery quality. Jan 2026 — Present.',
    bullets: [
      'Leads a group of full-stack engineers; roadmap clarity and release quality.',
      'Previously shipped camera-required enforcement for tutoring and proctored exam rooms.',
      'collablab.dev'
    ]
  },
  {
    id: 'olixir-ai',
    title: 'Junior AI Engineer @ Olixir New York',
    badge: 'Full-time',
    summary:
      'Full-time at Olixir New York (Omnicom): backend Python/FastAPI with Azure AI Search; frontend Nuxt on Azure App Service.',
    detail: 'Healthcare workflows, retrieval-driven tooling, Deep Learning and TypeScript. Oct 2025 — Present, NYC Metro Hybrid.',
    bullets: [
      'Backend: Python, FastAPI, Azure AI Search for storage and retrieval.',
      'Frontend: Nuxt, hosted on Azure App Service.',
      'Oct 2025 — Present · NYC Metro · Hybrid.'
    ]
  },
  {
    id: 'powerlifting',
    title: 'Collegiate Powerlifting',
    badge: 'Rutgers',
    summary: '6th place at East Coast Collegiate Championships (Dec 2024), 67.5kg class; qualified for nationals.',
    detail: 'Squat 215kg · Bench 145kg · Deadlift 250kg. Secretary, Pakistani Student Association.',
    bullets: [
      'Squat 215kg · Bench 145kg · Deadlift 250kg',
      'Dec 2024 East Coast Collegiate Championships · 6th place in the 67.5kg weight class (nationals qualifier)',
      'Training logs double as reliability rituals that keep engineering and sport aligned.'
    ]
  },
  {
    id: 'github-activity',
    title: 'GitHub & Portfolio',
    badge: 'Open Source',
    summary: 'Live GitHub contributions and this portfolio for recruiters.',
    detail: 'Repos, contribution chart, and project grid wired to live data.',
    bullets: ['Browse repos and contribution history; site built with React, TypeScript, and the same UX focus.'],
    link: 'https://github.com/dayy346',
    linkLabel: 'Browse GitHub ↗'
  }
];

const createInitialWindowMap = () =>
  apps.reduce((acc, app, i) => {
    acc[app.id] = {
      isOpen: false,
      minimized: false,
      maximized: false,
      z: i + 1,
      x: INITIAL_POSITIONS[app.id].x,
      y: INITIAL_POSITIONS[app.id].y
    };
    return acc;
  }, {} as Record<AppId, WindowState>);

const ABOUT_WINDOW_CENTER_SIZE = { w: 460, h: 420 };
function getAboutWindowCenter() {
  const x = Math.max(0, (window.innerWidth - ABOUT_WINDOW_CENTER_SIZE.w) / 2);
  const y = Math.max(0, (window.innerHeight - ABOUT_WINDOW_CENTER_SIZE.h) / 2);
  return { x, y };
}

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
  const [startSearch, setStartSearch] = useState('');
  const [allProgramsOpen, setAllProgramsOpen] = useState(false);
  const [recentAppIds, setRecentAppIds] = useState<AppId[]>(() => readRecentApps());
  const [shuttingDown, setShuttingDown] = useState(false);
  const startSearchInputRef = useRef<HTMLInputElement | null>(null);
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

      if (e.key === 'Escape') {
        if (allProgramsOpen) {
          setAllProgramsOpen(false);
        } else {
          closeStartMenu();
        }
      }

      if (e.key === '/' && startMenuOpen) {
        const target = e.target as HTMLElement | null;

        if (target?.tagName !== 'INPUT' && target?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          startSearchInputRef.current?.focus();
        }
      }

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
  }, [bootDone, isMobile, focused, windowMap, startMenuOpen, allProgramsOpen]);

  useEffect(() => {
    if (!loggedIn || defaultWindowsApplied) return;
    const { x, y } = getAboutWindowCenter();
    zRef.current += 1;
    setFocused('about');
    setStartMenuOpen(false);
    setWindowMap((curr) => ({
      ...curr,
      about: {
        ...curr.about,
        isOpen: true,
        minimized: false,
        z: zRef.current,
        x,
        y
      }
    }));
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

  /** Fallback chime when XP sound files are not available */
  function playFallbackChime() {
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
    window.setTimeout(() => ctx.close().catch(() => undefined), 1400);
  }

  /** No boot sound – only post-login YouTube plays */
  function playBootSound() {}

  const postLoginPlayerRef = useRef<HTMLDivElement | null>(null);
  const postLoginPlayedRef = useRef(false);

  useEffect(() => {
    if (!loggedIn || postLoginPlayedRef.current) return;
    postLoginPlayedRef.current = true;
    const run = () => {
      const el = document.getElementById('yt-post-login');
      if (!el) return;
      loadYouTubeIframeAPI()
        .then(() => {
          if (!window.YT?.Player) return;
          new window.YT.Player('yt-post-login', {
            videoId: POST_LOGIN_YOUTUBE_VIDEO_ID,
            playerVars: { autoplay: 1 },
            events: {
              onReady(ev) {
                ev.target.playVideo();
              }
            }
          });
        })
        .catch(() => {});
    };
    const t = window.setTimeout(run, 100);
    return () => window.clearTimeout(t);
  }, [loggedIn]);

  function handleLogin() {
    if (!bootDone || loginPhase !== 'idle') return;
    setLoginPhase('animating');
    setStartMenuOpen(false);
    window.setTimeout(() => {
      setLoggedIn(true);
      setLoginPhase('idle');
    }, 320);
  }

  function focusWindow(appId: AppId) {
    zRef.current += 1;
    setFocused(appId);
    setWindowMap((curr) => ({ ...curr, [appId]: { ...curr[appId], z: zRef.current, minimized: false, isOpen: true } }));
  }

  function closeStartMenu() {
    setStartMenuOpen(false);
    setStartSearch('');
    setAllProgramsOpen(false);
  }

  function openWindow(appId: AppId) {
    focusWindow(appId);
    closeStartMenu();
    setRecentAppIds((prev) => {
      const next = [appId, ...prev.filter((id) => id !== appId)].slice(0, MAX_RECENT_APPS);
      writeRecentApps(next);
      return next;
    });
  }

  function triggerShutdown() {
    closeStartMenu();
    setShuttingDown(true);
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

  /* Full-page XP login: replaces desktop until user logs in */
  if (bootDone && !loggedIn) {
    return (
      <>
        <XPLoginScreen
          animating={loginPhase === 'animating'}
          onLogin={handleLogin}
          reducedMotion={reducedMotion}
        />
        {isMobile && <div className="mobile-boot-hint">Tip: click your name to open the desktop.</div>}
      </>
    );
  }

  return (
    <>
      {/* Hidden YouTube player: plays only after login (https://www.youtube.com/watch?v=7nQ2oiVqKHw) */}
      {loggedIn && (
        <div
          id="yt-post-login"
          ref={postLoginPlayerRef}
          className="yt-post-login"
          aria-hidden="true"
        />
      )}
      <div className={`os-shell ${bootDone ? 'ready' : 'preboot'} mood-${shellMood} ${bootDone && !loggedIn ? 'login-visible' : ''}`}>
        <main className="desktop" data-testid="desktop" onClick={() => closeStartMenu()}>
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
                    <span className="desktop-icon-svg" aria-hidden>
                      <AppShellIcon appId={app.id} size="desktop" />
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

        {startMenuOpen && bootDone && (() => {
          const searchLower = startSearch.trim().toLowerCase();
          const matchesSearch = (id: AppId) => {
            if (!searchLower) return true;
            const app = apps.find((a) => a.id === id);
            if (!app) return false;
            return app.label.toLowerCase().includes(searchLower) || APP_SUBTITLES[id].toLowerCase().includes(searchLower);
          };

          const shownPinned = PINNED_START_APP_IDS.filter(matchesSearch);
          const shownSecondary = SECONDARY_START_APP_IDS.filter(matchesSearch);
          const shownRecent = searchLower
            ? []
            : recentAppIds.filter((id) => !PINNED_START_APP_IDS.includes(id)).slice(0, 3);

          const allMatches = [...shownPinned, ...shownSecondary];
          const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (allMatches.length === 1) openWindow(allMatches[0]);
          };

          return (
          <aside className="start-menu start-menu-xp" role="menu" aria-label="Start Menu" data-testid="start-menu">
            <header className="start-menu-header-xp">
              <img src={`${BASE}assets/headshot.jpg`} alt="" className="start-menu-avatar" />
              <div className="start-menu-identity">
                <span className="start-menu-username">Dayyan Hamid</span>
                <span className="start-menu-subtitle">
                  <span className="start-menu-online-dot" aria-hidden="true" />
                  Online · Portfolio 2026
                </span>
              </div>
            </header>

            <div className="start-menu-body-xp">
              <div className="start-menu-col start-menu-col-programs">
                {shownPinned.length > 0 && (
                  <>
                    <p className="start-menu-section-label">{searchLower ? 'Results' : 'Pinned'}</p>
                    <div className="start-menu-program-list" role="list">
                      {shownPinned.map((id) => {
                        const app = apps.find((a) => a.id === id);
                        if (!app) return null;
                        return (
                          <button
                            key={id}
                            type="button"
                            role="menuitem"
                            className="start-menu-program-item"
                            onClick={() => openWindow(id)}
                            data-testid={`start-menu-app-${id}`}
                          >
                            <span className="start-menu-program-icon" aria-hidden="true"><AppShellIcon appId={id} size="menu" /></span>
                            <span className="start-menu-program-text">
                              <span className="start-menu-program-title">{app.label}</span>
                              <span className="start-menu-program-subtitle">{APP_SUBTITLES[id]}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {shownRecent.length > 0 && (
                  <>
                    <div className="start-menu-separator" aria-hidden="true" />
                    <p className="start-menu-section-label">Recently opened</p>
                    <div className="start-menu-program-list start-menu-program-list-compact" role="list">
                      {shownRecent.map((id) => {
                        const app = apps.find((a) => a.id === id);
                        if (!app) return null;
                        return (
                          <button
                            key={id}
                            type="button"
                            role="menuitem"
                            className="start-menu-program-item start-menu-program-item-compact"
                            onClick={() => openWindow(id)}
                            data-testid={`start-menu-recent-${id}`}
                          >
                            <span className="start-menu-program-icon" aria-hidden="true"><AppShellIcon appId={id} size="menu" /></span>
                            <span className="start-menu-program-title">{app.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {searchLower && allMatches.length === 0 && (
                  <p className="start-menu-empty" data-testid="start-menu-empty">
                    No programs match &ldquo;{startSearch}&rdquo;
                  </p>
                )}

                <button
                  type="button"
                  className="start-menu-all-programs-btn"
                  onClick={() => setAllProgramsOpen((v) => !v)}
                  aria-expanded={allProgramsOpen}
                  data-testid="start-menu-all-programs"
                >
                  <span>All Programs</span>
                  <ChevronRight className="size-4" aria-hidden />
                </button>
              </div>

              <div className="start-menu-col start-menu-col-shortcuts">
                <form className="start-menu-search-field" onSubmit={handleSearchSubmit} role="search">
                  <Search className="size-4 shrink-0 opacity-80" aria-hidden />
                  <input
                    ref={startSearchInputRef}
                    id="start-menu-search"
                    name="startSearch"
                    type="search"
                    placeholder="Search apps…"
                    value={startSearch}
                    onChange={(e) => setStartSearch(e.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                    data-testid="start-menu-search"
                    aria-label="Search apps"
                  />
                  {startSearch && (
                    <button
                      type="button"
                      className="start-menu-search-clear"
                      onClick={() => setStartSearch('')}
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}
                </form>

                {shownSecondary.length > 0 && (
                  <>
                    <p className="start-menu-col-label">{searchLower ? 'More matches' : 'More apps'}</p>
                    <ul className="start-menu-shortcut-list" role="list">
                      {shownSecondary.map((id) => {
                        const app = apps.find((a) => a.id === id);
                        if (!app) return null;
                        return (
                          <li key={id}>
                            <button
                              type="button"
                              className="start-menu-shortcut-item"
                              onClick={() => openWindow(id)}
                              data-testid={`start-menu-app-${id}`}
                            >
                              <span className="start-menu-shortcut-icon" aria-hidden="true"><AppShellIcon appId={id} size="menu" /></span>
                              <span>{app.label}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}

                {!searchLower && (
                  <>
                    <div className="start-menu-separator" aria-hidden="true" />
                    <p className="start-menu-col-label">Connect</p>
                    <ul className="start-menu-shortcut-list" role="list">
                      <li>
                        <a
                          className="start-menu-shortcut-item"
                          href="https://github.com/dayy346"
                          target="_blank"
                          rel="noreferrer"
                          data-testid="start-menu-github"
                        >
                          <Github className="start-menu-shortcut-lucide" aria-hidden />
                          <span>GitHub</span>
                        </a>
                      </li>
                      <li>
                        <a
                          className="start-menu-shortcut-item"
                          href="https://www.linkedin.com/in/dayyan-hamid"
                          target="_blank"
                          rel="noreferrer"
                          data-testid="start-menu-linkedin"
                        >
                          <Linkedin className="start-menu-shortcut-lucide" aria-hidden />
                          <span>LinkedIn</span>
                        </a>
                      </li>
                      <li>
                        <a
                          className="start-menu-shortcut-item"
                          href="mailto:dayyanhamid@gmail.com"
                          data-testid="start-menu-email"
                        >
                          <Mail className="start-menu-shortcut-lucide" aria-hidden />
                          <span>Email me</span>
                        </a>
                      </li>
                      <li>
                        <a
                          className="start-menu-shortcut-item"
                          href={`${BASE}assets/resume.pdf`}
                          download
                          data-testid="start-menu-resume-link"
                        >
                          <FileDown className="start-menu-shortcut-lucide" aria-hidden />
                          <span>Download resume</span>
                        </a>
                      </li>
                    </ul>

                    <div className="start-menu-separator" aria-hidden="true" />

                    <ul className="start-menu-shortcut-list" role="list">
                      <li>
                        <button
                          type="button"
                          className="start-menu-shortcut-item"
                          onClick={() => openWindow('help')}
                          data-testid="start-menu-help"
                        >
                          <LifeBuoy className="start-menu-shortcut-lucide" aria-hidden />
                          <span>Help &amp; Support</span>
                        </button>
                      </li>
                    </ul>
                  </>
                )}
              </div>
            </div>

            <footer className="start-menu-footer-xp">
              <button
                type="button"
                className="start-menu-footer-btn"
                onClick={() => closeStartMenu()}
                data-testid="start-menu-logoff"
              >
                <LogOut className="size-4 shrink-0" aria-hidden />
                <span>Log Off</span>
              </button>
              <button
                type="button"
                className="start-menu-footer-btn start-menu-shutdown"
                onClick={triggerShutdown}
                data-testid="start-menu-shutdown"
              >
                <Power className="size-4 shrink-0" aria-hidden />
                <span>Turn Off Computer</span>
              </button>
            </footer>

            {allProgramsOpen && (
              <aside
                className="start-menu-all-programs-flyout"
                role="menu"
                aria-label="All Programs"
                data-testid="start-menu-all-programs-flyout"
              >
                <div className="start-menu-all-programs-header">
                  <button
                    type="button"
                    className="start-menu-all-programs-back"
                    onClick={() => setAllProgramsOpen(false)}
                    aria-label="Back to Start menu"
                  >
                    <ArrowLeft className="size-4" aria-hidden />
                  </button>
                  <span>All Programs</span>
                </div>
                <div className="start-menu-all-programs-list" role="list">
                  {apps.map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      role="menuitem"
                      className="start-menu-program-item"
                      onClick={() => openWindow(app.id)}
                      data-testid={`start-menu-all-app-${app.id}`}
                    >
                      <span className="start-menu-program-icon" aria-hidden="true"><AppShellIcon appId={app.id} size="menu" /></span>
                      <span className="start-menu-program-text">
                        <span className="start-menu-program-title">{app.label}</span>
                        <span className="start-menu-program-subtitle">{APP_SUBTITLES[app.id]}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </aside>
            )}
          </aside>
          );
        })()}

        <header className="taskbar" data-testid="taskbar">
          <button
            className="start-btn"
            onClick={() => (startMenuOpen ? closeStartMenu() : setStartMenuOpen(true))}
            aria-haspopup="menu"
            aria-expanded={startMenuOpen}
            data-testid="start-button"
          >
            <span className="start-btn-logo" aria-hidden="true">
              <span className="start-btn-flag-pane start-btn-flag-red" />
              <span className="start-btn-flag-pane start-btn-flag-green" />
              <span className="start-btn-flag-pane start-btn-flag-blue" />
              <span className="start-btn-flag-pane start-btn-flag-yellow" />
            </span>
            <span className="start-btn-text">Start</span>
          </button>
          <div className="taskbar-quick-launch" aria-label="Quick launch">
            {DESKTOP_ICON_APPS.map((app) => (
              <button
                key={app.id}
                type="button"
                className="taskbar-quick-launch-btn"
                title={app.label}
                onClick={() => openWindow(app.id)}
                aria-label={app.label}
              >
                <span className="taskbar-quick-launch-icon"><AppShellIcon appId={app.id} size="taskbar" /></span>
              </button>
            ))}
          </div>
          <div className="taskbar-divider" aria-hidden="true" />
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
                  <span className="taskbar-window-btn-icon"><AppShellIcon appId={app.id} size="window" /></span>
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
          onBootStart={playBootSound}
        />
      )}

      {isMobile && !bootDone && <div className="mobile-boot-hint">Tip: press S, Enter, or Skip to load Mobile Lite.</div>}

      {shuttingDown && <ShutdownOverlay onRestart={() => window.location.reload()} />}
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
  const [experiencePanel, setExperiencePanel] = useState<ExperiencePanel>('olixir');
  const [skillFilter, setSkillFilter] = useState<'all' | 'frontend' | 'backend' | 'cloud' | 'data'>('all');
  const [projectQuery, setProjectQuery] = useState('');
  const [sortMode, setSortMode] = useState<'stars' | 'name'>('stars');
  const [useLbs, setUseLbs] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const botTimerRef = useRef<number | null>(null);
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
    {
      label: 'Python + FastAPI',
      value: 93,
      lane: 'backend',
      proof: 'Core stack for AI services, retrieval APIs, and product backends.'
    },
    {
      label: 'Nuxt + Vue',
      value: 91,
      lane: 'frontend',
      proof: 'Used in production healthcare workflows where clarity matters.'
    },
    {
      label: 'React + TypeScript',
      value: 88,
      lane: 'frontend',
      proof: 'Portfolio, tooling, and UI experiments with stronger interaction polish.'
    },
    {
      label: 'Azure AI Search + App Service',
      value: 87,
      lane: 'cloud',
      proof: 'Search-backed retrieval, hosting, and AI-adjacent service delivery.'
    },
    {
      label: 'AWS Fargate + ECS + S3',
      value: 86,
      lane: 'cloud',
      proof: 'Migration and delivery work for CollabLab production infrastructure.'
    },
    {
      label: 'SQL + data workflows',
      value: 85,
      lane: 'data',
      proof: 'Structured data work across analytics, internal tools, and ML projects.'
    },
    {
      label: 'PyTorch + TensorFlow',
      value: 84,
      lane: 'data',
      proof: 'Model training, experimentation, and neural-net side projects.'
    },
    {
      label: 'Leadership + delivery',
      value: 84,
      lane: 'backend',
      proof: 'Roadmaps, reviews, architecture calls, and keeping small teams moving.'
    }
  ] as const;

  const shownSkills = skills.filter(
    (item) => skillFilter === 'all' || item.lane === skillFilter
  );
  const shownSkillSpotlights = skillSpotlights.filter(
    (item) => skillFilter === 'all' || item.lane === skillFilter
  );

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
      <article className="about-revamp app-panel-frame">
        <header className="about-hero">
          <div className="about-hero-avatar">
            <img src={`${BASE}assets/headshot.jpg`} alt="Dayyan Hamid" />
          </div>
          <div className="about-hero-text">
            <h1>Dayyan Hamid</h1>
            <p className="about-tagline">
              Software / AI Engineer · Conversational AI @ Olixir New York
              (Omnicom) · Rutgers CS ’25
            </p>
            <p className="about-lead">
              I build AI products that need to feel usable to normal people and
              reliable to the teams behind them. Right now that means healthcare
              work at Olixir New York: Nuxt/Vue on the front end, Python/FastAPI
              in the middle, and retrieval pipelines that can survive real review.
              Outside of that, I lead a five-engineer squad at CollabLab, build ML
              side projects, and stay competitive in collegiate powerlifting.
            </p>
          </div>
        </header>
        <section className="about-signal-grid">
          {aboutSignals.map((signal) => (
            <article key={signal.label} className="about-signal-card">
              <p className="about-signal-label">{signal.label}</p>
              <strong>{signal.value}</strong>
              <span>{signal.detail}</span>
            </article>
          ))}
        </section>
        <section className="about-section">
          <h2>What I’m good at</h2>
          <ul className="about-list">
            <li>
              <strong>Applied AI that ships</strong> — RAG evaluation, retrieval
              design, and NLP pipelines built for actual product use.
            </li>
            <li>
              <strong>Full-stack execution</strong> — I can move from front-end
              UX to backend APIs to deployment without losing the thread.
            </li>
            <li>
              <strong>Small-team leverage</strong> — mentoring, architecture
              decisions, and shipping habits that make a five-person team feel
              bigger than it is.
            </li>
          </ul>
        </section>
        <section className="about-section">
          <h2>Core stack</h2>
          <div className="stack-badge-grid">
            {stackBadges.map((badge) => (
              <article key={badge.id} className="stack-badge-card">
                <div className="stack-badge-header">
                  <FrameworkLogo id={badge.id} size={18} />
                  <strong>{badge.label}</strong>
                </div>
                <p>{badge.note}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="about-section about-links">
          <h2>Connect</h2>
          <p>
            <a href="https://github.com/dayy346" target="_blank" rel="noreferrer">GitHub</a>
            {' · '}
            <a href="https://www.linkedin.com/in/dayyan-hamid" target="_blank" rel="noreferrer">LinkedIn</a>
            {' · '}
            <a href={`${BASE}assets/resume.pdf`} target="_blank" rel="noreferrer">Resume (PDF)</a>
          </p>
        </section>
      </article>
    );
  }

  if (appId === 'resume') {
    return (
      <article className="resume-window app-panel-frame">
        <header className="resume-window-header">
          <div className="resume-window-title-row">
            <h2 className="resume-window-title">Resume</h2>
            <a href={`${BASE}assets/resume.pdf`} download className="resume-download-btn">
              Download PDF
            </a>
          </div>
          <p className="resume-window-subtitle">
            Built-in PDF viewer. If it doesn’t render in your browser, use the download button.
          </p>
        </header>
        <div className="resume-pdf-viewer">
          <object
            data={`${BASE}assets/resume.pdf`}
            type="application/pdf"
            className="resume-pdf-object"
            aria-label="Resume PDF viewer"
          >
            <p className="muted">
              PDF preview not supported in this browser.{' '}
              <a href={`${BASE}assets/resume.pdf`} target="_blank" rel="noreferrer">
                Open the PDF ↗
              </a>
            </p>
          </object>
        </div>
      </article>
    );
  }

  if (appId === 'experience') {
    const experienceLogos = [
      'nuxt',
      'vue',
      'python',
      'fastapi',
      'azure',
      'aws'
    ] as const;

    return (
      <article className="timeline app-panel-frame">
        <header className="app-window-intro">
          <h2>Experience</h2>
          <p className="app-window-intro-lead">
            My best work usually sits at the intersection of product, platform,
            and trust. Healthcare taught me to build carefully. EdTech taught me
            to move fast with a small team. Regeneron taught me how process and
            quality actually shape software in regulated environments.
          </p>
        </header>
        <section className="experience-stack-strip" aria-label="Experience stack">
          {experienceLogos.map((logoId) => (
            <span key={logoId} className="experience-stack-pill">
              <FrameworkLogo id={logoId} size={16} />
            </span>
          ))}
        </section>
        <section>
          <h3>
            <button className="exp-toggle" onClick={() => setExperiencePanel('olixir')} aria-expanded={experiencePanel === 'olixir'}>
              Junior AI Engineer — Olixir New York
            </button>
          </h3>
          {experiencePanel === 'olixir' && (
            <>
              <p className="muted">Oct 2025 — Present · Full-time · NYC · Olixir New York (Omnicom)</p>
              <ul>
                <li>Full-stack AI apps for pharma clients on the Conversational AI team — Nuxt + Vue.</li>
                <li>Python/FastAPI backends with Azure AI Search; RAG pipelines and blob-backed indexes.</li>
                <li>NLP with spaCy and NLU frameworks under GxP constraints; LLM/RAG architecture research.</li>
              </ul>
              <p className="muted">Stack: Nuxt · Vue · Python · FastAPI · Azure AI Search · Blob · spaCy</p>
            </>
          )}
        </section>
        <section>
          <h3>
            <button className="exp-toggle" onClick={() => setExperiencePanel('collablab')} aria-expanded={experiencePanel === 'collablab'}>
              Engineering Manager & Full Stack Engineer — Troy Tutors (CollabLab)
            </button>
          </h3>
          {experiencePanel === 'collablab' && (
            <>
              <p><strong>Engineering Manager</strong> (Jan 2026 — Present, part-time): Lead five full-stack engineers; architecture, reviews, and sprint execution; directed EC2 → AWS Fargate migration for scale and cost.</p>
              <p><strong>Full Stack Software Engineer</strong> (Mar 2025 — Jan 2026, remote; part-time from Jun 2025): Core platform on Vue + Node; Playwright CI/CD; AWS ECS, S3, CloudFront migrations; camera enforcement for tutoring rooms. <a href="https://collablab.dev" target="_blank" rel="noreferrer">collablab.dev</a></p>
            </>
          )}
        </section>
        <section>
          <h3>
            <button className="exp-toggle" onClick={() => setExperiencePanel('regeneron')} aria-expanded={experiencePanel === 'regeneron'}>
              Regeneron — QA Document Control & Developer Intern
            </button>
          </h3>
          {experiencePanel === 'regeneron' && (
            <>
              <p><strong>QA Document Control Analyst</strong> (Jun 2025 — Oct 2025, contract): GxP documentation with OpenText, myQumas, TrackWise; improved SharePoint workflows. Contract through Oxford Global Resources.</p>
              <p><strong>QA Developer Intern</strong> (May 2024 — Sep 2024, Albany on-site): Power Automate, Power BI, SharePoint, SQL, PowerApps; launched SharePoint intake site (1,000+ submissions first week); superlative award and program extension. GxP systems: DataMart, OpsTrakker.</p>
            </>
          )}
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
      <article className="app-panel-frame">
        <header className="app-window-intro">
          <h2>Skills</h2>
          <p className="app-window-intro-lead">
            This is the stack I can talk through in detail because I’ve used it
            to ship work, not because I memorized a docs page. The goal here
            isn’t to claim “expert in everything” — it’s to show where I’m
            genuinely strongest and what kind of problems I’m useful on.
          </p>
        </header>
        <section className="skills-logo-cloud" aria-label="Framework logos">
          {stackBadges.map((badge) => (
            <article key={badge.id} className="skills-logo-tile">
              <FrameworkLogo id={badge.id} size={20} />
              <div>
                <strong>{badge.label}</strong>
                <span>{badge.note}</span>
              </div>
            </article>
          ))}
        </section>
        <div className="filter-row" role="toolbar" aria-label="Skill filters">
          {['all', 'frontend', 'backend', 'cloud', 'data'].map((key) => (
            <button key={key} className={skillFilter === key ? 'active' : ''} onClick={() => setSkillFilter(key as typeof skillFilter)}>{key}</button>
          ))}
        </div>
        <section className="skill-spotlight-grid">
          {shownSkillSpotlights.map((spotlight) => (
            <article key={spotlight.title} className="skill-spotlight-card">
              <div className="skill-spotlight-top">
                <p>{spotlight.title}</p>
                <strong>{spotlight.score}%</strong>
              </div>
              <div className="skill-spotlight-logos">
                {spotlight.stack.map((logo) => (
                  <span key={`${spotlight.title}-${logo}`} className="skill-spotlight-logo">
                    <FrameworkLogo id={logo} size={18} />
                  </span>
                ))}
              </div>
              <h3>{spotlight.summary}</h3>
              <span>{spotlight.proof}</span>
            </article>
          ))}
        </section>
        <div className="meter-stack">
          {shownSkills.map((skill) => (
            <div className="meter" key={skill.label}>
              <div className="meter-header">
                <p>{skill.label}</p>
                <strong>{skill.value}%</strong>
              </div>
              <div className="track"><span style={{ width: `${skill.value}%` }} /></div>
              <small>{skill.proof}</small>
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
      <article className="extracurricular-panel app-panel-frame">
        <header className="app-window-intro">
          <h2>Outside the keyboard</h2>
          <p className="app-window-intro-lead">
            What grew the discipline behind the engineering. Collegiate powerlifting (qualified for nationals after a top-6 finish at the East Coast Championships), running point as PSA Secretary at Rutgers, and four years working through every front-of-house role at PJ's Pancake House.
          </p>
        </header>

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
      <article className="leetcode-panel app-panel-frame">
        <header className="app-window-intro">
          <h2>LeetCode · @dayy345</h2>
          <p className="app-window-intro-lead">
            Daily-ish practice — graphs, DP, and system-design flavored mediums. Counters below pull from leetcode-stats-api when CORS allows; otherwise cached. Open the profile for the live ledger.
          </p>
        </header>
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
      <article className="app-panel-frame projects-app">
        <header className="app-window-intro">
          <h2>Projects · github.com/dayy346</h2>
          <p className="app-window-intro-lead">
            Live repo data is still here, but the point of this window is the
            story behind the work: healthcare AI, a real EdTech platform, and ML
            projects that started as curiosity but ended up with strong systems
            thinking behind them.
          </p>
        </header>
        <section className="featured-story-grid">
          {featuredStories.map((story) => (
            <article key={story.title} className="featured-story-card">
              <div className="featured-story-head">
                <p>{story.strap}</p>
                <h3>{story.title}</h3>
              </div>
              <div className="featured-story-logos">
                {story.stack.map((logo) => (
                  <span key={`${story.title}-${logo}`} className="featured-story-logo">
                    <FrameworkLogo id={logo} size={18} />
                  </span>
                ))}
              </div>
              <p className="featured-story-summary">{story.summary}</p>
              <ul>
                {story.outcomes.map((outcome) => (
                  <li key={`${story.title}-${outcome}`}>{outcome}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
        <p className="repo-summary">
          {repoStatusLine}
          <a href="https://github.com/dayy346" target="_blank" rel="noreferrer"> Browse GitHub ↗</a>
        </p>
        <div className="project-controls">
          <input
            id="project-filter"
            name="projectFilter"
            value={projectQuery}
            onChange={(e) => setProjectQuery(e.target.value)}
            placeholder="Filter repositories"
            aria-label="Filter repositories"
          />
          <select
            id="project-sort"
            name="projectSort"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as typeof sortMode)}
            aria-label="Sort repositories"
          >
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
      <article className="contributions-panel app-panel-frame">
        <header className="app-window-intro">
          <p className="muted">Delivery telemetry</p>
          <h2>Contributions.log</h2>
          <p className="app-window-intro-lead">
            This is the closest thing to a delivery dashboard for my work. It’s
            part live GitHub feed, part “what have I actually built lately?”
            summary. Signal strength tracks repo traction; freshness tracks how
            active the work has been recently. {repoStatusLine}
          </p>
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
        <section className="contribution-story-strip">
          {featuredStories.slice(0, 3).map((story) => (
            <article key={`contribution-${story.title}`} className="contribution-story-card">
              <p>{story.strap}</p>
              <h3>{story.title}</h3>
              <span>{story.summary}</span>
            </article>
          ))}
        </section>
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
      <article className="app-contact-content app-panel-frame">
        <header className="app-window-intro">
          <h2>Contact</h2>
          <p className="app-window-intro-lead">
            Best path: email. I respond within a day for recruiting, collabs, or technical questions. Phone for time-sensitive interviews. All channels below match what's on my resume.
          </p>
        </header>
        <div className="contact-card-grid">
          <div className="contact-card contact-card-primary">
            <p className="contact-card-label">Primary</p>
            <button type="button" className="contact-copy-btn" onClick={() => copyText('email', 'dayyan6093@gmail.com')}>
              Copy dayyan6093@gmail.com
            </button>
            <a className="contact-card-link" href="mailto:dayyan6093@gmail.com">Open in mail client</a>
          </div>
          <div className="contact-card">
            <p className="contact-card-label">University</p>
            <button type="button" className="contact-copy-btn" onClick={() => copyText('school email', 'dh820@scarletmail.rutgers.edu')}>
              Copy Rutgers email
            </button>
          </div>
          <a className="contact-card contact-card-linktile" href="tel:+16099776880">
            <span className="contact-card-label">Phone</span>
            <span className="contact-card-strong">(609) 977-6880</span>
          </a>
          <a className="contact-card contact-card-linktile" href="https://www.linkedin.com/in/dayyan-hamid/" target="_blank" rel="noreferrer">
            <span className="contact-card-label">LinkedIn</span>
            <span className="contact-card-strong">Profile ↗</span>
          </a>
          <a className="contact-card contact-card-linktile" href="https://github.com/dayy346" target="_blank" rel="noreferrer">
            <span className="contact-card-label">GitHub</span>
            <span className="contact-card-strong">dayy346 ↗</span>
          </a>
          <a className="contact-card contact-card-linktile" href="https://leetcode.com/dayy345" target="_blank" rel="noreferrer">
            <span className="contact-card-label">LeetCode</span>
            <span className="contact-card-strong">dayy345 ↗</span>
          </a>
        </div>
        {copied && <p className="muted contact-copy-toast">Copied {copied}.</p>}
      </article>
    );
  }

  if (appId === 'chatbot') {
    return (
      <article className="chatbot-shell app-panel-frame">
        <header className="chatbot-header">
          <h2>Assist · portfolio bot</h2>
          <p>Local rules-based bot trained on my project list. Try <em>&quot;list projects&quot;</em>, <em>&quot;tell me about CollabLab&quot;</em>, or <em>&quot;what stack do you use at Olixir?&quot;</em>. No external API calls — runs in-browser.</p>
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
            id="chatbot-input"
            name="chatbotInput"
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

  return (
    <article className="help-panel app-panel-frame">
      <h2>Keyboard Shortcuts</h2>
      <ul>
        <li><kbd>Alt</kbd> + <kbd>Tab</kbd>: cycle focused window</li>
        <li><kbd>Ctrl</kbd> + <kbd>M</kbd>: minimize focused window</li>
        <li><kbd>Esc</kbd>: close Start menu or skip boot</li>
        <li><kbd>S</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>: skip boot instantly</li>
        <li>Double-click desktop icons or press <kbd>Enter</kbd> to open apps</li>
      </ul>
    </article>
  );
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
        <h1>Portfolio · Mobile</h1>
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
        <h3>Olixir New York highlights</h3>
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
