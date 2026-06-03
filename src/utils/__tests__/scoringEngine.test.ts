import { describe, it, expect } from "vitest";
import { calculatePortfolioStrength } from "../scoringEngine";
import type { ProfileData } from "@/contexts/ProfileContext";

const emptyProfile: ProfileData = {
  fullName: "",
  photoUrl: "",
  bio: "",
  headline: "",
  location: "",
  email: "",
  website: "",
  linkedinUrl: "",
  githubUrl: "",
  twitterUrl: "",
  workExperience: [],
  projects: [],
  skills: [],
  keyHighlights: [],
  views: 0,
  resumeUrl: "",
  calendlyUrl: "",
  selectedFont: "default",
  selectedTemplate: "modern-dark",
  activePersona: "general",
  narrativeVariants: {
    general: { bio: "", headline: "" },
    startup: { bio: "", headline: "" },
    bigtech: { bio: "", headline: "" },
    fintech: { bio: "", headline: "" },
  },
};

describe("calculatePortfolioStrength", () => {
  it("returns 0 for an empty profile", () => {
    const result = calculatePortfolioStrength(emptyProfile);
    expect(result.totalScore).toBe(0);
    expect(result.breakdown).toEqual({
      profileBasics: 0,
      experience: 0,
      projects: 0,
      skills: 0,
      contact: 0,
    });
  });

  it("returns 100 for a fully filled profile", () => {
    const profile: ProfileData = {
      ...emptyProfile,
      fullName: "Jane Doe",
      headline: "Engineer",
      location: "NYC",
      bio: "Builder",
      email: "a@b.com",
      linkedinUrl: "https://linkedin.com/in/x",
      githubUrl: "https://github.com/x",
      website: "https://example.com",
      skills: ["React", "TypeScript", "Node", "Go", "SQL"],
      workExperience: [
        { id: "1", company: "Acme", role: "Eng", startDate: "", endDate: "", description: "" } as any,
      ],
      projects: Array.from({ length: 2 }, (_, i) => ({
        id: String(i),
        title: `Project ${i}`,
        link: "",
        imageUrl: "",
        description: "",
        techStack: ["React"],
      })),
    };

    const result = calculatePortfolioStrength(profile);
    expect(result.totalScore).toBe(100);
    expect(result.breakdown).toEqual({
      profileBasics: 20,
      experience: 20,
      projects: 20,
      skills: 20,
      contact: 20,
    });
  });

  it("calculates partial scores correctly", () => {
    const profile: ProfileData = {
      ...emptyProfile,
      fullName: "Jane",
      headline: "Eng",
      email: "a@b.com",
      skills: ["React", "Vue"],
      projects: [
        { id: "1", title: "P1", link: "", imageUrl: "", description: "", techStack: ["React"] },
      ],
    };

    const result = calculatePortfolioStrength(profile);
    expect(result.breakdown.profileBasics).toBe(10);
    expect(result.breakdown.experience).toBe(0);
    expect(result.breakdown.projects).toBe(10);
    expect(result.breakdown.skills).toBe(10);
    expect(result.breakdown.contact).toBe(10);
    expect(result.totalScore).toBe(40);
  });
});
