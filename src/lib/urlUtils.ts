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
