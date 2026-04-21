import { useEffect, useMemo, useState } from 'react';

type StatsBundle = {
  totalSolved: string;
  acceptanceRate: string;
  activeDays: string;
  practiceStreak: string;
  easySolved: string;
  mediumSolved: string;
  hardSolved: string;
};

const FALLBACK_STATS: StatsBundle = {
  totalSolved: '163',
  acceptanceRate: '68.3%',
  activeDays: '65',
  practiceStreak: '12 days',
  easySolved: '62',
  mediumSolved: '89',
  hardSolved: '12'
};

const CACHE_KEY = 'dayyan.leetcode.stats.v2';
const CACHE_TTL = 1000 * 60 * 60 * 6;

const SUMMARY_STATS: { id: keyof StatsBundle; label: string; detail: string }[] = [
  { id: 'totalSolved', label: 'Problems solved', detail: 'Across easy / medium / hard, refreshed daily.' },
  { id: 'activeDays', label: 'Active days', detail: 'Total days I pushed a solve this past year.' },
  { id: 'practiceStreak', label: 'Current streak', detail: 'Back-to-back days I’ve been in the grind.' },
  { id: 'acceptanceRate', label: 'Acceptance rate', detail: 'Raw accepted submissions over total attempts.' }
];

const DIFFICULTY_STATS: { id: keyof StatsBundle; label: string; detail: string }[] = [
  { id: 'easySolved', label: 'Easy', detail: 'Warm-ups and foundational patterns.' },
  { id: 'mediumSolved', label: 'Medium', detail: 'The real interview-prep bulk.' },
  { id: 'hardSolved', label: 'Hard', detail: 'Graph, DP, and system-scale puzzles.' }
];

type StatsPayload = {
  totalSolved: number | null;
  easySolved: number | null;
  mediumSolved: number | null;
  hardSolved: number | null;
  acceptanceRate: string | null;
  streak: number | null;
  totalActiveDays: number | null;
  updatedAt: string;
};

const toStatsBundle = (payload: StatsPayload): StatsBundle => ({
  totalSolved: payload.totalSolved != null ? String(payload.totalSolved) : FALLBACK_STATS.totalSolved,
  acceptanceRate: payload.acceptanceRate ?? FALLBACK_STATS.acceptanceRate,
  activeDays: payload.totalActiveDays != null ? String(payload.totalActiveDays) : FALLBACK_STATS.activeDays,
  practiceStreak: payload.streak != null ? `${payload.streak} day${payload.streak === 1 ? '' : 's'}` : FALLBACK_STATS.practiceStreak,
  easySolved: payload.easySolved != null ? String(payload.easySolved) : FALLBACK_STATS.easySolved,
  mediumSolved: payload.mediumSolved != null ? String(payload.mediumSolved) : FALLBACK_STATS.mediumSolved,
  hardSolved: payload.hardSolved != null ? String(payload.hardSolved) : FALLBACK_STATS.hardSolved
});

const statsUrl = `${import.meta.env.BASE_URL}leetcode-stats.json`;


export function LeetCodeStatsWidget({ recruiterSignalCount, highlight }: { recruiterSignalCount: number; highlight: string }) {
  const [stats, setStats] = useState<StatsBundle>(FALLBACK_STATS);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let isActive = true;
    const cached = window.localStorage.getItem(CACHE_KEY);

    if (cached) {
      try {
        const parsed = JSON.parse(cached) as { fetchedAt: string; stats: StatsBundle };
        if (parsed.fetchedAt && parsed.stats) {
          const age = Date.now() - new Date(parsed.fetchedAt).getTime();
          if (age < CACHE_TTL) {
            setStats(parsed.stats);
            setLastSync(parsed.fetchedAt);
            setStatus('ready');
          }
        }
      } catch {
        // cache is disposable
      }
    }

    const controller = new AbortController();

    const syncStats = async () => {
      setStatus('loading');
      try {
        const response = await fetch(statsUrl, { signal: controller.signal, cache: 'no-cache' });
        if (!response.ok) throw new Error(`Stats file ${response.status}`);
        const payload = (await response.json()) as StatsPayload;
        const normalized = toStatsBundle(payload);
        const fetchedAt = payload.updatedAt ?? new Date().toISOString();
        window.localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt, stats: normalized }));
        if (!isActive) return;
        setStats(normalized);
        setLastSync(fetchedAt);
        setStatus('ready');
      } catch (error) {
        if (!isActive || controller.signal.aborted) return;
        console.warn('LeetCode stats sync failed', error);
        setStatus('error');
      }
    };

    syncStats();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  const statusLabel = useMemo(() => {
    if (status === 'loading') return 'Loading LeetCode stats…';
    if (status === 'ready') return 'Practice telemetry live';
    if (status === 'error') return 'Offline · showing cached stats';
    return 'Awaiting sync';
  }, [status]);

  const syncLabel = useMemo(() => {
    if (lastSync) {
      const date = new Date(lastSync);
      return `Synced ${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
    }
    return 'No sync yet';
  }, [lastSync]);

  return (
    <section className="win95-chrome-panel leetcode-stats-panel" data-testid="leetcode-stats-panel">
      <header className="chrome-panel-header">
        <div>
          <p className="muted">Practice lab</p>
          <h3>LeetCode stats</h3>
          <p className="chrome-panel-subtext">Systems-aligned problem solving backed by a story-driven cadence.</p>
        </div>
        <div className="chrome-panel-status">
          <span data-testid="leetcode-stats-status-label">{statusLabel}</span>
          <small data-testid="leetcode-stats-last-sync">{syncLabel}</small>
        </div>
      </header>
      <div className="leetcode-stats-grid" data-testid="leetcode-stats-summary-grid">
        {SUMMARY_STATS.map((entry) => (
          <article key={entry.id} data-testid={`leetcode-stat-${entry.id}`}>
            <strong>{stats[entry.id]}</strong>
            <p>{entry.label}</p>
            <small>{entry.detail}</small>
          </article>
        ))}
      </div>
      <div className="leetcode-stats-grid difficulty" data-testid="leetcode-stats-difficulty-grid">
        {DIFFICULTY_STATS.map((entry) => (
          <article key={entry.id} data-testid={`leetcode-stat-${entry.id}`}>
            <strong>{stats[entry.id]}</strong>
            <p>{entry.label}</p>
            <small>{entry.detail}</small>
          </article>
        ))}
      </div>
      <footer className="chrome-panel-footer" data-testid="leetcode-stats-recruiter-note">
        <strong>Recruiter signal {recruiterSignalCount} aligned</strong>
        <p>{highlight}</p>
      </footer>
    </section>
  );
}
