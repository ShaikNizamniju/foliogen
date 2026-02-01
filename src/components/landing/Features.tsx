import { Bot, Palette, FileDown, Zap, Shield, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Bot,
    emoji: "🤖",
    title: 'AI-Powered Writing',
    description: 'Our AI transforms your experience into compelling, professional copy that impresses recruiters.',
    className: 'md:col-span-2 md:row-span-1',
    gradient: 'from-primary/20 to-primary/5',
  },
  {
    icon: Palette,
    emoji: "🎨",
    title: '11 Premium Templates',
    description: 'From minimalist to creative, choose stunning designs crafted for every industry.',
    className: 'md:col-span-1 md:row-span-2',
    gradient: 'from-accent/20 to-accent/5',
  },
  {
    icon: FileDown,
    emoji: "📄",
    title: 'One-Click PDF Export',
    description: 'Download your portfolio as a beautifully formatted PDF resume instantly.',
    className: 'md:col-span-1 md:row-span-1',
    gradient: 'from-emerald-500/20 to-emerald-500/5',
  },
  {
    icon: Zap,
    emoji: "⚡",
    title: 'Instant Publishing',
    description: 'Go live in seconds with your custom subdomain.',
    className: 'md:col-span-1 md:row-span-1',
    gradient: 'from-amber-500/20 to-amber-500/5',
  },
  {
    icon: Shield,
    emoji: "🔒",
    title: 'Privacy First',
    description: 'Your data stays secure. Control what you share.',
    className: 'md:col-span-1 md:row-span-1',
    gradient: 'from-rose-500/20 to-rose-500/5',
  },
  {
    icon: Globe,
    emoji: "🌍",
    title: 'Custom Domains',
    description: 'Connect your own domain for a professional presence.',
    className: 'md:col-span-1 md:row-span-1',
    gradient: 'from-violet-500/20 to-violet-500/5',
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
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

export function Features() {
  return (
    <section id="features" className="relative pt-10 pb-24 sm:py-32 bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Everything you need to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              stand out
            </span>
          </h2>
          <p className="text-lg text-slate-400">
            Build a portfolio that showcases your best work and lands you opportunities.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className={`group relative rounded-2xl border border-white/10 bg-gradient-to-br ${feature.gradient} backdrop-blur-sm p-6 sm:p-8 transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-primary/10 ${feature.className}`}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-3xl">{feature.emoji}</span>
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/10 text-white transition-colors group-hover:bg-white/20">
                    <feature.icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
