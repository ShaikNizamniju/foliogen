import { Project } from '@/contexts/ProfileContext';
import { getUnsplashProjectImage, DEFAULT_PROJECT_THUMBNAIL } from './image-utils';

/**
 * Generate project image URL - uses Unsplash for professional images
 */
export function getProjectImageUrl(project: Project, style: 'minimal' | 'creative' | 'terminal' | 'bold' = 'minimal'): string {
  // If user has provided a custom image, use it
  if (project.imageUrl) return project.imageUrl;
  
  // If project has a title, get a relevant image
  if (project.title) {
    return getUnsplashProjectImage(project.title);
  }
  
  // Otherwise, return the default professional gradient
  return DEFAULT_PROJECT_THUMBNAIL;
}
