import type { AppId } from '../../data';
import * as React from 'react';
import {
  BarChart3,
  Bot,
  Briefcase,
  Code2,
  Dumbbell,
  FileText,
  FolderOpen,
  LifeBuoy,
  Radio,
  Settings2,
  User
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

const LUCIDE_BY_APP: Record<AppId, React.FC<LucideProps>> = {
  about: User,
  resume: FileText,
  projects: FolderOpen,
  contributions: BarChart3,
  experience: Briefcase,
  skills: Settings2,
  power: Dumbbell,
  leetcode: Code2,
  contact: Radio,
  chatbot: Bot,
  help: LifeBuoy
};

type AppShellIconProps = {
  appId: AppId;
  size?: 'desktop' | 'menu' | 'taskbar' | 'window';
  className?: string;
};

const sizeMap = { desktop: 22, menu: 16, taskbar: 15, window: 14 } as const;

export function AppShellIcon({ appId, size = 'desktop', className = '' }: AppShellIconProps) {
  const Icon = LUCIDE_BY_APP[appId];
  const px = sizeMap[size];
  if (!Icon) return null;
  return (
    <span
      className={`app-shell-icon app-shell-icon--${size} ${className}`.trim()}
      aria-hidden
    >
      <Icon
        size={px}
        strokeWidth={size === 'desktop' ? 2.1 : 2}
        className="app-shell-icon-glyph"
      />
    </span>
  );
}
