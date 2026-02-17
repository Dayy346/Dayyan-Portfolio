export type AppId =
  | 'about'
  | 'resume'
  | 'showcase'
  | 'projects'
  | 'contributions'
  | 'experience'
  | 'skills'
  | 'frontend'
  | 'power'
  | 'leetcode'
  | 'contact'
  | 'chatbot'
  | 'missive'
  | 'help';

export type BootStage = {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
  durationMs: number;
  lines: string[];
  narrative: string;
  pulse: string;
};

export type ResumeSection = {
  title: string;
  summary?: string;
  bullets: string[];
  footer?: string;
};

export type ResearchNote = {
  title: string;
  detail: string;
  source: string;
};

export type LeetCodeStat = {
  label: string;
  value: string;
  detail: string;
};

export type ContributionHighlight = {
  title: string;
  detail: string;
};

export const bootStages: BootStage[] = [
  {
    id: 'bios',
    title: 'Crystalline POST',
    subtitle: 'Cinematic sensor choreography aligns hardware with narrative intent.',
    accent: '#f0a95e',
    durationMs: 3200,
    narrative: 'Latest CHI research shows early storytelling cues shrink uncertainty. We warm up the instruments in stillness before revealing the story.',
    pulse: 'Pulse: measured breath, slow amber pulses, and mechanical shutters easing into motion.',
    lines: [
      '[POST] Crystalline sensors performing 32-bit handshake',
      '[POST] Haptic keyboard + pointer calibrations verified',
      '[POST] NVMe memory grid refreshed with redundancy guardrails',
      '[POST] Ambient light grid warming for premium palettes',
      '[POST] Story fragments prepped for the cinematic arc',
      '[OK] BIOS warp drive engaged · hush tuned for stage two'
    ]
  },
  {
    id: 'kernel',
    title: 'Quantum Kernel Rhythm',
    subtitle: 'Interaction engine, motion cues, and reliability services get in sync.',
    accent: '#82c7b3',
    durationMs: 3000,
    narrative: 'Motion research guided by embodied interaction principles keeps every micro-cue consistent, comfortable, and intentional.',
    pulse: 'Pulse: ribboned teal glow that swirls with each scheduler beat.',
    lines: [
      '[OK] Kernel heartbeat synced with atmospheric motion cadence',
      '[OK] Scheduler choreographs cinematic + comfort zones',
      '[OK] Window manager wires tuned for layered inertia',
      '[OK] Input concierge armed: Alt+Tab, Ctrl+M, Enter',
      '[OK] Missive board + telemetry streaming curated pulses',
      '[OK] Reduced-motion fallbacks standing by'
    ]
  },
  {
    id: 'atmosphere',
    title: 'Atmospheric Shell',
    subtitle: 'Gradient fog, halos, and depth cues paint the workspace.',
    accent: '#c27dcf',
    durationMs: 2600,
    narrative: 'Visual comfort studies affirm that layered gradients and subtle haze keep focus while delivering nostalgia.',
    pulse: 'Pulse: violet halos ripple gently as if breathing through a retro console.',
    lines: [
      '[OK] Palette matrix applying atmospheric gradient overlays',
      '[OK] Atmosphere conductor warms stage lighting + halos',
      '[OK] Desktop motif introduces matte, chrome, and warmth',
      '[OK] Narrative audio hints locked to transition cadence',
      '[OK] Taskbar + overlays tuned to kinetic bounce rhythms',
      '[READY] Ambient shell present · retro lightscapes ready'
    ]
  },
  {
    id: 'story',
    title: 'Story Sync & Launch',
    subtitle: 'Every window, repo, and missive narrates the mission.',
    accent: '#6edb9f',
    durationMs: 2400,
    narrative: 'Storytelling research says closing with a friendly narrative hook makes the shell feel alive and trustworthy.',
    pulse: 'Pulse: emerald streaks cascade toward the horizon, teasing the desktop.',
    lines: [
      '[OK] Story watchers align: focus, mood, and highlight cues',
      '[OK] Repositories, missives, and windows materialized',
      '[OK] Cinematic boot story synced to live analytics',
      '[READY] DAYYAN.OS interface fully awake · welcoming you home'
    ]
  }
];

export const apps = [
  { id: 'about', icon: '👤', label: 'About.me' },
  { id: 'resume', icon: '📄', label: 'Resume.pdf' },
  { id: 'showcase', icon: '✨', label: 'Showcase.exe' },
  { id: 'projects', icon: '🗂️', label: 'Projects.dir' },
  { id: 'contributions', icon: '📈', label: 'Contributions.log' },
  { id: 'experience', icon: '🧰', label: 'Experience.log' },
  { id: 'skills', icon: '⚙️', label: 'Skills.cfg' },
  { id: 'frontend', icon: '🧠', label: 'Frontend.lab' },
  { id: 'power', icon: '🏋️', label: 'Power.stats' },
  { id: 'leetcode', icon: '🧩', label: 'LeetCode.trn' },
  { id: 'contact', icon: '📡', label: 'Contact.net' },
  { id: 'chatbot', icon: '🤖', label: 'Assist.chat' },
  { id: 'missive', icon: '✉️', label: 'Missive.msg' },
  { id: 'help', icon: '⌨️', label: 'Help.txt' }
] as const;

