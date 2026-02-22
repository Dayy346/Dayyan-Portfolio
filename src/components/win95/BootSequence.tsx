import { useEffect, useMemo, useState, type CSSProperties } from 'react';
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
      aria-label="Portfolio boot sequence"
      data-testid="boot-sequence-dialog"
      data-stage-id={stage.id}
      data-stage-index={stageIndex}
      data-stage-count={stageCount}
      style={accentStyle}
    >
      <div className="win95-boot-noise" aria-hidden="true" />
      <div className="win95-boot-hw" aria-hidden="true">
        <span className="win95-boot-logo">⊞</span>
        <p>Windows 95 · Portfolio shell</p>
      </div>
      <div className="win95-boot-body">
        <div className="win95-loading-hud" data-testid="boot-stage-header">
          <div className="boot-stage-title" data-testid="boot-stage-title">
            <p>Stage {stageIndex + 1} / {stageCount} · {stage.title}</p>
            <span className="boot-stage-percent">{Math.round(stagePercent * 100)}%</span>
            <small data-testid="boot-stage-subtitle">{stage.subtitle}</small>
          </div>
          <div
            className="win95-loading-bar"
            role="progressbar"
            aria-live="polite"
            aria-label="Boot progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
          >
            <span className="win95-loading-fill" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
          <p className="win95-loading-caption">{stageMetric}</p>
          <small className="win95-loading-note">Short, cinematic arc · narrative intact.</small>
        </div>
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
        <div className="win95-boot-actions" data-testid="boot-actions">
          <button type="button" onClick={onSkip} data-testid="boot-skip-button" aria-describedby={skipHintId}>
            {reducedMotion ? 'Continue' : 'Skip boot story'}
          </button>
          <div className="win95-toolstrip-hint" id={skipHintId}>
            <span>Press S · Esc · Enter · Space</span>
            <span>{nextStage ? `Next: ${nextStage.title}` : 'Desktop ready · login will appear soon.'}</span>
          </div>
        </div>
        <FileTransferDialog
          accent={stage.accent}
          progress={progress}
          reducedMotion={reducedMotion}
          stageIndex={stageIndex}
          stageTitle={stage.title}
          stageMetric={stageMetric}
        />
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

const transferQueue = [
  { name: 'SignalKernel.sys', size: '612 KB', type: 'system kernel call', stage: 'bios' },
  { name: 'HeroSignal.git', size: '1.1 GB', type: 'signal overlay', stage: 'kernel' },
  { name: 'RecruiterSignal.dat', size: '412 KB', type: 'insights bundle', stage: 'atmosphere' },
  { name: 'DesktopPalette.bin', size: '2.2 MB', type: 'gradient matrix', stage: 'story' }
] as const;

const transferFields = [
  { label: 'Source', value: 'A:\\Research\\Payload\\', helper: 'Encrypted research vault' },
  { label: 'Destination', value: 'C:\\Portfolio\\Boot\\Payload\\', helper: 'Local shell' }
];

type FileTransferDialogProps = {
  progress: number;
  accent: string;
  stageIndex: number;
  stageTitle: string;
  reducedMotion: boolean;
  stageMetric: string;
};

function FileTransferDialog({
  progress,
  accent,
  stageIndex,
  stageTitle,
  reducedMotion,
  stageMetric
}: FileTransferDialogProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const percentage = useMemo(() => Math.min(100, Math.round(progress * 100)), [progress]);
  const activeFileIndex = useMemo(
    () => Math.min(transferQueue.length - 1, Math.floor(progress * transferQueue.length)),
    [progress]
  );
  const activeFile = transferQueue[activeFileIndex];
  const baseSpeed = 160 + stageIndex * 12;
  const speedValue = isPaused ? '0 KB/s' : `${baseSpeed + (percentage % 36)} KB/s`;
  const eta = Math.max(1, Math.round((100 - percentage) / (percentage > 0 ? Math.max(1, percentage / 20) : 1)));
  const statusCopy = isPaused ? 'Transfer paused · awaiting resume command' : `Transferring ${activeFile.name}`;
  const logLines = useMemo(() => {
    return [
      `Preparing ${activeFile.name}`,
      `${Math.round(progress * 100)}% of ${activeFile.size}`,
      `${speedValue} · ${stageMetric}`,
      isPaused ? 'Paused for verification' : 'Stream encrypted · chunk verified'
    ];
  }, [activeFile, progress, speedValue, stageMetric, isPaused]);

  const handlePauseToggle = () => setIsPaused((prev) => !prev);
  const handleCancel = () => {
    setIsPaused(true);
    setShowLog(true);
  };

  return (
    <section
      className="win95-transfer-dialog"
      data-testid="file-transfer-dialog"
      aria-live="polite"
      style={{ '--transfer-accent': accent } as CSSProperties}
    >
      <header className="transfer-header">
        <div>
          <p data-testid="file-transfer-title">File transfer · Stage {stageIndex + 1}</p>
          <strong>{stageTitle}</strong>
        </div>
        <span className="transfer-status" data-testid="file-transfer-status">
          {statusCopy}
        </span>
      </header>
      <div className="transfer-grid">
        <div className="transfer-fields">
          {transferFields.map((field) => (
            <label key={field.label}>
              <span>{field.label}</span>
              <input value={field.value} readOnly data-testid={`file-transfer-${field.label.toLowerCase()}`} spellCheck="false" />
              <small>{field.helper}</small>
            </label>
          ))}
        </div>
        <div
          className="transfer-progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percentage}
          data-testid="file-transfer-progress"
        >
          <div className="transfer-progress-fill" style={{ width: `${percentage}%` }} />
          <p>
            <span>{percentage}%</span>
            <span>{speedValue}</span>
          </p>
        </div>
        <div className="transfer-meta">
          <p className="meta-label">Current file</p>
          <p className="meta-file" data-testid="file-transfer-file">
            {activeFile.name}
          </p>
          <p className="meta-detail">{activeFile.type} · est. {eta}s remaining</p>
        </div>
      </div>
      <div className="transfer-files" aria-label="Transfer queue" data-testid="file-transfer-queue">
        {transferQueue.map((file, index) => (
          <article key={file.name} className={`transfer-row ${index === activeFileIndex ? 'active' : ''}`}>
            <span>{file.name}</span>
            <small>{file.size}</small>
          </article>
        ))}
      </div>
      <div className="transfer-actions">
        <button type="button" onClick={handlePauseToggle} data-testid="file-transfer-toggle">
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button type="button" onClick={() => setShowLog((prev) => !prev)} data-testid="file-transfer-log-toggle">
          {showLog ? 'Hide log' : 'View log'}
        </button>
        <button type="button" onClick={handleCancel} data-testid="file-transfer-cancel">
          Cancel
        </button>
      </div>
      {showLog && (
        <div className="transfer-log" data-testid="file-transfer-log">
          <p className="log-caption">Transfer log</p>
          <ul>
            {logLines.map((line) => (
              <li key={`${line}-${activeFile.name}`}>{line}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="transfer-note" data-testid="file-transfer-note">
        {reducedMotion ? 'Static progress for reduced motion' : 'Frame-accurate progress synchronized with boot telemetry.'}
      </p>
    </section>
  );
}
