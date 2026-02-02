import { Project } from '@/contexts/ProfileContext';
import { getUnsplashProjectImage } from './image-utils';

/**
 * Generate project image URL - uses Unsplash for professional images
 */
export function getProjectImageUrl(project: Project, style: 'minimal' | 'creative' | 'terminal' | 'bold' = 'minimal'): string {
  // If user has provided a custom image, use it
  if (project.imageUrl) return project.imageUrl;
  
  // Otherwise, get a professional Unsplash image based on title
  return getUnsplashProjectImage(project.title || 'technology');
}
