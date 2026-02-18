import { useEffect } from 'react';
import { type Credential } from './win95Types';

export type LoginProps = {
  animating: boolean;
  onLogin: () => void;
  reducedMotion: boolean;
  credentials: Credential[];
  searchUrl: string;
  dataStatus: string;
  recruiterScore: number;
  signalRefresh: number;
};

const iconTiles = [
  { label: 'Calculator', emoji: '🧮', tone: 'Calc' },
  { label: 'Notepad', emoji: '📓', tone: 'Notes' },
  { label: 'Inbox', emoji: '📧', tone: 'Mail' },
  { label: 'Signal', emoji: '📡', tone: 'Missive' },
  { label: 'Terminal', emoji: '🖥️', tone: 'Shell' },
  { label: 'Graphs', emoji: '📊', tone: 'Repo' }
];

export function Win95Login({
  animating,
  onLogin,
  reducedMotion,
  credentials,
  searchUrl,
  dataStatus,
  recruiterScore,
  signalRefresh
}: LoginProps) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !animating) {
        event.preventDefault();
        onLogin();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [animating, onLogin]);

  return (
    <div
      className={`win95-login-overlay${animating ? ' animating' : ''}${reducedMotion ? ' reduced-motion' : ''}`}
      data-testid="login-overlay"
    >
      <div className="win95-login-card" role="dialog" aria-modal="true" aria-label="Windows 95 log on" data-testid="login-dialog">
        <div className="win95-login-header">
          <div className="win95-avatar" aria-hidden="true">DH</div>
          <div>
            <p className="muted">Boot telemetry synced · Secure contributions ready</p>
            <h1>Dayyan.OS Log on</h1>
            <p className="muted">Recruiter signal online · cinematic arrival</p>
          </div>
        </div>
        <div className="win95-typing-grid">
          {credentials.map((cred) => (
            <div key={cred.label} className="typing-row">
              <p className="typing-label">{cred.label}</p>
              <div className="typing-field" role="textbox" aria-label={`${cred.label} input`}>
                <span>{cred.value}</span>
                <span className="typing-cursor" aria-hidden="true" />
              </div>
              {cred.hint && <small>{cred.hint}</small>}
            </div>
          ))}
        </div>
        <div className="win95-login-status" aria-live="polite">
          <p className="login-data-status" data-testid="login-data-status">{dataStatus}</p>
          <p className="login-contrib-note" data-testid="login-contrib-note">Secure contributions telemetry is primed—tokens minted for the incoming shell.</p>
        </div>
        <section className="recruiter-callout" data-testid="recruiter-callout">
          <p className="callout-title" data-testid="recruiter-callout-title">Recruiter Signal</p>
          <p className="callout-metric" data-testid="recruiter-callout-metric">Candidate score: {recruiterScore} · Signal refresh in {signalRefresh}s</p>
          <a className="callout-button" href="/assets/resume.pdf" target="_blank" rel="noreferrer" data-testid="view-resume-link">
            View Resume
          </a>
        </section>
        <div className="win95-login-actions">
          <button type="button" onClick={onLogin} disabled={animating} data-testid="login-button">
            {animating ? 'Logging on…' : 'Press Enter to log on'}
          </button>
          <span className="login-key-prompt">Press Enter or click to launch the desktop</span>
        </div>
        <div className="win95-login-icons" data-testid="login-icon-grid-wrapper">
          <IconGrid />
          <a className="win95-login-search" href={searchUrl} target="_blank" rel="noreferrer" data-testid="login-search-link">
            🔍 Search with SearX
          </a>
        </div>
        <p className="login-hint">Animated login in motion—watch Dayyan boot into the shell.</p>
      </div>
    </div>
  );
}

function IconGrid() {
  return (
    <div className="win95-icon-grid" aria-label="Win95 program icons" data-testid="login-icon-grid">
      {iconTiles.map((tile) => (
        <div key={tile.label} className="win95-icon-tile">
          <span aria-hidden="true">{tile.emoji}</span>
          <p>{tile.label}</p>
          <small>{tile.tone}</small>
        </div>
      ))}
    </div>
  );
}
