import { Project } from '@/contexts/ProfileContext';
import { getSmartCover, getSmartCoverWithSize } from '@/utils/smartCovers';

/**
 * Generate professional project cover image
 * Uses curated Unsplash images matched to project keywords
 * Falls back to smart cover system if no custom image is provided
 */
export function getProjectImageUrl(
  project: Project, 
  style: 'minimal' | 'creative' | 'terminal' | 'bold' = 'minimal'
): string {
  // If project has a custom image URL, use that
  if (project.imageUrl) return project.imageUrl;
  
  // Collect tags from techStack and targetKeywords if available
  const tags: string[] = [
    ...((project as any).techStack || []),
    ...((project as any).targetKeywords || []),
  ];
  
  // Use smart cover system with curated Unsplash images
  const size = style === 'bold' ? 'large' : style === 'creative' ? 'medium' : 'medium';
  return getSmartCoverWithSize(project.title || 'project', tags, size);
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use getProjectImageUrl instead
 */
export function getProjectImageUrlLegacy(
  project: Project, 
  style: 'minimal' | 'creative' | 'terminal' | 'bold' = 'minimal'
): string {
  if (project.imageUrl) return project.imageUrl;
  
  const prompt = project.visualPrompt || project.title || 'abstract tech';
  
  const styleModifiers: Record<string, string> = {
    minimal: 'high quality UI design clean minimal modern',
    creative: 'high quality UI design abstract gradient',
    terminal: 'dark mode tech interface neon',
    bold: 'bright colorful bold graphic design',
  };
  
  const modifier = styleModifiers[style] || styleModifiers.minimal;
  
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ' ' + modifier)}?width=800&height=600&nologo=true`;
}
