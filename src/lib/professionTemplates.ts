/**
 * Profession Template Registry — 2026 Top 20
 *
 * Each entry maps a profession to:
 *   - a BASE layout archetype (Clinical / Technical / Executive / Trades)
 *   - profession-specific accent color
 *   - icon (lucide-react name)
 *   - section schema (custom section blocks, in display order)
 *   - default headline copy used when previewing on empty profiles
 *
 * Rendered by <ProfessionTemplate /> — one component, switches base layout
 * by `base`, decorates with the schema below.
 */

export type TemplateBase = 'clinical' | 'technical' | 'executive' | 'trades';

export interface SectionBlock {
  /** Stable id used by the base layout to know which section panel to render */
  key: string;
  /** Display label */
  label: string;
}

export interface ProfessionTemplate {
  id: string;
  name: string;
  description: string;
  base: TemplateBase;
  /** Tailwind-safe HSL accent (used as CSS var --tpl-accent) */
  accent: string;
  /** lucide-react icon name */
  icon: string;
  /** Section blocks rendered in order */
  sections: SectionBlock[];
}

export const PROFESSION_TEMPLATES: ProfessionTemplate[] = [
  /* ── Healthcare (1-8) ────────────────────────────────────────────────── */
  {
    id: 'nurse-practitioner',
    name: 'Nurse Practitioner',
    description: 'Clinical skills, flexibility, medical growth timeline',
    base: 'clinical',
    accent: '188 78% 41%',
    icon: 'Stethoscope',
    sections: [
      { key: 'certifications', label: 'Board Certifications' },
      { key: 'clinical-skills', label: 'Clinical Competencies' },
      { key: 'experience', label: 'Practice History' },
      { key: 'cme', label: 'Continuing Education' },
    ],
  },
  {
    id: 'registered-nurse',
    name: 'Registered Nurse',
    description: 'OR, pediatric and oncology specialization blocks',
    base: 'clinical',
    accent: '0 72% 51%',
    icon: 'HeartPulse',
    sections: [
      { key: 'specialties', label: 'Specialties' },
      { key: 'shift-history', label: 'Shift & Unit History' },
      { key: 'experience', label: 'Hospital Experience' },
      { key: 'certifications', label: 'Licensure & Certifications' },
    ],
  },
  {
    id: 'physical-therapist',
    name: 'Physical Therapist',
    description: 'Rehabilitation case studies and outcome metrics',
    base: 'clinical',
    accent: '142 71% 45%',
    icon: 'Activity',
    sections: [
      { key: 'case-studies', label: 'Rehabilitation Case Studies' },
      { key: 'techniques', label: 'Treatment Modalities' },
      { key: 'experience', label: 'Clinical Practice' },
      { key: 'outcomes', label: 'Patient Outcomes' },
    ],
  },
  {
    id: 'physician-assistant',
    name: 'Physician Assistant',
    description: 'Certifications and collaborative practice logs',
    base: 'clinical',
    accent: '217 91% 60%',
    icon: 'ClipboardCheck',
    sections: [
      { key: 'certifications', label: 'NCCPA Certifications' },
      { key: 'procedures', label: 'Procedures Performed' },
      { key: 'experience', label: 'Collaborative Practice' },
      { key: 'rotations', label: 'Clinical Rotations' },
    ],
  },
  {
    id: 'behavioral-health',
    name: 'Behavioral Health Counselor',
    description: 'Mental health support and practice experience',
    base: 'clinical',
    accent: '262 83% 58%',
    icon: 'Brain',
    sections: [
      { key: 'modalities', label: 'Therapeutic Modalities' },
      { key: 'populations', label: 'Populations Served' },
      { key: 'experience', label: 'Practice Settings' },
      { key: 'credentials', label: 'Licensure & Supervision' },
    ],
  },
  {
    id: 'respiratory-therapist',
    name: 'Respiratory Therapist',
    description: 'Specialized clinical care and respiratory gear certifications',
    base: 'clinical',
    accent: '199 89% 48%',
    icon: 'Wind',
    sections: [
      { key: 'equipment', label: 'Respiratory Equipment Mastery' },
      { key: 'certifications', label: 'RRT / NPS Certifications' },
      { key: 'experience', label: 'ICU & ER Experience' },
      { key: 'protocols', label: 'Protocols Authored' },
    ],
  },
  {
    id: 'occupational-therapist',
    name: 'Occupational Therapist',
    description: 'Specialist care and rehabilitation progress layouts',
    base: 'clinical',
    accent: '24 95% 53%',
    icon: 'Hand',
    sections: [
      { key: 'specialties', label: 'Therapy Specialties' },
      { key: 'case-studies', label: 'Patient Progress Studies' },
      { key: 'experience', label: 'Practice Settings' },
      { key: 'certifications', label: 'Specialty Certifications' },
    ],
  },
  {
    id: 'home-care-caregiver',
    name: 'Home Care Caregiver',
    description: 'Aging-in-place care and patient relationship management',
    base: 'clinical',
    accent: '340 82% 52%',
    icon: 'Home',
    sections: [
      { key: 'care-model', label: 'Care Model' },
      { key: 'experience', label: 'Client Experience' },
      { key: 'testimonials', label: 'Family Testimonials' },
      { key: 'training', label: 'Specialized Training' },
    ],
  },

  /* ── Technology & AI (9-12) ──────────────────────────────────────────── */
  {
    id: 'ai-ml-engineer',
    name: 'AI / ML Engineer',
    description: 'Model architecture and deployment metrics',
    base: 'technical',
    accent: '263 70% 50%',
    icon: 'BrainCircuit',
    sections: [
      { key: 'models', label: 'Models Deployed' },
      { key: 'architecture', label: 'Architecture Showcase' },
      { key: 'experience', label: 'ML Engineering Roles' },
      { key: 'publications', label: 'Papers & Patents' },
    ],
  },
  {
    id: 'cybersecurity-analyst',
    name: 'Cybersecurity Analyst',
    description: 'Threat analysis and risk mitigation case files',
    base: 'technical',
    accent: '142 71% 45%',
    icon: 'ShieldCheck',
    sections: [
      { key: 'case-files', label: 'Threat Case Files' },
      { key: 'certifications', label: 'CISSP / OSCP / CEH' },
      { key: 'experience', label: 'Security Operations' },
      { key: 'frameworks', label: 'Frameworks Implemented' },
    ],
  },
  {
    id: 'it-manager',
    name: 'IT Manager',
    description: 'Infrastructure oversight, team leadership, uptime',
    base: 'technical',
    accent: '217 91% 60%',
    icon: 'Server',
    sections: [
      { key: 'uptime', label: 'Uptime & SLA Track Record' },
      { key: 'team', label: 'Team Leadership' },
      { key: 'experience', label: 'Infrastructure Roles' },
      { key: 'tooling', label: 'Tooling & Stack' },
    ],
  },
  {
    id: 'data-engineer',
    name: 'Data Engineer & Analytics',
    description: 'Pipeline architecture and BI metrics',
    base: 'technical',
    accent: '188 78% 41%',
    icon: 'Database',
    sections: [
      { key: 'pipelines', label: 'Data Pipelines Built' },
      { key: 'stack', label: 'Stack & Warehouses' },
      { key: 'experience', label: 'Data Roles' },
      { key: 'impact', label: 'Business Impact Metrics' },
    ],
  },

  /* ── Business & Operations (13-15) ───────────────────────────────────── */
  {
    id: 'financial-manager',
    name: 'Financial Manager',
    description: 'Budget scaling and fiscal growth frameworks',
    base: 'executive',
    accent: '160 84% 39%',
    icon: 'TrendingUp',
    sections: [
      { key: 'budgets', label: 'Budgets Managed' },
      { key: 'frameworks', label: 'Financial Frameworks' },
      { key: 'experience', label: 'Leadership History' },
      { key: 'credentials', label: 'CPA / CFA Credentials' },
    ],
  },
  {
    id: 'project-manager',
    name: 'Project Manager',
    description: 'Remote operations and agile delivery tracking',
    base: 'executive',
    accent: '24 95% 53%',
    icon: 'KanbanSquare',
    sections: [
      { key: 'projects', label: 'Project Portfolio' },
      { key: 'methodology', label: 'Methodologies' },
      { key: 'experience', label: 'Delivery Leadership' },
      { key: 'certifications', label: 'PMP / PRINCE2 / CSM' },
    ],
  },
  {
    id: 'operations-manager',
    name: 'Operations Manager',
    description: 'Cross-industry budget execution and resource management',
    base: 'executive',
    accent: '217 91% 60%',
    icon: 'Briefcase',
    sections: [
      { key: 'operations', label: 'Operations Owned' },
      { key: 'frameworks', label: 'Policy Frameworks' },
      { key: 'experience', label: 'Leadership Roles' },
      { key: 'impact', label: 'Efficiency Gains' },
    ],
  },

  /* ── Skilled Trades & Tech Ops (16-20) ───────────────────────────────── */
  {
    id: 'electrician',
    name: 'Electrician',
    description: 'Electrification trends and complex power-system work',
    base: 'trades',
    accent: '45 93% 47%',
    icon: 'Zap',
    sections: [
      { key: 'licenses', label: 'Licenses & Compliance' },
      { key: 'projects', label: 'Installation Portfolio' },
      { key: 'experience', label: 'Field Experience' },
      { key: 'specialties', label: 'System Specialties' },
    ],
  },
  {
    id: 'sales-representative',
    name: 'Sales Representative',
    description: 'Growth pipelines and client relationship dashboards',
    base: 'executive',
    accent: '340 82% 52%',
    icon: 'LineChart',
    sections: [
      { key: 'quota', label: 'Quota Attainment' },
      { key: 'pipeline', label: 'Pipeline Highlights' },
      { key: 'experience', label: 'Sales Roles' },
      { key: 'wins', label: 'Marquee Wins' },
    ],
  },
  {
    id: 'customer-experience',
    name: 'Customer Experience Rep',
    description: 'Resolution metrics, retention, inquiry workflows',
    base: 'executive',
    accent: '188 78% 41%',
    icon: 'MessageCircle',
    sections: [
      { key: 'metrics', label: 'CSAT & Resolution Metrics' },
      { key: 'workflows', label: 'Workflows Optimized' },
      { key: 'experience', label: 'Support Roles' },
      { key: 'training', label: 'CX Training' },
    ],
  },
  {
    id: 'construction-manager',
    name: 'Construction Manager',
    description: 'Site certifications, project scaling, asset tracking',
    base: 'trades',
    accent: '20 90% 48%',
    icon: 'HardHat',
    sections: [
      { key: 'projects', label: 'Site Portfolio' },
      { key: 'certifications', label: 'OSHA / LEED Certifications' },
      { key: 'experience', label: 'Site Leadership' },
      { key: 'safety', label: 'Safety Record' },
    ],
  },
  {
    id: 'cloud-architect',
    name: 'Cloud Architect',
    description: '2026 enterprise scale and microservices architecture',
    base: 'technical',
    accent: '199 89% 48%',
    icon: 'Cloud',
    sections: [
      { key: 'architectures', label: 'Cloud Architectures' },
      { key: 'certifications', label: 'AWS / GCP / Azure Pro' },
      { key: 'experience', label: 'Architecture Leadership' },
      { key: 'scale', label: 'Scale & Cost Wins' },
    ],
  },
];

export function getProfessionTemplate(id: string): ProfessionTemplate | undefined {
  return PROFESSION_TEMPLATES.find((t) => t.id === id);
}

/** Quick lookup set used by render switches to detect "is this a profession template?" */
export const PROFESSION_TEMPLATE_IDS = new Set(PROFESSION_TEMPLATES.map((t) => t.id));
