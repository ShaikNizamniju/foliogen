/**
 * Profession Template Registry — 2026 Top 20
 *
 * Each entry maps a profession to:
 *   - a BASE layout archetype (Clinical / Technical / Executive / Trades)
 *   - profession-specific accent color
 *   - icon (lucide-react name)
 *   - section schema (custom section blocks, in display order)
 *   - sample fallback data shown in the preview when the profile is empty,
 *     so every template feels populated and bespoke even on a fresh account
 *
 * Rendered by <ProfessionTemplate /> — one component, four genuinely distinct
 * base layouts, decorated with the schema below.
 */

export type TemplateBase = 'clinical' | 'technical' | 'executive' | 'trades';

/** Section block kinds the renderer knows how to draw structurally. */
export type SectionKind =
  | 'timeline'       // vertical dated timeline (clinical rotations, work history)
  | 'badge-grid'     // certifications / compliance / licenses
  | 'metric-grid'    // KPI tiles with number + caption
  | 'checklist'      // equipment mastery / protocols
  | 'cards'          // case studies, projects, threat case files
  | 'code-block'     // architecture / stack snippets (technical only)
  | 'pill-cloud';    // skills, modalities, specialties

export interface SectionBlock {
  /** Stable id used in render switch */
  key: string;
  /** Display label */
  label: string;
  /** Structural rendering kind */
  kind: SectionKind;
}

/** Generic sample item used by several section kinds. */
export interface SampleItem {
  title: string;
  caption?: string;
  meta?: string;
}

export interface ProfessionTemplate {
  id: string;
  name: string;
  description: string;
  base: TemplateBase;
  /** HSL accent stored as `H S% L%` (used as CSS var --tpl-accent) */
  accent: string;
  /** lucide-react icon name */
  icon: string;
  /** Profession tagline used under the name when profile has no headline */
  tagline: string;
  /** Section blocks rendered in order */
  sections: SectionBlock[];
  /** Bespoke fallback content keyed by section.key */
  samples: Record<string, SampleItem[]>;
}

/* ── Healthcare (1-8) ──────────────────────────────────────────────────── */

