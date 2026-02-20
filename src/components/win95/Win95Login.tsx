import { useEffect } from 'react';
import { type Credential } from './win95Types';

export type LoginProps = {
  animating: boolean;
  onLogin: () => void;
  reducedMotion: boolean;
  credentials: Credential[];
  dataStatus: string;
  recruiterScore: number;
  signalRefresh: number;
};

export function Win95Login({
  animating,
  onLogin,
  reducedMotion,
  credentials,
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
      className={`win9x-login-overlay ${animating ? 'animating' : ''} ${reducedMotion ? 'reduced-motion' : ''}`}
      data-testid="login-overlay"
    >
      <div className="win9x-login-dialog" role="dialog" aria-modal="true" aria-label="Log on" data-testid="login-dialog">
        <header className="win9x-login-titlebar">
          <span className="title-text">Log on</span>
        </header>
        <div className="win9x-login-body">
          <div className="win9x-typing-grid">
            {credentials.map((cred) => (
              <div key={cred.label} className="win9x-typing-row">
                <label>{cred.label}</label>
                <div className="win9x-typing-field" role="textbox" aria-label={`${cred.label} input`}>
                  <span>{cred.value}</span>
                  <span className="win9x-typing-cursor" aria-hidden="true" />
                </div>
                {cred.hint && <small>{cred.hint}</small>}
              </div>
            ))}
          </div>
          <p className="win9x-login-status" data-testid="login-data-status" aria-hidden="true">{dataStatus}</p>
          <p className="win9x-login-note" data-testid="login-contrib-note">Double-click <strong>About Me</strong> on the desktop to learn more.</p>
          <div className="win9x-login-links">
            <a className="win9x-login-btn-link" href={`${import.meta.env.BASE_URL}assets/resume.pdf`} target="_blank" rel="noreferrer" data-testid="view-resume-link">
              View Resume
            </a>
          </div>
          <div className="win9x-login-actions">
            <button type="button" className="win9x-btn" onClick={onLogin} disabled={animating} data-testid="login-button">
              {animating ? 'Logging on…' : 'OK'}
            </button>
          </div>
          <p className="win9x-login-hint" aria-hidden="true">Press Enter to log on.</p>
        </div>
      </div>
    </div>
  );
}
