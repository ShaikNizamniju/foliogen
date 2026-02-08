/**
 * URL utility functions for sanitizing and validating URLs
 */

/**
 * Ensures a URL has a protocol prefix.
 * If the URL is empty, returns empty string.
 * If the URL already has http:// or https://, returns as-is.
 * Otherwise, prepends https://.
 * 
 * @example
 * ensureProtocol('google.com') // 'https://google.com'
 * ensureProtocol('https://example.com') // 'https://example.com'
 * ensureProtocol('') // ''
 */
export function ensureProtocol(url: string | undefined | null): string {
  if (!url || url.trim() === '') {
    return '';
  }
  
  const trimmedUrl = url.trim();
  
  // Already has a protocol
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }
  
  // Prepend https://
  return `https://${trimmedUrl}`;
}

/**
 * Validates if a string is a valid URL.
 * Returns true for empty strings (optional fields).
 */
export function isValidUrl(url: string | undefined | null): boolean {
  if (!url || url.trim() === '') {
    return true; // Empty is valid (optional)
  }
  
  try {
    const urlWithProtocol = ensureProtocol(url);
    new URL(urlWithProtocol);
    return true;
  } catch {
    return false;
  }
}

/**
 * Opens a URL in a new tab, ensuring it has a protocol.
 */
export function openUrlSafely(url: string | undefined | null): void {
  const safeUrl = ensureProtocol(url);
  if (safeUrl) {
    window.open(safeUrl, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Gets a smart label for a document URL based on its content
 * @param url - The document URL
 * @returns A contextual label like "View PDF", "View Post", or "View Details"
 */
export function getDocsButtonLabel(url: string | undefined | null): string {
  if (!url) return 'View Details';
  const lowerUrl = url.toLowerCase();
  
  // Check for PDF files
  if (lowerUrl.endsWith('.pdf')) {
    return 'View PDF';
  }
  
  // Check for LinkedIn posts
  if (lowerUrl.includes('linkedin.com')) {
    return 'View Post';
  }
  
  // Check for common document platforms
  if (lowerUrl.includes('notion.so') || lowerUrl.includes('notion.site')) {
    return 'View Docs';
  }
  
  if (lowerUrl.includes('docs.google.com') || lowerUrl.includes('drive.google.com')) {
    return 'View Document';
  }
  
  if (lowerUrl.includes('github.com')) {
    return 'View Repo';
  }
  
  if (lowerUrl.includes('figma.com')) {
    return 'View Design';
  }
  
  if (lowerUrl.includes('medium.com') || lowerUrl.includes('dev.to') || lowerUrl.includes('hashnode')) {
    return 'Read Article';
  }
  
  return 'View Details';
}
