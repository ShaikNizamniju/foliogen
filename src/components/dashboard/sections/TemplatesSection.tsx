import { useProfile } from '@/contexts/ProfileContext';
import { TemplateCard } from '../TemplateCard';
import { motion } from 'framer-motion';
import { useFavorites } from '@/hooks/useFavorites';
import { templates } from './FavoritesSection';

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
  const { toggleFavorite, isFavorite } = useFavorites();

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
              isFavorite={isFavorite(template.id)}
              onToggleFavorite={toggleFavorite}
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
