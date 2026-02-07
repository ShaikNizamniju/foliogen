/**
 * Smart Cover System
 * Maps project keywords to curated high-quality Unsplash images
 */

interface CoverMatch {
  keywords: string[];
  imageId: string;
  fallbackId?: string;
}

// Curated Unsplash photo IDs mapped to common project categories
const COVER_MAPPINGS: CoverMatch[] = [
  // AI & Machine Learning
  {
    keywords: ['ai', 'artificial intelligence', 'ml', 'machine learning', 'robot', 'neural', 'deep learning', 'gpt', 'llm', 'chatbot'],
    imageId: 'photo-1677442136019-21780ecad995', // AI brain visualization
    fallbackId: 'photo-1620712943543-bcc4688e7485'
  },
  // Finance & Crypto
  {
    keywords: ['finance', 'fintech', 'crypto', 'cryptocurrency', 'bitcoin', 'blockchain', 'trading', 'money', 'banking', 'payment', 'investment'],
    imageId: 'photo-1611974789855-9c2a0a7236a3', // Financial charts
    fallbackId: 'photo-1642790106117-e829e14a795f'
  },
  // Health & Medical
  {
    keywords: ['health', 'medical', 'healthcare', 'wellness', 'fitness', 'hospital', 'doctor', 'patient', 'biotech', 'pharma'],
    imageId: 'photo-1576091160399-112ba8d25d1d', // Medical technology
    fallbackId: 'photo-1559757175-0eb30cd8c063'
  },
  // Mobile & Apps
  {
    keywords: ['mobile', 'app', 'ios', 'android', 'smartphone', 'social', 'phone', 'messaging', 'notification'],
    imageId: 'photo-1512941937669-90a1b58e7e9c', // Phone in hand
    fallbackId: 'photo-1556656793-08538906a9f8'
  },
  // Web & SaaS
  {
    keywords: ['web', 'saas', 'dashboard', 'platform', 'analytics', 'crm', 'erp', 'b2b', 'enterprise', 'software'],
    imageId: 'photo-1460925895917-afdab827c52f', // Dashboard/analytics
    fallbackId: 'photo-1551288049-bebda4e38f71'
  },
  // Design & Creative
  {
    keywords: ['design', 'creative', 'ui', 'ux', 'graphic', 'art', 'brand', 'visual', 'illustration', 'animation'],
    imageId: 'photo-1558655146-9f40138edfeb', // Design workspace
    fallbackId: 'photo-1561070791-2526d30994b5'
  },
  // E-commerce & Retail
  {
    keywords: ['ecommerce', 'e-commerce', 'shop', 'store', 'retail', 'marketplace', 'cart', 'product', 'inventory'],
    imageId: 'photo-1556742049-0cfed4f6a45d', // Shopping/retail
    fallbackId: 'photo-1472851294608-062f824d29cc'
  },
  // Education & Learning
  {
    keywords: ['education', 'learning', 'course', 'school', 'university', 'edtech', 'training', 'tutorial', 'lms'],
    imageId: 'photo-1503676260728-1c00da094a0b', // Education
    fallbackId: 'photo-1523240795612-9a054b0db644'
  },
  // Gaming & Entertainment
  {
    keywords: ['game', 'gaming', 'entertainment', 'video', 'stream', 'music', 'media', 'play', 'esports'],
    imageId: 'photo-1538481199705-c710c4e965fc', // Gaming setup
    fallbackId: 'photo-1511512578047-dfb367046420'
  },
  // DevOps & Infrastructure
  {
    keywords: ['devops', 'cloud', 'aws', 'infrastructure', 'server', 'kubernetes', 'docker', 'deployment', 'ci/cd'],
    imageId: 'photo-1558494949-ef010cbdcc31', // Server room
    fallbackId: 'photo-1544197150-b99a580bb7a8'
  },
  // Security & Privacy
  {
    keywords: ['security', 'privacy', 'cyber', 'encryption', 'authentication', 'firewall', 'protection', 'secure'],
    imageId: 'photo-1563206767-5b18f218e8de', // Cybersecurity
    fallbackId: 'photo-1555949963-ff9fe0c870eb'
  },
  // Data & Analytics
  {
    keywords: ['data', 'analytics', 'visualization', 'chart', 'metrics', 'insights', 'reporting', 'bi', 'statistics'],
    imageId: 'photo-1551288049-bebda4e38f71', // Data visualization
    fallbackId: 'photo-1504868584819-f8e8b4b6d7e3'
  },
  // IoT & Hardware
  {
    keywords: ['iot', 'hardware', 'sensor', 'arduino', 'raspberry', 'embedded', 'device', 'smart home'],
    imageId: 'photo-1518770660439-4636190af475', // Circuit board
    fallbackId: 'photo-1558618666-fcd25c85cd64'
  },
  // Productivity & Tools
  {
    keywords: ['productivity', 'tool', 'workflow', 'automation', 'task', 'project management', 'collaboration'],
    imageId: 'photo-1484480974693-6ca0a78fb36b', // Productivity workspace
    fallbackId: 'photo-1507925921958-8a62f3d1a50d'
  },
];

