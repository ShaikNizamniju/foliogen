import { Project } from '@/contexts/ProfileContext';

/**
 * Generate AI-powered image URL for projects using Pollinations API
 */
export function getProjectImageUrl(project: Project, style: 'minimal' | 'creative' | 'terminal' | 'bold' = 'minimal'): string {
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
