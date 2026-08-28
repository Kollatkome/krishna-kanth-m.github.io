import type { ProtoSemAttachment, ProtoSemDateEntry, AttachmentType } from '../types/protosem';
export type { ProtoSemAttachment, ProtoSemDateEntry, AttachmentType };

export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  shortBio: string;
  email: string;
  phone: string;
  location: string;
  githubUrl: string;
  githubUsername: string;
  linkedinUrl: string;
  college: string;
  currentProgram: string;
  graduationYear: string;
  statusBadge: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  accentColor: string;
  skills: {
    name: string;
    level: string;
    description: string;
  }[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  shortDescription: string;
  fullProblem: string;
  solution: string;
  technologies: string[];
  role: string;
  status: string;
  icon: string;
  accentColor: string;
  githubUrl?: string;
  liveUrl?: string;
  highlights: string[];
  evidenceType: string;
}

export interface ProtoSemWeek {
  id: string;
  weekNumber: number;
  slug: string;
  name: string;
  order: number;
  entries: ProtoSemDateEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface BeforeAfterItem {
  pillar: string;
  icon: string;
  before: string;
  journey: string;
  after: string;
}

export interface EvidenceVaultItem {
  id: string;
  title: string;
  category: 'PROJECTS' | 'FORGE' | 'INTERNSHIP' | 'CERTIFICATIONS' | 'ACADEMIC' | 'DOCUMENTS';
  description: string;
  format: 'PDF' | 'IMAGE' | 'CODE' | 'PPT' | 'REPORT';
  date: string;
  size?: string;
  downloadUrl?: string;
  viewUrl?: string;
  previewType: 'pdf' | 'image' | 'modal';
  highlights: string[];
  verified: boolean;
}

export interface CertificationItem {
  id: string;
  title: string;
  organization: string;
  date: string;
  score?: string;
  credentialId?: string;
  verified: boolean;
  skills: string[];
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  score?: string;
  scoreLabel?: string;
  details: string;
  highlights: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  type: string;
  summary: string;
  bullets: string[];
  tags: string[];
}

export interface MediaGalleryItem {
  id: string;
  title: string;
  category: 'PROJECTS' | 'FORGE' | 'INTERNSHIP' | 'EVENTS' | 'CERTIFICATIONS';
  type: 'IMAGE' | 'VIDEO';
  url: string;
  thumbnail?: string;
  caption: string;
  date: string;
  tags: string[];
}

export interface AchievementItem {
  id: string;
  title: string;
  category: 'ACADEMIC' | 'HACKATHON' | 'FELLOWSHIP' | 'CERTIFICATION';
  organization: string;
  date: string;
  score?: string;
  description: string;
  icon: string;
  badge: string;
  highlights: string[];
}

// -------------------------------------------------------------
// VERIFIED DATA
// -------------------------------------------------------------

export const personalInfo: PersonalInfo = {
  name: "Krishna Kanth M",
  title: "MCA Student • AI/ML Enthusiast • Frontend Developer",
  tagline: "Bridging the gap between conceptual algorithms, modern software architecture, and intelligent interfaces.",
  shortBio: "Master of Computer Applications student at Kumaraguru College of Technology with a strong foundation in Artificial Intelligence, Machine Learning, Python, and Modern Web Engineering. Experienced in building responsive interfaces and academic IoT solutions.",
  email: "krishnakanth.m16@gmail.com",
  phone: "+91 9080110139",
  location: "Tamil Nadu, India",
  githubUrl: "https://github.com/krishna-kanth-m",
  githubUsername: "krishna-kanth-m",
  linkedinUrl: "https://www.linkedin.com/in/krishna-kanth-m-b48970384",
  college: "Kumaraguru College of Technology",
  currentProgram: "Master of Computer Applications (MCA)",
  graduationYear: "2025 – 2027",
  statusBadge: "Available for AI Roles & Engineering Projects"
};

export const educationList: EducationItem[] = [
  {
    id: "mca",
    degree: "Master of Computer Applications (MCA)",
    institution: "Kumaraguru College of Technology",
    period: "2025 – 2027",
    details: "Advanced computing, intelligent systems, machine learning fundamentals, software architecture, and enterprise engineering workflows.",
    highlights: [
      "Specializing in AI & Intelligent Computing",
      "Selected for PRICE ProtoSem Innovation Programme",
      "Applied Software Engineering & Database Systems"
    ]
  },
  {
    id: "bvoc",
    degree: "Bachelor of Vocational in Information & Communication Technology",
    institution: "National College",
    period: "2022 – 2025",
    score: "9.29 / 10.0 CGPA",
    scoreLabel: "First Class with Distinction",
    details: "Rigorous curriculum encompassing foundational programming, relational databases, computer networking, and applied software development.",
    highlights: [
      "Graduated with Distinction (9.29 CGPA)",
      "Built IoT-Based Home Automation capstone project",
      "Core mastery of Python, SQL, and Web Technologies"
    ]
  }
];

export const experienceList: ExperienceItem[] = [
  {
    id: "fg-global",
    role: "Frontend Developer Intern",
    organization: "FG Global",
    period: "August 2024",
    type: "Industry Internship",
    summary: "Worked directly on user interface development, responsive layouts, and modern frontend architecture.",
    bullets: [
      "Engineered and styled modular frontend components adhering to strict UI/UX design specifications.",
      "Gained hands-on industry experience building cross-browser compatible, high-performance web interfaces.",
      "Enhanced understanding of modern frontend workflows, component reusability, and rapid prototyping."
    ],
    tags: ["UI/UX Design", "Responsive Web", "Frontend Workflows", "HTML5/CSS3", "JavaScript"]
  },
  {
    id: "protosem-trainee",
    role: "Innovation Engineer Trainee",
    organization: "PRICE ProtoSem (Forge / Kumaraguru)",
    period: "2025 – 2026 (20-Week Cohort)",
    type: "Industry-Integrated Innovation",
    summary: "Selected for intensive 20-week programme solving industry retail & commerce challenges through AI, IoT, and prototyping.",
    bullets: [
      "Tackling real-world retail and intelligent commerce challenges through hardware-software integration.",
      "Iterating through customer discovery, problem refinement, rapid proof-of-concept prototyping, and validation.",
      "Developing multidisciplinary problem-solving skills across embedded systems, analytics, and agile execution."
    ],
    tags: ["Phygital Retail", "AI & Analytics", "Intelligent Systems", "IoT", "Venture Prototyping"]
  }
];

export const skillCategories: SkillCategory[] = [
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    subtitle: "Intelligent Computing & Modeling",
    icon: "Brain",
    accentColor: "purple",
    skills: [
      { name: "Machine Learning (Foundations)", level: "Core", description: "Supervised & unsupervised learning concepts, algorithm evaluation" },
      { name: "Artificial Intelligence", level: "Core", description: "Intelligent agent architectures, search algorithms, heuristic methods" },
      { name: "Prompt Engineering", level: "Applied", description: "Structured LLM prompting, context framing, workflow automation" },
      { name: "Antigravity AI Tools", level: "Applied", description: "Agentic coding environments, MCP integrations, rapid building" },
      { name: "Data Modeling", level: "Core", description: "Feature framing, data schemas, relational structures" }
    ]
  },
  {
    id: "core-dev",
    title: "Programming & Database",
    subtitle: "Foundational Engineering",
    icon: "Code",
    accentColor: "brand",
    skills: [
      { name: "Python", level: "Proficient", description: "Core data structures, OOP, file processing, data transformation" },
      { name: "SQL & Relational DBs", level: "Proficient", description: "Complex queries, schema design, joins, data integrity" },
      { name: "Data Structures & Algorithms", level: "Core", description: "Time/space complexity, arrays, trees, search & sorting" },
      { name: "Object-Oriented Programming", level: "Core", description: "Encapsulation, inheritance, polymorphism, modular architecture" },
      { name: "Database Management", level: "Applied", description: "Normalization, ACID properties, indexing basics" }
    ]
  },
  {
    id: "frontend-web",
    title: "Frontend & UI Design",
    subtitle: "Modern Web Interfaces",
    icon: "Layout",
    accentColor: "cyan",
    skills: [
      { name: "Frontend Development", level: "Proficient", description: "Component-driven architecture, state management, modern workflows" },
      { name: "HTML5 & Modern CSS3", level: "Proficient", description: "Semantic markup, Flexbox, Grid, custom properties, animations" },
      { name: "JavaScript / TypeScript", level: "Proficient", description: "DOM manipulation, ES6+ async/await, strictly typed data structures" },
      { name: "Responsive & Glassmorphic UI", level: "Applied", description: "Mobile-first layouts, backdrop filters, micro-interactions" },
      { name: "UI Prototyping (Canva / Figma)", level: "Applied", description: "Visual wireframing, layout experimentation, visual identity" }
    ]
  },
  {
    id: "cloud-tools",
    title: "Cloud, IoT & Tools",
    subtitle: "Infrastructure & Hardware",
    icon: "Cloud",
    accentColor: "emerald",
    skills: [
      { name: "Google Cloud Platform", level: "Certified (73%)", description: "Cloud computing foundations, IAM, compute instances, storage buckets" },
      { name: "Git & GitHub", level: "Proficient", description: "Version control, branching, PR workflows, GitHub Pages deployment" },
      { name: "IoT & Hardware Sensors", level: "Applied", description: "Microcontroller interfacing, sensor telemetry, wireless relay control" },
      { name: "Microsoft Office & Docs", level: "Proficient", description: "Technical report documentation, data spreadsheets, presentations" }
    ]
  },
  {
    id: "soft-skills",
    title: "Professional & Soft Skills",
    subtitle: "Execution & Collaboration",
    icon: "Users",
    accentColor: "rose",
    skills: [
      { name: "Analytical Problem Solving", level: "Core", description: "Deconstructing ambiguous challenges into systematic execution steps" },
      { name: "Effective Technical Communication", level: "Core", description: "Explaining engineering concepts clearly across multidisciplinary teams" },
      { name: "Team Collaboration & Leadership", level: "Core", description: "Pair programming, peer code reviews, hackathon team coordination" },
      { name: "Agility & Adaptability", level: "Core", description: "Rapidly mastering emerging tools, frameworks, and AI workflows" }
    ]
  }
];

