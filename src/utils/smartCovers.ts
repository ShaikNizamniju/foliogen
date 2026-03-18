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
    keywords: ['ai', 'artificial intelligence', 'ml', 'machine learning', 'robot', 'neural', 'deep learning', 'gpt', 'llm', 'chatbot', 'automation', 'nlp', 'vision', 'tensorflow', 'pytorch'],
    imageId: 'photo-1677442136019-21780ecad995',
    fallbackId: 'photo-1620712943543-bcc4688e7485'
  },
  // Finance & Crypto
  {
    keywords: ['finance', 'fintech', 'crypto', 'cryptocurrency', 'bitcoin', 'blockchain', 'trading', 'money', 'banking', 'payment', 'investment', 'wallet', 'nft', 'defi', 'stocks', 'portfolio'],
    imageId: 'photo-1611974789855-9c2a0a7236a3',
    fallbackId: 'photo-1642790106117-e829e14a795f'
  },
  // Health & Medical
  {
    keywords: ['health', 'medical', 'healthcare', 'wellness', 'fitness', 'hospital', 'doctor', 'patient', 'biotech', 'pharma', 'telemedicine', 'gym', 'workout', 'nutrition', 'mental'],
    imageId: 'photo-1576091160399-112ba8d25d1d',
    fallbackId: 'photo-1559757175-0eb30cd8c063'
  },
  // Mobile & Apps
  {
    keywords: ['mobile', 'app', 'ios', 'android', 'smartphone', 'phone', 'notification', 'push', 'native', 'flutter', 'react native', 'swift', 'kotlin'],
    imageId: 'photo-1512941937669-90a1b58e7e9c',
    fallbackId: 'photo-1556656793-08538906a9f8'
  },
  // E-commerce & Retail
  {
    keywords: ['ecommerce', 'e-commerce', 'shop', 'store', 'retail', 'marketplace', 'cart', 'product', 'inventory', 'fashion', 'buy', 'sell', 'order', 'checkout', 'shopify', 'woocommerce'],
    imageId: 'photo-1556742049-0cfed4f6a45d',
    fallbackId: 'photo-1472851294608-062f824d29cc'
  },
  // Social & Community
  {
    keywords: ['social', 'media', 'chat', 'message', 'messaging', 'connect', 'community', 'forum', 'profile', 'network', 'friend', 'share', 'post', 'feed', 'twitter', 'instagram', 'tiktok'],
    imageId: 'photo-1611162617474-5b21e879e113',
    fallbackId: 'photo-1611605698335-8b1569810432'
  },
  // Data & Analytics
  {
    keywords: ['data', 'analytics', 'visualization', 'chart', 'graph', 'metrics', 'insights', 'reporting', 'bi', 'statistics', 'dashboard', 'report', 'admin', 'monitoring', 'kpi'],
    imageId: 'photo-1551288049-bebda4e38f71',
    fallbackId: 'photo-1504868584819-f8e8b4b6d7e3'
  },
  // Education & Learning
  {
    keywords: ['education', 'learning', 'course', 'school', 'university', 'edtech', 'training', 'tutorial', 'lms', 'learn', 'study', 'tutor', 'student', 'teacher', 'quiz', 'exam', 'mooc'],
    imageId: 'photo-1503676260728-1c00da094a0b',
    fallbackId: 'photo-1523240795612-9a054b0db644'
  },
  // Productivity & Tools
  {
    keywords: ['productivity', 'tool', 'workflow', 'automation', 'task', 'project management', 'collaboration', 'todo', 'list', 'calendar', 'planner', 'organize', 'notes', 'docs', 'notion', 'trello'],
    imageId: 'photo-1484480974693-6ca0a78fb36b',
    fallbackId: 'photo-1507925921958-8a62f3d1a50d'
  },
  // Web & SaaS
  {
    keywords: ['web', 'saas', 'platform', 'crm', 'erp', 'b2b', 'enterprise', 'software', 'subscription', 'portal', 'management', 'system'],
    imageId: 'photo-1460925895917-afdab827c52f',
    fallbackId: 'photo-1551288049-bebda4e38f71'
  },
  // Design & Creative
  {
    keywords: ['design', 'creative', 'ui', 'ux', 'graphic', 'art', 'brand', 'visual', 'illustration', 'animation', 'figma', 'sketch', 'adobe', 'portfolio', 'studio'],
    imageId: 'photo-1558655146-9f40138edfeb',
    fallbackId: 'photo-1561070791-2526d30994b5'
  },
  // Gaming & Entertainment
  {
    keywords: ['game', 'gaming', 'entertainment', 'video', 'stream', 'music', 'media', 'play', 'esports', 'arcade', 'unity', 'unreal', 'godot', 'interactive', 'twitch', 'youtube'],
    imageId: 'photo-1538481199705-c710c4e965fc',
    fallbackId: 'photo-1511512578047-dfb367046420'
  },
  // Dev Tools & Code
  {
    keywords: ['api', 'sdk', 'cli', 'library', 'framework', 'git', 'code', 'database', 'developer', 'open source', 'npm', 'package', 'module', 'terminal', 'vscode', 'github'],
    imageId: 'photo-1555066931-4365d14bab8c',
    fallbackId: 'photo-1461749280684-dccba630e2f6'
  },
  // DevOps & Infrastructure
  {
    keywords: ['devops', 'cloud', 'aws', 'infrastructure', 'server', 'kubernetes', 'docker', 'deployment', 'ci/cd', 'pipeline', 'terraform', 'azure', 'gcp', 'linux', 'hosting'],
    imageId: 'photo-1558494949-ef010cbdcc31',
    fallbackId: 'photo-1544197150-b99a580bb7a8'
  },
  // Security & Privacy
  {
    keywords: ['security', 'privacy', 'cyber', 'encryption', 'authentication', 'firewall', 'protection', 'secure', 'auth', 'login', 'lock', 'guard', 'vpn', 'password', 'oauth'],
    imageId: 'photo-1563206767-5b18f218e8de',
    fallbackId: 'photo-1555949963-ff9fe0c870eb'
  },
  // Real Estate & Property
  {
    keywords: ['house', 'home', 'property', 'estate', 'rent', 'booking', 'bnb', 'airbnb', 'apartment', 'real estate', 'listing', 'rental', 'mortgage', 'interior'],
    imageId: 'photo-1600596542815-ffad4c1539a9',
    fallbackId: 'photo-1600585154340-be6161a56a0c'
  },
  // Travel & Tourism
  {
    keywords: ['travel', 'trip', 'flight', 'hotel', 'map', 'location', 'tourism', 'vacation', 'booking', 'adventure', 'destination', 'explore', 'tour', 'airline'],
    imageId: 'photo-1488646953014-85cb44e25828',
    fallbackId: 'photo-1469854523086-cc02fe5d8800'
  },
  // Food & Restaurant
  {
    keywords: ['food', 'recipe', 'cook', 'restaurant', 'delivery', 'meal', 'diet', 'kitchen', 'chef', 'menu', 'order', 'catering', 'nutrition', 'grocery', 'ubereats', 'doordash'],
    imageId: 'photo-1504674900247-0877df9cc836',
    fallbackId: 'photo-1414235077428-338989a2e8c0'
  },
  // IoT & Hardware
  {
    keywords: ['iot', 'hardware', 'sensor', 'arduino', 'raspberry', 'embedded', 'device', 'smart home', 'wearable', 'electronics', 'robotics', 'drone', '3d print'],
    imageId: 'photo-1518770660439-4636190af475',
    fallbackId: 'photo-1558618666-fcd25c85cd64'
  },
  // Marketing & Growth
  {
    keywords: ['marketing', 'seo', 'growth', 'ads', 'advertising', 'campaign', 'email', 'newsletter', 'funnel', 'conversion', 'leads', 'crm', 'outreach', 'affiliate'],
    imageId: 'photo-1533750349088-cd871a92f312',
    fallbackId: 'photo-1460925895917-afdab827c52f'
  },
  // HR & Recruiting
  {
    keywords: ['hr', 'hiring', 'recruit', 'job', 'career', 'resume', 'talent', 'employee', 'onboarding', 'interview', 'applicant', 'workforce', 'payroll'],
    imageId: 'photo-1521737711867-e3b97375f902',
    fallbackId: 'photo-1600880292203-757bb62b4baf'
  },
  // Legal & Compliance
  {
    keywords: ['legal', 'law', 'contract', 'compliance', 'document', 'sign', 'agreement', 'policy', 'terms', 'gdpr', 'regulation'],
    imageId: 'photo-1589829545856-d10d557cf95f',
    fallbackId: 'photo-1450101499163-c8848c66ca85'
  },
  // Environment & Sustainability
  {
    keywords: ['green', 'eco', 'sustainable', 'environment', 'climate', 'carbon', 'renewable', 'solar', 'energy', 'recycle', 'nature'],
    imageId: 'photo-1473341304170-971dccb5ac1e',
    fallbackId: 'photo-1497435334941-8c899ee9e8e9'
  },
  // News & Media
  {
    keywords: ['news', 'blog', 'article', 'magazine', 'journal', 'press', 'publish', 'content', 'cms', 'wordpress', 'medium', 'editorial'],
    imageId: 'photo-1504711434969-e33886168f5c',
    fallbackId: 'photo-1495020689067-958852a7765e'
  },
  // Logistics & Supply Chain
  {
    keywords: ['logistics', 'shipping', 'delivery', 'warehouse', 'supply chain', 'inventory', 'tracking', 'fleet', 'transport', 'fulfillment'],
    imageId: 'photo-1586528116311-ad8dd3c8310d',
    fallbackId: 'photo-1553413077-190dd305871c'
  },
];

