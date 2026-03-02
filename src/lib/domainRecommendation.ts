export type ProfessionalDomain = 'tech' | 'creative' | 'corporate' | 'luxury' | 'other';

export interface DomainOption {
  id: ProfessionalDomain;
  label: string;
  description: string;
  icon: string;
  recommendedTemplate: string;
}

export const domainOptions: DomainOption[] = [
  {
    id: 'tech',
    label: 'Tech / Engineering',
    description: 'Developers, PMs, data scientists',
    icon: '⌨️',
    recommendedTemplate: 'arpeggio',
  },
  {
    id: 'creative',
    label: 'Creative / Design',
    description: 'Designers, artists, photographers',
    icon: '🎨',
    recommendedTemplate: 'destello',
  },
  {
    id: 'corporate',
    label: 'Corporate / Finance',
    description: 'Executives, analysts, consultants',
    icon: '📊',
    recommendedTemplate: 'executive',
  },
  {
    id: 'luxury',
    label: 'Luxury / Fashion',
    description: 'Stylists, brand managers, editors',
    icon: '✦',
    recommendedTemplate: 'gaspar',
  },
];

/** Domain → template tag map for highlighting in the gallery */
export const domainTemplateMap: Record<ProfessionalDomain, string[]> = {
  tech: ['arpeggio', 'dev', 'minimal-saas', 'modern-dark', 'frqncy'],
  creative: ['destello', 'frqncy', 'niju-bold', 'studio', 'brutalist', 'creative', 'influencer'],
  corporate: ['executive', 'saas', 'minimalist', 'swiss', 'academic'],
  luxury: ['gaspar', 'nakula', 'academic', 'noir'],
  other: ['modern-dark', 'minimalist', 'saas', 'creative', 'niju-bold'],
};

export function getRecommendedTemplate(domain: ProfessionalDomain): string {
  return domainOptions.find((d) => d.id === domain)?.recommendedTemplate ?? 'modern-dark';
}

export function isRecommendedForDomain(templateId: string, domain: ProfessionalDomain | null): boolean {
  if (!domain) return false;
  return domainOptions.find((d) => d.id === domain)?.recommendedTemplate === templateId;
}

export function isDomainRelevant(templateId: string, domain: ProfessionalDomain | null): boolean {
  if (!domain) return true;
  return domainTemplateMap[domain]?.includes(templateId) ?? false;
}
