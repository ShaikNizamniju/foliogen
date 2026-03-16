import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, ArrowRight, Filter, Sparkles } from 'lucide-react';
import { GasparTemplate } from '@/components/templates/GasparTemplate';
import { DestelloTemplate } from '@/components/templates/DestelloTemplate';
import { FrqncyTemplate } from '@/components/templates/FrqncyTemplate';
import { ArpeggioTemplate } from '@/components/templates/ArpeggioTemplate';
import { NakulaTemplate } from '@/components/templates/NakulaTemplate';
import { HeroBoldTemplate } from '@/components/templates/HeroBoldTemplate';
import { MinimalSaasTemplate } from '@/components/templates/MinimalSaasTemplate';
import { MinimalistTemplate } from '@/components/dashboard/templates/MinimalistTemplate';
import { ModernDarkTemplate } from '@/components/dashboard/templates/ModernDarkTemplate';
import { CreativeTemplate } from '@/components/dashboard/templates/CreativeTemplate';
import { SaasTemplate } from '@/components/dashboard/templates/SaasTemplate';
import { DevTemplate } from '@/components/dashboard/templates/DevTemplate';
import { BrutalistTemplate } from '@/components/dashboard/templates/BrutalistTemplate';
import { AcademicTemplate } from '@/components/dashboard/templates/AcademicTemplate';
import { StudioTemplate } from '@/components/dashboard/templates/StudioTemplate';
import { ExecutiveTemplate } from '@/components/dashboard/templates/ExecutiveTemplate';
import { InfluencerTemplate } from '@/components/dashboard/templates/InfluencerTemplate';
import { SwissTemplate } from '@/components/dashboard/templates/SwissTemplate';
import { NoirTemplate } from '@/components/dashboard/templates/NoirTemplate';
import { Helmet } from 'react-helmet-async';
import { Badge } from '@/components/ui/badge';
import { isRecommendedForDomain, isDomainRelevant, type ProfessionalDomain } from '@/lib/domainRecommendation';

const ONBOARDING_DONE_KEY = 'foliogen_onboarding_domain';

type TemplateCategory = 'editorial' | 'brutalist' | 'modern' | 'creative' | 'glassmorphic' | 'tech' | 'bold' | 'minimal' | 'corporate' | 'cinematic';

interface TemplateEntry {
  id: string;
  name: string;
  tagline: string;
  style: string;
  category: TemplateCategory;
  gradient: string;
  preview: React.ComponentType<any>;
}

