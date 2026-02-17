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

export const bootLines = [
  '[OK] Loading Dayyan.OS kernel modules...',
  '[OK] Mounting frontend workspace...',
  '[OK] Hydrating portfolio shell in React + TypeScript...',
  '[OK] Starting desktop window manager...',
  '[OK] Enabling accessibility and keyboard controls...',
  '[OK] Preparing showcase and FCB Health highlights...',
  '[OK] DAYYAN.OS ready.'
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