export const projectList: ProjectItem[] = [
  {
    id: "iot-home-automation",
    title: "IoT-Based Home Automation System",
    category: "EMBEDDED_IOT",
    categoryLabel: "Hardware & IoT Systems",
    shortDescription: "Embedded IoT system for real-time remote appliance control, telemetry monitoring, and household energy optimization.",
    fullProblem: "Residential energy waste and accessibility constraints necessitate wireless, low-latency control systems that operate reliably without complex infrastructure.",
    solution: "Engineered an IoT microcontroller-based prototype with wireless relays and sensor telemetry, providing real-time device switching and environmental monitoring.",
    technologies: ["IoT Hardware", "Microcontrollers", "Relay Telemetry", "Embedded C/Python", "Wireless Control"],
    role: "Lead Hardware & System Developer",
    status: "Completed (Academic Capstone)",
    icon: "Home",
    accentColor: "cyan",
    githubUrl: "https://github.com/krishna-kanth-m",
    highlights: [
      "Wireless remote control of home appliances",
      "Sensor telemetry for temperature & state monitoring",
      "Energy conservation and safety fail-safes",
      "Hardware-software integration and validation"
    ],
    evidenceType: "Hardware Prototype & Technical Report"
  },
  {
    id: "ai-ml-lab",
    title: "AI & ML Research & Modeling Lab",
    category: "AI_ML",
    categoryLabel: "AI & Machine Learning",
    shortDescription: "Exploratory machine learning modeling, data analysis pipelines, and prompt engineering experiments using Python and SQL.",
    fullProblem: "Understanding data patterns, algorithmic behavior, and evaluating model accuracy across structured datasets.",
    solution: "Constructed end-to-end Python exploratory scripts and SQL analytical queries, incorporating generative AI prompt pipelines to automate data insights.",
    technologies: ["Python", "SQL", "Machine Learning", "Prompt Engineering", "Data Analytics"],
    role: "ML Explorer & Data Developer",
    status: "Active Research & Development",
    icon: "Cpu",
    accentColor: "purple",
    githubUrl: "https://github.com/krishna-kanth-m",
    highlights: [
      "Structured data exploration with Python & SQL",
      "Evaluation of supervised baseline models",
      "Prompt engineering workflows for automated data extraction",
      "Reproducible experimentation notebooks"
    ],
    evidenceType: "Code Repositories & Analytical Notebooks"
  },
  {
    id: "design-audit-agent",
    title: "Design-Audit-Agent",
    category: "AI_DEV",
    categoryLabel: "Autonomous AI & Tooling",
    shortDescription: "Automated analysis tool leveraging AI workflows to audit frontend interfaces, accessibility, and visual compliance.",
    fullProblem: "Manual UI audits are time-consuming and prone to missing subtle accessibility and design token inconsistencies.",
    solution: "Created an autonomous agent workflow that inspects UI layouts, parses DOM hierarchies, and flags visual and accessibility bugs.",
    technologies: ["Python", "AI Workflows", "DOM Inspection", "Automation", "Git"],
    role: "Creator & Developer",
    status: "Repository Published",
    icon: "ShieldCheck",
    accentColor: "brand",
    githubUrl: "https://github.com/Kollatkome/Design-Audit-Agent",
    highlights: [
      "Automated inspection of frontend design tokens",
      "Accessibility audit reporting",
      "Published open-source repository on GitHub"
    ],
    evidenceType: "Open-Source GitHub Repository"
  },
  {
    id: "code-slayers-hackathon",
    title: "Code-Slayers Solution (PSG Hackathon)",
    category: "FULL_STACK",
    categoryLabel: "Hackathon Engineering",
    shortDescription: "Collaborative rapid prototype developed during PSG Hackathon addressing real-time software automation challenges.",
    fullProblem: "High-intensity hackathon challenge requiring rapid architectural design, API integration, and MVP delivery under strict time constraints.",
    solution: "Co-developed an agile web application featuring responsive layouts, reliable backend handling, and dynamic data presentation.",
    technologies: ["JavaScript", "Full Stack", "API Integration", "Git Collaboration"],
    role: "Frontend & Team Engineer",
    status: "Hackathon Submission",
    icon: "Trophy",
    accentColor: "emerald",
    githubUrl: "https://github.com/PSG-HACKATHON/Code-Slayers",
    highlights: [
      "Rapid prototype delivery under 24-hour deadline",
      "Collaborative team git workflow",
      "Interactive data display and user feedback mechanisms"
    ],
    evidenceType: "Hackathon Repository & Project"
  }
];

