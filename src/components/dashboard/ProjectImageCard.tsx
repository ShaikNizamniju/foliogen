import { useState } from 'react';
import { Project } from '@/contexts/ProfileContext';
import { getUnsplashProjectImage } from '@/lib/image-utils';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectImageCardProps {
  project: Project;
  onImageChange: (imageUrl: string) => void;
}

export function ProjectImageCard({ project, onImageChange }: ProjectImageCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Determine image source
  const getImageUrl = () => {
    if (project.imageUrl) return project.imageUrl;
    if (project.title) return getUnsplashProjectImage(project.title);
    return getUnsplashProjectImage('technology');
  };

  const handleRefreshImage = async () => {
    setIsRefreshing(true);
    setImageError(false);
    
    // Generate new Unsplash URL with cache buster
    const newUrl = `${getUnsplashProjectImage(project.title || 'technology')}&t=${Date.now()}`;
    onImageChange(newUrl);
    
    // Simulate loading
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleGenerateCover = () => {
    // Mockup for AI generation - just shows a toast for now
    // This will eventually call an AI image generation API
    alert('AI Cover Generation coming soon! For now, we auto-select relevant images from Unsplash.');
  };

  return (
    <div className="space-y-2">
      <div className="relative aspect-video rounded-lg overflow-hidden border border-border bg-muted group">
        {!imageError ? (
          <img
            src={getImageUrl()}
            alt={project.title || 'Project cover'}
            className={cn(
              'w-full h-full object-cover transition-all duration-300',
              isRefreshing && 'opacity-50'
            )}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10">
            <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        
        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleRefreshImage}
            disabled={isRefreshing}
            className="gap-1.5"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isRefreshing && 'animate-spin')} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={handleGenerateCover}
            className="gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate Cover
          </Button>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        Hover to refresh or generate AI cover
      </p>
    </div>
  );
}
