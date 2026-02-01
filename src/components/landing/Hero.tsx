import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function TypewriterText({ text, className }: { text: string; className?: string }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 80);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <span className={className}>
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-1 h-[1em] bg-primary ml-1 align-middle"
      />
    </span>
  );
}

function Document3DAnimation() {
  return (
    <div className="relative w-full max-w-xs sm:max-w-lg mx-auto mt-8 sm:mt-16">
      {/* Document transforming into website */}
      <motion.div
        className="relative"
        initial={{ rotateY: 0 }}
        animate={{ rotateY: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      >
        {/* Resume/Document */}
        <motion.div
          className="absolute left-0 top-0 w-24 h-32 sm:w-40 sm:h-52 bg-card border border-border rounded-lg shadow-xl p-2 sm:p-4"
          initial={{ x: 0, opacity: 1 }}
          animate={{ x: [-10, 0, -10], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="space-y-1.5 sm:space-y-2">
            <div className="h-1.5 sm:h-2 w-10 sm:w-12 bg-muted-foreground/30 rounded" />
            <div className="h-1 sm:h-1.5 w-full bg-muted-foreground/20 rounded" />
            <div className="h-1 sm:h-1.5 w-3/4 bg-muted-foreground/20 rounded" />
            <div className="h-1 sm:h-1.5 w-5/6 bg-muted-foreground/20 rounded" />
            <div className="mt-2 sm:mt-3 h-1 sm:h-1.5 w-1/2 bg-muted-foreground/20 rounded" />
            <div className="h-1 sm:h-1.5 w-full bg-muted-foreground/20 rounded" />
            <div className="h-1 sm:h-1.5 w-2/3 bg-muted-foreground/20 rounded" />
          </div>
          <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center">
            <span className="text-[10px] sm:text-xs text-primary-foreground font-bold">📄</span>
          </div>
        </motion.div>

        {/* Arrow animation */}
        <motion.div
          className="absolute left-28 sm:left-44 top-14 sm:top-24"
          animate={{ x: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="flex items-center gap-1">
            <div className="w-8 sm:w-16 h-0.5 bg-gradient-to-r from-primary to-accent" />
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
          </div>
        </motion.div>

        {/* Website/Portfolio */}
        <motion.div
          className="absolute right-0 top-0 w-32 h-36 sm:w-52 sm:h-56 bg-gradient-to-br from-card to-muted border border-border rounded-xl shadow-2xl overflow-hidden"
          initial={{ x: 0, scale: 1 }}
          animate={{ x: [10, 0, 10], scale: [0.95, 1, 0.95] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Browser bar */}
          <div className="h-5 sm:h-6 bg-muted flex items-center px-1.5 sm:px-2 gap-1 sm:gap-1.5">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-destructive/60" />
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500/60" />
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500/60" />
            <div className="ml-1 sm:ml-2 flex-1 h-2.5 sm:h-3 bg-background/50 rounded text-[5px] sm:text-[6px] flex items-center px-1 sm:px-1.5 text-muted-foreground">
              foliogen.app/you
            </div>
          </div>
          {/* Website content */}
          <div className="p-2 sm:p-3">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary to-accent" />
              <div className="space-y-0.5 sm:space-y-1">
                <div className="h-1.5 sm:h-2 w-12 sm:w-16 bg-foreground/20 rounded" />
                <div className="h-1 sm:h-1.5 w-8 sm:w-12 bg-muted-foreground/20 rounded" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              <div className="h-8 sm:h-12 bg-primary/10 rounded-lg" />
              <div className="h-8 sm:h-12 bg-accent/20 rounded-lg" />
            </div>
            <div className="mt-1.5 sm:mt-2 space-y-0.5 sm:space-y-1">
              <div className="h-1 sm:h-1.5 w-full bg-muted-foreground/20 rounded" />
              <div className="h-1 sm:h-1.5 w-2/3 bg-muted-foreground/20 rounded" />
            </div>
          </div>
          <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-accent rounded-full flex items-center justify-center">
            <span className="text-[10px] sm:text-xs font-bold">🌐</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/2 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-accent/20 rounded-full blur-2xl -z-10" />
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-fit overflow-hidden bg-background pt-24 pb-6 md:py-32">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-[128px]"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground) / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary backdrop-blur-sm"
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.span>
            AI-Powered Portfolio Builder
          </motion.div>

          {/* Headline with typewriter */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            <TypewriterText text="Your Career. Accelerated." />
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            Transform your Resume into a World-Class Portfolio in seconds using AI.
          </motion.p>

          {/* Glowing CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button
              asChild
              size="lg"
              className="relative h-16 px-12 text-lg font-bold shadow-[0_0_40px_8px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_12px_rgba(59,130,246,0.4)] transition-all duration-300 bg-gradient-to-r from-primary to-blue-500 hover:from-primary hover:to-blue-400 border-0"
            >
              <Link to="/auth">
                <motion.span
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Build My Portfolio
                  <ArrowRight className="h-5 w-5" />
                </motion.span>
              </Link>
            </Button>
          </motion.div>

          {/* 3D Document Animation */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-4 sm:mt-8 h-48 sm:h-72"
          >
            <Document3DAnimation />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
