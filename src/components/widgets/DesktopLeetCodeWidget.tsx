import { useEffect, useState } from 'react';

type Stats = { easySolved: string; mediumSolved: string; hardSolved: string; totalSolved: string };

const FALLBACK: Stats = { easySolved: '110', mediumSolved: '85', hardSolved: '52', totalSolved: '245+' };
const CACHE_KEY = 'dayyan.leetcode.stats';
const CACHE_TTL = 1000 * 60 * 45;
const FETCH_URL = 'https://leetcode-stats-api.herokuapp.com/dayy345';

const normalize = (v: unknown, fallback: string): string => {
  if (v == null) return fallback;
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  return fallback;
};

/**
 * Compact desktop widget: LeetCode breakdown (easy / medium / hard).
 * Renders in the top-right of the desktop.
 */
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
        // ignore
      }
    }
    fetch(FETCH_URL)
      .then((r) => r.json())
      .then((payload: Record<string, unknown>) => {
        if (!isActive) return;
        const next: Stats = {
          easySolved: normalize(payload?.easySolved ?? payload?.easy, FALLBACK.easySolved),
          mediumSolved: normalize(payload?.mediumSolved ?? payload?.medium, FALLBACK.mediumSolved),
          hardSolved: normalize(payload?.hardSolved ?? payload?.hard, FALLBACK.hardSolved),
          totalSolved: normalize(payload?.totalSolved ?? payload?.solved, FALLBACK.totalSolved)
        };
        setStats(next);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: new Date().toISOString(), stats: next }));
        }
      })
      .catch(() => {});
    return () => { isActive = false; };
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
