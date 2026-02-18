import { useEffect, type CSSProperties } from 'react';
import { bootStages, type BootStage, type ResearchNote } from '../../data';

export type BootSequenceProps = {
  stage: BootStage;
  stageIndex: number;
  stageCount: number;
  visibleLines: string[];
  progress: number;
  transitioning: boolean;
  onSkip: () => void;
  reducedMotion: boolean;
  stageMetric: string;
  researchNotes: ResearchNote[];
};

export function BootSequence({
  stage,
  stageIndex,
  stageCount,
  visibleLines,
  progress,
  transitioning,
  onSkip,
  reducedMotion,
  stageMetric,
  researchNotes
}: BootSequenceProps) {
  const stagePercent = stage.lines.length ? Math.min(1, visibleLines.length / stage.lines.length) : 1;
  const activeLineIndex = Math.max(0, visibleLines.length - 1);
  const upcomingLines = stage.lines.slice(visibleLines.length, visibleLines.length + 3);
  const accentStyle = { '--stage-accent': stage.accent } as CSSProperties;
  const researchHighlights = researchNotes.slice(0, 3);
  const nextStage = bootStages[stageIndex + 1];
  const skipHintId = 'boot-skip-hint';

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
      className={`win95-boot boot-sequence ${transitioning ? 'fade' : ''} ${reducedMotion ? 'reduced-motion' : ''}`}
      role="dialog"
      aria-live="polite"
      aria-modal="true"
      aria-label="Dayyan OS boot sequence"
      data-testid="boot-sequence-dialog"
      data-stage-id={stage.id}
      data-stage-index={stageIndex}
      data-stage-count={stageCount}
      style={accentStyle}
    >
      <div className="win95-boot-noise" aria-hidden="true" />
      <div className="win95-boot-hw" aria-hidden="true">
        <span className="win95-boot-logo">⊞</span>
        <p>Windows 95 · Dayyan.OS shell</p>
      </div>
      <div className="win95-boot-body">
        <header className="boot-sequence-header" data-testid="boot-stage-header">
          <div className="boot-stage-title" data-testid="boot-stage-title">
            <p>Stage {stageIndex + 1} / {stageCount} · {stage.title}</p>
            <small data-testid="boot-stage-subtitle">{stage.subtitle}</small>
          </div>
          <div className="boot-stage-progress" aria-live="polite" data-testid="boot-stage-progress">
            <span className="boot-stage-percent">{Math.round(stagePercent * 100)}%</span>
            <div className="progress-track" aria-hidden="true">
              <div className="progress-fill" style={{ width: `${Math.round(stagePercent * 100)}%` }} />
            </div>
          </div>
        </header>
        <section className="win95-boot-console" role="log" aria-label="Boot console" data-testid="boot-console">
          {visibleLines.map((line, idx) => (
            <p key={`${line}-${idx}`} className={idx === activeLineIndex ? 'active' : ''} data-testid={`boot-line-${idx}`}>
              <span>{line}</span>
            </p>
          ))}
          <p className="console-metric" data-testid="boot-stage-metric-line">{stageMetric}</p>
        </section>
        {upcomingLines.length > 0 && (
          <section className="win95-boot-upcoming" aria-live="off" data-testid="boot-upcoming">
            <p>Up next</p>
            <ul>
              {upcomingLines.map((line, idx) => (
                <li key={`${line}-up-${idx}`}>{line}</li>
              ))}
            </ul>
          </section>
        )}
        <section className="win95-boot-metadata" aria-live="polite" data-testid="boot-metadata">
          <div className="win95-boot-metric">
            <p className="metric-label" data-testid="boot-metric-label">{stage.metricLabel}</p>
            <strong data-testid="boot-metric-value">{stageMetric}</strong>
            <small data-testid="boot-metric-subtitle">{stage.subtitle}</small>
          </div>
          <div className="win95-boot-narrative" data-testid="boot-narrative">
            <p>{stage.narrative}</p>
            <span>{stage.pulse}</span>
            {nextStage && (
              <small className="next-stage" data-testid="boot-next-stage">Next: {nextStage.title}</small>
            )}
          </div>
        </section>
        <div className="win95-boot-progress" data-testid="boot-progress">
          <div className="progress-track" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
          <div className="progress-meta">
            <p>Boot progress</p>
            <small>{stage.pulse}</small>
          </div>
        </div>
        <div className="win95-boot-actions" data-testid="boot-actions">
          <button type="button" onClick={onSkip} data-testid="boot-skip-button" aria-describedby={skipHintId}>
            {reducedMotion ? 'Continue' : 'Skip boot story'}
          </button>
          <div className="boot-skip-hints" id={skipHintId}>
            <p>Press S, Esc, Enter, or Space to skip · Last stage: {stage.title}</p>
            <p>{nextStage ? `Next: ${nextStage.title}` : 'Desktop ready · login will appear soon.'}</p>
          </div>
        </div>
      </div>
      <aside className="win95-boot-sidebar" aria-label="Boot telemetry" data-testid="boot-sidebar">
        <p>Stage telemetry</p>
        <div className="sidebar-pills" role="list" data-testid="boot-stage-timeline">
          {bootStages.map((item, idx) => {
            const status = idx < stageIndex ? 'complete' : idx === stageIndex ? 'active' : 'pending';
            return (
              <span
                key={item.id}
                className={`sidebar-pill ${status}`}
                style={{ borderColor: item.accent, background: status === 'complete' ? item.accent : 'transparent' }}
                aria-label={`${item.title} stage ${idx + 1} ${status}`}
                title={`${item.title} · ${status}`}
                data-stage-id={item.id}
                data-stage-index={idx}
                data-stage-status={status}
                data-testid={`boot-stage-pill-${item.id}`}
              />
            );
          })}
        </div>
        <p className="sidebar-status" data-testid="boot-stage-status">
          {stage.title} · {stage.subtitle}
        </p>
        <div className="sidebar-metric" data-testid="boot-sidebar-metric">
          <p>{stage.metricLabel}</p>
          <strong>{stage.metricValue}</strong>
        </div>
        <section className="sidebar-research" aria-label="Research signals" data-testid="boot-research">
          <p className="sidebar-research-title">Research signals</p>
          <div className="sidebar-research-grid">
            {researchHighlights.map((note) => (
              <article key={note.title}>
                <p className="sidebar-research-note">{note.title}</p>
                <p>{note.detail}</p>
                <small>{note.source}</small>
              </article>
            ))}
          </div>
          {researchNotes.length > researchHighlights.length && (
            <p className="sidebar-research-more">+{researchNotes.length - researchHighlights.length} more insights queued</p>
          )}
        </section>
      </aside>
    </div>
  );
}