// Default covers for when no keywords match - abstract tech aesthetics
const DEFAULT_COVERS = [
  'photo-1451187580459-43490279c0fa', // Abstract tech globe
  'photo-1526374965328-7f61d4dc18c5', // Matrix/code rain
  'photo-1635070041078-e363dbe005cb', // Abstract gradient
  'photo-1614851099511-773084f6911d', // Purple gradient abstract
  'photo-1557682250-33bd709cbe85', // Gradient waves
];

/**
 * Normalize text for keyword matching
 */
function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

/**
 * Calculate match score for a project against cover keywords
 */
function calculateMatchScore(title: string, tags: string[], coverKeywords: string[]): number {
  const normalizedTitle = normalizeText(title);
  const normalizedTags = tags.map(normalizeText);
  
  let score = 0;
  
  for (const keyword of coverKeywords) {
    const normalizedKeyword = normalizeText(keyword);
    
    // Title contains keyword (highest weight)
    if (normalizedTitle.includes(normalizedKeyword)) {
      score += 3;
    }
    
    // Tags contain keyword (high weight)
    if (normalizedTags.some(tag => tag.includes(normalizedKeyword) || normalizedKeyword.includes(tag))) {
      score += 2;
    }
    
    // Partial word match in title
    const titleWords = normalizedTitle.split(/\s+/);
    if (titleWords.some(word => word.startsWith(normalizedKeyword) || normalizedKeyword.startsWith(word))) {
      score += 1;
    }
  }
  
  return score;
}

/**
 * Build Unsplash URL from photo ID
 */
function buildUnsplashUrl(photoId: string, width: number = 800, quality: number = 80): string {
  return `https://images.unsplash.com/${photoId}?w=${width}&q=${quality}&auto=format&fit=crop`;
}

/**
 * Get the best matching cover image for a project
 * @param title - Project title
 * @param tags - Array of tech stack or keyword tags
 * @returns Unsplash image URL
 */
export function getSmartCover(title: string, tags: string[] = []): string {
  if (!title && tags.length === 0) {
    // Return random default if no context
    const randomIndex = Math.floor(Math.random() * DEFAULT_COVERS.length);
    return buildUnsplashUrl(DEFAULT_COVERS[randomIndex]);
  }
  
  let bestMatch: CoverMatch | null = null;
  let highestScore = 0;
  
  for (const mapping of COVER_MAPPINGS) {
    const score = calculateMatchScore(title, tags, mapping.keywords);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = mapping;
    }
  }
  
  // If we found a match with score > 0, use it
  if (bestMatch && highestScore > 0) {
    return buildUnsplashUrl(bestMatch.imageId);
  }
  
  // Use consistent default based on title hash for same project = same image
  const hashCode = title.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  const defaultIndex = Math.abs(hashCode) % DEFAULT_COVERS.length;
  
  return buildUnsplashUrl(DEFAULT_COVERS[defaultIndex]);
}

/**
 * Get cover with size options
 */
export function getSmartCoverWithSize(
  title: string, 
  tags: string[] = [], 
  size: 'small' | 'medium' | 'large' = 'medium'
): string {
  const sizeMap = {
    small: { width: 400, quality: 70 },
    medium: { width: 800, quality: 80 },
    large: { width: 1200, quality: 90 },
  };
  
  const { width, quality } = sizeMap[size];
  const baseUrl = getSmartCover(title, tags);
  
  // Replace width and quality in the URL
  return baseUrl.replace(/w=\d+/, `w=${width}`).replace(/q=\d+/, `q=${quality}`);
}

/**
 * Refresh cover - returns a different default if no keywords match
 * Useful for "try another" functionality
 */
export function getRefreshedCover(title: string, tags: string[] = [], currentUrl: string): string {
  const newUrl = getSmartCover(title, tags);
  
  // If we got a keyword match, always return that
  if (!DEFAULT_COVERS.some(id => newUrl.includes(id))) {
    return newUrl;
  }
  
  // Otherwise cycle through defaults
  const currentIndex = DEFAULT_COVERS.findIndex(id => currentUrl.includes(id));
  const nextIndex = (currentIndex + 1) % DEFAULT_COVERS.length;
  
  return buildUnsplashUrl(DEFAULT_COVERS[nextIndex]);
}
