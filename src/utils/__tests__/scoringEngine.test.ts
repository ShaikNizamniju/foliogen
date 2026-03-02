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
};

describe("calculatePortfolioStrength", () => {
  it("returns 0 for an empty profile", () => {
    const result = calculatePortfolioStrength(emptyProfile);
    expect(result.totalScore).toBe(0);
    expect(result.breakdown).toEqual({ projects: 0, contact: 0, mapping: 0 });
  });

  it("returns 100 for a perfect profile", () => {
    const profile: ProfileData = {
      ...emptyProfile,
      email: "a@b.com",
      linkedinUrl: "https://linkedin.com/in/x",
      githubUrl: "https://github.com/x",
      twitterUrl: "https://twitter.com/x",
      website: "https://example.com",
      skills: ["React", "TypeScript", "Node"],
      projects: Array.from({ length: 5 }, (_, i) => ({
        id: String(i),
        title: `Project ${i}`,
        link: "",
        imageUrl: "",
        description: "",
        techStack: ["React", "TypeScript", "Node"],
      })),
    };

    const result = calculatePortfolioStrength(profile);
    expect(result.totalScore).toBe(100);
    expect(result.breakdown).toEqual({ projects: 30, contact: 20, mapping: 50 });
  });

  it("calculates correctly for a partial profile", () => {
    const profile: ProfileData = {
      ...emptyProfile,
      email: "a@b.com",
      linkedinUrl: "https://linkedin.com/in/x",
      githubUrl: "https://github.com/x",
      skills: ["React", "Vue"],
      projects: [
        { id: "1", title: "P1", link: "", imageUrl: "", description: "", techStack: ["React"] },
        { id: "2", title: "P2", link: "", imageUrl: "", description: "", techStack: ["Angular"] },
      ],
    };

    const result = calculatePortfolioStrength(profile);
    // 2 projects = 15, 3 contacts = 12, 1/2 skills matched = 25
    expect(result.breakdown.projects).toBe(15);
    expect(result.breakdown.contact).toBe(12);
    expect(result.breakdown.mapping).toBe(25);
    expect(result.totalScore).toBe(52);
  });
});
