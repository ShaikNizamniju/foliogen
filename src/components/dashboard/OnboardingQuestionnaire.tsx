import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { domainOptions, getRecommendedTemplate, type ProfessionalDomain } from '@/lib/domainRecommendation';
import { useProfile } from '@/contexts/ProfileContext';
import { cn } from '@/lib/utils';

const ONBOARDING_DONE_KEY = 'foliogen_onboarding_domain';

export function OnboardingQuestionnaire() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ProfessionalDomain | null>(null);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherText, setOtherText] = useState('');
  const { updateProfile } = useProfile();

  useEffect(() => {
    const stored = localStorage.getItem(ONBOARDING_DONE_KEY);
    if (!stored) {
      const timer = setTimeout(() => setOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConfirm = () => {
    if (!selected) return;
    const recommended = getRecommendedTemplate(selected);
    localStorage.setItem(ONBOARDING_DONE_KEY, selected);
    
    if (selected === 'other' && otherText.trim()) {
      localStorage.setItem('foliogen_custom_domain', otherText.trim());
    }

    // Specialized Logic for Tech/Engineering
    if (selected === 'tech') {
      updateProfile({ 
        selectedTemplate: 'executive', // Suggesting Executive Elite (id: executive)
        activePersona: 'bigtech',
        predictedDomain: 'tech'
      });
    } else {
      updateProfile({ 
        selectedTemplate: recommended as any,
        predictedDomain: selected
      });
    }
    
    setOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem(ONBOARDING_DONE_KEY, 'skipped');
    setOpen(false);
  };

  const handleSelectOther = () => {
    setSelected('other');
    setShowOtherInput(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-background border-border gap-0">
        <DialogTitle className="sr-only">Choose your professional domain</DialogTitle>
        <DialogDescription className="sr-only">
          Select your industry to help us tailor your portfolio experience.
        </DialogDescription>

        {/* Header */}
        <div className="relative px-6 pt-8 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2.5 mb-3"
          >
            <div className="p-2 rounded-xl bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground tracking-tight">
              What&apos;s your domain?
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-muted-foreground"
          >
            We&apos;ll auto-select the best template for your field.
          </motion.p>
        </div>

        {/* Options */}
        <div className="px-6 pb-2 space-y-2">
          {domainOptions.map((opt, i) => (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              onClick={() => { setSelected(opt.id); setShowOtherInput(false); }}
              className={cn(
                'w-full flex items-center gap-4 p-3.5 rounded-xl border text-left transition-all duration-200',
                selected === opt.id && !showOtherInput
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/30 hover:bg-muted/40'
              )}
            >
              <span className="text-xl shrink-0 w-8 text-center">{opt.icon}</span>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground">{opt.label}</span>
                <span className="block text-xs text-muted-foreground mt-0.5">{opt.description}</span>
              </div>
              {selected === opt.id && !showOtherInput && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0"
                >
                  <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                </motion.div>
              )}
            </motion.button>
          ))}

          {/* Others option */}
          <motion.button
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + domainOptions.length * 0.06 }}
            onClick={handleSelectOther}
            className={cn(
              'w-full flex items-center gap-4 p-3.5 rounded-xl border text-left transition-all duration-200',
              showOtherInput
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border hover:border-primary/30 hover:bg-muted/40'
            )}
          >
            <span className="text-xl shrink-0 w-8 text-center">🌐</span>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground">Others</span>
              <span className="block text-xs text-muted-foreground mt-0.5">Tell us your profession</span>
            </div>
            {showOtherInput && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0"
              >
                <div className="h-2 w-2 rounded-full bg-primary-foreground" />
              </motion.div>
            )}
          </motion.button>

          {/* Custom text input for "Others" */}
          <AnimatePresence>
            {showOtherInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Input
                  placeholder="e.g. Healthcare, Education, Marketing..."
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  className="h-10 mt-1"
                  autoFocus
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 flex items-center justify-between border-t border-border mt-2">
          <button
            onClick={handleSkip}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
          <Button
            size="sm"
            disabled={!selected}
            onClick={handleConfirm}
            className="gap-1.5"
          >
            Apply Recommendation
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
