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

export function calculatePortfolioStrength(profile: ProfileData): PortfolioStrength {
  const projects = getProjectScore(profile.projects.length);
  const contact = getContactScore(profile);
  const mapping = getSkillMappingScore(profile.skills, profile.projects);
  const domain = getUserDomain();
  const recommendations = getRecommendations(profile, domain);

  return {
    totalScore: projects + contact + mapping,
    breakdown: { projects, contact, mapping },
    recommendations,
  };
}

function getProjectScore(count: number): number {
  if (count >= 5) return 30;
  if (count >= 3) return 25;
  if (count >= 1) return 15;
  return 0;
}

function getContactScore(profile: ProfileData): number {
  const fields = [profile.email, profile.linkedinUrl, profile.githubUrl, profile.twitterUrl, profile.website];
  return fields.filter(Boolean).length * 4;
}

function getSkillMappingScore(skills: string[], projects: ProfileData["projects"]): number {
  if (skills.length === 0) return 0;

  const allTech = new Set(
    projects.flatMap((p) => (p.techStack ?? []).map((t) => t.toLowerCase()))
  );

  const matched = skills.filter((s) => allTech.has(s.toLowerCase())).length;
  return Math.round((matched / skills.length) * 50);
}

// --- Domain-aware recommendations ---

function getRecommendations(profile: ProfileData, domain: ProfessionalDomain | null): Recommendation[] {
  const recs: Recommendation[] = [];

  // Universal recommendations
  if (profile.projects.length < 5) {
    const needed = 5 - profile.projects.length;
    const pts = profile.projects.length < 1 ? 15 : profile.projects.length < 3 ? 10 : 5;
    recs.push({ id: 'more-projects', label: `Add ${needed} more project${needed > 1 ? 's' : ''} to gain +${pts} points`, completed: false, points: pts });
  }
  if (!profile.email) recs.push({ id: 'add-email', label: 'Add a contact email (+4 pts)', completed: false, points: 4 });
  if (!profile.linkedinUrl) recs.push({ id: 'add-linkedin', label: 'Add your LinkedIn profile (+4 pts)', completed: false, points: 4 });
  if (!profile.githubUrl) recs.push({ id: 'add-github', label: 'Add your GitHub link (+4 pts)', completed: false, points: 4 });
  if (!profile.website) recs.push({ id: 'add-website', label: 'Add a personal website (+4 pts)', completed: false, points: 4 });

  // Skill mapping tip
  if (profile.skills.length > 0 && profile.projects.length > 0) {
    const allTech = new Set(profile.projects.flatMap((p) => (p.techStack ?? []).map((t) => t.toLowerCase())));
    const unmatched = profile.skills.filter((s) => !allTech.has(s.toLowerCase()));
    if (unmatched.length > 0) {
      recs.push({ id: 'match-skills', label: `Add "${unmatched[0]}" to a project's tech stack to boost mapping score`, completed: false, points: Math.round(50 / profile.skills.length) });
    }
  } else if (profile.skills.length === 0) {
    recs.push({ id: 'add-skills', label: 'Add skills and map them to project tech stacks (+50 pts potential)', completed: false, points: 50 });
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
