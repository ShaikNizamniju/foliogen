import { getEmbedUrl } from '@/lib/video-utils';

interface ProjectVideoEmbedProps {
  url: string;
  title: string;
  fallbackImage?: string;
  className?: string;
}

export function ProjectVideoEmbed({ url, title, fallbackImage, className = '' }: ProjectVideoEmbedProps) {
  const embedUrl = getEmbedUrl(url);

  if (embedUrl) {
    return (
      <iframe
        src={embedUrl}
        title={title}
        className={`w-full aspect-video ${className}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  // Fallback to image if not a video URL
  if (fallbackImage) {
    return (
      <img
        src={fallbackImage}
        alt={title}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  return null;
}
