import { useProfile } from '@/contexts/ProfileContext';
import { TemplateCard } from '../TemplateCard';
import { motion } from 'framer-motion';

const templates = [
  {
    id: 'minimalist',
    name: 'The Minimalist',
    description: 'Clean Swiss design with elegant spacing',
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

export function TemplatesSection() {
  const { profile, updateProfile } = useProfile();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Choose Your Template</h1>
        <p className="text-muted-foreground mt-1">
          Select a design that best represents your professional style.
        </p>
      </div>

      {/* Template Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
      >
        {templates.map((template) => (
          <motion.div key={template.id} variants={itemVariants}>
            <TemplateCard
              id={template.id}
              name={template.name}
              description={template.description}
              isSelected={profile.selectedTemplate === template.id}
              onSelect={() => updateProfile({ selectedTemplate: template.id as any })}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Footer hint */}
      <p className="text-center text-sm text-muted-foreground pt-4">
        Your choice is saved automatically. Preview updates in real-time.
      </p>
    </div>
  );
}
