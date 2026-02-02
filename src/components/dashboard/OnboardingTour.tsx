import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TourStep {
  id: string;
  target: string | null; // null means center of screen
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    target: null,
    title: 'Welcome to FolioGen',
    description: 'Your career story, upgraded. Let\'s configure your AI-powered portfolio in 3 steps.',
    position: 'center',
  },
  {
    id: 'profile',
    target: '[data-tour="profile"]',
    title: 'The Foundation',
    description: 'Input your raw experience here. Our AI uses this data to answer recruiter questions automatically.',
    position: 'right',
  },
  {
    id: 'projects',
    target: '[data-tour="projects"]',
    title: 'The Case Study Engine',
    description: 'Don\'t just list features. Use the \'Enhance with AI\' button to transform bullet points into executive-level STAR case studies.',
    position: 'right',
  },
  {
    id: 'chat',
    target: '[data-tour="chat"]',
    title: 'Your Digital Twin',
    description: 'Test your RAG Chatbot here. This is exactly what recruiters will interact with on your public site.',
    position: 'bottom',
  },
  {
    id: 'pdf',
    target: '[data-tour="pdf"]',
    title: 'The ATS Weapon',
    description: 'Download your \'Ghost Resume\'—a hidden, ATS-optimized document that passes automated screens.',
    position: 'bottom',
  },
];

const STORAGE_KEY = 'foliogen-tour-completed';

export function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem(STORAGE_KEY);
    if (!hasSeenTour) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const updateTargetPosition = useCallback(() => {
    const step = tourSteps[currentStep];
    if (step.target) {
      const element = document.querySelector(step.target);
      if (element) {
        setTargetRect(element.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    } else {
      setTargetRect(null);
    }
  }, [currentStep]);

  useEffect(() => {
    updateTargetPosition();
    window.addEventListener('resize', updateTargetPosition);
    window.addEventListener('scroll', updateTargetPosition);
    return () => {
      window.removeEventListener('resize', updateTargetPosition);
      window.removeEventListener('scroll', updateTargetPosition);
    };
  }, [updateTargetPosition]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeTour();
    }
  };

  const completeTour = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVisible(false);
  };

  const handleSkip = () => {
    completeTour();
  };

  if (!isVisible) return null;

  const step = tourSteps[currentStep];
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Calculate tooltip position
  const getTooltipPosition = () => {
    if (!targetRect || step.position === 'center') {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const padding = 16;
    const tooltipWidth = isMobile ? 300 : 360;
    const tooltipHeight = 200;

    // On mobile, always position at bottom of screen
    if (isMobile) {
      return {
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '400px',
      };
    }

    switch (step.position) {
      case 'right':
        return {
          top: `${targetRect.top + targetRect.height / 2}px`,
          left: `${targetRect.right + padding}px`,
          transform: 'translateY(-50%)',
        };
      case 'left':
        return {
          top: `${targetRect.top + targetRect.height / 2}px`,
          right: `${window.innerWidth - targetRect.left + padding}px`,
          transform: 'translateY(-50%)',
        };
      case 'bottom':
        return {
          top: `${targetRect.bottom + padding}px`,
          left: `${targetRect.left + targetRect.width / 2}px`,
          transform: 'translateX(-50%)',
        };
      case 'top':
        return {
          bottom: `${window.innerHeight - targetRect.top + padding}px`,
          left: `${targetRect.left + targetRect.width / 2}px`,
          transform: 'translateX(-50%)',
        };
      default:
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Spotlight overlay with cutout - no blur, uses box-shadow for dimming */}
          {targetRect && step.position !== 'center' ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed z-[9998] pointer-events-none"
              style={{
                top: targetRect.top - 8,
                left: targetRect.left - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
                borderRadius: '12px',
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)',
              }}
              onClick={handleSkip}
            >
              {/* Click-through area for the rest of the screen */}
              <div 
                className="fixed inset-0 -z-10 pointer-events-auto" 
                style={{ 
                  top: -(targetRect.top - 8), 
                  left: -(targetRect.left - 8),
                  width: '100vw',
                  height: '100vh',
                }}
                onClick={handleSkip}
              />
              {/* Pulsing beacon ring around the visible element */}
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-primary pointer-events-none"
                animate={{
                  boxShadow: [
                    '0 0 0 0 hsl(var(--primary) / 0.5)',
                    '0 0 0 8px hsl(var(--primary) / 0)',
                    '0 0 0 0 hsl(var(--primary) / 0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          ) : (
            /* Center overlay for welcome step - simple dim, no blur */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9998] bg-black/75"
              onClick={handleSkip}
            />
          )}

          {/* Tooltip Card */}
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed z-[10000]"
            style={getTooltipPosition()}
          >
            <div className="relative w-[360px] max-w-[calc(100vw-32px)] rounded-2xl border border-white/20 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-accent/20 pointer-events-none" />
              
              {/* Glass shine effect */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              
              <div className="relative p-6">
                {/* Header with icon and close */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Step {currentStep + 1} of {tourSteps.length}
                      </p>
                      <h3 className="text-lg font-semibold text-foreground">
                        {step.title}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={handleSkip}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                    aria-label="Skip tour"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {step.description}
                </p>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleSkip}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Skip tour
                  </button>
                  <Button
                    onClick={handleNext}
                    size="sm"
                    className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                  >
                    {currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
