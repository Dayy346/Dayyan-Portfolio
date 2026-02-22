/**
 * Full-page Windows XP Luna–style login screen.
 * Replaces the desktop until the user logs in; click user account to go to desktop.
 */
import { useEffect, useRef, useState } from 'react';

const BASE = import.meta.env.BASE_URL;
const LOGIN_FADEOUT_MS = 280;

export type XPLoginScreenProps = {
  animating: boolean;
  onLogin: () => void;
  reducedMotion: boolean;
};

export function XPLoginScreen({ animating, onLogin, reducedMotion }: XPLoginScreenProps) {
  const [exiting, setExiting] = useState(false);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitingRef = useRef(false);
  exitingRef.current = exiting;

  const startExit = () => {
    if (reducedMotion) {
      onLogin();
      return;
    }
    setExiting(true);
    exitTimeoutRef.current = setTimeout(onLogin, LOGIN_FADEOUT_MS);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key !== 'Enter' && e.key !== ' ') || animating || exitingRef.current) return;
      e.preventDefault();
      startExit();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [animating, onLogin, reducedMotion]);

  useEffect(() => {
    return () => { if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current); };
  }, []);

  const handleLogin = () => {
    if (animating || exiting) return;
    startExit();
  };

  return (
    <div
      className={`xp-login-screen ${animating ? 'xp-login-screen--animating' : ''} ${exiting ? 'xp-login-screen--exiting' : ''} ${reducedMotion ? 'xp-login-screen--reduced-motion' : ''}`}
      data-testid="login-dialog"
      role="dialog"
      aria-modal="true"
      aria-label="Log on to Windows"
    >
      <header className="xp-login-topbar" aria-hidden="true" />
      <div className="xp-login-main">
        <div className="xp-login-left">
          <div className="xp-login-logo">
            <span className="xp-login-logo-windows">Windows</span>
            <span className="xp-login-logo-flag" aria-hidden="true">
              <span className="xp-login-flag-pane xp-login-flag-red" />
              <span className="xp-login-flag-pane xp-login-flag-green" />
              <span className="xp-login-flag-pane xp-login-flag-blue" />
              <span className="xp-login-flag-pane xp-login-flag-yellow" />
            </span>
            <span className="xp-login-logo-xp">XP</span>
          </div>
          <p className="xp-login-instruction">To begin, click your user name</p>
        </div>
        <div className="xp-login-divider" aria-hidden="true" />
        <div className="xp-login-right">
          <div className="xp-login-users">
            <button
              type="button"
              className="xp-login-user-tile"
              onClick={() => handleLogin()}
              disabled={animating || exiting}
              data-testid="login-button"
              aria-label="Log on as Dayyan Hamid"
            >
              <span className="xp-login-user-icon">
                <img src={`${BASE}assets/headshot.jpg`} alt="" />
              </span>
              <span className="xp-login-user-name">Dayyan Hamid</span>
            </button>
          </div>
        </div>
      </div>
      <footer className="xp-login-footer">
        <button
          type="button"
          className="xp-login-turn-off"
          aria-label="Turn off computer"
          onClick={(e) => e.preventDefault()}
        >
          <span className="xp-login-turn-off-icon" aria-hidden="true" />
          Turn off computer
        </button>
        <p className="xp-login-footer-hint">
          After you log on, the desktop will open. Double-click <strong>About Me</strong> to get started.
        </p>
      </footer>
    </div>
  );
}
