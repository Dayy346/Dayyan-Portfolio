export function DesktopGitHubWidget() {
  const username = 'dayy346';
  const chartUrl = `https://ghchart.rshah.org/${username}`;
  const profileUrl = `https://github.com/${username}`;

  return (
    <aside className="desktop-widget desktop-widget-github" aria-label="GitHub contributions">
      <a href={profileUrl} target="_blank" rel="noreferrer" className="desktop-widget-link">
        <span className="desktop-widget-title">GitHub · last 12 months</span>
        <div className="desktop-widget-chart-wrap desktop-widget-chart-wrap--compact">
          <img
            src={chartUrl}
            alt={`${username} GitHub contribution chart`}
            className="desktop-widget-chart"
            width={920}
            height={143}
            loading="lazy"
          />
        </div>
        <span className="desktop-widget-cta">@{username} · open profile →</span>
      </a>
    </aside>
  );
}