const galleryTemplates: TemplateEntry[] = [
  // ── New "Genius" Templates ──
  {
    id: 'gaspar',
    name: 'GASPAR',
    tagline: 'High-end branding studio with serif typography',
    style: 'Editorial · Luxury · Serif',
    category: 'editorial',
    gradient: 'from-[#F5F0E8] to-[#E8E0D0]',
    preview: GasparTemplate,
  },
  {
    id: 'destello',
    name: 'DESTELLO',
    tagline: 'Dramatic agency with numbered works & process accordion',
    style: 'Bold · Creative · Studio',
    category: 'creative',
    gradient: 'from-[#FFFFFF] to-[#FFF0F0]',
    preview: DestelloTemplate,
  },
  {
    id: 'frqncy',
    name: 'FRQNCY',
    tagline: 'High-energy neon bento grid with music producer vibes',
    style: 'Gen-Z · Creative · Neon',
    category: 'creative',
    gradient: 'from-[#F0F0F0] to-[#E8FFD0]',
    preview: FrqncyTemplate,
  },
  {
    id: 'arpeggio',
    name: 'ARPEGGIO',
    tagline: 'Dark brutalist grid with bold headings & staggered reveals',
    style: 'Brutalist · Dark · Grid',
    category: 'brutalist',
    gradient: 'from-[#0A0A0A] to-[#1A1A1A]',
    preview: ArpeggioTemplate,
  },
  {
    id: 'nakula',
    name: 'NAKULA',
    tagline: 'Airy glassmorphic layout with refined serif elegance',
    style: 'Glassmorphic · Airy · Elegant',
    category: 'glassmorphic',
    gradient: 'from-[#FAFAF8] to-[#F0EDE8]',
    preview: NakulaTemplate,
  },
  {
    id: 'niju-bold',
    name: 'HERO BOLD',
    tagline: 'High-contrast massive typography for speakers & thought leaders',
    style: 'Bold · High-Contrast · Leadership',
    category: 'bold',
    gradient: 'from-[#0A0A0A] to-[#1A0A10]',
    preview: HeroBoldTemplate,
  },
  {
    id: 'minimal-saas',
    name: 'MINIMAL SAAS',
    tagline: 'Clean tech-focused layout for AI PMs and developers',
    style: 'Tech · Minimal · Professional',
    category: 'tech',
    gradient: 'from-[#FAFBFC] to-[#EEF2FF]',
    preview: MinimalSaasTemplate,
  },
  // ── Original Templates ──
  {
    id: 'modern-dark',
    name: 'MODERN DARK',
    tagline: 'Cosmic night with glassmorphism & cyan accents',
    style: 'Modern · Dark · Glassmorphic',
    category: 'modern',
    gradient: 'from-[#0A0A1F] to-[#0F172A]',
    preview: ModernDarkTemplate,
  },
  {
    id: 'minimalist',
    name: 'THE MINIMALIST',
    tagline: 'Clean Swiss design with elegant spacing & editorial sidebar',
    style: 'Minimal · Swiss · Monochrome',
    category: 'minimal',
    gradient: 'from-[#FFFFFF] to-[#F0F0F0]',
    preview: MinimalistTemplate,
  },
  {
    id: 'creative',
    name: 'THE CREATIVE',
    tagline: 'Vibrant bento grid with aurora effects & colorful badges',
    style: 'Creative · Bento · Aurora',
    category: 'creative',
    gradient: 'from-[#F8F0FF] to-[#FFF0F8]',
    preview: CreativeTemplate,
  },
  {
    id: 'saas',
    name: 'THE FOUNDER',
    tagline: 'Stripe-inspired metrics showcase for startup builders',
    style: 'Corporate · Metrics · SaaS',
    category: 'corporate',
    gradient: 'from-[#F5F5FF] to-[#EEF2FF]',
    preview: SaasTemplate,
  },
  {
    id: 'dev',
    name: 'THE TERMINAL',
    tagline: 'Dark IDE with typewriter effects for developers',
    style: 'Tech · Terminal · Dark',
    category: 'tech',
    gradient: 'from-[#0D1117] to-[#161B22]',
    preview: DevTemplate,
  },
  {
    id: 'brutalist',
    name: 'THE BRUTALIST',
    tagline: 'Neo-brutalist with bold shadows & raw edges',
    style: 'Brutalist · Bold · Raw',
    category: 'brutalist',
    gradient: 'from-[#FFFBE6] to-[#FFF0B3]',
    preview: BrutalistTemplate,
  },
  {
    id: 'academic',
    name: 'THE ACADEMIC',
    tagline: 'Ivy League elegance with serif fonts & classic layout',
    style: 'Academic · Serif · Classic',
    category: 'editorial',
    gradient: 'from-[#FAF9F6] to-[#F0EDE8]',
    preview: AcademicTemplate,
  },
  {
    id: 'studio',
    name: 'THE STUDIO',
    tagline: 'Visual-first masonry grid for photographers & creatives',
    style: 'Creative · Masonry · Visual',
    category: 'creative',
    gradient: 'from-[#FAFAFA] to-[#F0F0F0]',
    preview: StudioTemplate,
  },
  {
    id: 'executive',
    name: 'THE EXECUTIVE',
    tagline: 'Fortune 500 navy with gold accents & authority layout',
    style: 'Corporate · Navy · Executive',
    category: 'corporate',
    gradient: 'from-[#0B1D3A] to-[#0F2849]',
    preview: ExecutiveTemplate,
  },
  {
    id: 'influencer',
    name: 'THE INFLUENCER',
    tagline: 'Premium link-in-bio with glassmorphism & social focus',
    style: 'Modern · Social · Glassmorphic',
    category: 'modern',
    gradient: 'from-[#FFF0F5] to-[#F0E8FF]',
    preview: InfluencerTemplate,
  },
  {
    id: 'swiss',
    name: 'THE SWISS',
    tagline: 'International typographic grid style with precision layout',
    style: 'Minimal · Grid · Typography',
    category: 'minimal',
    gradient: 'from-[#FFFFFF] to-[#F5F5F5]',
    preview: SwissTemplate,
  },
  {
    id: 'noir',
    name: 'THE NOIR',
    tagline: 'Cinematic black & white with film grain & dramatic lighting',
    style: 'Cinematic · B&W · Film',
    category: 'cinematic',
    gradient: 'from-[#0A0A0A] to-[#1A1A1A]',
    preview: NoirTemplate,
  },
];

const categories = [
  { id: 'all', label: 'All' },
  { id: 'editorial', label: 'Editorial' },
  { id: 'creative', label: 'Creative' },
  { id: 'brutalist', label: 'Brutalist' },
  { id: 'glassmorphic', label: 'Glassmorphic' },
  { id: 'bold', label: 'Bold' },
  { id: 'tech', label: 'Tech' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'cinematic', label: 'Cinematic' },
];