const HEALTHCARE: ProfessionTemplate[] = [
  {
    id: 'nurse-practitioner',
    name: 'Nurse Practitioner',
    description: 'Clinical skills, flexibility, medical growth timeline',
    base: 'clinical',
    accent: '188 78% 41%',
    icon: 'Stethoscope',
    tagline: 'Board-Certified Family Nurse Practitioner · Primary & Acute Care',
    sections: [
      { key: 'board-certifications', label: 'Medical Board Certifications', kind: 'badge-grid' },
      { key: 'clinical-rotations', label: 'Clinical Rotations', kind: 'timeline' },
      { key: 'departmental-specializations', label: 'Departmental Specializations', kind: 'pill-cloud' },
      { key: 'patient-care-timeline', label: 'Patient Care Timeline', kind: 'timeline' },
    ],
    samples: {
      'board-certifications': [
        { title: 'FNP-BC', caption: 'ANCC · 2024' },
        { title: 'AGACNP-BC', caption: 'AANP · 2023' },
        { title: 'ACLS Instructor', caption: 'AHA · 2025' },
        { title: 'PALS Provider', caption: 'AHA · 2025' },
      ],
      'clinical-rotations': [
        { title: 'Cardiothoracic ICU', caption: 'Mayo Clinic, Rochester', meta: '2025 · 480h' },
        { title: 'Pediatric Oncology', caption: 'St. Jude Children\'s Research', meta: '2024 · 320h' },
        { title: 'Emergency Department', caption: 'Mass General Brigham', meta: '2024 · 600h' },
      ],
      'departmental-specializations': [
        { title: 'Telehealth Triage' }, { title: 'Geriatric Care' }, { title: 'Chronic Disease Mgmt' },
        { title: 'Wound Care' }, { title: 'Behavioral Health' }, { title: 'Pain Management' },
      ],
      'patient-care-timeline': [
        { title: '12,400+ patient encounters', caption: 'Across acute, primary, and telehealth settings', meta: '2020 — 2026' },
        { title: 'HCAHPS 96th percentile', caption: 'Patient satisfaction, Cleveland Clinic', meta: '2025' },
      ],
    },
  },
  {
    id: 'registered-nurse',
    name: 'Registered Nurse',
    description: 'OR, pediatric and oncology specialization blocks',
    base: 'clinical',
    accent: '0 72% 51%',
    icon: 'HeartPulse',
    tagline: 'Registered Nurse, BSN · Trauma & Critical Care',
    sections: [
      { key: 'departmental-specializations', label: 'Departmental Specializations', kind: 'pill-cloud' },
      { key: 'shift-history', label: 'Shift & Unit History', kind: 'timeline' },
      { key: 'patient-care-timeline', label: 'Patient Care Timeline', kind: 'timeline' },
      { key: 'board-certifications', label: 'Licensure & Certifications', kind: 'badge-grid' },
    ],
    samples: {
      'departmental-specializations': [
        { title: 'Operating Room' }, { title: 'Pediatric ICU' }, { title: 'Oncology Infusion' },
        { title: 'Cardiac Step-Down' }, { title: 'Med-Surg Float' },
      ],
      'shift-history': [
        { title: 'Charge Nurse · Level I Trauma', caption: 'Johns Hopkins Hospital', meta: '2023 — Present' },
        { title: 'Staff RN · Pediatric Oncology', caption: 'Boston Children\'s', meta: '2020 — 2023' },
      ],
      'patient-care-timeline': [
        { title: '8,600+ direct patient hours', caption: 'Across trauma, oncology, and pediatric units', meta: '2020 — 2026' },
        { title: 'Zero CLABSI on unit for 18 months', caption: 'Infection prevention champion', meta: '2024 — 2026' },
      ],
      'board-certifications': [
        { title: 'CCRN', caption: 'AACN · 2024' },
        { title: 'TNCC', caption: 'ENA · 2025' },
        { title: 'CPN', caption: 'PNCB · 2023' },
      ],
    },
  },
  {
    id: 'physical-therapist',
    name: 'Physical Therapist',
    description: 'Rehabilitation case studies and outcome metrics',
    base: 'clinical',
    accent: '142 71% 45%',
    icon: 'Activity',
    tagline: 'Doctor of Physical Therapy · Orthopedic & Sports Rehab',
    sections: [
      { key: 'rehab-case-studies', label: 'Rehabilitation Case Studies', kind: 'cards' },
      { key: 'patient-outcomes', label: 'Patient Outcome Metrics', kind: 'metric-grid' },
      { key: 'clinical-rotations', label: 'Clinical Practice Timeline', kind: 'timeline' },
      { key: 'departmental-specializations', label: 'Treatment Modalities', kind: 'pill-cloud' },
    ],
    samples: {
      'rehab-case-studies': [
        { title: 'Post-ACL Reconstruction · Return to Sport', caption: 'D1 athlete returned to play in 22 weeks with full ROM and 95% LSI.' },
        { title: 'Total Knee Arthroplasty · Geriatric', caption: 'Reduced fall risk score from 8/10 to 2/10 over 12-week protocol.' },
      ],
      'patient-outcomes': [
        { title: '94%', caption: 'Functional goal attainment' },
        { title: '4.9 / 5', caption: 'Patient-reported satisfaction' },
        { title: '38%', caption: 'Avg pain reduction (NPRS)' },
        { title: '1,200+', caption: 'Episodes of care' },
      ],
      'clinical-rotations': [
        { title: 'Lead PT · Sports Medicine', caption: 'Hospital for Special Surgery', meta: '2023 — Present' },
        { title: 'Outpatient Orthopedic Fellow', caption: 'Mayo Clinic Health System', meta: '2021 — 2023' },
      ],
      'departmental-specializations': [
        { title: 'Dry Needling' }, { title: 'Manual Therapy' }, { title: 'Blood Flow Restriction' },
        { title: 'Vestibular Rehab' }, { title: 'Gait Analysis' },
      ],
    },
  },
  {
    id: 'physician-assistant',
    name: 'Physician Assistant',
    description: 'Certifications and collaborative practice logs',
    base: 'clinical',
    accent: '217 91% 60%',
    icon: 'ClipboardCheck',
    tagline: 'PA-C · Surgical & Emergency Medicine',
    sections: [
      { key: 'board-certifications', label: 'NCCPA Certifications', kind: 'badge-grid' },
      { key: 'procedures-performed', label: 'Procedures Performed', kind: 'checklist' },
      { key: 'clinical-rotations', label: 'Clinical Rotations', kind: 'timeline' },
      { key: 'patient-care-timeline', label: 'Collaborative Practice', kind: 'timeline' },
    ],
    samples: {
      'board-certifications': [
        { title: 'PA-C', caption: 'NCCPA · 2024' },
        { title: 'CAQ Emergency Medicine', caption: 'NCCPA · 2025' },
        { title: 'ATLS Provider', caption: 'ACS · 2025' },
      ],
      'procedures-performed': [
        { title: 'Central line placement', meta: '120+' },
        { title: 'Lumbar puncture', meta: '85+' },
        { title: 'Chest tube insertion', meta: '40+' },
        { title: 'Laceration repair', meta: '600+' },
        { title: 'Intubation, RSI', meta: '95+' },
      ],
      'clinical-rotations': [
        { title: 'General Surgery', caption: 'Cedars-Sinai', meta: '2024 · 8 wk' },
        { title: 'Emergency Medicine', caption: 'NYU Langone', meta: '2024 · 8 wk' },
        { title: 'Internal Medicine', caption: 'Kaiser Permanente', meta: '2023 · 6 wk' },
      ],
      'patient-care-timeline': [
        { title: 'Co-managed 3,200+ ED visits', caption: 'Alongside attending physicians', meta: '2024 — 2026' },
      ],
    },
  },
  {
    id: 'behavioral-health',
    name: 'Behavioral Health Counselor',
    description: 'Mental health support and practice experience',
    base: 'clinical',
    accent: '262 83% 58%',
    icon: 'Brain',
    tagline: 'LMHC · Trauma-Informed Cognitive Behavioral Therapy',
    sections: [
      { key: 'departmental-specializations', label: 'Therapeutic Modalities', kind: 'pill-cloud' },
      { key: 'patient-care-timeline', label: 'Populations Served', kind: 'timeline' },
      { key: 'clinical-rotations', label: 'Practice Settings', kind: 'timeline' },
      { key: 'board-certifications', label: 'Licensure & Supervision', kind: 'badge-grid' },
    ],
    samples: {
      'departmental-specializations': [
        { title: 'CBT' }, { title: 'EMDR' }, { title: 'DBT' }, { title: 'ACT' },
        { title: 'Motivational Interviewing' }, { title: 'Somatic Experiencing' },
      ],
      'patient-care-timeline': [
        { title: 'Adolescents (12–17)', caption: 'School-based & telehealth', meta: '2022 — Present' },
        { title: 'First responders & veterans', caption: 'PTSD focus, EMDR protocol', meta: '2023 — Present' },
      ],
      'clinical-rotations': [
        { title: 'Clinical Director', caption: 'Mindbloom Behavioral Health', meta: '2024 — Present' },
        { title: 'Outpatient Therapist', caption: 'Kaiser Permanente Behavioral', meta: '2020 — 2024' },
      ],
      'board-certifications': [
        { title: 'LMHC', caption: 'State Board · 2022' },
        { title: 'EMDR Certified', caption: 'EMDRIA · 2024' },
        { title: 'NBCC', caption: 'National Board · 2023' },
      ],
    },
  },
  {
    id: 'respiratory-therapist',
    name: 'Respiratory Therapist',
    description: 'Specialized clinical care and respiratory gear certifications',
    base: 'clinical',
    accent: '199 89% 48%',
    icon: 'Wind',
    tagline: 'RRT-ACCS · Adult Critical Care Specialist',
    sections: [
      { key: 'equipment-mastery', label: 'Equipment Mastery', kind: 'checklist' },
      { key: 'board-certifications', label: 'RRT / NPS Certifications', kind: 'badge-grid' },
      { key: 'clinical-rotations', label: 'ICU & ER Experience', kind: 'timeline' },
      { key: 'patient-care-timeline', label: 'Protocols Authored', kind: 'timeline' },
    ],
    samples: {
      'equipment-mastery': [
        { title: 'Hamilton G5 ventilator', meta: 'Expert' },
        { title: 'ECMO circuit support', meta: 'Certified' },
        { title: 'High-flow nasal cannula', meta: 'Expert' },
        { title: 'BiPAP / CPAP titration', meta: 'Expert' },
        { title: 'Bronchoscopy assistance', meta: 'Proficient' },
      ],
      'board-certifications': [
        { title: 'RRT-ACCS', caption: 'NBRC · 2024' },
        { title: 'NPS', caption: 'NBRC · 2023' },
        { title: 'ACLS', caption: 'AHA · 2025' },
      ],
      'clinical-rotations': [
        { title: 'Senior RT · MICU', caption: 'UCSF Medical Center', meta: '2023 — Present' },
        { title: 'Staff RT · Neonatal ICU', caption: 'Stanford Children\'s', meta: '2020 — 2023' },
      ],
      'patient-care-timeline': [
        { title: 'Authored COVID weaning protocol', caption: 'Adopted system-wide, reduced ventilator days 18%', meta: '2024' },
      ],
    },
  },
  {
    id: 'occupational-therapist',
    name: 'Occupational Therapist',
    description: 'Specialist care and rehabilitation progress layouts',
    base: 'clinical',
    accent: '24 95% 53%',
    icon: 'Hand',
    tagline: 'OTR/L · Pediatric Sensory Integration Specialist',
    sections: [
      { key: 'departmental-specializations', label: 'Therapy Specialties', kind: 'pill-cloud' },
      { key: 'rehab-case-studies', label: 'Patient Progress Studies', kind: 'cards' },
      { key: 'clinical-rotations', label: 'Practice Settings', kind: 'timeline' },
      { key: 'board-certifications', label: 'Specialty Certifications', kind: 'badge-grid' },
    ],
    samples: {
      'departmental-specializations': [
        { title: 'Sensory Integration' }, { title: 'Hand Therapy' }, { title: 'Pediatric ASD' },
        { title: 'Stroke Recovery' }, { title: 'Assistive Tech' },
      ],
      'rehab-case-studies': [
        { title: 'Pediatric ASD · Sensory Diet', caption: 'Reduced meltdowns 70% over 16 weeks via tailored sensory regulation plan.' },
        { title: 'Post-stroke Hand Function', caption: 'Restored Box & Block score from 4 to 38 blocks in 12 weeks.' },
      ],
      'clinical-rotations': [
        { title: 'Lead OT · Pediatrics', caption: 'Children\'s Hospital LA', meta: '2023 — Present' },
        { title: 'School-based OT', caption: 'LAUSD Special Education', meta: '2020 — 2023' },
      ],
      'board-certifications': [
        { title: 'OTR/L', caption: 'NBCOT · 2020' },
        { title: 'SIPT Certified', caption: 'USC · 2023' },
        { title: 'CHT', caption: 'HTCC · 2025' },
      ],
    },
  },
  {
    id: 'home-care-caregiver',
    name: 'Home Care Caregiver',
    description: 'Aging-in-place care and patient relationship management',
    base: 'clinical',
    accent: '340 82% 52%',
    icon: 'Home',
    tagline: 'Certified Home Health Aide · Dementia & Aging-in-Place Specialist',
    sections: [
      { key: 'departmental-specializations', label: 'Care Model', kind: 'pill-cloud' },
      { key: 'patient-care-timeline', label: 'Client Care Timeline', kind: 'timeline' },
      { key: 'rehab-case-studies', label: 'Family Testimonials', kind: 'cards' },
      { key: 'board-certifications', label: 'Specialized Training', kind: 'badge-grid' },
    ],
    samples: {
      'departmental-specializations': [
        { title: 'Dementia Care' }, { title: 'Mobility Support' }, { title: 'Medication Mgmt' },
        { title: 'Hospice Companion' }, { title: 'Meal Prep & Nutrition' },
      ],
      'patient-care-timeline': [
        { title: 'Long-term dementia client', caption: '4-year continuous care, in-home aging-in-place plan', meta: '2022 — Present' },
        { title: 'Post-surgical recovery rotations', caption: '40+ clients, avg 8-week engagements', meta: '2020 — 2026' },
      ],
      'rehab-case-studies': [
        { title: '“She gave my mother her dignity back.”', caption: '— Daughter of long-term Alzheimer\'s client, Boston' },
        { title: '“The first caregiver who actually listened.”', caption: '— Hospice family, Cambridge' },
      ],
      'board-certifications': [
        { title: 'CHHA', caption: 'State Board · 2021' },
        { title: 'CPR / First Aid', caption: 'Red Cross · 2025' },
        { title: 'Dementia Care Certified', caption: 'NCCDP · 2024' },
      ],
    },
  },
];

