import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function AuthLoadingOverlay({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: 'easeOut' } }}
        >
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <motion.div
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <Sparkles className="h-7 w-7 text-primary-foreground" />
            </motion.div>
            <motion.div
              className="h-1 w-32 rounded-full bg-muted overflow-hidden"
            >
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
              />
            </motion.div>
            <p className="text-sm text-muted-foreground font-medium">Setting up your workspace…</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
