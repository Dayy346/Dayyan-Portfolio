/**
 * Compact desktop widget: GitHub contribution chart + link.
 * Renders in the top-right of the desktop, on theme and minimal.
 */
export function DesktopGitHubWidget() {
  const username = 'dayy346';
  const chartUrl = `https://ghchart.rshah.org/${username}`;
  const profileUrl = `https://github.com/${username}`;

  return (
    <aside className="desktop-widget desktop-widget-github" aria-label="GitHub contributions">
      <a href={profileUrl} target="_blank" rel="noreferrer" className="desktop-widget-link">
        <span className="desktop-widget-title">GitHub</span>
        <img
          src={chartUrl}
          alt="GitHub contribution chart"
          className="desktop-widget-chart"
          width={540}
          height={120}
          loading="lazy"
        />
        <span className="desktop-widget-cta">View profile →</span>
      </a>
    </aside>
  );
}
