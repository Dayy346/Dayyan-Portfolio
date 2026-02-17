export type AppId =
  | 'about'
  | 'showcase'
  | 'projects'
  | 'experience'
  | 'skills'
  | 'frontend'
  | 'power'
  | 'contact'
  | 'help';

export type BootStage = {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
  durationMs: number;
  lines: string[];
};

export const bootStages: BootStage[] = [
  {
    id: 'bios',
    title: 'POST + BIOS',
    subtitle: 'Hardware profile checks and low-level startup',
    accent: '#b86f3a',
    durationMs: 2600,
    lines: [
      '[POST] CPU: frontend-core x64 @ 3.60GHz',
      '[POST] Memory test: 16384KB OK',
      '[POST] Input devices: keyboard + pointer online',
      '[POST] Video adapter: RetroVGA 32-bit mode',
      '[OK] Boot device: portfolio-shell.img'
    ]
  },
  {
    id: 'kernel',
    title: 'Kernel + Services',
    subtitle: 'Launching interaction engine and UI runtime',
    accent: '#5f8f74',
    durationMs: 3000,
    lines: [
      '[OK] Mounting /ui, /assets, /projects',
      '[OK] Loading React + TypeScript renderer',
      '[OK] Starting window manager daemon',
      '[OK] Registering keyboard shortcuts and a11y hooks',
      '[OK] Initializing GitHub repository feed'
    ]
  },
  {
    id: 'desktop',
    title: 'Desktop Composition',
    subtitle: 'Applying shell theme and restoring workspace',
    accent: '#8b5e7f',
    durationMs: 2200,
    lines: [
      '[OK] Calibrating nostalgic-modern color profile',
      '[OK] Priming icon cache and taskbar services',
      '[OK] Syncing engineering showcase modules',
      '[READY] DAYYAN.OS desktop is now available'
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
  { id: 'help', icon: '⌨️', label: 'Help.txt' }
] as const;
