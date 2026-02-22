/**
 * Windows XP–style 32×32 icons as inline SVGs.
 * Simple, recognizable shapes in classic XP colors.
 */

import type { SVGProps } from 'react';

const size = 32;
const defaultProps: SVGProps<SVGSVGElement> = { width: size, height: size, viewBox: `0 0 ${size} ${size}`, fill: 'none', xmlns: 'http://www.w3.org/2000/svg' };

export function XPIconUser(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...defaultProps} {...props}>
      <circle cx="16" cy="10" r="5" fill="#4A90D9" stroke="#2D5A8F" strokeWidth="1" />
      <path d="M6 28c0-5 4-8 10-8s10 3 10 8" fill="#4A90D9" stroke="#2D5A8F" strokeWidth="1" />
    </svg>
  );
}

export function XPIconDocument(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...defaultProps} {...props}>
      <path d="M8 2h12l6 6v20H8V2z" fill="#FFF" stroke="#808080" strokeWidth="1" />
      <path d="M20 2v6h6" fill="#FFF" stroke="#808080" strokeWidth="1" />
      <line x1="10" y1="12" x2="22" y2="12" stroke="#4A90D9" strokeWidth="1.5" />
      <line x1="10" y1="16" x2="22" y2="16" stroke="#4A90D9" strokeWidth="1.5" />
      <line x1="10" y1="20" x2="18" y2="20" stroke="#4A90D9" strokeWidth="1.5" />
    </svg>
  );
}

export function XPIconFolder(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...defaultProps} {...props}>
      <path d="M4 8h10l4 4h10v14H4V8z" fill="#FFC233" stroke="#B8860B" strokeWidth="1" />
      <path d="M4 8l4-4h6l4 4" fill="#E6A810" stroke="#B8860B" strokeWidth="1" />
    </svg>
  );
}

export function XPIconChart(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...defaultProps} {...props}>
      <rect x="4" y="20" width="6" height="6" fill="#4A90D9" stroke="#2D5A8F" strokeWidth="1" />
      <rect x="13" y="14" width="6" height="12" fill="#4A90D9" stroke="#2D5A8F" strokeWidth="1" />
      <rect x="22" y="8" width="6" height="18" fill="#4A90D9" stroke="#2D5A8F" strokeWidth="1" />
      <path d="M4 20V8 M13 14V6 M22 8V2" stroke="#808080" strokeWidth="0.5" fill="none" />
    </svg>
  );
}

export function XPIconBriefcase(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...defaultProps} {...props}>
      <path d="M4 12h24v14H4z" fill="#8B6914" stroke="#5C4510" strokeWidth="1" />
      <path d="M4 12V9a3 3 0 013-3h14a3 3 0 013 3v3" fill="#A67C00" stroke="#5C4510" strokeWidth="1" />
      <path d="M12 9v3h8V9" fill="#5C4510" stroke="#5C4510" strokeWidth="0.5" />
    </svg>
  );
}

export function XPIconGear(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...defaultProps} {...props}>
      <circle cx="16" cy="16" r="5" fill="#C0C0C0" stroke="#808080" strokeWidth="1" />
      <path d="M16 4v3M16 25v3M4 16h3M25 16h3M7.5 7.5l2 2M22.5 22.5l2 2M7.5 24.5l2-2M22.5 9.5l2-2M24.5 7.5l-2 2M9.5 22.5l-2 2" stroke="#808080" strokeWidth="1.5" />
    </svg>
  );
}

export function XPIconFire(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...defaultProps} {...props}>
      <path d="M16 4c-2 4-6 6-6 10a6 6 0 1012 0c0-4-4-6-6-10z" fill="#E25822" stroke="#C04000" strokeWidth="1" />
      <path d="M16 8a3 3 0 00-3 4 3 3 0 006 0 3 3 0 00-3-4z" fill="#FF8C42" />
    </svg>
  );
}

export function XPIconPuzzle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...defaultProps} {...props}>
      <path d="M8 4h8v4h4v8h-4v4H8v-4H4v-8h4V4z" fill="#7B5EB6" stroke="#4A3770" strokeWidth="1" />
      <path d="M20 12h4v4h-4z" fill="#9B7ED6" stroke="#4A3770" strokeWidth="1" />
      <path d="M20 20h4v4h-4z" fill="#9B7ED6" stroke="#4A3770" strokeWidth="1" />
    </svg>
  );
}

export function XPIconMail(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...defaultProps} {...props}>
      <path d="M4 8h24v16H4V8z" fill="#FFF8DC" stroke="#808080" strokeWidth="1" />
      <path d="M4 8l12 8 12-8" fill="none" stroke="#808080" strokeWidth="1" />
    </svg>
  );
}

export function XPIconChat(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...defaultProps} {...props}>
      <path d="M6 6h20v14H10l-4 4V6z" fill="#E8F4FC" stroke="#4A90D9" strokeWidth="1" />
      <path d="M10 10h12M10 14h8" stroke="#4A90D9" strokeWidth="1" />
    </svg>
  );
}

export function XPIconHelp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...defaultProps} {...props}>
      <circle cx="16" cy="16" r="12" fill="#FFF8DC" stroke="#808080" strokeWidth="1" />
      <path d="M12 12c0-2 1.5-4 4-4s4 2 4 4c0 2-1 3-3 4l-1 2v2h4" stroke="#4A90D9" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="16" cy="24" r="1.5" fill="#4A90D9" />
    </svg>
  );
}

export const XP_ICONS = {
  about: XPIconUser,
  resume: XPIconDocument,
  projects: XPIconFolder,
  contributions: XPIconChart,
  experience: XPIconBriefcase,
  skills: XPIconGear,
  power: XPIconFire,
  leetcode: XPIconPuzzle,
  contact: XPIconMail,
  chatbot: XPIconChat,
  help: XPIconHelp
} as const;
