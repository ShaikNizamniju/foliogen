import { motion } from 'framer-motion';
import { Palette, Code, Briefcase, Sparkles, Zap, GraduationCap } from 'lucide-react';

const templates = [
  {
    name: 'Arpeggio — Brutalist',
    description: 'Raw, high-impact layouts for engineers & makers',
    icon: Code,
    gradient: 'from-rose-500 to-red-700',
  },
  {
    name: 'Nakula — Glassmorphic',
    description: 'Frosted-glass elegance for creatives & designers',
    icon: Palette,
    gradient: 'from-sky-400 to-cyan-600',
  },
  {
    name: 'Niju Bold — Leadership',
    description: 'Commanding typography for speakers & thought leaders',
    icon: Briefcase,
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    name: 'Minimal SaaS',
    description: 'Clean indigo-accented layout for PMs & developers',
    icon: Zap,
    gradient: 'from-indigo-500 to-violet-600',
  },
  {
    name: 'Destello — Creative',
    description: 'Vibrant gradients for artists & storytellers',
    icon: Sparkles,
    gradient: 'from-pink-500 to-purple-600',
  },
  {
    name: 'Gaspar — Executive',
    description: 'Refined dark tones for corporate professionals',
    icon: GraduationCap,
    gradient: 'from-slate-500 to-slate-700',
  },
  {
    name: 'FRQNCY — Tech',
    description: 'Signal-inspired aesthetic for data & AI roles',
    icon: Code,
    gradient: 'from-green-500 to-emerald-600',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

export function TemplateGallery() {
  return (
    <section id="templates" className="relative py-24 sm:py-32 bg-muted/30 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            19+ Industry-Standard{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Design Systems
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From Brutalist to Glassmorphic, find the perfect style for your domain.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {templates.map((template) => (
            <motion.div
              key={template.name}
              variants={itemVariants}
              className="group relative rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1"
            >
              {/* Icon with gradient */}
              <div className={`mb-4 h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br ${template.gradient}`}>
                <template.icon className="h-6 w-6 text-white" />
              </div>
              
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {template.name}
              </h3>
              <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                {template.description}
              </p>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-muted-foreground mt-8"
        >
          More design systems added regularly — pick your domain, we pick the perfect fit.
        </motion.p>
      </div>
    </section>
  );
}
