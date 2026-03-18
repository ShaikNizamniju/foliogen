import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Zap } from 'lucide-react';
import { useState } from 'react';

interface MobileSprintCTAProps {
  onCTAClick?: () => void;
}

export function MobileSprintCTA({ onCTAClick }: MobileSprintCTAProps) {
  const isMobile = useIsMobile();
  const [dismissed, setDismissed] = useState(false);

  if (!isMobile || dismissed) return null;

  const handleClick = () => {
    if (onCTAClick) {
      onCTAClick();
    } else {
      window.dispatchEvent(new CustomEvent('trigger-waitlist-modal'));
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 2 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
        style={{
          background: 'hsla(var(--background) / 0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid hsla(var(--border) / 0.5)',
        }}
      >
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button
            onClick={handleClick}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground font-semibold text-base py-3 min-h-[48px] shadow-lg active:scale-[0.98] transition-transform"
          >
            <Zap className="h-4 w-4" />
            Get Sprint Pass — ₹999
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 h-11 w-11 flex items-center justify-center rounded-xl border border-border text-muted-foreground text-lg"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
