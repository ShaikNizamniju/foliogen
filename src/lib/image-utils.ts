/**
 * Generate a professional Unsplash image URL based on project title keywords
 */
export function getUnsplashProjectImage(title: string): string {
  // Extract keywords from title
  const keywords = extractKeywords(title);
  const query = keywords.length > 0 ? keywords.join(',') : 'technology,code';
  
  // Use Unsplash Source API
  return `https://source.unsplash.com/1600x900/?${encodeURIComponent(query)}`;
}

/**
 * Extract relevant keywords from a project title for image search
 */
function extractKeywords(title: string): string[] {
  const techKeywords: Record<string, string[]> = {
    // AI/ML
    'ai': ['artificial-intelligence', 'robot'],
    'ml': ['machine-learning', 'data'],
    'machine learning': ['machine-learning', 'neural'],
    'deep learning': ['neural-network', 'technology'],
    'neural': ['neural-network', 'brain'],
    'gpt': ['artificial-intelligence', 'chat'],
    'llm': ['artificial-intelligence', 'technology'],
    'chatbot': ['chat', 'robot'],
    
    // Finance
    'finance': ['finance', 'money'],
    'fintech': ['finance', 'technology'],
    'banking': ['bank', 'finance'],
    'payment': ['payment', 'credit-card'],
    'crypto': ['cryptocurrency', 'bitcoin'],
    'trading': ['stock-market', 'trading'],
    
    // Mobile/Apps
    'mobile': ['mobile-app', 'smartphone'],
    'app': ['mobile-app', 'application'],
    'ios': ['iphone', 'mobile'],
    'android': ['android', 'smartphone'],
    
    // Web
    'web': ['website', 'coding'],
    'website': ['website', 'design'],
    'frontend': ['coding', 'design'],
    'backend': ['server', 'database'],
    'fullstack': ['coding', 'technology'],
    
    // Data
    'data': ['data', 'analytics'],
    'analytics': ['analytics', 'chart'],
    'dashboard': ['dashboard', 'analytics'],
    'visualization': ['data-visualization', 'chart'],
    
    // Cloud/DevOps
    'cloud': ['cloud-computing', 'server'],
    'devops': ['server', 'code'],
    'kubernetes': ['container', 'cloud'],
    'docker': ['container', 'technology'],
    
    // E-commerce
    'ecommerce': ['ecommerce', 'shopping'],
    'shop': ['shopping', 'store'],
    'marketplace': ['marketplace', 'shopping'],
    
    // Health
    'health': ['healthcare', 'medical'],
    'medical': ['medical', 'hospital'],
    'fitness': ['fitness', 'gym'],
    
    // Education
    'education': ['education', 'learning'],
    'learning': ['learning', 'study'],
    'course': ['education', 'classroom'],
    
    // Default tech keywords
    'api': ['api', 'technology'],
    'saas': ['software', 'cloud'],
    'platform': ['technology', 'software'],
    'tool': ['tools', 'technology'],
    'automation': ['automation', 'robot'],
  };
  
  const lowerTitle = title.toLowerCase();
  const foundKeywords: string[] = [];
  
  // Check each keyword pattern
  for (const [pattern, imageKeywords] of Object.entries(techKeywords)) {
    if (lowerTitle.includes(pattern)) {
      foundKeywords.push(...imageKeywords);
    }
  }
  
  // Remove duplicates and limit
  return [...new Set(foundKeywords)].slice(0, 3);
}

/**
 * Get a fallback technology image for projects without matched keywords
 */
export function getTechFallbackImage(): string {
  const fallbackQueries = [
    'technology,code,modern',
    'software,development,computer',
    'coding,laptop,workspace',
    'digital,innovation,tech',
  ];
  
  const randomQuery = fallbackQueries[Math.floor(Math.random() * fallbackQueries.length)];
  return `https://source.unsplash.com/1600x900/?${encodeURIComponent(randomQuery)}`;
}
