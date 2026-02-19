import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BOOT_DURATION_MS,
  initialBootState,
  tickBootState,
  type BootState,
} from './bootMachine';

const FROM_VALUE = 'A:\\Dayyan Research\\Payload\\';
const TO_VALUE = 'C:\\DayyanOS\\Desktop\\';
const FILE_LABEL = 'Saving: ';
const FILE_NAME = 'Portfolio.dat';

export type Win9xBootDialogProps = {
  /** Total duration in ms for the simulated transfer (6–10s). */
  durationMs?: number;
  /** Called when user clicks Open after completion (or auto-close). */
  onComplete: () => void;
  /** Optional: reduced motion skips animation and completes quickly. */
  reducedMotion?: boolean;
  /** Optional: called once when boot screen appears (e.g. play boot chime). */
  onBootStart?: () => void;
};

export function Win9xBootDialog({
  durationMs = BOOT_DURATION_MS,
  onComplete,
  reducedMotion = false,
  onBootStart,
}: Win9xBootDialogProps) {
  useEffect(() => {
    if (!reducedMotion) onBootStart?.();
  }, [reducedMotion, onBootStart]);

  const [state, setState] = useState<BootState>(() => ({
    ...initialBootState,
    phase: reducedMotion ? 'completed' : 'transferring',
    progress: reducedMotion ? 1 : 0,
  }));
  const [explorerOpen, setExplorerOpen] = useState(false);
  const cancelResumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastProgressRef = useRef<number>(state.progress);

  const advanceProgress = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const targetProgress = Math.min(1, elapsed / durationMs);
    const delta = targetProgress - lastProgressRef.current;
    if (delta <= 0) return;
    lastProgressRef.current = targetProgress;
    setState((prev) => {
      const next = tickBootState(prev, delta);
      if (next.phase === 'completed' && prev.closeWhenComplete) {
        queueMicrotask(() => onComplete());
      }
      return next;
    });
  }, [durationMs, onComplete]);

  useEffect(() => {
    if (reducedMotion) {
      setState((prev) => ({ ...prev, phase: 'completed', progress: 1, rateKbs: 0, etaSeconds: 0 }));
      return;
    }
    startTimeRef.current = Date.now();
    lastProgressRef.current = 0;

    const tick = () => {
      advanceProgress();
      if (lastProgressRef.current >= 1) return;
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current != null) cancelAnimationFrame(animRef.current);
    };
  }, [reducedMotion, advanceProgress]);

  useEffect(() => {
    if (state.phase !== 'cancelling') return;
    cancelResumeRef.current = window.setTimeout(() => {
      setState((prev) => tickBootState(prev, 0.4, 'transferring'));
      cancelResumeRef.current = null;
    }, 1200);
    return () => {
      if (cancelResumeRef.current) clearTimeout(cancelResumeRef.current);
    };
  }, [state.phase]);

  const handleOpen = () => {
    if (state.phase !== 'completed') return;
    onComplete();
  };

  const handleOpenFolder = () => {
    setExplorerOpen(true);
    setTimeout(() => setExplorerOpen(false), 4000);
  };

  const handleCancel = () => {
    if (state.phase === 'completed') return;
    if (state.phase === 'cancelling') return;
    setState((prev) => ({ ...prev, phase: 'cancelling' }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, closeWhenComplete: e.target.checked }));
  };

  const progressPercent = Math.round(state.progress * 100);
  const isCompleted = state.phase === 'completed';
  const isCancelling = state.phase === 'cancelling';

  return (
    <>
      <div
        className="win9x-boot-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="File transfer"
        data-testid="boot-dialog"
      >
        <div className="win9x-boot-wrapper">
          <div
            className={`win9x-boot-dialog ${isCancelling ? 'cancelling' : ''}`}
            aria-live="polite"
          >
            <header className="win9x-boot-titlebar">
              <span className="title-text">Copying files...</span>
              <button type="button" className="win9x-titlebar-close" aria-label="Close" tabIndex={-1}>✕</button>
            </header>
            <div className="win9x-boot-body">
              <div className={`win9x-folders-transfer ${reducedMotion ? 'reduced-motion' : ''}`} aria-hidden="true">
                <div className="win9x-folder win9x-folder-source" aria-hidden="true">
                  <svg viewBox="0 0 32 28" className="win9x-folder-svg"><path fill="#ffc726" stroke="#000" strokeWidth="0.8" d="M2 4h12l4 4h12v16H2z"/></svg>
                </div>
                <div className="win9x-flying-docs">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="win9x-flying-doc" style={{ animationDelay: `${i * 0.5}s` }} />
                  ))}
                </div>
                <div className="win9x-folder win9x-folder-dest" aria-hidden="true">
                  <svg viewBox="0 0 32 28" className="win9x-folder-svg"><path fill="#ffc726" stroke="#000" strokeWidth="0.8" d="M2 4h12l4 4h12v16H2z"/></svg>
                </div>
              </div>
              <p className="win9x-boot-progress-label">{FILE_LABEL}{FILE_NAME}</p>
              <div className="win9x-boot-progress-row">
                <div
                  className="win9x-boot-progress-track"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progressPercent}
                  aria-label="Transfer progress"
                  data-testid="boot-progress"
                >
                  <div className="win9x-boot-progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>
                <button
                  type="button"
                  className="win9x-btn win9x-cancel-btn"
                  disabled={isCompleted || isCancelling}
                  onClick={handleCancel}
                  data-testid="boot-cancel"
                  aria-label="Cancel"
                >
                  Cancel
                </button>
              </div>
            <div className="win9x-boot-fields">
              <div className="win9x-boot-field">
                <label htmlFor="boot-from">From:</label>
                <input
                  id="boot-from"
                  type="text"
                  readOnly
                  value={FROM_VALUE}
                  aria-label="From"
                  data-testid="boot-from"
                />
              </div>
              <div className="win9x-boot-field">
                <label htmlFor="boot-to">To:</label>
                <input
                  id="boot-to"
                  type="text"
                  readOnly
                  value={TO_VALUE}
                  aria-label="To"
                  data-testid="boot-to"
                />
              </div>
            </div>

            <div className="win9x-boot-stats">
              <span>
                {isCancelling ? 'Cancelling…' : `${state.rateKbs} KB/s`}
              </span>
              <span>
                {isCancelling ? '—' : `Est. ${state.etaSeconds} sec remaining`}
              </span>
              <span className="simulated-note">(simulated)</span>
            </div>

            <div className="win9x-boot-checkbox-wrap">
              <input
                type="checkbox"
                id="boot-close-when-complete"
                className="win9x-boot-checkbox"
                checked={state.closeWhenComplete}
                onChange={handleCheckboxChange}
                aria-label="Close this dialog when download completes"
                data-testid="boot-checkbox"
              />
              <label htmlFor="boot-close-when-complete">
                Close this dialog when download completes
              </label>
            </div>

            <div className="win9x-boot-actions">
              <button
                type="button"
                className="win9x-btn"
                disabled={!isCompleted}
                onClick={handleOpen}
                data-testid="boot-open"
                aria-label="Open when transfer is complete"
              >
                Open
              </button>
              <button
                type="button"
                className="win9x-btn"
                onClick={handleOpenFolder}
                data-testid="boot-open-folder"
                aria-label="Open folder preview"
              >
                Open Folder
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>

      {explorerOpen && (
        <div
          className="win9x-explorer-preview"
          role="dialog"
          aria-label="Folder preview"
          data-testid="boot-explorer-preview"
        >
          <header className="win9x-explorer-titlebar">
            C:\DayyanOS\Desktop
          </header>
          <div className="win9x-explorer-body">
            <ul>
              <li><span className="icon">📁</span> About.me</li>
              <li><span className="icon">📄</span> Resume.pdf</li>
              <li><span className="icon">🗂️</span> Projects.dir</li>
              <li><span className="icon">📈</span> Contributions.log</li>
              <li><span className="icon">🧩</span> LeetCode.trn</li>
              <li><span className="icon">📡</span> Contact.net</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