/* ── Technology & AI (9-12) ────────────────────────────────────────────── */

const TECHNOLOGY: ProfessionTemplate[] = [
  {
    id: 'ai-ml-engineer',
    name: 'AI / ML Engineer',
    description: 'Model architecture and deployment metrics',
    base: 'technical',
    accent: '263 70% 50%',
    icon: 'BrainCircuit',
    tagline: 'Senior ML Engineer · LLM Systems & Multimodal Inference',
    sections: [
      { key: 'tech-stack-models', label: 'Tech Stack Models', kind: 'code-block' },
      { key: 'system-architecture', label: 'System Architecture Maps', kind: 'cards' },
      { key: 'github-pipeline-metrics', label: 'GitHub Pipeline Metrics', kind: 'metric-grid' },
      { key: 'publications', label: 'Papers & Patents', kind: 'timeline' },
    ],
    samples: {
      'tech-stack-models': [
        { title: 'PyTorch · CUDA 12.4 · Triton', caption: 'Custom kernels for FlashAttention-3 inference' },
        { title: 'vLLM · TensorRT-LLM · Ray Serve', caption: 'Multi-tenant LLM serving @ 12k req/s' },
        { title: 'LangGraph · DSPy · LiteLLM', caption: 'Agentic orchestration with deterministic eval' },
      ],
      'system-architecture': [
        { title: 'Multimodal RAG @ petabyte scale', caption: 'Vision + text retrieval over 4PB asset corpus, p99 latency 280ms.' },
        { title: 'On-device speculative decoding', caption: 'Llama-3 70B draft → 405B target, 2.4x throughput on H200.' },
      ],
      'github-pipeline-metrics': [
        { title: '14.2k', caption: 'GitHub stars (oss)' },
        { title: '98.4%', caption: 'CI green rate' },
        { title: '3,800', caption: 'PRs merged' },
        { title: '142ms', caption: 'p95 inference' },
      ],
      'publications': [
        { title: 'NeurIPS 2025 · "Sparse MoE Routing for Edge Devices"', meta: '2025' },
        { title: 'US Patent 11,xxx,xxx — Tokenizer-aware quantization', meta: '2024' },
      ],
    },
  },
  {
    id: 'cybersecurity-analyst',
    name: 'Cybersecurity Analyst',
    description: 'Threat analysis and risk mitigation case files',
    base: 'technical',
    accent: '142 71% 45%',
    icon: 'ShieldCheck',
    tagline: 'Senior SOC Analyst · Threat Intel & Incident Response',
    sections: [
      { key: 'threat-mitigation-logs', label: 'Threat Mitigation Logs', kind: 'cards' },
      { key: 'tech-stack-models', label: 'Detection Stack', kind: 'code-block' },
      { key: 'compliance-badges', label: 'CISSP / OSCP / CEH', kind: 'badge-grid' },
      { key: 'github-pipeline-metrics', label: 'SOC Metrics', kind: 'metric-grid' },
    ],
    samples: {
      'threat-mitigation-logs': [
        { title: 'INC-2025-0418 · Lateral movement contained', caption: 'Detected Cobalt Strike beacon via Sigma rule; isolated 14 hosts in 9 minutes.' },
        { title: 'INC-2025-0292 · Supply chain compromise', caption: 'Identified malicious npm package; rolled back CI fleet, zero customer impact.' },
      ],
      'tech-stack-models': [
        { title: 'Splunk ES · CrowdStrike Falcon · Wiz', caption: 'SIEM + EDR + CNAPP correlation' },
        { title: 'Sigma · YARA · MITRE ATT&CK', caption: '180+ custom detections authored' },
      ],
      'compliance-badges': [
        { title: 'CISSP', caption: 'ISC² · 2024' },
        { title: 'OSCP', caption: 'OffSec · 2023' },
        { title: 'GCIH', caption: 'GIAC · 2025' },
        { title: 'CEH', caption: 'EC-Council · 2022' },
      ],
      'github-pipeline-metrics': [
        { title: '4.2 min', caption: 'Mean time to detect' },
        { title: '11 min', caption: 'Mean time to contain' },
        { title: '0', caption: 'Critical breaches YTD' },
        { title: '99.97%', caption: 'Detection accuracy' },
      ],
    },
  },
  {
    id: 'it-manager',
    name: 'IT Manager',
    description: 'Infrastructure oversight, team leadership, uptime',
    base: 'technical',
    accent: '217 91% 60%',
    icon: 'Server',
    tagline: 'Director of IT Infrastructure · 24/7 Global Operations',
    sections: [
      { key: 'github-pipeline-metrics', label: 'Uptime & SLA Track Record', kind: 'metric-grid' },
      { key: 'system-architecture', label: 'Infrastructure Footprint', kind: 'cards' },
      { key: 'tech-stack-models', label: 'Tooling & Stack', kind: 'code-block' },
      { key: 'compliance-badges', label: 'Certifications', kind: 'badge-grid' },
    ],
    samples: {
      'github-pipeline-metrics': [
        { title: '99.995%', caption: '12-month SLA' },
        { title: '$4.2M', caption: 'IT spend optimized' },
        { title: '38', caption: 'Engineers led' },
        { title: '0', caption: 'Sev-1 outages YTD' },
      ],
      'system-architecture': [
        { title: 'Hybrid cloud migration', caption: 'Migrated 1,400 workloads from on-prem VMware → AWS + Azure in 14 months.' },
        { title: 'Zero Trust rollout', caption: 'Deployed BeyondCorp model across 9 offices, 6,200 endpoints.' },
      ],
      'tech-stack-models': [
        { title: 'Terraform · Ansible · ArgoCD', caption: 'IaC across 4 cloud accounts' },
        { title: 'Datadog · PagerDuty · Okta', caption: 'Observability + IAM backbone' },
      ],
      'compliance-badges': [
        { title: 'ITIL 4 Expert', caption: 'AXELOS · 2024' },
        { title: 'AWS Solutions Architect Pro', caption: '2025' },
        { title: 'CISM', caption: 'ISACA · 2023' },
      ],
    },
  },
  {
    id: 'data-engineer',
    name: 'Data Engineer & Analytics',
    description: 'Pipeline architecture and BI metrics',
    base: 'technical',
    accent: '188 78% 41%',
    icon: 'Database',
    tagline: 'Staff Data Engineer · Streaming Lakehouse & ML Feature Stores',
    sections: [
      { key: 'system-architecture', label: 'Pipelines Built', kind: 'cards' },
      { key: 'tech-stack-models', label: 'Stack & Warehouses', kind: 'code-block' },
      { key: 'github-pipeline-metrics', label: 'Business Impact Metrics', kind: 'metric-grid' },
      { key: 'compliance-badges', label: 'Certifications', kind: 'badge-grid' },
    ],
    samples: {
      'system-architecture': [
        { title: 'Iceberg lakehouse on S3', caption: 'Petabyte-scale, sub-second time-travel queries via Trino + Nessie.' },
        { title: 'Realtime CDC pipeline', caption: 'Debezium → Kafka → Flink → Pinot, 220k events/s, end-to-end < 800ms.' },
      ],
      'tech-stack-models': [
        { title: 'Snowflake · Databricks · BigQuery', caption: 'Cross-warehouse federation' },
        { title: 'dbt · Airflow · Dagster', caption: '900+ models, lineage to BI layer' },
      ],
      'github-pipeline-metrics': [
        { title: '$11M', caption: 'Annual infra savings' },
        { title: '42%', caption: 'Query latency reduction' },
        { title: '3.2 PB', caption: 'Data under management' },
        { title: '99.99%', caption: 'Pipeline freshness' },
      ],
      'compliance-badges': [
        { title: 'Databricks Pro', caption: '2024' },
        { title: 'Snowflake SnowPro Adv', caption: '2025' },
        { title: 'GCP Data Engineer', caption: '2023' },
      ],
    },
  },
];

