import type { ProfileData } from "@/contexts/ProfileContext";
import type { ProfessionalDomain } from "@/lib/domainRecommendation";

interface ScoreBreakdown {
  profileBasics: number;
  experience: number;
  projects: number;
  skills: number;
  contact: number;
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

// Domain-aware benchmark targets (kept for getRecommendations compatibility)
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
    default: return { projectTarget: 3, skillTarget: 15, contactTarget: 4 };
  }
}

export function calculatePortfolioStrength(profile: ProfileData): PortfolioStrength {
  const domain = getUserDomain();
  const benchmarks = getDomainBenchmarks(domain);

  const profileBasics =
    (profile.fullName?.trim() ? 5 : 0) +
    (profile.headline?.trim() ? 5 : 0) +
    (profile.location?.trim() ? 5 : 0) +
    (profile.bio?.trim() ? 5 : 0);

  const experience = (profile.workExperience?.length ?? 0) >= 1 ? 20 : 0;

  const projectCount = profile.projects?.length ?? 0;
  const projects = projectCount >= 2 ? 20 : projectCount === 1 ? 10 : 0;

  const skillCount = profile.skills?.length ?? 0;
  const skills = skillCount >= 5 ? 20 : skillCount >= 1 ? 10 : 0;

  const contact = Math.min(
    20,
    (profile.email ? 10 : 0) +
      (profile.linkedinUrl || profile.githubUrl || profile.website ? 10 : 0)
  );

  const recommendations = getRecommendations(profile, domain, benchmarks);

  return {
    totalScore: profileBasics + experience + projects + skills + contact,
    breakdown: { profileBasics, experience, projects, skills, contact },
    recommendations,
  };
}

// --- Domain-aware recommendations ---

function getRecommendations(profile: ProfileData, _domain: ProfessionalDomain | null, _benchmarks: DomainBenchmarks): Recommendation[] {
  const recs: Recommendation[] = [];

  // Profile basics
  const missingBasics: string[] = [];
  if (!profile.fullName?.trim()) missingBasics.push('name');
  if (!profile.headline?.trim()) missingBasics.push('title');
  if (!profile.location?.trim()) missingBasics.push('location');
  if (!profile.bio?.trim()) missingBasics.push('summary');
  if (missingBasics.length > 0) {
    recs.push({
      id: 'profile-basics',
      label: `Add a ${missingBasics[0]} to complete your Profile section`,
      completed: false,
      points: missingBasics.length * 5,
    });
  }

  // Experience
  if ((profile.workExperience?.length ?? 0) === 0) {
    recs.push({
      id: 'add-experience',
      label: 'Add a work experience entry for full Experience score',
      completed: false,
      points: 20,
    });
  }

  // Projects
  const projectCount = profile.projects?.length ?? 0;
  if (projectCount === 0) {
    recs.push({
      id: 'add-projects',
      label: 'Add at least 2 projects for full Projects score',
      completed: false,
      points: 20,
    });
  } else if (projectCount === 1) {
    recs.push({
      id: 'add-second-project',
      label: 'Add a second project to reach full Projects score',
      completed: false,
      points: 10,
    });
  }

  // Skills
  const skillCount = profile.skills?.length ?? 0;
  if (skillCount === 0) {
    recs.push({
      id: 'add-skills',
      label: 'Add at least 5 skills for full Skills score',
      completed: false,
      points: 20,
    });
  } else if (skillCount < 5) {
    recs.push({
      id: 'more-skills',
      label: `Add ${5 - skillCount} more skill${5 - skillCount === 1 ? '' : 's'} to reach full Skills score`,
      completed: false,
      points: 10,
    });
  }

  // Contact
  if (!profile.email) {
    recs.push({
      id: 'add-email',
      label: 'Add a contact email for full Contact score',
      completed: false,
      points: 10,
    });
  }
  if (!profile.linkedinUrl && !profile.githubUrl && !profile.website) {
    recs.push({
      id: 'add-social-link',
      label: 'Add a LinkedIn or GitHub link for full Contact score',
      completed: false,
      points: 10,
    });
  }

  return recs;
}

