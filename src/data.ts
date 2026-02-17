export type AppId =
  | 'about'
  | 'showcase'
  | 'projects'
  | 'experience'
  | 'skills'
  | 'frontend'
  | 'power'
  | 'contact'
  | 'missive'
  | 'help';

export type BootStage = {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
  durationMs: number;
  lines: string[];
  narrative: string;
  pulse: string;
};

export const bootStages: BootStage[] = [
  {
    id: 'bios',
    title: 'Crystalline POST',
    subtitle: 'Cinematic sensor choreography aligns hardware with narrative intent.',
    accent: '#f0a95e',
    durationMs: 3200,
    narrative: 'Latest CHI research shows early storytelling cues shrink uncertainty. We warm up the instruments in stillness before revealing the story.',
    pulse: 'Pulse: measured breath, slow amber pulses, and mechanical shutters easing into motion.',
    lines: [
      '[POST] Crystalline sensors performing 32-bit handshake',
      '[POST] Haptic keyboard + pointer calibrations verified',
      '[POST] NVMe memory grid refreshed with redundancy guardrails',
      '[POST] Ambient light grid warming for premium palettes',
      '[POST] Story fragments prepped for the cinematic arc',
      '[OK] BIOS warp drive engaged · hush tuned for stage two'
    ]
  },
  {
    id: 'kernel',
    title: 'Quantum Kernel Rhythm',
    subtitle: 'Interaction engine, motion cues, and reliability services get in sync.',
    accent: '#82c7b3',
    durationMs: 3000,
    narrative: 'Motion research guided by embodied interaction principles keeps every micro-cue consistent, comfortable, and intentional.',
    pulse: 'Pulse: ribboned teal glow that swirls with each scheduler beat.',
    lines: [
      '[OK] Kernel heartbeat synced with atmospheric motion cadence',
      '[OK] Scheduler choreographs cinematic + comfort zones',
      '[OK] Window manager wires tuned for layered inertia',
      '[OK] Input concierge armed: Alt+Tab, Ctrl+M, Enter',
      '[OK] Missive board + telemetry streaming curated pulses',
      '[OK] Reduced-motion fallbacks standing by'
    ]
  },
  {
    id: 'atmosphere',
    title: 'Atmospheric Shell',
    subtitle: 'Gradient fog, halos, and depth cues paint the workspace.',
    accent: '#c27dcf',
    durationMs: 2600,
    narrative: 'Visual comfort studies affirm that layered gradients and subtle haze keep focus while delivering nostalgia.',
    pulse: 'Pulse: violet halos ripple gently as if breathing through a retro console.',
    lines: [
      '[OK] Palette matrix applying atmospheric gradient overlays',
      '[OK] Atmosphere conductor warms stage lighting + halos',
      '[OK] Desktop motif introduces matte, chrome, and warmth',
      '[OK] Narrative audio hints locked to transition cadence',
      '[OK] Taskbar + overlays tuned to kinetic bounce rhythms',
      '[READY] Ambient shell present · retro lightscapes ready'
    ]
  },
  {
    id: 'story',
    title: 'Story Sync & Launch',
    subtitle: 'Every window, repo, and missive narrates the mission.',
    accent: '#6edb9f',
    durationMs: 2400,
    narrative: 'Storytelling research says closing with a friendly narrative hook makes the shell feel alive and trustworthy.',
    pulse: 'Pulse: emerald streaks cascade toward the horizon, teasing the desktop.',
    lines: [
      '[OK] Story watchers align: focus, mood, and highlight cues',
      '[OK] Repositories, missives, and windows materialized',
      '[OK] Cinematic boot story synced to live analytics',
      '[READY] DAYYAN.OS interface fully awake · welcoming you home'
    ]
  }
];

export const apps = [
  { id: 'about', icon: '👤', label: 'About.me' },
  { id: 'showcase', icon: '✨', label: 'Showcase.exe' },
  { id: 'projects', icon: '🗂️', label: 'Projects.dir' },
  { id: 'experience', icon: '🧰', label: 'Experience.log' },
  { id: 'skills', icon: '⚙️', label: 'Skills.cfg' },
  { id: 'frontend', icon: '🧠', label: 'Frontend.lab' },
  { id: 'power', icon: '🏋️', label: 'Power.stats' },
  { id: 'contact', icon: '📡', label: 'Contact.net' },
  { id: 'missive', icon: '✉️', label: 'Missive.msg' },
  { id: 'help', icon: '⌨️', label: 'Help.txt' }
] as const;