// Default covers - General tech/professional variety for unmatched projects
const DEFAULT_COVERS = [
  'photo-1498050108023-c5249f4df085', // Modern laptop workspace
  'photo-1517694712202-14dd9538aa97', // Clean coding desk
  'photo-1558494949-ef010cbdcc31', // Server room / data center
  'photo-1519389950473-47ba0277781c', // Team collaboration tech
  'photo-1531297484001-80022131f5a1', // Minimal tech gradient
  'photo-1504639725590-34d0984388bd', // Code on screen
  'photo-1451187580459-43490279c0fa', // Abstract tech globe
  'photo-1526374965328-7f61d4dc18c5', // Matrix/code rain
];

/**
 * Normalize text for keyword matching
 */
function normalizeText(text: any): string {
  if (typeof text !== 'string') return '';
  return text.toLowerCase().trim();
}

/**
 * Calculate match score for a project against cover keywords
 */
function calculateMatchScore(title: string, tags: string[], coverKeywords: string[]): number {
  const normalizedTitle = normalizeText(title);
  const normalizedTags = Array.isArray(tags) ? tags.map(normalizeText) : [];
  
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
    const titleWords = normalizedTitle.split(/\s+/).filter(Boolean);
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
  const safeTitle = typeof title === 'string' ? title : '';
  const safeTags = Array.isArray(tags) ? tags : [];

  if (!safeTitle && safeTags.length === 0) {
    // Return random default if no context
    const randomIndex = Math.floor(Math.random() * DEFAULT_COVERS.length);
    return buildUnsplashUrl(DEFAULT_COVERS[randomIndex]);
  }
  
  let bestMatch: CoverMatch | null = null;
  let highestScore = 0;
  
  for (const mapping of COVER_MAPPINGS) {
    const score = calculateMatchScore(safeTitle, safeTags, mapping.keywords);
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
  const hashCode = safeTitle.split('').reduce((acc, char) => {
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
