import { useEffect, type CSSProperties } from 'react';
import { bootStages, type BootStage } from '../../data';

export type Win95BootProps = {
  stage: BootStage;
  stageIndex: number;
  stageCount: number;
  visibleLines: string[];
  progress: number;
  transitioning: boolean;
  onSkip: () => void;
  reducedMotion: boolean;
};

export function Win95Boot({
  stage,
  stageIndex,
  stageCount,
  visibleLines,
  progress,
  transitioning,
  onSkip,
  reducedMotion
}: Win95BootProps) {
  const stagePercent = stage.lines.length ? Math.min(1, visibleLines.length / stage.lines.length) : 1;
  const activeLineIndex = Math.max(0, visibleLines.length - 1);
  const upcomingLines = stage.lines.slice(visibleLines.length, visibleLines.length + 3);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (['s', 'S', 'Escape', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        onSkip();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onSkip]);

  return (
    <div
      className={`win95-boot ${transitioning ? 'fade' : ''} ${reducedMotion ? 'reduced-motion' : ''}`}
      role="dialog"
      aria-live="polite"
      aria-label="Windows 95 boot"
    >
      <div className="win95-boot-hw" aria-hidden="true">
        <span className="win95-boot-logo">⊞</span>
        <p>Windows 95 · Dayyan.OS shell</p>
      </div>
      <div className="win95-boot-body">
        <header>
          <p className="stage-title">
            Stage {stageIndex + 1} / {stageCount} · {stage.title}
          </p>
          <strong style={{ color: stage.accent }}>{Math.round(stagePercent * 100)}% complete</strong>
        </header>
        <section className="win95-boot-console" role="log" aria-label="Boot console">
          {visibleLines.map((line, idx) => (
            <p key={`${line}-${idx}`} className={idx === activeLineIndex ? 'active' : ''}>
              <span>{line}</span>
            </p>
          ))}
        </section>
        {upcomingLines.length > 0 && (
          <section className="win95-boot-upcoming" aria-live="off">
            <p>Up next</p>
            <ul>
              {upcomingLines.map((line, idx) => (
                <li key={`${line}-up-${idx}`}>{line}</li>
              ))}
            </ul>
          </section>
        )}
        <div className="win95-boot-progress">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
          <div className="progress-meta">
            <p>{stage.subtitle}</p>
            <small>{stage.pulse}</small>
          </div>
        </div>
        <div className="win95-boot-actions">
          <button type="button" onClick={onSkip}>
            {reducedMotion ? 'Continue' : 'Skip boot script'}
          </button>
          <p>Press S, Esc, Enter, or Space to skip</p>
        </div>
      </div>
      <aside className="win95-boot-sidebar">
        <p>Stage telemetry</p>
        <div className="sidebar-pills">
          {bootStages.map((item, idx) => (
            <span
              key={item.id}
              className={`sidebar-pill ${idx <= stageIndex ? 'active' : ''}`}
              style={{ borderColor: item.accent, background: idx <= stageIndex ? item.accent : 'transparent' }}
            />
          ))}
        </div>
        <p className="sidebar-status">{stage.title} · {stage.subtitle}</p>
      </aside>
    </div>
  );
}
