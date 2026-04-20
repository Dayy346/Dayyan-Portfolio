/**
 * Compact desktop widget: GitHub contribution chart + link.
 * Chart wrap background matches image empty-cell color to avoid white cutout; chart is large and readable.
 */
export function DesktopGitHubWidget() {
  const username = 'dayy346';
  const chartUrl = `https://ghchart.rshah.org/${username}`;
  const profileUrl = `https://github.com/${username}`;

  return (
    <aside className="desktop-widget desktop-widget-github" aria-label="GitHub contributions">
      <a href={profileUrl} target="_blank" rel="noreferrer" className="desktop-widget-link">
        <span className="desktop-widget-title">GitHub</span>
        <div className="desktop-widget-chart-wrap desktop-widget-chart-wrap--compact">
          <img
            src={chartUrl}
            alt="GitHub contribution chart"
            className="desktop-widget-chart"
            width={468}
            height={104}
            loading="lazy"
          />
        </div>
        <span className="desktop-widget-cta">View profile →</span>
      </a>
    </aside>
  );
}
