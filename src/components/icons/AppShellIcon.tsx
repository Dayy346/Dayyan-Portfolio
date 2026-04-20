import * as React from 'react';
import type { AppId } from '../../data';

type IconRenderer = (props: { px: number }) => React.ReactElement;

const tileGradient = (id: string, top: string, bottom: string) => (
  <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor={top} />
    <stop offset="1" stopColor={bottom} />
  </linearGradient>
);

const Tile = ({
  id,
  top,
  bottom,
  stroke = 'rgba(0,0,0,0.55)'
}: {
  id: string;
  top: string;
  bottom: string;
  stroke?: string;
}) => (
  <>
    <defs>{tileGradient(id, top, bottom)}</defs>
    <rect x="1.5" y="1.5" width="29" height="29" rx="6" fill={`url(#${id})`} stroke={stroke} strokeWidth="1" />
    <rect x="2.5" y="2.5" width="27" height="14" rx="5" fill="rgba(255,255,255,0.22)" />
  </>
);

const ICONS: Record<AppId, IconRenderer> = {
  about: ({ px }) => (
    <svg viewBox="0 0 32 32" width={px} height={px} aria-hidden focusable="false">
      <Tile id="t-about" top="#7ec8ff" bottom="#1c5bb8" />
      <circle cx="16" cy="13.5" r="4.4" fill="#fff" stroke="#0b3a82" strokeWidth="0.8" />
      <path d="M7.5 26c1.4-4.2 5-6.4 8.5-6.4s7.1 2.2 8.5 6.4Z" fill="#fff" stroke="#0b3a82" strokeWidth="0.8" />
      <circle cx="22.5" cy="20.5" r="3.2" fill="#3aa856" stroke="#0b3a82" strokeWidth="0.6" />
      <path d="m21 20.5 1.2 1.2 1.9-2.1" stroke="#fff" strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  resume: ({ px }) => (
    <svg viewBox="0 0 32 32" width={px} height={px} aria-hidden focusable="false">
      <Tile id="t-resume" top="#f4d36b" bottom="#a76b1d" />
      <path d="M9 6h11l4 4v17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z" fill="#fffaf0" stroke="#3a2208" strokeWidth="0.9" />
      <path d="M20 6v4h4" fill="#e9d49a" stroke="#3a2208" strokeWidth="0.9" />
      <path d="M11 14h10M11 17h10M11 20h7M11 23h6" stroke="#3a2208" strokeWidth="0.9" strokeLinecap="round" />
      <rect x="20" y="22" width="6" height="7" fill="#c91d1d" stroke="#3a2208" strokeWidth="0.6" />
      <path d="M20 29l3-2 3 2v-7h-6Z" fill="#c91d1d" stroke="#3a2208" strokeWidth="0.6" />
    </svg>
  ),

  projects: ({ px }) => (
    <svg viewBox="0 0 32 32" width={px} height={px} aria-hidden focusable="false">
      <Tile id="t-projects" top="#7ad7ff" bottom="#1f6ea3" />
      <path d="M5 11h7l2 2h13v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1Z" fill="#f3c14b" stroke="#5a3b08" strokeWidth="0.9" />
      <path d="M5 11h7l2 2h13v3H5Z" fill="#e09a1f" stroke="#5a3b08" strokeWidth="0.9" />
      <rect x="9" y="17" width="14" height="9" rx="1" fill="#fffbe5" stroke="#5a3b08" strokeWidth="0.6" />
      <path d="M11 20h10M11 22.5h7" stroke="#5a3b08" strokeWidth="0.7" strokeLinecap="round" />
    </svg>
  ),

  contributions: ({ px }) => (
    <svg viewBox="0 0 32 32" width={px} height={px} aria-hidden focusable="false">
      <Tile id="t-contrib" top="#9be38a" bottom="#1f6e2c" />
      <rect x="6" y="22" width="3.5" height="5" fill="#9be38a" stroke="#0a3013" strokeWidth="0.6" />
      <rect x="11" y="17" width="3.5" height="10" fill="#4cc04a" stroke="#0a3013" strokeWidth="0.6" />
      <rect x="16" y="12" width="3.5" height="15" fill="#2a8a2e" stroke="#0a3013" strokeWidth="0.6" />
      <rect x="21" y="8" width="3.5" height="19" fill="#0e5a23" stroke="#0a3013" strokeWidth="0.6" />
      <path d="M5 27h22" stroke="#0a3013" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M5 27V8" stroke="#0a3013" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  ),

  experience: ({ px }) => (
    <svg viewBox="0 0 32 32" width={px} height={px} aria-hidden focusable="false">
      <Tile id="t-exp" top="#c79a6c" bottom="#5a3416" />
      <path d="M12 9h8a2 2 0 0 1 2 2v2h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V14a1 1 0 0 1 1-1h3v-2a2 2 0 0 1 2-2Z" fill="#7c4a1d" stroke="#2a1503" strokeWidth="0.9" />
      <path d="M14 13v-1.5h4V13" stroke="#2a1503" strokeWidth="0.9" fill="none" />
      <rect x="6" y="17" width="20" height="3" fill="#3d1f08" />
      <rect x="14" y="17" width="4" height="3" fill="#f5c976" stroke="#2a1503" strokeWidth="0.6" />
    </svg>
  ),

  skills: ({ px }) => (
    <svg viewBox="0 0 32 32" width={px} height={px} aria-hidden focusable="false">
      <Tile id="t-skills" top="#cfd6df" bottom="#5a6373" />
      <path d="m18.6 6.5.7 2.5a8 8 0 0 1 2 1.2l2.5-.7 2 3.5-1.9 1.8a8 8 0 0 1 0 2.4l1.9 1.8-2 3.5-2.5-.7a8 8 0 0 1-2 1.2l-.7 2.5h-4l-.7-2.5a8 8 0 0 1-2-1.2l-2.5.7-2-3.5 1.9-1.8a8 8 0 0 1 0-2.4l-1.9-1.8 2-3.5 2.5.7a8 8 0 0 1 2-1.2l.7-2.5Z" fill="#f0a533" stroke="#3a2208" strokeWidth="0.9" />
      <circle cx="16.6" cy="16" r="3.4" fill="#fff5dc" stroke="#3a2208" strokeWidth="0.9" />
    </svg>
  ),

  power: ({ px }) => (
    <svg viewBox="0 0 32 32" width={px} height={px} aria-hidden focusable="false">
      <Tile id="t-power" top="#ff7a7a" bottom="#7a0d10" />
      <rect x="3" y="14" width="3" height="4" rx="0.6" fill="#222" stroke="#000" strokeWidth="0.6" />
      <rect x="26" y="14" width="3" height="4" rx="0.6" fill="#222" stroke="#000" strokeWidth="0.6" />
      <rect x="6" y="11" width="3" height="10" rx="1" fill="#444" stroke="#000" strokeWidth="0.6" />
      <rect x="23" y="11" width="3" height="10" rx="1" fill="#444" stroke="#000" strokeWidth="0.6" />
      <rect x="9" y="14.5" width="14" height="3" fill="#dcdcdc" stroke="#000" strokeWidth="0.6" />
    </svg>
  ),

  leetcode: ({ px }) => (
    <svg viewBox="0 0 32 32" width={px} height={px} aria-hidden focusable="false">
      <Tile id="t-leet" top="#1c1c22" bottom="#000" stroke="rgba(255,255,255,0.25)" />
      <rect x="5" y="7" width="22" height="18" rx="2" fill="#0d0d12" stroke="#ffa116" strokeWidth="0.9" />
      <path d="M5 11h22" stroke="#ffa116" strokeWidth="0.9" />
      <circle cx="7.5" cy="9" r="0.7" fill="#ffa116" />
      <circle cx="9.5" cy="9" r="0.7" fill="#ffa116" />
      <circle cx="11.5" cy="9" r="0.7" fill="#ffa116" />
      <path d="m11 16 3 3-3 3M16 22h6" stroke="#ffa116" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  contact: ({ px }) => (
    <svg viewBox="0 0 32 32" width={px} height={px} aria-hidden focusable="false">
      <Tile id="t-contact" top="#ffb27a" bottom="#a83c1d" />
      <rect x="5" y="9" width="22" height="15" rx="1" fill="#fff" stroke="#3a1305" strokeWidth="0.9" />
      <path d="m5 9 11 8 11-8" stroke="#3a1305" strokeWidth="0.9" fill="none" />
      <circle cx="22.5" cy="11.5" r="3" fill="#c91d1d" stroke="#3a1305" strokeWidth="0.6" />
      <text x="22.5" y="13" fontFamily="Arial" fontSize="4.5" fontWeight="700" fill="#fff" textAnchor="middle">@</text>
    </svg>
  ),

  chatbot: ({ px }) => (
    <svg viewBox="0 0 32 32" width={px} height={px} aria-hidden focusable="false">
      <Tile id="t-bot" top="#7ee0d5" bottom="#0e6e7a" />
      <rect x="9" y="10" width="14" height="9" rx="2" fill="#fff" stroke="#03363d" strokeWidth="0.9" />
      <circle cx="13" cy="14.5" r="1.3" fill="#03363d" />
      <circle cx="19" cy="14.5" r="1.3" fill="#03363d" />
      <path d="M13 17h6" stroke="#03363d" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M16 9.5V7" stroke="#03363d" strokeWidth="0.9" strokeLinecap="round" />
      <circle cx="16" cy="6.5" r="1" fill="#03363d" />
      <path d="M14 19v3l-3 2v-5z" fill="#fff" stroke="#03363d" strokeWidth="0.8" strokeLinejoin="round" />
      <rect x="7" y="20" width="3" height="4" rx="0.6" fill="#03363d" />
      <rect x="22" y="20" width="3" height="4" rx="0.6" fill="#03363d" />
    </svg>
  ),

  help: ({ px }) => (
    <svg viewBox="0 0 32 32" width={px} height={px} aria-hidden focusable="false">
      <Tile id="t-help" top="#bcd9ff" bottom="#1d4baf" />
      <circle cx="16" cy="17" r="9" fill="#fff" stroke="#0a2966" strokeWidth="0.9" />
      <path d="M12.5 13.5a3.5 3.5 0 0 1 7 0c0 2-3.5 2.5-3.5 4.5" stroke="#0a2966" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="16" cy="22" r="1.3" fill="#0a2966" />
    </svg>
  )
};

type AppShellIconProps = {
  appId: AppId;
  size?: 'desktop' | 'menu' | 'taskbar' | 'window';
  className?: string;
};

const sizeMap = { desktop: 38, menu: 22, taskbar: 20, window: 18 } as const;

export function AppShellIcon({ appId, size = 'desktop', className = '' }: AppShellIconProps) {
  const Render = ICONS[appId];
  const px = sizeMap[size];

  if (!Render) return null;

  return (
    <span
      className={`app-shell-icon app-shell-icon--${size} app-shell-icon--${appId} ${className}`.trim()}
      aria-hidden
    >
      <Render px={px} />
    </span>
  );
}
