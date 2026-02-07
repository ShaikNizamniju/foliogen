import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ImageOff } from 'lucide-react';
import { getSmartCover, getRefreshedCover } from '@/utils/smartCovers';
import { cn } from '@/lib/utils';

interface SmartProjectImageProps {
  title: string;
  tags?: string[];
  customImage?: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'wide';
  showRefresh?: boolean;
  priority?: boolean;
}

export function SmartProjectImage({
  title,
  tags = [],
  customImage,
  className,
  aspectRatio = 'video',
  showRefresh = false,
  priority = false,
}: SmartProjectImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  // Memoize the smart cover URL to prevent unnecessary recalculations
  const smartCoverUrl = useMemo(() => {
    return getSmartCover(title, tags);
  }, [title, tags]);

  // Determine which image to display
  const imageUrl = customImage && !imageError ? customImage : (currentImage || smartCoverUrl);

  const handleImageError = () => {
    if (customImage && !imageError) {
      // If custom image failed, try smart cover
      setImageError(true);
    }
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const newUrl = getRefreshedCover(title, tags, imageUrl);
    setCurrentImage(newUrl);
    setIsLoading(true);
  };

  const aspectRatioClass = {
    video: 'aspect-video',
    square: 'aspect-square',
    wide: 'aspect-[21/9]',
  }[aspectRatio];

  return (
    <div 
      className={cn(
        'relative overflow-hidden bg-muted group',
        aspectRatioClass,
        className
      )}
    >
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/10 animate-pulse" />
      )}

      {/* Main image with zoom effect */}
      <motion.img
        src={imageUrl}
        alt={title || 'Project cover'}
        loading={priority ? 'eager' : 'lazy'}
        onError={handleImageError}
        onLoad={handleImageLoad}
        className={cn(
          'w-full h-full object-cover transition-transform duration-700',
          'group-hover:scale-105',
          isLoading && 'opacity-0'
        )}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: isLoading ? 0 : 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />

      {/* Bottom gradient overlay for text readability */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        aria-hidden="true"
      />

      {/* Always-visible subtle gradient at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Refresh button (optional) */}
      {showRefresh && !customImage && (
        <motion.button
          onClick={handleRefresh}
          className={cn(
            'absolute top-2 right-2 p-2 rounded-full',
            'bg-black/50 backdrop-blur-sm text-white/80',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
            'hover:bg-black/70 hover:text-white',
            'focus:outline-none focus:ring-2 focus:ring-primary/50'
          )}
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
          title="Try a different cover"
          aria-label="Refresh cover image"
        >
          <RefreshCw className="h-4 w-4" />
        </motion.button>
      )}

      {/* Error state fallback */}
      {imageError && !customImage && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center text-muted-foreground">
            <ImageOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <span className="text-xs">Image unavailable</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Simplified version without interactivity for templates
export function SmartProjectImageStatic({
  title,
  tags = [],
  customImage,
  className,
  style,
}: {
  title: string;
  tags?: string[];
  customImage?: string;
  className?: string;
  style?: 'minimal' | 'creative' | 'terminal' | 'bold';
}) {
  const [imageError, setImageError] = useState(false);

  const smartCoverUrl = useMemo(() => {
    return getSmartCover(title, tags);
  }, [title, tags]);

  const imageUrl = customImage && !imageError ? customImage : smartCoverUrl;

  return (
    <img
      src={imageUrl}
      alt={title || 'Project cover'}
      onError={() => setImageError(true)}
      className={cn('w-full h-full object-cover', className)}
    />
  );
}
