import { type Credential } from './win95Types';

export type LoginProps = {
  animating: boolean;
  onLogin: () => void;
  reducedMotion: boolean;
  credentials: Credential[];
  searchUrl: string;
  dataStatus: string;
};

const iconTiles = [
  { label: 'Calculator', emoji: '🧮', tone: 'Calc' },
  { label: 'Notepad', emoji: '📓', tone: 'Notes' },
  { label: 'Inbox', emoji: '📧', tone: 'Mail' },
  { label: 'Signal', emoji: '📡', tone: 'Missive' },
  { label: 'Terminal', emoji: '🖥️', tone: 'Shell' },
  { label: 'Graphs', emoji: '📊', tone: 'Repo' }
];

export function Win95Login({ animating, onLogin, reducedMotion, credentials, searchUrl, dataStatus }: LoginProps) {
  return (
    <div
      className={`win95-login-overlay${animating ? ' animating' : ''}${reducedMotion ? ' reduced-motion' : ''}`}
      data-testid="login-overlay"
    >
      <div className="win95-login-horizon" aria-hidden="true">
        <span className="win95-hill primary" />
        <span className="win95-hill secondary" />
        <span className="win95-cloud" />
      </div>
      <div className="win95-login-card" role="dialog" aria-modal="true" aria-label="Windows 95 log on" data-testid="login-dialog">
        <header>
          <span className="win95-logo">⌂</span>
          <div>
            <p className="muted">Windows 95 · Dayyan.OS Edition</p>
            <h1>Log on</h1>
          </div>
        </header>
        <section className="credential-panel">
          {credentials.map((cred) => (
            <article key={cred.label}>
              <p>{cred.label}</p>
              <strong>{cred.value}</strong>
              {cred.hint && <small>{cred.hint}</small>}
            </article>
          ))}
        </section>
        <IconGrid />
        <div className="win95-login-status" aria-live="polite">
          <p className="login-data-status">{dataStatus}</p>
          <p className="login-contrib-note">Secure contributions telemetry is primed—tokens minted for the incoming shell.</p>
        </div>
        <a className="win95-login-search" href={searchUrl} target="_blank" rel="noreferrer">
          🔍 Search with SearX
        </a>
        <button type="button" onClick={onLogin} disabled={animating} data-testid="login-button">
          {animating ? 'Logging on…' : 'Press to log on'}
        </button>
        <p className="login-hint">Animated login in motion—watch Dayyan boot into the shell.</p>
      </div>
    </div>
  );
}

function IconGrid() {
  return (
    <div className="win95-icon-grid" aria-label="Win95 program icons">
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
