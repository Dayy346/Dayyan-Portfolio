const projectList = document.getElementById('project-list');
const clock = document.getElementById('clock');
const year = document.getElementById('year');
const startBtn = document.getElementById('start-btn');
const palette = document.getElementById('palette');

function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function projectCard(repo) {
  const title = repo.name.replace(/-/g, ' ');
  return `
    <article class="project-card">
      <h3>${escapeHtml(title)}</h3>
      <div class="project-meta">
        <span>${escapeHtml(repo.language || 'Multi')}</span>
        <span>★ ${repo.stargazers_count || 0}</span>
      </div>
      <p>${escapeHtml(repo.description || 'Project focused on practical engineering and product quality.')}</p>
      <div class="project-links">
        <a href="${repo.html_url}" target="_blank" rel="noreferrer">GitHub</a>
        ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noreferrer">Live</a>` : ''}
      </div>
    </article>
  `;
}

async function loadProjects() {
  try {
    const username = 'dayy346';
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repos = await res.json();

    const filtered = repos
      .filter((repo) => !repo.fork && repo.name !== 'Dayyan-Portfolio')
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 9);

    projectList.innerHTML = filtered.map(projectCard).join('');
  } catch {
    projectList.innerHTML = `
      <article class="project-card">
        <h3>Unable to fetch projects right now.</h3>
        <p>Check GitHub directly: <a href="https://github.com/dayy346" target="_blank" rel="noreferrer">github.com/dayy346</a></p>
      </article>
    `;
  }
}

startBtn.addEventListener('click', () => {
  palette.classList.toggle('hidden');
  palette.setAttribute('aria-hidden', String(palette.classList.contains('hidden')));
});

document.querySelectorAll('[data-target]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = document.querySelector(btn.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    palette.classList.add('hidden');
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    palette.classList.toggle('hidden');
  }
  if (e.key === 'Escape') palette.classList.add('hidden');
});

year.textContent = new Date().getFullYear();
updateClock();
setInterval(updateClock, 1000);
loadProjects();
