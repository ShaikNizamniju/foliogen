/**
 * Detects if a URL is from YouTube or Loom and returns the embed URL
 * @param url - The video URL to convert
 * @returns The embed URL or null if not a video link
 */
export function getEmbedUrl(url: string): string | null {
  if (!url) return null;

  try {
    const urlObj = new URL(url);
    
    // YouTube patterns
    // - youtube.com/watch?v=VIDEO_ID
    // - youtu.be/VIDEO_ID
    // - youtube.com/embed/VIDEO_ID
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
      // Already an embed URL
      if (urlObj.pathname.startsWith('/embed/')) {
        return url;
      }
    }
    
    if (urlObj.hostname === 'youtu.be') {
      const videoId = urlObj.pathname.slice(1);
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // Loom patterns
    // - loom.com/share/VIDEO_ID
    // - loom.com/embed/VIDEO_ID
    if (urlObj.hostname.includes('loom.com')) {
      const pathParts = urlObj.pathname.split('/');
      const shareIndex = pathParts.indexOf('share');
      const embedIndex = pathParts.indexOf('embed');
      
      if (shareIndex !== -1 && pathParts[shareIndex + 1]) {
        return `https://www.loom.com/embed/${pathParts[shareIndex + 1]}`;
      }
      if (embedIndex !== -1 && pathParts[embedIndex + 1]) {
        return url; // Already an embed URL
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Check if a URL is a video link (YouTube or Loom)
 */
export function isVideoUrl(url: string): boolean {
  return getEmbedUrl(url) !== null;
}