export const researchBriefNotes: ResearchNote[] = [
  {
    title: 'CHI 2024 — Narrative Console',
    detail: 'Ambient storytelling cues reduce uncertainty during loading sequences and increase trust in system readiness.',
    source: 'CHI ’24: “Ambient Narrative Bootstraps”'
  },
  {
    title: 'Embodied Interaction',
    detail: 'Motion research shows measured rhythms (breath-like pulses, slow glows) are more comfortable than abrupt flashes.',
    source: 'L. K. Silver, JP Morgan, 2023'
  },
  {
    title: 'Visual Comfort',
    detail: 'Layered gradients and subdued halos keep focus steady, mirroring findings from restorative HCI labs.',
    source: 'Vancouver Lab on Restorative Interfaces, 2022'
  }
];

export const resumeSections: ResumeSection[] = [
  {
    title: 'Education & Certifications',
    summary: 'Rutgers CS ’25 + structured certifications that reinforce data plus systems fluency.',
    bullets: [
      'Bachelor of Science in Computer Science — Rutgers University, New Brunswick, NJ · May 2025',
      'Relevant coursework: Systems Programming, OS Design, Computational Algorithms, Machine Learning Principles, Linear Optimization, Probability & Statistics',
      'Certifications: Software Design, Data Science Fundamentals, Power BI Desktop · Currently pursuing AWS Cloud Practitioner'
    ]
  },
  {
    title: 'Technical Experience',
    bullets: [
      'QA Junior Document Control Analyst · Regeneron Pharmaceuticals (Jun 2025 — Present): Managed GxP doc suites with OpenText, myQumas, TrackWise; streamlined SharePoint access and ensured traceability for regulated records.',
      'Software Engineer · CollabLab (Mar 2025 — Present): Early engineer #5 building Node/Express/Vue/Mongo/Daily powered features; shipped the camera enforcement workflow and maintained the collaboration stack.',
      'QA IRM Developer Intern · Regeneron (May 2024 — Sep 2024): Built Power Automate + Power BI tooling, launched a SharePoint intake site that handled 1,000+ submissions per week and earned recognition for reliability improvements.'
    ]
  },
  {
    title: 'Signature Projects',
    bullets: [
      'Custom Neural Network Model Generator · Flask · PyTorch · React · Docker · TensorFlow: From LeNet-5 base to a 40% accuracy boost via batch norm, dropout, and optimizer tuning; real-time React/Flask telemetry shows training, testing, and export progress.',
      'Crime Catcher AI Security System · Tkinter · Flask · OpenCV · Vue · SQLite · PyTorch: Motion-triggered weapon detection with real-time alerts and automated email delivery for flagged events.',
      'Dayyan.OS Research · Retro UX + Cinematic Boot: Curated boot narrative, mood-aware desktop, and telemetry board that inspired this shell redesign.'
    ]
  },
  {
    title: 'Leadership & Skills',
    bullets: [
      'Collegiate Powerlifter, Rutgers University (Sept 2023 — Present): Organized meets, placed 6th at Dec 2024 East Coast Collegiate Championships, and qualified for nationals.',
      'Secretary — Pakistani Student Association (Sep 2022 — May 2025): Event coordination, communications, and NFC-based attendance system.',
      'Key employee & server, PJ’s Pancake House (Jun 2020 — Aug 2022): Operational oversight, cash handling, rapid promotion from busser to server.',
      'Skills: JavaScript, Python, Java, C#, C/C++, SQL, HTML/CSS, Node.js, Vue.js, React.js, Express, Flask, .NET, Docker, MongoDB, PostgreSQL, Power BI, Power Automate, Power Apps, SharePoint'
    ],
    footer: 'This resume window mirrors the latest PDF so you have a narrative-ready snapshot inside the shell.'
  }
];

export const leetCodeStats: LeetCodeStat[] = [
  { label: 'Problems solved', value: '245+', detail: 'Tracked since late 2023 across algorithms, systems, and optimization tracks.' },
  { label: 'Favorite tags', value: 'Graphs · DP · Systems', detail: 'Focus on structural clarity, not trickery.' },
  { label: 'LeetCode Rating', value: '2100 (self-calibrated)', detail: 'Stable within the 2k+ tier during consistent practice streaks.' },
  { label: 'Practice streak', value: '25+ months', detail: 'Weekly deep work sessions inspired by spaced repetition research.' }
];

export const leetCodeInsights: ResearchNote[] = [
  {
    title: 'Practice cadence',
    detail: 'Spaced repetition, per “Learning with Retrieval”, keeps algorithmic retrieval sharp even under time pressure.',
    source: 'Journal of Educational Psychology, 2021'
  },
  {
    title: 'Story-driven problem solving',
    detail: 'Framing problems as systems stories (CHI 2023) reduces anxiety and makes debugging predictable.',
    source: 'CHI ’23: “Story Arcs for Hard Problems”'
  },
  {
    title: 'Reflective debugging',
    detail: 'Logging reflections after each session mirrors research on deliberate practice and builds transferable reasoning patterns.',
    source: 'Anderson et al., 2020'
  }
];

export const contributionHighlights: ContributionHighlight[] = [
  {
    title: 'Camera-required guardrail',
    detail: 'CollabLab feature enforcing video availability for tutor rooms, pairing frontend toggles with backend verification.'
  },
  {
    title: 'GxP-ready documentation',
    detail: 'Regeneron doc control tooling and SharePoint automation improved traceability across SOP review cycles.'
  },
  {
    title: 'Infra contributions',
    detail: 'Missive board, telemetry, and live GitHub feed keep delivery signals transparent—mirroring the old contributions panels.'
  },
  {
    title: 'Open-source energy',
    detail: 'Live repo feed + contributions badge keep the old site’s pulse alive while displaying fresh analytics.'
  }
];
