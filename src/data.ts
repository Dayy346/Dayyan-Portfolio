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

export type FrameworkLogoId =
  | 'python'
  | 'typescript'
  | 'react'
  | 'vue'
  | 'nuxt'
  | 'fastapi'
  | 'node'
  | 'azure'
  | 'aws'
  | 'docker'
  | 'postgresql'
  | 'playwright'
  | 'pytorch'
  | 'tensorflow';

export type StackBadge = {
  id: FrameworkLogoId;
  label: string;
  note: string;
  lane: 'frontend' | 'backend' | 'cloud' | 'data';
};

export type SkillSpotlight = {
  title: string;
  lane: 'frontend' | 'backend' | 'cloud' | 'data';
  score: number;
  summary: string;
  proof: string;
  stack: FrameworkLogoId[];
};

export type ShowcaseStory = {
  title: string;
  strap: string;
  summary: string;
  outcomes: string[];
  stack: FrameworkLogoId[];
};

export type AboutSignal = {
  label: string;
  value: string;
  detail: string;
};

export const bootStages: BootStage[] = [
  {
    id: 'bios',
    title: 'System Check',
    subtitle: 'A restrained boot sequence that gets straight to the portfolio.',
    accent: '#f0a95e',
    durationMs: 1800,
    metricLabel: 'Readiness',
    metricValue: 'Portfolio ready · core assets verified',
    narrative: 'The retro shell stays, but the first impression is calmer and more professional. Clear content always wins over spectacle.',
    pulse: 'Amber status lights and quiet progress cues set the tone.',
    lines: [
      '[CHECK] Core assets verified',
      '[CHECK] Copy and layout loaded',
      '[CHECK] Resume, projects, and contact links online',
      '[READY] Opening portfolio view'
    ]
  },
  {
    id: 'kernel',
    title: 'Content Sync',
    subtitle: 'The app windows and live data are loading in a cleaner order.',
    accent: '#82c7b3',
    durationMs: 1600,
    metricLabel: 'Sync status',
    metricValue: 'Data channels online · interactions ready',
    narrative: 'This step keeps the desktop feel, but the copy stays focused on the work instead of the novelty.',
    pulse: 'Soft teal movement keeps the interface feeling active without being loud.',
    lines: [
      '[OK] Interaction model aligned',
      '[OK] Window manager ready',
      '[OK] GitHub and LeetCode data streams connected',
      '[OK] Keyboard shortcuts available',
      '[READY] Portfolio windows can be opened'
    ]
  },
  {
    id: 'atmosphere',
    title: 'Visual Setup',
    subtitle: 'Spacing, hierarchy, and contrast are now tuned for readability.',
    accent: '#c27dcf',
    durationMs: 1400,
    metricLabel: 'Visual polish',
    metricValue: 'Type, spacing, and contrast calibrated',
    narrative: 'The goal is a site that feels designed, not decorated. The interface should support the content instead of competing with it.',
    pulse: 'Subtle color shifts keep the page feeling polished and intentional.',
    lines: [
      '[OK] Typographic scale confirmed',
      '[OK] Panel contrast tuned',
      '[OK] Responsive breakpoints checked',
      '[READY] Layout ready for browsing'
    ]
  },
  {
    id: 'story',
    title: 'Ready to Browse',
    subtitle: 'The portfolio is open and the important links are obvious.',
    accent: '#6edb9f',
    durationMs: 1200,
    metricLabel: 'Launch state',
    metricValue: 'Portfolio open · resume and projects available',
    narrative: 'Now the content can do the talking: work history, projects, skills, and contact links are all easy to find.',
    pulse: 'A final green cue signals that the site is ready.',
    lines: [
      '[OK] Resume available',
      '[OK] Projects and experience visible',
      '[OK] Contact links ready',
      '[READY] Portfolio interface fully awake'
    ]
  }
];

