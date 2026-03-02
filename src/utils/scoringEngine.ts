import type { ProfileData } from "@/contexts/ProfileContext";

interface ScoreBreakdown {
  projects: number;
  contact: number;
  mapping: number;
}

interface PortfolioStrength {
  totalScore: number;
  breakdown: ScoreBreakdown;
}

export function calculatePortfolioStrength(profile: ProfileData): PortfolioStrength {
  const projects = getProjectScore(profile.projects.length);
  const contact = getContactScore(profile);
  const mapping = getSkillMappingScore(profile.skills, profile.projects);

  return {
    totalScore: projects + contact + mapping,
    breakdown: { projects, contact, mapping },
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
