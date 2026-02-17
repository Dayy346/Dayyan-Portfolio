const bootLines = [
  '[OK] Initializing dayyan kernel modules...',
  '[OK] Mounting portfolio filesystem...',
  '[OK] Loading profile.exe ...',
  '[OK] Registering projects.dir ...',
  '[OK] Enabling experience.log services ...',
  '[OK] Networking online: contact.net',
  '[OK] DAYYAN.OS boot complete.'
];

const bootLog = document.getElementById('boot-log');
const bootProgress = document.getElementById('boot-progress');
const bootScreen = document.getElementById('boot-screen');
const enterBtn = document.getElementById('enter-os');
const os = document.getElementById('os');
const clockEl = document.getElementById('clock');

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function runBoot() {
  for (let i = 0; i < bootLines.length; i++) {
    const p = document.createElement('p');
    p.textContent = bootLines[i];
    bootLog.appendChild(p);
    bootLog.scrollTop = bootLog.scrollHeight;
    bootProgress.style.width = `${((i + 1) / bootLines.length) * 100}%`;
    await sleep(450);
  }
  enterBtn.classList.remove('hidden');
}

function startOS() {
  bootScreen.classList.add('hidden');
  os.classList.remove('hidden');
}

enterBtn.addEventListener('click', startOS);
runBoot();

function updateClock() {
  clockEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
updateClock();
setInterval(updateClock, 1000);

const zBase = { value: 10 };

function openApp(app) {
  const win = document.getElementById(`app-${app}`);
  if (!win) return;
  win.classList.remove('hidden');
  zBase.value += 1;
  win.style.zIndex = zBase.value;
}

function closeApp(app) {
  const win = document.getElementById(`app-${app}`);
  if (win) win.classList.add('hidden');
}

document.querySelectorAll('.app-icon').forEach((btn) => {
  btn.addEventListener('click', () => openApp(btn.dataset.app));
});

document.querySelectorAll('.close').forEach((btn) => {
  btn.addEventListener('click', () => closeApp(btn.dataset.close));
});

// start button opens About by default like a launcher
const startBtn = document.getElementById('start-btn');
startBtn.addEventListener('click', () => openApp('about'));

// Window dragging for retro OS feel
function makeDraggable(windowEl) {
  const titlebar = windowEl.querySelector('.titlebar');
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  titlebar.addEventListener('mousedown', (e) => {
    dragging = true;
    zBase.value += 1;
    windowEl.style.zIndex = zBase.value;
    const rect = windowEl.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    windowEl.style.left = `${rect.left}px`;
    windowEl.style.top = `${rect.top}px`;
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const x = Math.max(8, e.clientX - offsetX);
    const y = Math.max(52, e.clientY - offsetY);
    windowEl.style.left = `${x}px`;
    windowEl.style.top = `${y}px`;
  });

  document.addEventListener('mouseup', () => { dragging = false; });
}

document.querySelectorAll('.window').forEach((win, idx) => {
  win.style.top = `${70 + idx * 18}px`;
  win.style.left = `${90 + idx * 20}px`;
  makeDraggable(win);
  win.addEventListener('mousedown', () => {
    zBase.value += 1;
    win.style.zIndex = zBase.value;
  });
});

function escapeHtml(value = '') {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function projectCard(repo) {
  return `<article class="project-card">
    <h3>${escapeHtml(repo.name.replace(/-/g, ' '))}</h3>
    <div class="project-meta">
      <span>${escapeHtml(repo.language || 'Multi')}</span>
      <span>★ ${repo.stargazers_count || 0}</span>
    </div>
    <p>${escapeHtml(repo.description || 'Built to solve real problems with practical engineering.')}</p>
    <div class="project-links">
      <a href="${repo.html_url}" target="_blank" rel="noreferrer">GitHub</a>
      ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noreferrer">Live</a>` : ''}
    </div>
  </article>`;
}

async function loadProjects() {
  const list = document.getElementById('project-list');
  try {
    const res = await fetch('https://api.github.com/users/dayy346/repos?sort=updated&per_page=100');
    const repos = await res.json();
    const filtered = repos.filter((r) => !r.fork && r.name !== 'Dayyan-Portfolio').sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0)).slice(0, 12);
    list.innerHTML = filtered.map(projectCard).join('');
  } catch {
    list.innerHTML = '<p class="muted">Could not load repos right now. Visit github.com/dayy346.</p>';
  }
}

loadProjects();
