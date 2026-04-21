import { useEffect, useState } from 'react';

type Stats = { easySolved: string; mediumSolved: string; hardSolved: string; totalSolved: string };

const FALLBACK: Stats = { easySolved: '62', mediumSolved: '89', hardSolved: '12', totalSolved: '163' };
const CACHE_KEY = 'dayyan.leetcode.stats.v2';
const CACHE_TTL = 1000 * 60 * 60 * 6;
const STATS_URL = `${import.meta.env.BASE_URL}leetcode-stats.json`;

type StatsPayload = {
  totalSolved: number | null;
  easySolved: number | null;
  mediumSolved: number | null;
  hardSolved: number | null;
  updatedAt: string;
};

const format = (value: number | null, fallback: string) => (value != null ? String(value) : fallback);


export function DesktopLeetCodeWidget() {
  const [stats, setStats] = useState<Stats>(FALLBACK);

  useEffect(() => {
    let isActive = true;
    const cached = typeof window !== 'undefined' ? window.localStorage.getItem(CACHE_KEY) : null;

    if (cached) {
      try {
        const { fetchedAt, stats: s } = JSON.parse(cached) as { fetchedAt: string; stats: Stats };
        if (s && fetchedAt && Date.now() - new Date(fetchedAt).getTime() < CACHE_TTL) {
          setStats(s);
          return;
        }
      } catch {
        // disposable cache
      }
    }

    fetch(STATS_URL, { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((payload: StatsPayload) => {
        if (!isActive) return;
        const next: Stats = {
          easySolved: format(payload.easySolved, FALLBACK.easySolved),
          mediumSolved: format(payload.mediumSolved, FALLBACK.mediumSolved),
          hardSolved: format(payload.hardSolved, FALLBACK.hardSolved),
          totalSolved: format(payload.totalSolved, FALLBACK.totalSolved)
        };
        setStats(next);

        if (typeof window !== 'undefined') {
          const fetchedAt = payload.updatedAt ?? new Date().toISOString();
          window.localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt, stats: next }));
        }
      })
      .catch(() => {});

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <aside className="desktop-widget desktop-widget-leetcode" aria-label="LeetCode stats">
      <div className="desktop-widget-inner">
        <span className="desktop-widget-title">LeetCode</span>
        <div className="desktop-widget-leetcode-grid">
          <div className="desktop-widget-stat"><strong>{stats.easySolved}</strong><span>Easy</span></div>
          <div className="desktop-widget-stat"><strong>{stats.mediumSolved}</strong><span>Medium</span></div>
          <div className="desktop-widget-stat"><strong>{stats.hardSolved}</strong><span>Hard</span></div>
        </div>
        <span className="desktop-widget-muted">{stats.totalSolved} solved</span>
      </div>
    </aside>
  );
}
