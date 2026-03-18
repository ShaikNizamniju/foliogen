import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target } from 'lucide-react';

const CLAIMS = [
  { slug: 'j', status: 'Recently Claimed' },
  { slug: 'aa', status: 'Reserved' },
  { slug: 'shaik', status: 'Active' },
  { slug: 'pm', status: 'Premium Reserved' },
  { slug: 'ceo', status: 'Claimed' },
  { slug: 'dev', status: 'Active' },
  { slug: 'niju', status: 'Recently Claimed' },
  { slug: 'a1', status: 'Reserved' },
  { slug: 'ux', status: 'Premium Reserved' },
  { slug: 'king', status: 'Claimed' },
];

export function IdentityTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % CLAIMS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-indigo-950/20 border-y border-white/5 py-2.5 overflow-hidden">
      <div className="container mx-auto px-4 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em]">Global Identity Feed</span>
        </div>
        
        <div className="h-4 w-px bg-white/10 shrink-0" />
        
        <div className="relative h-5 flex-1 max-w-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span className="text-xs font-mono text-white/50">foliogen.in/u/</span>
              <span className="text-xs font-mono font-bold text-white">{CLAIMS[index].slug}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-indigo-400 font-bold uppercase tracking-tighter">
                {CLAIMS[index].status}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="h-4 w-px bg-white/10 shrink-0" />
        
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <Target className="h-3 w-3 text-indigo-400/50" />
          <span className="text-[10px] text-white/30 font-medium">1,240+ Active Portfolios</span>
        </div>
      </div>
    </div>
  );
}
