import { useProfile } from '@/contexts/ProfileContext';
import { TemplateCard } from '../TemplateCard';
import { motion } from 'framer-motion';
import { useFavorites } from '@/hooks/useFavorites';
import { templates } from './FavoritesSection';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

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

// Free template ID - 'creative' is available to all users
const FREE_TEMPLATE_ID = 'creative';

export function TemplatesSection() {
  const { profile, updateProfile } = useProfile();
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleTemplateSelect = (templateId: string) => {
    updateProfile({ selectedTemplate: templateId as any });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Choose Your Template</h1>
        <p className="text-muted-foreground mt-1">
          Select a design that best represents your professional style.
        </p>
        {profile.predictedDomain && (
          <div className="mt-3 p-3 rounded-xl bg-primary/5 border border-primary/20 text-sm text-foreground">
            <span className="font-medium">🎯 Optimized for {profile.predictedDomain}.</span>{' '}
            <span className="text-muted-foreground">Changing templates may reduce your portfolio's effectiveness for this domain.</span>
          </div>
        )}
      </div>

      {/* Template Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {templates.map((template) => {
          const isSelected = profile.selectedTemplate === template.id;

          return (
            <motion.div
              key={template.id}
              variants={itemVariants}
              className="relative"
            >
              <div className="transition-all duration-200">
                <TemplateCard
                  id={template.id}
                  name={template.name}
                  description={template.description}
                  isSelected={isSelected}
                  onSelect={() => handleTemplateSelect(template.id)}
                  isFavorite={isFavorite(template.id)}
                  onToggleFavorite={toggleFavorite}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Footer hint */}
      <p className="text-center text-sm text-muted-foreground pt-4">
        Your choice is saved automatically. Preview updates in real-time.
      </p>
    </div>
  );
}
