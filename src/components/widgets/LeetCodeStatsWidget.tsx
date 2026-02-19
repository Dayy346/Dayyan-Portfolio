import { useEffect, useMemo, useState } from 'react';

type StatsBundle = {
  totalSolved: string;
  acceptanceRate: string;
  rating: string;
  practiceStreak: string;
  easySolved: string;
  mediumSolved: string;
  hardSolved: string;
};

const FALLBACK_STATS: StatsBundle = {
  totalSolved: '245+',
  acceptanceRate: '72%',
  rating: '2100 (self-calibrated)',
  practiceStreak: '25+ months',
  easySolved: '110',
  mediumSolved: '85',
  hardSolved: '52'
};

const CACHE_KEY = 'dayyan.leetcode.stats';
const CACHE_TTL = 1000 * 60 * 45; // 45 minutes

const SUMMARY_STATS: { id: keyof StatsBundle; label: string; detail: string }[] = [
  { id: 'totalSolved', label: 'Problems solved', detail: 'Tracked since late 2023 across algorithms and systems.' },
  { id: 'rating', label: 'LeetCode rating', detail: 'Recruiter-ready 2k+ tier that reflects steady craft.' },
  { id: 'practiceStreak', label: 'Practice streak', detail: 'Spaced repetition, story-backed practice every week.' },
  { id: 'acceptanceRate', label: 'Acceptance rate', detail: 'Confidence metric for reviewers and recruiters.' }
];

const DIFFICULTY_STATS: { id: keyof StatsBundle; label: string; detail: string }[] = [
  { id: 'easySolved', label: 'Easy', detail: 'Systems clarity + foundational algorithms.' },
  { id: 'mediumSolved', label: 'Medium', detail: 'Architecture, trade-offs, and practical reasoning.' },
  { id: 'hardSolved', label: 'Hard', detail: 'System-level puzzles, edge cases, and scalability.' }
];

const normalizeStat = (value: unknown, fallback: string) => {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  return fallback;
};

const toStatsBundle = (payload: Record<string, any>): StatsBundle => {
  const ratingSource = payload.rating ?? payload.ranking;
  return {
    totalSolved: normalizeStat(payload.totalSolved ?? payload.totalSolvedCount ?? payload.solved ?? FALLBACK_STATS.totalSolved, FALLBACK_STATS.totalSolved),
    acceptanceRate: normalizeStat(payload.acceptanceRate ?? payload.acceptRate ?? FALLBACK_STATS.acceptanceRate, FALLBACK_STATS.acceptanceRate),
    rating: ratingSource ? normalizeStat(ratingSource, FALLBACK_STATS.rating) : FALLBACK_STATS.rating,
    practiceStreak: normalizeStat(payload.practiceStreak ?? payload.streak ?? FALLBACK_STATS.practiceStreak, FALLBACK_STATS.practiceStreak),
    easySolved: normalizeStat(payload.easySolved ?? payload.easy ?? FALLBACK_STATS.easySolved, FALLBACK_STATS.easySolved),
    mediumSolved: normalizeStat(payload.mediumSolved ?? payload.medium ?? FALLBACK_STATS.mediumSolved, FALLBACK_STATS.mediumSolved),
    hardSolved: normalizeStat(payload.hardSolved ?? payload.hard ?? FALLBACK_STATS.hardSolved, FALLBACK_STATS.hardSolved)
  };
};

const fetchUrl = 'https://leetcode-stats-api.herokuapp.com/dayy345';

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
        // ignore cache issues
      }
    }

    const controller = new AbortController();

    const syncStats = async () => {
      setStatus('loading');
      try {
        const response = await fetch(fetchUrl, { signal: controller.signal });
        if (!response.ok) throw new Error('LeetCode stats offline');
        const payload = await response.json();
        const normalized = toStatsBundle(payload ?? {});
        const fetchedAt = new Date().toISOString();
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
    if (status === 'loading') return 'Polling LeetCode stats…';
    if (status === 'ready') return 'Practice telemetry live';
    if (status === 'error') return 'Offline · showing cached stats';
    return 'Awaiting sync';
  }, [status]);

  const syncLabel = useMemo(() => {
    if (lastSync) {
      const date = new Date(lastSync);
      return `Synced ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
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
