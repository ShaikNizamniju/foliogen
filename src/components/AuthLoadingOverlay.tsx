import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const WITTY_MESSAGES = [
  "Calibrating your RICE score... don't panic.",
  "Applying 50 layers of Noir glass. Perfection takes time.",
  "Verifying your genius. This might take a second.",
  "Consulting the RICE gods. Almost there.",
  "Engineering your identity. No entry for generic resumes.",
  "Polishing the Noir Bridge. Hang tight."
];

export function AuthLoadingOverlay({ show }: { show: boolean }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!show) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % WITTY_MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [show]);
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
              className="h-1 w-32 rounded-full bg-muted overflow-hidden relative"
              style={{ boxShadow: 'inset 0 0 4px rgba(0,0,0,0.5)' }}
            >
              <motion.div
                className="absolute top-0 bottom-0 left-0 w-full rounded-full bg-blue-500"
                style={{ boxShadow: '0 0 10px rgba(59,130,246,0.8)' }}
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              />
            </motion.div>
            
            {/* Witty Loader Container (fixed height to prevent layout shift) */}
            <div className="relative h-6 w-full max-w-sm overflow-hidden flex justify-center items-center mt-2">
               <AnimatePresence mode="wait">
                 <motion.p
                   key={messageIndex}
                   initial={{ opacity: 0, y: 5 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -5 }}
                   transition={{ duration: 0.3, ease: 'easeInOut' }}
                   className="absolute text-sm text-neutral-400 font-medium font-mono text-center w-full"
                 >
                   {WITTY_MESSAGES[messageIndex]}
                 </motion.p>
               </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
