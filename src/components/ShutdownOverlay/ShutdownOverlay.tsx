import { useEffect, useState } from 'react';

type Phase = 'shutting' | 'off';

export function ShutdownOverlay({ onRestart }: { onRestart: () => void }) {
  const [phase, setPhase] = useState<Phase>('shutting');

  useEffect(() => {
    const timer = window.setTimeout(() => setPhase('off'), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== 'off') return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'Escape') {
        event.preventDefault();
        onRestart();
      }
    };

    window.addEventListener('keydown', handleKey);

    return () => window.removeEventListener('keydown', handleKey);
  }, [phase, onRestart]);

  if (phase === 'shutting') {
    return (
      <div
        className="shutdown-overlay shutdown-overlay-xp"
        role="alert"
        aria-live="polite"
        data-testid="shutdown-overlay-shutting"
      >
        <div className="shutdown-logo" aria-hidden="true">
          <span className="shutdown-logo-pane shutdown-logo-pane-red" />
          <span className="shutdown-logo-pane shutdown-logo-pane-green" />
          <span className="shutdown-logo-pane shutdown-logo-pane-blue" />
          <span className="shutdown-logo-pane shutdown-logo-pane-yellow" />
        </div>

        <h2 className="shutdown-heading">Please wait while Dayyan.OS shuts down&hellip;</h2>

        <div className="shutdown-progress" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  return (
    <div
      className="shutdown-overlay shutdown-overlay-off"
      role="alert"
      aria-live="polite"
      data-testid="shutdown-overlay-off"
    >
      <p className="shutdown-safe-text">It&apos;s now safe to turn off your computer.</p>

      <button
        type="button"
        className="shutdown-restart-btn"
        onClick={onRestart}
        data-testid="shutdown-restart"
        autoFocus
      >
        Restart
      </button>
    </div>
  );
}
