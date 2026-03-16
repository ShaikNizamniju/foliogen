import { useProfile } from '@/contexts/ProfileContext';
import { TemplateCard } from '../TemplateCard';
import { motion } from 'framer-motion';
import { useFavorites } from '@/hooks/useFavorites';
import { usePro } from '@/contexts/ProContext';
import { templates } from './FavoritesSection';
import { Lock, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { handlePayment } from '@/lib/payment';
import { useAuth } from '@/contexts/AuthContext';
import { ProUpsellBanner } from './ProUpsellBanner';

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
  const { isPro, isBasicOrAbove, refreshProStatus } = usePro();
  const { user } = useAuth();

  const handleTemplateSelect = (templateId: string) => {
    const isLocked = !isBasicOrAbove && templateId !== FREE_TEMPLATE_ID;

    if (isLocked) {
      // Trigger waitlist modal for locked templates
      window.dispatchEvent(new Event('trigger-waitlist-modal'));
      return;
    }

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
        {!isBasicOrAbove && <ProUpsellBanner />}
      </div>

      {/* Template Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {templates.map((template) => {
          const isLocked = !isBasicOrAbove && template.id !== FREE_TEMPLATE_ID;
          const isSelected = profile.selectedTemplate === template.id;

          return (
            <motion.div
              key={template.id}
              variants={itemVariants}
              className="relative"
            >
              {/* Locked overlay */}
              {isLocked && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl pointer-events-none">
                  <Lock className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-xs font-medium text-muted-foreground">Pro Only</span>
                </div>
              )}

              <div className={cn(
                "transition-all duration-200",
                isLocked && "grayscale opacity-60"
              )}>
                <TemplateCard
                  id={template.id}
                  name={template.name}
                  description={isLocked ? 'Upgrade to unlock' : template.description}
                  isSelected={isSelected && !isLocked}
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