const domainFilters = [
  { id: null as ProfessionalDomain | null, label: 'All Domains' },
  { id: 'tech' as ProfessionalDomain, label: '⌨️ Tech' },
  { id: 'creative' as ProfessionalDomain, label: '🎨 Creative' },
  { id: 'corporate' as ProfessionalDomain, label: '📊 Corporate' },
  { id: 'luxury' as ProfessionalDomain, label: '✦ Luxury' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 * i, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export default function TemplatesGallery() {
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDomain, setActiveDomain] = useState<ProfessionalDomain | null>(null);
  const activeTemplate = galleryTemplates.find((t) => t.id === previewId);

  // Load saved domain from onboarding
  useEffect(() => {
    const stored = localStorage.getItem(ONBOARDING_DONE_KEY);
    if (stored && stored !== 'skipped') {
      setActiveDomain(stored as ProfessionalDomain);
    }
  }, []);

  let filtered = activeCategory === 'all'
    ? galleryTemplates
    : galleryTemplates.filter((t) => t.category === activeCategory);

  // Sort: recommended first when domain is active
  if (activeDomain) {
    filtered = [...filtered].sort((a, b) => {
      const aRec = isRecommendedForDomain(a.id, activeDomain) ? -2 : isDomainRelevant(a.id, activeDomain) ? -1 : 0;
      const bRec = isRecommendedForDomain(b.id, activeDomain) ? -2 : isDomainRelevant(b.id, activeDomain) ? -1 : 0;
      return aRec - bRec;
    });
  }

  return (
    <>
      <Helmet>
        <title>Template Gallery — The AI PM Identity Vault</title>
        <meta name="description" content="Browse premium portfolio templates for professionals. From editorial luxury to minimalist elegance." />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Instrument+Serif&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold tracking-tight text-foreground">Foliogen</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm text-muted-foreground">Templates</span>
            </div>
            <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
              {galleryTemplates.length}+ Premium Design Systems
            </span>
          </div>
        </motion.header>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-4">
              Template{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-foreground">
                Gallery
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Premium, hand-crafted portfolio designs. Click preview to experience each template in full.
            </p>
          </motion.div>
        </section>

        {/* Domain Filter */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex items-center gap-2 flex-wrap"
          >
            <Sparkles className="h-4 w-4 text-primary mr-1" />
            <span className="text-xs text-muted-foreground mr-1">Domain:</span>
            {domainFilters.map((df) => (
              <button
                key={df.label}
                onClick={() => setActiveDomain(df.id)}
                className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 ${
                  activeDomain === df.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-transparent text-muted-foreground border-border hover:border-primary/30'
                }`}
              >
                {df.label}
              </button>
            ))}
          </motion.div>
        </section>

        {/* Style Filter */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex items-center gap-2 flex-wrap"
          >
            <Filter className="h-4 w-4 text-muted-foreground mr-1" />
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 text-xs tracking-wider uppercase rounded-full border transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-transparent text-muted-foreground border-border hover:border-foreground/30'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>
        </section>

        {/* Grid */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${activeDomain}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((template, i) => {
                const isRecommended = isRecommendedForDomain(template.id, activeDomain);
                const isRelevant = isDomainRelevant(template.id, activeDomain);

                return (
                  <motion.div
                    key={template.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className={`group relative rounded-2xl border bg-card overflow-hidden cursor-pointer transition-all duration-300 flex flex-col h-full ${
                      isRecommended
                        ? 'border-primary ring-2 ring-primary/20 shadow-lg'
                        : activeDomain && !isRelevant
                        ? 'border-border opacity-50'
                        : 'border-border hover:border-primary/40'
                    }`}
                    onClick={() => setPreviewId(template.id)}
                  >
                    {/* Recommended badge */}
                    {isRecommended && (
                      <div className="absolute top-3 left-3 z-20">
                        <Badge className="bg-primary text-primary-foreground gap-1 text-[10px] shadow-lg">
                          <Sparkles className="h-3 w-3" />
                          Recommended
                        </Badge>
                      </div>
                    )}

                    {/* Thumbnail */}
                    <div className={`relative aspect-video w-full bg-gradient-to-br ${template.gradient} overflow-hidden shrink-0`}>
                      <div className="absolute inset-0 origin-top-left scale-[0.25] w-[400%] h-[400%] pointer-events-none">
                        <template.preview />
                      </div>
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm text-foreground text-sm font-medium px-4 py-2 rounded-full shadow-lg">
                            <Eye className="h-4 w-4" />
                            Preview
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-foreground tracking-tight line-clamp-1">
                          {template.name}
                        </h3>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
                        {template.tagline}
                      </p>
                      <div className="mt-auto">
                        <span className="text-[10px] tracking-wider uppercase font-medium text-muted-foreground/60 transition-colors group-hover:text-primary/70">
                          {template.style}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Full-screen Preview Modal */}
        <AnimatePresence>
          {activeTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-background"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-background/80 backdrop-blur-xl border-b border-border"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">{activeTemplate.name}</span>
                  <span className="text-xs text-muted-foreground">{activeTemplate.style}</span>
                  {isRecommendedForDomain(activeTemplate.id, activeDomain) && (
                    <Badge className="bg-primary text-primary-foreground gap-1 text-[10px]">
                      <Sparkles className="h-3 w-3" />
                      Recommended
                    </Badge>
                  )}
                </div>
                <button
                  onClick={() => setPreviewId(null)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5 text-foreground" />
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="overflow-auto"
                style={{ height: 'calc(100vh - 53px)' }}
              >
                <activeTemplate.preview />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