export const apps = [
  { id: 'about', icon: '👤', label: 'About' },
  { id: 'resume', icon: '📄', label: 'Resume' },
  { id: 'projects', icon: '🗂️', label: 'Projects' },
  { id: 'contributions', icon: '📈', label: 'GitHub' },
  { id: 'experience', icon: '🧰', label: 'Experience' },
  { id: 'skills', icon: '⚙️', label: 'Skills' },
  { id: 'power', icon: '🏋️', label: 'Extracurriculars' },
  { id: 'leetcode', icon: '🧩', label: 'LeetCode' },
  { id: 'contact', icon: '📡', label: 'Contact' },
  { id: 'chatbot', icon: '🤖', label: 'Chat' },
  { id: 'help', icon: '⌨️', label: 'Help' }
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
      'Junior AI Engineer · Olixir New York (Omnicom) · Oct 2025 — Present · NYC: Full-stack AI applications for pharmaceutical clients on the Conversational AI team — Nuxt + Vue frontends; Python/FastAPI backends with retrieval via Azure AI Search; RAG pipelines with indexes on Azure Blob; NLP with spaCy under GxP constraints; benchmarked LLM/RAG architectures for performance and regulatory alignment.',
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
    footer: 'Keep this resume in sync with the PDF whenever the file changes.'
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

export const stackBadges: StackBadge[] = [
  { id: 'python', label: 'Python', note: 'APIs, ML, data tooling', lane: 'backend' },
  { id: 'typescript', label: 'TypeScript', note: 'Typed UI + DX', lane: 'frontend' },
  { id: 'react', label: 'React', note: 'Interactive product surfaces', lane: 'frontend' },
  { id: 'vue', label: 'Vue', note: 'Client work + shipping velocity', lane: 'frontend' },
  { id: 'nuxt', label: 'Nuxt', note: 'Production healthcare apps', lane: 'frontend' },
  { id: 'fastapi', label: 'FastAPI', note: 'Retrieval and service layers', lane: 'backend' },
  { id: 'node', label: 'Node.js', note: 'Web backends and tooling', lane: 'backend' },
  { id: 'azure', label: 'Azure', note: 'AI Search + App Service', lane: 'cloud' },
  { id: 'aws', label: 'AWS', note: 'Fargate, ECS, S3, CloudFront', lane: 'cloud' },
  { id: 'docker', label: 'Docker', note: 'Containers + local parity', lane: 'cloud' },
  { id: 'postgresql', label: 'PostgreSQL', note: 'Structured data + SQL', lane: 'data' },
  { id: 'playwright', label: 'Playwright', note: 'QA and CI confidence', lane: 'data' },
  { id: 'pytorch', label: 'PyTorch', note: 'Model training + experimentation', lane: 'data' },
  { id: 'tensorflow', label: 'TensorFlow', note: 'Classifiers + ML workflows', lane: 'data' }
];

export const skillSpotlights: SkillSpotlight[] = [
  {
    title: 'Frontend systems',
    lane: 'frontend',
    score: 91,
    summary: 'I build interfaces that feel sharp under pressure: recruiter-facing dashboards, pharma workflows, and internal tooling that still has to look clean and load fast.',
    proof: 'Recent work spans Nuxt/Vue at Olixir New York plus React-based portfolio and ML tooling projects.',
    stack: ['typescript', 'react', 'vue', 'nuxt']
  },
  {
    title: 'Backend + AI product engineering',
    lane: 'backend',
    score: 93,
    summary: 'My strongest lane is stitching product requirements to AI infrastructure: service APIs, retrieval layers, and evaluation loops that teams can actually trust.',
    proof: 'Python/FastAPI services, Azure AI Search retrieval, spaCy-based NLP, and benchmark work for LLM/RAG architectures.',
    stack: ['python', 'fastapi', 'node', 'postgresql']
  },
  {
    title: 'Cloud delivery',
    lane: 'cloud',
    score: 88,
    summary: 'I am comfortable owning the path from laptop to production, especially when the work needs to stay maintainable for a team after launch.',
    proof: 'Migrated CollabLab services from EC2 to Fargate and shipped apps on Azure App Service with storage and retrieval dependencies.',
    stack: ['aws', 'azure', 'docker', 'playwright']
  },
  {
    title: 'Data + model work',
    lane: 'data',
    score: 87,
    summary: 'I like projects where the engineering and the analysis matter equally: clean data pipelines, interpretable metrics, and models that answer a real question.',
    proof: 'NFL Big Data Bowl modeling, custom neural-net tooling, SQL-heavy internal systems, and ML experimentation across PyTorch and TensorFlow.',
    stack: ['pytorch', 'tensorflow', 'python', 'postgresql']
  }
];

export const featuredStories: ShowcaseStory[] = [
  {
    title: 'Olixir New York · Conversational AI',
    strap: 'Regulated AI delivery',
    summary: 'I build internal healthcare tools where the work has to be useful, explainable, and safe under review. That means pairing polished front-end flows with retrieval systems and APIs that hold up under GxP expectations.',
    outcomes: [
      'Built Nuxt/Vue interfaces for real pharma workflows rather than demo-only surfaces.',
      'Shipped Python/FastAPI services backed by Azure AI Search and blob-based retrieval.',
      'Benchmarked RAG/LLM approaches with performance and regulatory alignment in mind.'
    ],
    stack: ['nuxt', 'vue', 'python', 'fastapi', 'azure']
  },
  {
    title: 'CollabLab / Troy Tutors',
    strap: 'EdTech platform + leadership',
    summary: 'This is where I got sharper at balancing hands-on engineering with delivery leadership. I still build, but I also think in terms of systems, ownership, and how a small team ships reliably.',
    outcomes: [
      'Promoted into part-time engineering management for a five-engineer squad.',
      'Directed EC2 to AWS Fargate migration work for scale, cost, and cleaner ops.',
      'Owned product-facing features like camera-required room enforcement and QA automation.'
    ],
    stack: ['vue', 'node', 'aws', 'docker', 'playwright']
  },
  {
    title: 'JUDGE · NFL Big Data Bowl',
    strap: 'ML + storytelling',
    summary: 'The best side projects for me feel like product work: take a messy problem, build a model, then explain the result in a way another person can trust. JUDGE was exactly that.',
    outcomes: [
      'Designed the JumpLine feature to better describe coverage behavior from tracking data.',
      'Built an XGBoost pipeline with strong predictive performance on a real competition dataset.',
      'Turned the analysis into a named metric instead of leaving it as a notebook experiment.'
    ],
    stack: ['python', 'pytorch', 'tensorflow', 'postgresql']
  }
];

export const aboutSignals: AboutSignal[] = [
  {
    label: 'Current role',
    value: 'AI engineer',
    detail: 'Building conversational AI and product tooling at Olixir New York.'
  },
  {
    label: 'Leadership',
    value: '5 engineers',
    detail: 'Leading a small full-stack team at CollabLab while staying hands-on.'
  },
  {
    label: 'Outside work',
    value: 'Nationals qualified',
    detail: 'Top-6 finish at the East Coast Collegiate Championships in powerlifting.'
  }
];
