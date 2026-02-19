import { useEffect, useMemo, useState } from 'react';

type FeedEntry = {
  id: string;
  repo: string;
  summary: string;
  updatedAt: string;
  url: string;
};

const FALLBACK_FEED: FeedEntry[] = [
  {
    id: 'fallback-camera-guardrail',
    repo: 'CollabLab/camera-guardrails',
    summary: 'Ship camera-required guardrails paired with backend verification for secure tutor rooms.',
    updatedAt: '2026-02-10T14:20:00Z',
    url: 'https://github.com/dayy346/camera-guardrails'
  },
  {
    id: 'fallback-gxp-docs',
    repo: 'Regeneron/quality-automation',
    summary: 'Automated GxP documentation pipelines to improve traceability across SOP reviews.',
    updatedAt: '2026-02-05T09:00:00Z',
    url: 'https://github.com/dayy346/quality-automation'
  },
  {
    id: 'fallback-missive',
    repo: 'Dayyan-OS/Missive',
    summary: 'Missive board telemetry updates keep premium deliveries transparent and resilient.',
    updatedAt: '2026-02-01T18:10:00Z',
    url: 'https://github.com/dayy346/Dayyan-OS'
  },
  {
    id: 'fallback-infra',
    repo: 'CollabLab/infrastructure',
    summary: 'Infra contributions harmonize telemetry, logging, and scheduler rails for reliability rituals.',
    updatedAt: '2026-01-27T11:05:00Z',
    url: 'https://github.com/dayy346/infra-telemetry'
  }
];

const CACHE_KEY = 'dayyan.github.contributionFeed';
const CACHE_TTL = 1000 * 60 * 12; // 12 minutes

type GitHubEvent = {
  id: string;
  type: string;
  created_at?: string;
  repo?: { name: string; url?: string };
  payload?: Record<string, any>;
};

const normalizeRepoUrl = (rawUrl?: string, name?: string) => {
  if (rawUrl) {
    return rawUrl.replace('https://api.github.com/repos/', 'https://github.com/');
  }
  return name ? `https://github.com/${name}` : 'https://github.com/dayy346';
};

const convertEventToEntry = (event: GitHubEvent): FeedEntry | null => {
  if (!event?.id || !event?.repo?.name) return null;
  const repoName = event.repo.name;
  const eventPayload = event.payload ?? {};
  const baseUrl = normalizeRepoUrl(event.repo.url, repoName);
  const detailUrl =
    eventPayload?.pull_request?.html_url ||
    eventPayload?.issue?.html_url ||
    eventPayload?.comment?.html_url ||
    baseUrl;
  let summary = 'Activity streaming from GitHub.';

  if (event.type === 'PushEvent') {
    const commits = Array.isArray(eventPayload.commits) ? eventPayload.commits : [];
    const commitCount = Math.max(1, commits.length);
    const message = commits[0]?.message ?? 'Updated codebase';
    summary = `Push · ${commitCount} commit${commitCount === 1 ? '' : 's'} · ${message}`;
  } else if (event.type === 'PullRequestEvent') {
    const action = eventPayload.action ?? 'updated';
    const title = eventPayload.pull_request?.title ?? 'Pull request activity';
    summary = `PR ${action} · ${title}`;
  } else if (event.type === 'IssuesEvent') {
    const action = eventPayload.action ?? 'updated';
    const title = eventPayload.issue?.title ?? 'Issue chatter';
    summary = `Issue ${action} · ${title}`;
  } else if (event.type === 'CreateEvent') {
    const refType = eventPayload.ref_type ?? 'resource';
    summary = `Created ${refType} · ${repoName}`;
  } else if (event.type === 'ReleaseEvent') {
    const releaseName = eventPayload.release?.name ?? 'release';
    summary = `Released ${releaseName}`;
  }

  return {
    id: event.id,
    repo: repoName,
    summary,
    updatedAt: event.created_at ?? new Date().toISOString(),
    url: detailUrl
  };
};

export function GitHubContributionFeed({ recruiterSignal, highlight }: { recruiterSignal: number; highlight: string }) {
  const [feed, setFeed] = useState<FeedEntry[]>(FALLBACK_FEED);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let isActive = true;
    const cached = window.localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as { fetchedAt: string; items: FeedEntry[] };
        if (parsed.fetchedAt && Array.isArray(parsed.items)) {
          const age = Date.now() - new Date(parsed.fetchedAt).getTime();
          if (age < CACHE_TTL) {
            setFeed(parsed.items);
            setLastSync(parsed.fetchedAt);
            setStatus('ready');
          }
        }
      } catch {
        // ignore cache issues
      }
    }

    const controller = new AbortController();

    const syncFeed = async () => {
      setStatus('loading');
      try {
        const response = await fetch('https://api.github.com/users/dayy346/events/public?per_page=6', {
          signal: controller.signal
        });
        if (!response.ok) throw new Error('GitHub events offline');
        const payload = (await response.json()) as GitHubEvent[];
        if (!Array.isArray(payload)) throw new Error('Unexpected feed payload');
        const entries = payload
          .map(convertEventToEntry)
          .filter((entry): entry is FeedEntry => Boolean(entry));
        if (!entries.length) throw new Error('Empty GitHub activity list');
        const trimmed = entries.slice(0, 6);
        const fetchedAt = new Date().toISOString();
        window.localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt, items: trimmed }));
        if (!isActive) return;
        setFeed(trimmed);
        setLastSync(fetchedAt);
        setStatus('ready');
      } catch (error) {
        if (!isActive || controller.signal.aborted) return;
        console.warn('GitHub feed sync failed', error);
        setStatus('error');
      }
    };

    syncFeed();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  const statusLabel = useMemo(() => {
    if (status === 'loading') return 'Syncing contributions…';
    if (status === 'ready') return 'Contribution signal live';
    if (status === 'error') return 'Offline · showing cached signal';
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
    <section className="win95-chrome-panel github-feed-panel" data-testid="github-feed-panel">
      <header className="chrome-panel-header">
        <div>
          <p className="muted">Recruiter-aligned telemetry</p>
          <h3>GitHub contribution feed</h3>
        </div>
        <div className="chrome-panel-status">
          <span data-testid="github-feed-status-label">{statusLabel}</span>
          <small data-testid="github-feed-last-sync">{syncLabel}</small>
        </div>
      </header>
      <div className="github-feed-list" data-testid="github-feed-list">
        {feed.map((entry, index) => (
          <article key={entry.id} className="github-feed-entry" data-testid={`github-feed-entry-${index}`}>
            <a href={entry.url} target="_blank" rel="noreferrer">{entry.repo}</a>
            <p>{entry.summary}</p>
            <small>{new Date(entry.updatedAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</small>
          </article>
        ))}
      </div>
      <footer className="chrome-panel-footer" data-testid="github-feed-recruiter-note">
        <strong>Recruiter signal {recruiterSignal} live</strong>
        <p>{highlight}</p>
      </footer>
    </section>
  );
}