/* ── Business & Operations (13-15) ─────────────────────────────────────── */

const BUSINESS: ProfessionTemplate[] = [
  {
    id: 'financial-manager',
    name: 'Financial Manager',
    description: 'Budget scaling and fiscal growth frameworks',
    base: 'executive',
    accent: '160 84% 39%',
    icon: 'TrendingUp',
    tagline: 'VP Finance · FP&A and Capital Allocation',
    sections: [
      { key: 'fiscal-growth', label: 'Fiscal Growth Charts', kind: 'metric-grid' },
      { key: 'budget-managed', label: 'Budgets Managed', kind: 'cards' },
      { key: 'kpi-trackers', label: 'KPI Trackers', kind: 'metric-grid' },
      { key: 'credentials', label: 'CPA / CFA Credentials', kind: 'badge-grid' },
    ],
    samples: {
      'fiscal-growth': [
        { title: '+34% YoY', caption: 'Revenue growth, FY26' },
        { title: '22pt', caption: 'Gross margin expansion' },
        { title: '$180M', caption: 'Cash flow generated' },
        { title: '4.1x', caption: 'EBITDA multiple uplift' },
      ],
      'budget-managed': [
        { title: '$420M annual operating budget', caption: 'Multi-entity consolidation across 6 BUs and 14 cost centers.' },
        { title: '$95M capex program', caption: 'Led 3-year infrastructure investment with 18% IRR.' },
      ],
      'kpi-trackers': [
        { title: '11 days', caption: 'Close cycle' },
        { title: '<0.5%', caption: 'Forecast variance' },
        { title: '94%', caption: 'On-time reporting' },
      ],
      'credentials': [
        { title: 'CPA', caption: 'AICPA · 2018' },
        { title: 'CFA Charterholder', caption: 'CFA Institute · 2021' },
        { title: 'MBA, Wharton', caption: '2019' },
      ],
    },
  },
  {
    id: 'project-manager',
    name: 'Project Manager',
    description: 'Remote operations and agile delivery tracking',
    base: 'executive',
    accent: '24 95% 53%',
    icon: 'KanbanSquare',
    tagline: 'Sr. Technical Program Manager · Distributed Agile Delivery',
    sections: [
      { key: 'agile-delivery', label: 'Agile Delivery Timelines', kind: 'timeline' },
      { key: 'budget-managed', label: 'Project Portfolio', kind: 'cards' },
      { key: 'kpi-trackers', label: 'Delivery KPIs', kind: 'metric-grid' },
      { key: 'credentials', label: 'PMP / PRINCE2 / CSM', kind: 'badge-grid' },
    ],
    samples: {
      'agile-delivery': [
        { title: 'Platform re-architecture · 14 squads', caption: 'Shipped on time across 3 time zones', meta: 'Q1–Q4 2025' },
        { title: 'Customer portal v3 launch', caption: '12-week delivery, NPS +18', meta: 'H1 2024' },
      ],
      'budget-managed': [
        { title: 'Global payments platform', caption: 'Coordinated 80 engineers across 6 squads to deliver Stripe + Adyen rails in 9 months.' },
        { title: 'AI copilot rollout', caption: 'Phased rollout to 12,000 internal users with 96% adoption in 60 days.' },
      ],
      'kpi-trackers': [
        { title: '94%', caption: 'On-time delivery' },
        { title: '+27%', caption: 'Velocity uplift' },
        { title: '0', caption: 'Sev-1 incidents at launch' },
      ],
      'credentials': [
        { title: 'PMP', caption: 'PMI · 2022' },
        { title: 'CSM', caption: 'Scrum Alliance · 2021' },
        { title: 'PRINCE2 Practitioner', caption: 'AXELOS · 2023' },
      ],
    },
  },
  {
    id: 'operations-manager',
    name: 'Operations Manager',
    description: 'Cross-industry budget execution and resource management',
    base: 'executive',
    accent: '217 91% 60%',
    icon: 'Briefcase',
    tagline: 'Director of Operations · Process, People, and P&L',
    sections: [
      { key: 'kpi-trackers', label: 'Efficiency Gains', kind: 'metric-grid' },
      { key: 'budget-managed', label: 'Operations Owned', kind: 'cards' },
      { key: 'agile-delivery', label: 'Leadership Timeline', kind: 'timeline' },
      { key: 'credentials', label: 'Certifications', kind: 'badge-grid' },
    ],
    samples: {
      'kpi-trackers': [
        { title: '-31%', caption: 'Operating cost' },
        { title: '+22%', caption: 'Throughput' },
        { title: '4.8 / 5', caption: 'Team eNPS' },
        { title: '99.4%', caption: 'On-spec delivery' },
      ],
      'budget-managed': [
        { title: 'North America fulfillment ops', caption: 'P&L for 11 distribution centers, 1,400 associates, $310M annual budget.' },
        { title: 'Lean Six Sigma transformation', caption: 'Trained 60 green belts; saved $9.6M in first 18 months.' },
      ],
      'agile-delivery': [
        { title: 'Director of Operations', caption: 'GlobalFlow Logistics', meta: '2023 — Present' },
        { title: 'Sr. Operations Manager', caption: 'Amazon Fulfillment', meta: '2019 — 2023' },
      ],
      'credentials': [
        { title: 'Lean Six Sigma Black Belt', caption: 'ASQ · 2022' },
        { title: 'APICS CPIM', caption: '2024' },
      ],
    },
  },
];

