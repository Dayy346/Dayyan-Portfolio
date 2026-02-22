export type AppId =
  | 'about'
  | 'resume'
  | 'projects'
  | 'contributions'
  | 'experience'
  | 'skills'
  | 'power'
  | 'leetcode'
  | 'contact'
  | 'chatbot'
  | 'help';

export type BootStage = {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
  durationMs: number;
  metricLabel: string;
  metricValue: string;
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
    durationMs: 2000,
    metricLabel: 'Sensor coherence',
    metricValue: 'Crystalline POST at 99.7% readiness',
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
    durationMs: 1800,
    metricLabel: 'Kernel cadence',
    metricValue: 'Scheduler locks 3.2ms beats · input concierge armed',
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
    durationMs: 1500,
    metricLabel: 'Atmospheric depth',
    metricValue: 'Four matte gradients locked · halo intensity steady',
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
    durationMs: 1400,
    metricLabel: 'Story sync',
    metricValue: 'Repo + Missive signals streaming · narrative locked',
    narrative: 'Storytelling research says closing with a friendly narrative hook makes the shell feel alive and trustworthy.',
    pulse: 'Pulse: emerald streaks cascade toward the horizon, teasing the desktop.',
    lines: [
      '[OK] Story watchers align: focus, mood, and highlight cues',
      '[OK] Repositories, missives, and windows materialized',
      '[OK] Cinematic boot story synced to live analytics',
      '[READY] Portfolio interface fully awake · welcoming you home'
    ]
  }
];

export const apps = [
  { id: 'about', icon: '👤', label: 'About.me' },
  { id: 'resume', icon: '📄', label: 'Resume.pdf' },
  { id: 'projects', icon: '🗂️', label: 'Projects.dir' },
  { id: 'contributions', icon: '📈', label: 'Contributions.log' },
  { id: 'experience', icon: '🧰', label: 'Experience.log' },
  { id: 'skills', icon: '⚙️', label: 'Skills.cfg' },
  { id: 'power', icon: '🏋️', label: 'Extracurricular.log' },
  { id: 'leetcode', icon: '🧩', label: 'LeetCode.trn' },
  { id: 'contact', icon: '📡', label: 'Contact.net' },
  { id: 'chatbot', icon: '🤖', label: 'Assist.chat' },
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
    summary: 'Rutgers BA in Computer Science & Mathematics ’25; certifications in software design, data science, and MLOps.',
    bullets: [
      'Bachelor of Arts in Computer Science and Mathematics — Rutgers University, New Brunswick, NJ · May 2025',
      'Relevant coursework: Systems Programming, OS Design, Computational Algorithms, Machine Learning Principles, Linear Optimization, Probability & Statistics, Intro to AI, Design and Analysis of Algorithms',
      'Certifications: MLOps and Data Pipeline Orchestration for AI Systems (LinkedIn, Oct 2025); Software Design: From Requirements to Release (Aug 2024); Data Science Fundamentals; Power BI Desktop · Pursuing AWS Cloud Practitioner'
    ]
  },
  {
    title: 'Technical Experience',
    bullets: [
      'Junior AI Engineer · FCB Health New York | IPG Health (Oct 2025 — Present), Full-time, NYC Metro Hybrid: Backend in Python and FastAPI with storage/retrieval in Azure AI Search; frontend in Nuxt hosted on Azure App Service. Deep Learning, TypeScript, and production healthcare workflows.',
      'Engineering Manager · Troy Tutors / CollabLab (Jan 2026 — Present), Part-time: Promoted to part-time engineering manager leading a group of full-stack engineers at CollabLab.',
      'Full Stack Software Engineer · CollabLab (Mar 2025 — Jan 2026), Remote: Engineer #5 at education tech startup under Troy Tutors; Node/Express/Vue/Mongo/Daily; shipped camera-required enforcement for tutoring and proctored rooms. Part-time from June 2025. collablab.dev',
      'QA Document Control Analyst · Regeneron (Jun 2025 — Oct 2025), Contract: Managed GxP documentation with OpenText, myQumas, TrackWise; improved internal SharePoint site and workflows. Contract through Oxford Global Resources.',
      'QA Developer Intern · Regeneron (May 2024 — Sep 2024), On-site Albany: Power Automate, Power BI, SharePoint, SQL, PowerApps; launched SharePoint intake site (1,000+ submissions first week); superlative award and program extension. GxP systems: DataMart, OpsTrakker.',
      'Warehouse Associate · Amazon Fulfillment Technologies & Robotics (Dec 2022 — Mar 2023), Seasonal, Robbinsville NJ.'
    ]
  },
  {
    title: 'Signature Projects',
    bullets: [
      'Custom Neural Network Model Generator · Flask · PyTorch · React · Docker · TensorFlow: LeNet-5–based image classification; 40% accuracy gain via batch norm, dropout, augmentation; real-time React/Flask telemetry.',
      'Crime Catcher AI Security System · Tkinter · Flask · OpenCV · Vue · SQLite · PyTorch: Motion-triggered weapon detection, real-time alerts, automated email delivery for flagged events.',
      'Big Data Bowl · Judge-ing Aggressive vs Defensive Back Coverage (Kaggle): NFL coverage analysis notebook built with a partner—aggressive vs defensive back coverage. See Kaggle submission (mscoop16).'
    ]
  },
  {
    title: 'Leadership & Skills',
    bullets: [
      'Collegiate Powerlifter, Rutgers University (Sep 2023 — Present): 6th place, 67.5kg, East Coast Collegiate Championships (Dec 2024); qualified for nationals. Secretary, Pakistani Student Association (Sep 2022 — May 2025). Key employee & server, PJ’s Pancake House (Jun 2020 — Aug 2022).',
      'Skills: Python, Java, JavaScript, TypeScript, SQL, C#, C/C++; Data Science; Node.js, Vue.js, Nuxt, React.js, Express, Flask, FastAPI; Azure, Azure AI Search; Power BI, Power Automate, Power Apps, SharePoint; Git, Docker, MongoDB, PostgreSQL; Engineering Management, Engineering Leadership'
    ],
    footer: 'This resume window mirrors the latest PDF; see LinkedIn for full experience and skills.'
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
