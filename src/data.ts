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
    summary:
      'Rutgers University · BA Computer Science · May 2025. Coursework spans ML, AI, algorithms, data structures, and OS.',
    bullets: [
      'Rutgers University, New Brunswick, NJ — BA Computer Science · Graduated May 2025',
      'Relevant coursework: Machine Learning, Artificial Intelligence, Algorithms, Data Structures, Operating Systems',
      'Certifications: Software Design · Data Science Fundamentals · MLOps and Data Pipeline Orchestration for AI Systems (LinkedIn)'
    ]
  },
  {
    title: 'Technical Experience',
    bullets: [
      'Junior AI Engineer · Omnicom Health · New York · Oct 2025 — Present · NYC: Full-stack AI applications for pharmaceutical clients on the Conversational AI team — Nuxt + Vue frontends; Python/FastAPI backends with retrieval via Azure AI Search; RAG pipelines with indexes on Azure Blob; NLP with spaCy under GxP constraints; benchmarked LLM/RAG architectures for performance and regulatory alignment.',
      'Engineering Manager (part-time) · CollabLab / Troy Tutors · Jan 2026 — Present · Remote: Lead a team of five full-stack engineers; directed migration from EC2 to AWS Fargate; code reviews, architecture, and sprint execution with leadership.',
      'Full Stack Software Engineer (part-time from Jun 2025) · CollabLab · Mar 2025 — Jan 2026 · Remote: Early-stage EdTech; end-to-end features on Vue + Node; CI/CD with Playwright; migrated services to AWS (ECS, S3, CloudFront). collablab.dev',
      'QA Document Control Analyst (contract) · Regeneron Pharmaceuticals · Jun 2025 — Oct 2025 · East Greenbush, NY: GxP documentation in OpenText, myQumas, TrackWise; improved SharePoint workflows and collaboration.',
      'QA R&D Developer Intern · Regeneron · May 2024 — Sep 2024 · Albany: SharePoint system handling 1000+ requests in week one (~27% efficiency gain); superlative intern award.',
      'Warehouse Associate · Amazon Fulfillment Technologies & Robotics · Dec 2022 — Mar 2023 · Seasonal · Robbinsville, NJ.'
    ]
  },
  {
    title: 'Signature Projects',
    bullets: [
      'JUDGE — NFL Big Data Bowl 2026 · Python, XGBoost, Pandas, NumPy · Oct 2025 — Jan 2026: ML pipeline for defensive coverage; novel “JumpLine” geometric feature; XGBoost model (R² ≈ 0.75); JUDGE metric (Jump Underneath Distance Gained Over Expected).',
      'Custom Neural Network Model Generator · Flask, PyTorch, React, Docker, TensorFlow · Dec 2024 — Jun 2025: Full-stack platform to train and export image classifiers; ~40% accuracy lift via batch norm, dropout, and augmentation.',
      'Crime Catcher AI Security System (hackathon) · Tkinter, Flask, OpenCV, Vue, SQLite, PyTorch · Nov 2024: Weapon detection with YOLO-class models; real-time alerts and recording hooks.'
    ]
  },
  {
    title: 'Leadership & Skills',
    bullets: [
      'Collegiate Powerlifter · Rutgers · Sep 2023 — Present: 6th place at Collegiate Championships (67.5 kg, Dec 2024); qualified for Collegiate Nationals.',
      'Secretary (Executive Board) · Pakistani Student Association · Sep 2022 — May 2025: Events, communications, NFC attendance system still in use at Rutgers.',
      'Skills — Languages: Python, TypeScript/JavaScript, Java, SQL. AI/ML: PyTorch, TensorFlow, scikit-learn. (See PDF for full stack list.)'
    ],
    footer: 'Download matches Resume_Dayyan_2026 — update this site when the PDF changes.'
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
