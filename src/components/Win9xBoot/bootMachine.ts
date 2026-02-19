/**
 * Boot flow state for the Win9x file-transfer style dialog.
 * Pure state transitions; no side effects.
 */

export type BootPhase =
  | 'idle'      // dialog visible, not started
  | 'transferring'  // progress bar advancing
  | 'cancelling'    // user clicked Cancel; show "Cancelling..." then resume or complete
  | 'completed';    // progress 100%, Open enabled

export type BootState = {
  phase: BootPhase;
  progress: number;       // 0..1
  closeWhenComplete: boolean;
  /** Simulated KB/s for display */
  rateKbs: number;
  /** Simulated seconds remaining */
  etaSeconds: number;
};

export const initialBootState: BootState = {
  phase: 'transferring',
  progress: 0,
  closeWhenComplete: false,
  rateKbs: 0,
  etaSeconds: 0,
};

/** Duration in ms for the full "download" (configurable 6–10s). */
export const BOOT_DURATION_MS = 8000;

/** Compute simulated rate (KB/s) and ETA from progress. */
export function simulateTransfer(progress: number): { rateKbs: number; etaSeconds: number } {
  const p = Math.max(0, Math.min(1, progress));
  const rateKbs = Math.round(120 + p * 180 + (Math.sin(p * Math.PI) * 40));
  const remaining = 1 - p;
  const etaSeconds = remaining <= 0 ? 0 : Math.max(1, Math.round((remaining * BOOT_DURATION_MS) / 1000));
  return { rateKbs, etaSeconds };
}

export function tickBootState(
  state: BootState,
  deltaProgress: number,
  nowPhase?: BootPhase
): BootState {
  const phase = nowPhase ?? state.phase;
  if (phase === 'cancelling') {
    return { ...state, phase: 'cancelling' };
  }
  if (phase === 'completed') {
    return {
      ...state,
      phase: 'completed',
      progress: 1,
      rateKbs: 0,
      etaSeconds: 0,
    };
  }
  const progress = Math.min(1, state.progress + deltaProgress);
  const { rateKbs, etaSeconds } = simulateTransfer(progress);
  const nextPhase: BootPhase = progress >= 1 ? 'completed' : 'transferring';
  return {
    ...state,
    phase: nextPhase,
    progress,
    rateKbs,
    etaSeconds,
  };
}
