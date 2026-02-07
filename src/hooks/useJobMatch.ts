import { useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Project } from '@/contexts/ProfileContext';

interface JobMatchResult {
  sortedProjects: Project[];
  matchMode: boolean;
  matchTarget: string | null;
  matchType: 'company' | 'skill' | null;
  resetView: () => void;
  highlightedProjectIds: Set<string>;
}

export function useJobMatch(projects: Project[]): JobMatchResult {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isReset, setIsReset] = useState(false);
  
  // Read URL parameters
  const companyParam = searchParams.get('company');
  const skillParam = searchParams.get('skill');
  
  // Determine match mode
  const matchTarget = !isReset ? (companyParam || skillParam) : null;
  const matchType: 'company' | 'skill' | null = !isReset 
    ? (companyParam ? 'company' : skillParam ? 'skill' : null)
    : null;
  const matchMode = !!matchTarget;

  // Score and sort projects
  const { sortedProjects, highlightedProjectIds } = useMemo(() => {
    if (!matchMode || !matchTarget) {
      return { 
        sortedProjects: projects, 
        highlightedProjectIds: new Set<string>() 
      };
    }

    const targetLower = matchTarget.toLowerCase();
    const highlighted = new Set<string>();

    const scoredProjects = projects.map((project) => {
      let score = 0;

      // Check target keywords (industry tags)
      const targetKeywords = project.targetKeywords || [];
      for (const keyword of targetKeywords) {
        if (keyword.toLowerCase().includes(targetLower) || targetLower.includes(keyword.toLowerCase())) {
          score += 10;
          highlighted.add(project.id);
        }
      }

      // Check tech stack for skill matches
      const techStack = project.techStack || [];
      for (const tech of techStack) {
        if (tech.toLowerCase().includes(targetLower) || targetLower.includes(tech.toLowerCase())) {
          score += 10;
          highlighted.add(project.id);
        }
      }

      // Also check title and description for partial matches
      if (project.title?.toLowerCase().includes(targetLower)) {
        score += 5;
        highlighted.add(project.id);
      }
      if (project.description?.toLowerCase().includes(targetLower)) {
        score += 3;
        highlighted.add(project.id);
      }

      return { project, score };
    });

    // Sort by score (highest first), then maintain original order for equal scores
    const sorted = scoredProjects
      .sort((a, b) => b.score - a.score)
      .map(({ project }) => project);

    return { 
      sortedProjects: sorted, 
      highlightedProjectIds: highlighted 
    };
  }, [projects, matchMode, matchTarget]);

  // Reset view handler
  const resetView = useCallback(() => {
    setIsReset(true);
    // Optionally clear URL params
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('company');
    newParams.delete('skill');
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  return {
    sortedProjects,
    matchMode,
    matchTarget,
    matchType,
    resetView,
    highlightedProjectIds,
  };
}