/* ── Skilled Trades & Tech Ops (16-20) ─────────────────────────────────── */

const TRADES: ProfessionTemplate[] = [
  {
    id: 'electrician',
    name: 'Electrician',
    description: 'Electrification trends and complex power-system work',
    base: 'trades',
    accent: '45 93% 47%',
    icon: 'Zap',
    tagline: 'Master Electrician · Commercial & EV Infrastructure',
    sections: [
      { key: 'regional-compliance', label: 'Regional Compliance Badges', kind: 'badge-grid' },
      { key: 'project-scale', label: 'Project Scale Metrics', kind: 'metric-grid' },
      { key: 'equipment-mastery', label: 'Equipment Mastery Checklist', kind: 'checklist' },
      { key: 'safety-incident-log', label: 'Safety Incident Log', kind: 'cards' },
    ],
    samples: {
      'regional-compliance': [
        { title: 'NEC 2026 Certified', caption: 'NFPA · current' },
        { title: 'Master Electrician', caption: 'TX License #ME-xxxxx' },
        { title: 'OSHA 30', caption: '2025' },
        { title: 'NABCEP PV Installer', caption: '2024' },
      ],
      'project-scale': [
        { title: '14 MW', caption: 'Solar installed' },
        { title: '420', caption: 'EV chargers commissioned' },
        { title: '3.2M', caption: 'Sq ft wired (commercial)' },
        { title: '$28M', caption: 'Projects delivered' },
      ],
      'equipment-mastery': [
        { title: 'Switchgear 480V / 4160V', meta: 'Expert' },
        { title: 'PLC controls (Allen-Bradley)', meta: 'Proficient' },
        { title: 'Fluke 1587 / Megger MFT', meta: 'Expert' },
        { title: 'DC fast charger commissioning', meta: 'Certified' },
      ],
      'safety-incident-log': [
        { title: '1,800 days incident-free', caption: 'Crew lead, multi-site commercial buildout, zero recordables.' },
      ],
    },
  },
  {
    id: 'sales-representative',
    name: 'Sales Representative',
    description: 'Growth pipelines and client relationship dashboards',
    base: 'executive',
    accent: '340 82% 52%',
    icon: 'LineChart',
    tagline: 'Enterprise Account Executive · SaaS & Cloud Infrastructure',
    sections: [
      { key: 'kpi-trackers', label: 'Quota Attainment', kind: 'metric-grid' },
      { key: 'budget-managed', label: 'Marquee Wins', kind: 'cards' },
      { key: 'agile-delivery', label: 'Sales Roles', kind: 'timeline' },
      { key: 'credentials', label: 'Sales Certifications', kind: 'badge-grid' },
    ],
    samples: {
      'kpi-trackers': [
        { title: '187%', caption: 'Quota attainment FY26' },
        { title: '$14.2M', caption: 'ARR closed' },
        { title: '4', caption: 'President\'s Club years' },
        { title: '38', caption: 'Logos won' },
      ],
      'budget-managed': [
        { title: 'Fortune 50 retailer · $3.8M ACV', caption: 'Displaced incumbent in 6-month enterprise cycle.' },
        { title: 'Global bank platform deal · $5.1M ACV', caption: 'Multi-stakeholder, 14-person buying committee navigated end-to-end.' },
      ],
      'agile-delivery': [
        { title: 'Enterprise AE', caption: 'Snowflake', meta: '2023 — Present' },
        { title: 'Sr. Account Executive', caption: 'Datadog', meta: '2020 — 2023' },
      ],
      'credentials': [
        { title: 'MEDDPICC Certified', caption: 'Force Mgmt · 2024' },
        { title: 'Challenger Sale', caption: 'CEB · 2022' },
      ],
    },
  },
  {
    id: 'customer-experience',
    name: 'Customer Experience Rep',
    description: 'Resolution metrics, retention, inquiry workflows',
    base: 'executive',
    accent: '188 78% 41%',
    icon: 'MessageCircle',
    tagline: 'Sr. CX Specialist · Omnichannel Support & Retention',
    sections: [
      { key: 'kpi-trackers', label: 'CSAT & Resolution Metrics', kind: 'metric-grid' },
      { key: 'budget-managed', label: 'Workflows Optimized', kind: 'cards' },
      { key: 'agile-delivery', label: 'Support Roles', kind: 'timeline' },
      { key: 'credentials', label: 'CX Training', kind: 'badge-grid' },
    ],
    samples: {
      'kpi-trackers': [
        { title: '97%', caption: 'CSAT (rolling 12mo)' },
        { title: '4m 12s', caption: 'Avg first response' },
        { title: '82%', caption: 'First-contact resolution' },
        { title: '+18pt', caption: 'NPS lift' },
      ],
      'budget-managed': [
        { title: 'AI-assisted triage rollout', caption: 'Designed Zendesk + LLM macro flow, cut handle time 31%.' },
        { title: 'VIP retention program', caption: 'Recovered $2.4M in at-risk ARR via proactive outreach playbook.' },
      ],
      'agile-delivery': [
        { title: 'Lead CX Specialist', caption: 'Notion', meta: '2024 — Present' },
        { title: 'Sr. Support Engineer', caption: 'Linear', meta: '2022 — 2024' },
      ],
      'credentials': [
        { title: 'HDI CSM', caption: '2024' },
        { title: 'Zendesk Admin Expert', caption: '2025' },
      ],
    },
  },
  {
    id: 'construction-manager',
    name: 'Construction Manager',
    description: 'Site certifications, project scaling, asset tracking',
    base: 'trades',
    accent: '20 90% 48%',
    icon: 'HardHat',
    tagline: 'Senior Construction Manager · Commercial & Mixed-Use Build-Outs',
    sections: [
      { key: 'project-scale', label: 'Site Portfolio Scale', kind: 'metric-grid' },
      { key: 'regional-compliance', label: 'OSHA / LEED Compliance', kind: 'badge-grid' },
      { key: 'safety-incident-log', label: 'Safety Record', kind: 'cards' },
      { key: 'equipment-mastery', label: 'Heavy Equipment Mastery', kind: 'checklist' },
    ],
    samples: {
      'project-scale': [
        { title: '$240M', caption: 'Total project value' },
        { title: '11', caption: 'Active sites' },
        { title: '4.2M', caption: 'Sq ft delivered' },
        { title: '+0d', caption: 'Schedule variance' },
      ],
      'regional-compliance': [
        { title: 'OSHA 510', caption: 'Construction Industry' },
        { title: 'LEED AP BD+C', caption: 'USGBC · 2024' },
        { title: 'CCM', caption: 'CMAA · 2023' },
        { title: 'PMP', caption: 'PMI · 2022' },
      ],
      'safety-incident-log': [
        { title: '2,400 days incident-free', caption: 'Multi-site portfolio, zero lost-time incidents.' },
        { title: 'EMR 0.62', caption: 'Below industry avg 1.00 for 4 consecutive years.' },
      ],
      'equipment-mastery': [
        { title: 'Tower crane ops oversight', meta: 'Certified' },
        { title: 'Procore + Autodesk Build', meta: 'Expert' },
        { title: 'BIM 360 coordination', meta: 'Expert' },
      ],
    },
  },
  {
    id: 'cloud-architect',
    name: 'Cloud Architect',
    description: '2026 enterprise scale and microservices architecture',
    base: 'technical',
    accent: '199 89% 48%',
    icon: 'Cloud',
    tagline: 'Principal Cloud Architect · Multi-Region Microservices at Scale',
    sections: [
      { key: 'system-architecture', label: 'Cloud Architectures', kind: 'cards' },
      { key: 'tech-stack-models', label: 'Reference Stacks', kind: 'code-block' },
      { key: 'compliance-badges', label: 'AWS / GCP / Azure Pro', kind: 'badge-grid' },
      { key: 'github-pipeline-metrics', label: 'Scale & Cost Wins', kind: 'metric-grid' },
    ],
    samples: {
      'system-architecture': [
        { title: 'Active-active across 4 regions', caption: 'Designed multi-region failover with < 30s RTO for fintech workload.' },
        { title: 'Microservices mesh @ 1,400 services', caption: 'Istio + Envoy, p99 inter-service latency 6ms.' },
      ],
      'tech-stack-models': [
        { title: 'EKS · Karpenter · Crossplane', caption: 'Self-healing k8s at scale' },
        { title: 'Pulumi · Terraform · OpenTofu', caption: 'Multi-cloud IaC unified' },
      ],
      'compliance-badges': [
        { title: 'AWS Solutions Architect Pro', caption: '2025' },
        { title: 'GCP Cloud Architect', caption: '2024' },
        { title: 'Azure Solutions Architect Expert', caption: '2024' },
        { title: 'CKA', caption: 'CNCF · 2023' },
      ],
      'github-pipeline-metrics': [
        { title: '$7.4M', caption: 'Annual cloud savings' },
        { title: '99.99%', caption: 'Platform SLO' },
        { title: '4 → 14', caption: 'Regions expanded' },
        { title: '52%', caption: 'Cold-start reduction' },
      ],
    },
  },
];

export const PROFESSION_TEMPLATES: ProfessionTemplate[] = [
  ...HEALTHCARE,
  ...TECHNOLOGY,
  ...BUSINESS,
  ...TRADES,
];

export function getProfessionTemplate(id: string): ProfessionTemplate | undefined {
  return PROFESSION_TEMPLATES.find((t) => t.id === id);
}

/** Quick lookup set used by render switches to detect "is this a profession template?" */
export const PROFESSION_TEMPLATE_IDS = new Set(PROFESSION_TEMPLATES.map((t) => t.id));
