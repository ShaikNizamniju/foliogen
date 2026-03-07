import type { ProfileData } from "@/contexts/ProfileContext";
import type { ProfessionalDomain } from "@/lib/domainRecommendation";

interface ScoreBreakdown {
  projects: number;
  contact: number;
  mapping: number;
}

export interface Recommendation {
  id: string;
  label: string;
  completed: boolean;
  points: number;
}

interface PortfolioStrength {
  totalScore: number;
  breakdown: ScoreBreakdown;
  recommendations: Recommendation[];
}

const ONBOARDING_DONE_KEY = 'foliogen_onboarding_domain';

function getUserDomain(): ProfessionalDomain | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(ONBOARDING_DONE_KEY);
  if (stored && stored !== 'skipped') return stored as ProfessionalDomain;
  return null;
}

// Domain-aware benchmark targets
interface DomainBenchmarks {
  projectTarget: number;
  skillTarget: number;
  contactTarget: number;
}

function getDomainBenchmarks(domain: ProfessionalDomain | null): DomainBenchmarks {
  switch (domain) {
    case 'tech': return { projectTarget: 5, skillTarget: 15, contactTarget: 4 };
    case 'creative': return { projectTarget: 5, skillTarget: 10, contactTarget: 3 };
    case 'corporate': return { projectTarget: 3, skillTarget: 12, contactTarget: 5 };
    case 'luxury': return { projectTarget: 4, skillTarget: 10, contactTarget: 3 };
    default: return { projectTarget: 3, skillTarget: 15, contactTarget: 4 }; // Founder-level default
  }
}

export function calculatePortfolioStrength(profile: ProfileData): PortfolioStrength {
  const domain = getUserDomain();
  const benchmarks = getDomainBenchmarks(domain);
  const projects = getProjectScore(profile.projects.length, benchmarks.projectTarget);
  const contact = getContactScore(profile, benchmarks.contactTarget);
  const mapping = getSkillMappingScore(profile.skills, profile.projects, benchmarks.skillTarget);
  const recommendations = getRecommendations(profile, domain, benchmarks);

  return {
    totalScore: projects + contact + mapping,
    breakdown: { projects, contact, mapping },
    recommendations,
  };
}

function getProjectScore(count: number, target: number): number {
  return Math.min(30, Math.round((count / target) * 30));
}

function getContactScore(profile: ProfileData, target: number): number {
  const fields = [profile.email, profile.linkedinUrl, profile.githubUrl, profile.twitterUrl, profile.website];
  const filled = fields.filter(Boolean).length;
  return Math.min(20, Math.round((filled / target) * 20));
}

function getSkillMappingScore(skills: string[], projects: ProfileData["projects"], target: number): number {
  if (skills.length === 0) return 0;

  const cappedSkills = skills.slice(0, target);
  const allTech = new Set(
    projects.flatMap((p) => (p.techStack ?? []).map((t) => t.toLowerCase()))
  );

  const matched = cappedSkills.filter((s) => allTech.has(s.toLowerCase())).length;
  return Math.round((matched / Math.min(skills.length, target)) * 50);
}

// --- Domain-aware recommendations ---

function getRecommendations(profile: ProfileData, domain: ProfessionalDomain | null, benchmarks: DomainBenchmarks): Recommendation[] {
  const recs: Recommendation[] = [];
  const domainLabel = domain ? domain.charAt(0).toUpperCase() + domain.slice(1) : 'Founder-level';

  // Dynamic project recommendation
  if (profile.projects.length < benchmarks.projectTarget) {
    const needed = benchmarks.projectTarget - profile.projects.length;
    const currentPct = Math.round((profile.projects.length / benchmarks.projectTarget) * 30);
    const pts = 30 - currentPct;
    recs.push({ id: 'more-projects', label: `Current: ${currentPct}/30 Projects — Add more projects to boost your credibility`, completed: false, points: pts });
  }

  // Contact recommendations with dynamic target
  const contactFields = [
    { key: 'email', label: 'contact email', value: profile.email },
    { key: 'linkedin', label: 'LinkedIn profile', value: profile.linkedinUrl },
    { key: 'github', label: 'GitHub link', value: profile.githubUrl },
    { key: 'website', label: 'personal website', value: profile.website },
  ];
  const filledContacts = contactFields.filter(f => !!f.value).length;
  const missingContacts = contactFields.filter(f => !f.value);
  if (filledContacts < benchmarks.contactTarget && missingContacts.length > 0) {
    const top = missingContacts[0];
    const currentPct = Math.round((filledContacts / benchmarks.contactTarget) * 20);
    const pts = 20 - currentPct;
    recs.push({ id: `add-${top.key}`, label: `Current: ${currentPct}/20 Contact — Add ${top.label} to increase reach`, completed: false, points: pts });
  }

  // Skill mapping tip with dynamic target
  if (profile.skills.length > 0 && profile.projects.length > 0) {
    const allTech = new Set(profile.projects.flatMap((p) => (p.techStack ?? []).map((t) => t.toLowerCase())));
    const unmatched = profile.skills.filter((s) => !allTech.has(s.toLowerCase()));
    const matched = profile.skills.length - unmatched.length;
    const currentPct = Math.round((matched / Math.min(profile.skills.length, benchmarks.skillTarget)) * 50);

    if (unmatched.length > 0) {
      recs.push({ id: 'match-skills', label: `Current: ${currentPct}/50 Skill Map — Add "${unmatched[0]}" to a project to boost score`, completed: false, points: Math.round(50 / Math.min(profile.skills.length, benchmarks.skillTarget)) });
    }
  } else if (profile.skills.length === 0) {
    recs.push({ id: 'add-skills', label: `Current: 0/50 Skill Map — Add tech stack skills to your profile`, completed: false, points: 50 });
  }

  // Domain-specific tips
  if (domain === 'tech') {
    if (!profile.githubUrl) recs.push({ id: 'tech-github', label: 'Tech tip: Link your GitHub for credibility', completed: false, points: 4 });
    const hasTechStack = profile.projects.some((p) => (p.techStack?.length ?? 0) >= 3);
    if (!hasTechStack && profile.projects.length > 0) recs.push({ id: 'tech-stack', label: 'Tech tip: Add 3+ tech stack items per project', completed: false, points: 5 });
  }
  if (domain === 'creative') {
    const hasImages = profile.projects.some((p) => !!p.imageUrl);
    if (!hasImages && profile.projects.length > 0) recs.push({ id: 'creative-images', label: 'Creative tip: Add high-res images to your projects', completed: false, points: 5 });
    if (!profile.bio || profile.bio.length < 80) recs.push({ id: 'creative-narrative', label: 'Creative tip: Write a compelling brand narrative (80+ chars)', completed: false, points: 3 });
  }
  if (domain === 'corporate') {
    if (!profile.linkedinUrl) recs.push({ id: 'corp-linkedin', label: 'Corporate tip: LinkedIn link is essential for recruiters', completed: false, points: 4 });
    if (profile.workExperience.length === 0) recs.push({ id: 'corp-timeline', label: 'Corporate tip: Add your experience timeline', completed: false, points: 5 });
  }
  if (domain === 'luxury') {
    if (!profile.headline || profile.headline.length > 60) recs.push({ id: 'luxury-headline', label: 'Luxury tip: Keep your headline refined & under 60 chars', completed: false, points: 2 });
    if (profile.bio && profile.bio.length > 200) recs.push({ id: 'luxury-bio', label: 'Luxury tip: Trim your bio for elegant minimalism', completed: false, points: 2 });
  }

  // Deduplicate by id
  const seen = new Set<string>();
  return recs.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });
}
