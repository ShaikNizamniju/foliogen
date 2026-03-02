import { useProfile } from '@/contexts/ProfileContext';
import { useFavorites } from '@/hooks/useFavorites';
import { TemplateCard } from '../TemplateCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Template registry - should be shared with TemplatesSection
export const templates = [
  {
    id: 'minimalist',
    name: 'The Minimalist',
    description: 'Clean Swiss design with elegant spacing',
  },
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    description: 'Cosmic night with glassmorphism & cyan accents',
  },
  {
    id: 'creative',
    name: 'The Creative',
    description: 'Vibrant bento grid with aurora effects',
  },
  {
    id: 'saas',
    name: 'The Founder',
    description: 'Stripe-inspired metrics showcase',
  },
  {
    id: 'dev',
    name: 'The Terminal',
    description: 'Dark IDE with typewriter effects',
  },
  {
    id: 'brutalist',
    name: 'The Brutalist',
    description: 'Neo-brutalist with bold shadows',
  },
  {
    id: 'academic',
    name: 'The Academic',
    description: 'Ivy League elegance with serif fonts',
  },
  {
    id: 'studio',
    name: 'The Studio',
    description: 'Visual-first masonry for creatives',
  },
  {
    id: 'executive',
    name: 'The Executive',
    description: 'Fortune 500 navy with gold accents',
  },
  {
    id: 'influencer',
    name: 'The Influencer',
    description: 'Premium link-in-bio with glassmorphism',
  },
  {
    id: 'swiss',
    name: 'The Swiss',
    description: 'International typographic grid style',
  },
  {
    id: 'noir',
    name: 'The Noir',
    description: 'Cinematic black & white with film grain',
  },
  {
    id: 'gaspar',
    name: 'Gaspar',
    description: 'Editorial luxury with serif typography',
  },
  {
    id: 'destello',
    name: 'Destello',
    description: 'Bold creative studio with numbered works',
  },
  {
    id: 'frqncy',
    name: 'Frqncy',
    description: 'Gen-Z neon bento grid with creative vibes',
  },
  {
    id: 'arpeggio',
    name: 'Arpeggio',
    description: 'Dark brutalist grid with staggered reveals',
  },
  {
    id: 'nakula',
    name: 'Nakula',
    description: 'Airy glassmorphic layout with serif elegance',
  },
  {
    id: 'niju-bold',
    name: 'Hero Bold',
    description: 'High-contrast large type for thought leaders',
  },
  {
    id: 'minimal-saas',
    name: 'Minimal SaaS',
    description: 'Clean tech-focused layout for PMs & devs',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function FavoritesSection() {
  const { profile, updateProfile } = useProfile();
  const { favorites, isLoading, toggleFavorite, isFavorite } = useFavorites();

  // Filter templates to only show favorites
  const favoriteTemplates = templates.filter((t) => favorites.includes(t.id));

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/10">
            <Heart className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <div className="h-5 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-48 bg-muted animate-pulse rounded mt-1" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[4/3] bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (favoriteTemplates.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-dashed border-border bg-muted/30 p-8"
      >
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
          <div className="p-4 rounded-2xl bg-red-500/10 mb-4">
            <Heart className="h-8 w-8 text-red-500/70" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Saved Templates Yet
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Browse the template gallery and click the heart icon to save your favorites here for quick access.
          </p>
          <Link to="/dashboard?section=templates">
            <Button variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Browse Templates
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-red-500/10">
          <Heart className="h-5 w-5 text-red-500 fill-red-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Saved Templates</h2>
          <p className="text-sm text-muted-foreground">
            {favoriteTemplates.length} template{favoriteTemplates.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </div>

      {/* Favorites Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {favoriteTemplates.map((template) => (
            <motion.div
              key={template.id}
              variants={itemVariants}
              layout
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <TemplateCard
                id={template.id}
                name={template.name}
                description={template.description}
                isSelected={profile.selectedTemplate === template.id}
                onSelect={() => updateProfile({ selectedTemplate: template.id as any })}
                isFavorite={isFavorite(template.id)}
                onToggleFavorite={toggleFavorite}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
