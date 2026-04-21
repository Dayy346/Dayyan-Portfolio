import type { FrameworkLogoId } from '../../data';
import type { SimpleIcon } from 'simple-icons';
import {
  siDocker,
  siFastapi,
  siNodedotjs,
  siNuxt,
  siPostgresql,
  siPython,
  siPytorch,
  siReact,
  siTensorflow,
  siTypescript,
  siVuedotjs
} from 'simple-icons';

type FrameworkLogoProps = {
  id: FrameworkLogoId;
  size?: number;
  className?: string;
};

const iconById: Partial<Record<FrameworkLogoId, SimpleIcon>> = {
  docker: siDocker,
  fastapi: siFastapi,
  node: siNodedotjs,
  nuxt: siNuxt,
  postgresql: siPostgresql,
  python: siPython,
  pytorch: siPytorch,
  react: siReact,
  tensorflow: siTensorflow,
  typescript: siTypescript,
  vue: siVuedotjs
};

const fallbackLabelById: Record<FrameworkLogoId, string> = {
  aws: 'AWS',
  azure: 'Az',
  docker: 'Dk',
  fastapi: 'Fa',
  node: 'Nd',
  nuxt: 'Nx',
  playwright: 'Pw',
  postgresql: 'Pg',
  python: 'Py',
  pytorch: 'Pt',
  react: 'Re',
  tensorflow: 'Tf',
  typescript: 'Ts',
  vue: 'Vu'
};

export function FrameworkLogo({
  id,
  size = 18,
  className = ''
}: FrameworkLogoProps) {
  const icon = iconById[id];

  if (!icon) {
    return (
      <span
        className={`framework-logo framework-logo-fallback ${className}`.trim()}
        aria-hidden
      >
        <span>{fallbackLabelById[id]}</span>
      </span>
    );
  }

  return (
    <span className={`framework-logo ${className}`.trim()} aria-hidden>
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        role="img"
        aria-label={icon.title}
      >
        <path d={icon.path} fill={`#${icon.hex}`} />
      </svg>
    </span>
  );
}
