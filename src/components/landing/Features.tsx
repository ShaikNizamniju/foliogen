import { Bot, Palette, FileDown, MessageSquare, Video, Zap, Lock } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.9, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring' as const,
      stiffness: 90,
      damping: 18,
      mass: 0.8
    }
  }
};

// Mock chat messages for RAG Chat card
function MockChatWindow() {
  return (
    <div className="mt-4 rounded-xl bg-muted/80 border border-border p-3 space-y-3">
      {/* Recruiter message */}
      <div className="flex gap-2 items-start">
        <div className="w-6 h-6 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white">
          R
        </div>
        <div className="bg-secondary rounded-lg px-3 py-2 text-xs text-secondary-foreground max-w-[180px]">
          "What's your experience with React?"
        </div>
      </div>
      {/* AI response */}
      <div className="flex gap-2 items-start justify-end">
        <div className="bg-primary/20 border border-primary/30 rounded-lg px-3 py-2 text-xs text-foreground max-w-[180px]">
          "Built 12+ production apps with React, including..."
        </div>
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0 flex items-center justify-center">
          <Bot className="w-3 h-3 text-white" />
        </div>
      </div>
    </div>);

}

// Ghost Resume visual
function GhostResumeVisual() {
  return (
    <div className="mt-4 flex items-center justify-center gap-4">
      {/* Document */}
      <div className="relative w-12 h-16 bg-card rounded shadow-lg border border-border">
        <div className="absolute inset-2 space-y-1">
          <div className="h-1 w-6 bg-muted-foreground/30 rounded" />
          <div className="h-0.5 w-full bg-muted-foreground/20 rounded" />
          <div className="h-0.5 w-4/5 bg-muted-foreground/20 rounded" />
          <div className="h-0.5 w-full bg-muted-foreground/20 rounded" />
        </div>
      </div>
      {/* Arrow */}
      <motion.div
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-primary">

        →
      </motion.div>
      {/* 3D Web Icon */}
      <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border flex items-center justify-center">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <span className="text-white text-lg">🌐</span>
        </div>
      </div>
    </div>);

}

// Multimedia logos
function MultimediaLogos() {
  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      {['🎬', '📺', '🎨'].map((emoji, i) =>
      <motion.div
        key={i}
        initial={{ scale: 0.8, opacity: 0.5 }}
        whileHover={{ scale: 1.1 }}
        className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl">

          {emoji}
        </motion.div>
      )}
    </div>);

}

export function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" className="relative pt-10 pb-24 sm:py-32 bg-background overflow-hidden">
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }} />


      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <div className="container relative mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-16">

          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            Everything you need to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              stand out
            </span>
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Build a portfolio that showcases your best work and lands you opportunities.
          </p>
        </motion.div>

        {/* Premium Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Card 1: Context-Aware RAG Chat (Large - spans 2 cols) */}
          <motion.div
            variants={itemVariants}
            className="group relative md:col-span-2 rounded-2xl border border-border bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm p-6 sm:p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">

            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl">💬</span>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-muted/80">
                  <MessageSquare className="h-5 w-5" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Context-Aware RAG Chat</h3>
              <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                Recruiters can ask questions about your experience. Our AI answers accurately using your portfolio data.
              </p>
              <MockChatWindow />
            </div>
          </motion.div>

          {/* Card 2: Ghost Resume (Small - top right) */}
          <motion.div
            variants={itemVariants}
            className="group relative rounded-2xl border border-border bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 backdrop-blur-sm p-6 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10">

            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl">👻</span>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-muted/80">
                  <FileDown className="h-5 w-5" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Ghost Resume</h3>
              <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors text-sm">
                Hidden ATS-optimized PDF that passes automated screens.
              </p>
              <GhostResumeVisual />
            </div>
          </motion.div>

          {/* Card 3: 11 Premium Templates */}
          <motion.div
            variants={itemVariants}
            className="group relative rounded-2xl border border-border bg-gradient-to-br from-accent/20 to-accent/5 backdrop-blur-sm p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/10">

            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl">🎨</span>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-muted/80">
                  <Palette className="h-5 w-5" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">19+ Design Systems</h3>
              <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors text-sm">
                From minimalist to creative, stunning designs for every industry.
              </p>
            </div>
          </motion.div>

          {/* Card 4: Multimedia Embeds */}
          <motion.div
            variants={itemVariants}
            className="group relative rounded-2xl border border-border bg-gradient-to-br from-violet-500/20 to-violet-500/5 backdrop-blur-sm p-6 transition-all duration-300 hover:border-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/10">

            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl">🎥</span>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-muted/80">
                  <Video className="h-5 w-5" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Multimedia Embeds</h3>
              <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors text-sm">
                Embed Loom, YouTube, and Figma demos directly in your portfolio.
              </p>
              <MultimediaLogos />
            </div>
          </motion.div>

          {/* Card 5: Instant Publishing */}
          <motion.div
            variants={itemVariants}
            className="group relative rounded-2xl border border-border bg-gradient-to-br from-amber-500/20 to-amber-500/5 backdrop-blur-sm p-6 transition-all duration-300 hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/10">

            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl">⚡</span>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-muted/80">
                  <Zap className="h-5 w-5" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Instant Publishing</h3>
              <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors text-sm">
                Go live in seconds with your custom subdomain.
              </p>
            </div>
          </motion.div>

          {/* Card 6: Privacy First */}
          <motion.div
            variants={itemVariants}
            className="group relative rounded-2xl border border-border bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 backdrop-blur-sm p-6 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl">🔒</span>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-muted/80">
                  <Lock className="h-5 w-5 transition-all group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_6px_hsl(187,80%,55%)]" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Your Data, Your Control</h3>
              <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors text-sm">
                We use Security Invoker logic and stripped public views to ensure your private data (email, subscription status) never leaks to the public.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>);

}