export const protoSemWeeks: ProtoSemWeek[] = Array.from({ length: 20 }, (_, idx) => {
  const numStr = idx < 10 ? `0${idx}` : `${idx}`;
  return {
    id: `week-${numStr}`,
    weekNumber: idx,
    slug: `week-${numStr}`,
    name: '', // Separately editable week name (initially empty)
    order: idx,
    entries: [], // Empty initial content state — WEEK 00 through WEEK 19
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
});

export const beforeAfterComparison: BeforeAfterItem[] = [
  {
    pillar: "Problem Understanding",
    icon: "Search",
    before: "Generic problem definitions based solely on textbook theories without customer validation.",
    journey: "Conducting customer discovery, pain-point mapping, and stakeholder interviews in real environments.",
    after: "Precision problem framing anchored on quantifiable industry friction and measurable ROI."
  },
  {
    pillar: "Technical Prototyping",
    icon: "Wrench",
    before: "Siloed coding with isolated scripts and simulated, non-integrated mock datasets.",
    journey: "Hands-on hardware assembly, embedded sensor calibration, and full-stack API integration.",
    after: "End-to-end working systems connecting microcontrollers, databases, AI models, and real-time UIs."
  },
  {
    pillar: "AI & Software Application",
    icon: "Brain",
    before: "Theoretical awareness of machine learning algorithms without practical pipeline deployment.",
    journey: "Implementing Python analytics, evaluating baseline models, and leveraging prompt engineering.",
    after: "Applied intelligent solutions designed to process live telemetry and automate decision workflows."
  },
  {
    pillar: "Communication & Pitching",
    icon: "Presentation",
    before: "Academic presentation style focused heavily on bullet points and technical jargon.",
    journey: "Structured feedback cycles, mentor defense panels, and live demonstration rehearsals.",
    after: "Executive-level storytelling highlighting problem gravity, solution clarity, and business impact."
  },
  {
    pillar: "Engineering Agility & Mindset",
    icon: "Zap",
    before: "Linear development with hesitation when unexpected technical constraints arose.",
    journey: "Rapid iteration cycles, continuous debugging in Forge labs, and agile pivot readiness.",
    after: "Resilient problem solver with high adaptability, rapid debugging ability, and execution speed."
  }
];

export const evidenceVaultItems: EvidenceVaultItem[] = [
  {
    id: "nptel-gcp-cert",
    title: "Google Cloud Computing Foundations Certificate",
    category: "CERTIFICATIONS",
    description: "Official NPTEL certification verifying proficiency in cloud architecture, compute resources, IAM security, and cloud storage systems.",
    format: "PDF",
    date: "October 2024",
    size: "1.2 MB",
    downloadUrl: "#",
    viewUrl: "#",
    previewType: "pdf",
    highlights: ["Official NPTEL Score: 73%", "Verified Cloud Architecture Credential", "Google Cloud Core Concepts"],
    verified: true
  },
  {
    id: "fg-global-internship-record",
    title: "FG Global Frontend Internship Experience Letter",
    category: "INTERNSHIP",
    description: "Industry internship documentation certifying successful frontend user interface engineering, design workflows, and component modularity.",
    format: "PDF",
    date: "August 2024",
    size: "850 KB",
    downloadUrl: "#",
    viewUrl: "#",
    previewType: "pdf",
    highlights: ["Responsive UI Engineering", "Cross-Browser Compatibility", "Agile Component Development"],
    verified: true
  },
  {
    id: "iot-project-report",
    title: "IoT Home Automation Technical Report & Schematics",
    category: "PROJECTS",
    description: "Complete technical architecture dossier covering sensor schematics, microcontroller firmware logic, wireless relay triggers, and test results.",
    format: "REPORT",
    date: "May 2024",
    size: "3.4 MB",
    downloadUrl: "#",
    viewUrl: "#",
    previewType: "pdf",
    highlights: ["Hardware Schematics & Wiring Diagrams", "Wireless Relay Telemetry Protocols", "System Testing & Energy Analysis"],
    verified: true
  },
  {
    id: "protosem-phase1-deck",
    title: "PRICE ProtoSem Phase 01 Problem Discovery Pitch Deck",
    category: "FORGE",
    description: "Comprehensive executive deck presented during Phase 01 milestone review detailing retail problem validation and stakeholder insights.",
    format: "PPT",
    date: "Phase 01 Review",
    size: "4.8 MB",
    downloadUrl: "#",
    viewUrl: "#",
    previewType: "modal",
    highlights: ["Stakeholder Needs Analysis", "Value Proposition Canvas", "Technical Feasibility Matrix"],
    verified: true
  },
  {
    id: "ats-resume-master",
    title: "Krishna Kanth M — Master ATS Resume",
    category: "DOCUMENTS",
    description: "Clean, ATS-optimized single-page master resume detailing education, technical competencies, projects, and internship credentials.",
    format: "PDF",
    date: "August 2026",
    size: "180 KB",
    downloadUrl: "resume.html",
    viewUrl: "resume.html",
    previewType: "pdf",
    highlights: ["ATS-Optimized Formatting", "Kumaraguru MCA & National College B.Voc", "NPTEL Certified & FG Global Intern"],
    verified: true
  },
  {
    id: "bvoc-degree-transcript",
    title: "B.Voc ICT Academic Record (9.29 CGPA)",
    category: "ACADEMIC",
    description: "Official academic distinction record for Bachelor of Vocational in Information & Communication Technology from National College.",
    format: "PDF",
    date: "May 2025",
    size: "1.1 MB",
    downloadUrl: "#",
    viewUrl: "#",
    previewType: "pdf",
    highlights: ["CGPA: 9.29 / 10.0", "First Class with Distinction", "Information & Communication Technology"],
    verified: true
  }
];

export const certificationsList: CertificationItem[] = [
  {
    id: "nptel-gcp",
    title: "Google Cloud Computing Foundations",
    organization: "NPTEL / Google Cloud",
    date: "October 2024",
    score: "73%",
    credentialId: "NPTEL-GCP-2024-73",
    verified: true,
    skills: ["Cloud Architecture", "Google Cloud Compute", "Cloud Storage", "IAM Security", "Networking"],
    description: "Demonstrated thorough understanding of cloud computing architecture, scalable virtual machines, storage paradigms, resource security, and cloud data infrastructure."
  }
];

export const achievementsList: AchievementItem[] = [
  {
    id: "bvoc-gold-distinction",
    title: "First Class with Distinction (9.29 CGPA)",
    category: "ACADEMIC",
    organization: "National College",
    date: "2022 – 2025",
    score: "9.29 / 10.0 CGPA",
    description: "Graduated with top-tier academic distinction in Bachelor of Vocational in Information & Communication Technology, demonstrating consistent excellence across algorithmic programming and database systems.",
    icon: "GraduationCap",
    badge: "Academic Distinction",
    highlights: [
      "Graduated with 9.29 Cumulative Grade Point Average",
      "Ranked at the top of the graduating department cohort",
      "Capstone IoT System Selected for Academic Exhibition"
    ]
  },
  {
    id: "protosem-fellowship-induction",
    title: "PRICE ProtoSem Innovation Fellowship Selection",
    category: "FELLOWSHIP",
    organization: "Forge Innovation & Ventures / Kumaraguru",
    date: "2025 – 2026",
    score: "20-Week Selective Fellowship",
    description: "Selected into the intensive 20-week industry-integrated innovation cohort at Forge to engineer intelligent retail, AI analytics, and phygital commerce systems.",
    icon: "Rocket",
    badge: "Innovation Fellowship",
    highlights: [
      "Rigorous multi-round technical and problem-solving selection",
      "Direct venture engineering and customer discovery training",
      "Hardware prototyping lab and sensor testbed access"
    ]
  },
  {
    id: "nptel-gcp-elite",
    title: "Google Cloud Computing Foundations Certification",
    category: "CERTIFICATION",
    organization: "NPTEL / Google Cloud",
    date: "October 2024",
    score: "73% Score",
    description: "Completed rigorous nationwide cloud examination covering cloud infrastructure, virtualization, IAM security protocols, and scalable compute pipelines.",
    icon: "Award",
    badge: "Verified Cloud Credential",
    highlights: [
      "73% National Examination Score",
      "Credential Verification ID: NPTEL-GCP-2024-73",
      "Cloud Infrastructure, IAM Security & Compute Provisioning"
    ]
  },
  {
    id: "psg-hackathon-finalist",
    title: "PSG Hackathon Engineering Prototype (Code-Slayers)",
    category: "HACKATHON",
    organization: "PSG College of Technology",
    date: "2024",
    score: "24-Hour Prototype",
    description: "Collaborated under high-pressure 24-hour sprint in the Code-Slayers team to architect and build an automated full-stack software prototype.",
    icon: "Trophy",
    badge: "Hackathon Engineering",
    highlights: [
      "24-Hour Rapid Product Development & System Integration",
      "End-to-End API Integration & Responsive UI",
      "Collaborative Team Git Architecture & Live Presentation"
    ]
  }
];

export const mediaGalleryList: MediaGalleryItem[] = [
  {
    id: "media-iot-prototype",
    title: "IoT Smart Automation Microcontroller Rig",
    category: "PROJECTS",
    type: "IMAGE",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    caption: "Hardware testbed assembly featuring microcontroller relay interfacing, telemetry breadboards, and wireless transceiver module.",
    date: "May 2024",
    tags: ["IoT Hardware", "Sensors", "Microcontrollers", "Automation"]
  },
  {
    id: "media-forge-lab",
    title: "PRICE ProtoSem Innovation Lab Sprint",
    category: "FORGE",
    type: "IMAGE",
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    caption: "Collaborative domain scoping and retail journey mapping workshop inside Forge Innovation Labs.",
    date: "January 2026",
    tags: ["ProtoSem", "Innovation Sprint", "Forge Labs", "Team Ideation"]
  },
  {
    id: "media-frontend-internship",
    title: "FG Global Modular UI Engineering",
    category: "INTERNSHIP",
    type: "IMAGE",
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    caption: "Responsive frontend layout engineering and cross-browser testing environment during FG Global internship.",
    date: "August 2024",
    tags: ["Frontend", "UI/UX", "Industry Internship", "Clean Code"]
  },
  {
    id: "media-psg-hackathon",
    title: "PSG Hackathon Code-Slayers Live Build",
    category: "EVENTS",
    type: "IMAGE",
    url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    caption: "24-hour rapid prototyping hackathon team session engineering real-time data visualization endpoints.",
    date: "March 2024",
    tags: ["PSG Hackathon", "Code-Slayers", "Rapid Prototyping", "Teamwork"]
  },
  {
    id: "media-gcp-cert",
    title: "Google Cloud Computing Foundations Validation",
    category: "CERTIFICATIONS",
    type: "IMAGE",
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    caption: "Cloud architecture benchmarking and compute engine provisioning verification.",
    date: "October 2024",
    tags: ["Google Cloud", "NPTEL", "Cloud Compute", "IAM"]
  },
  {
    id: "media-ai-lab-notebook",
    title: "AI & Machine Learning Exploratory Data Pipeline",
    category: "PROJECTS",
    type: "IMAGE",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    caption: "Python exploratory scripts and SQL analytical queries evaluating model classification accuracy.",
    date: "December 2024",
    tags: ["Python Analytics", "Machine Learning", "SQL", "Data Science"]
  }
];

