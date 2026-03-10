import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Foliogen turned my outdated resume into a stunning portfolio in under 5 minutes. The AI scoring helped me land 3 interviews in my first week.",
    name: "Taylor Morgan",
    role: "Software Engineer",
    company: "Series-B Startup",
  },
  {
    quote: "As a creative, I need my portfolio to feel like me. The Destello template with custom fonts gave me exactly that — polished but personal.",
    name: "Jordan Ellis",
    role: "Art Director",
    company: "Independent Studio",
  },
  {
    quote: "I went from zero online presence to a fully optimized portfolio with a 92 strength score. Recruiters started reaching out the same day.",
    name: "Casey Lin",
    role: "Product Lead",
    company: "Fortune 500",
  },
  {
    quote: "The visual narratives I can build here are lightyears ahead of basic templates. It feels like editing a high-end magazine feature.",
    name: "Alex Vance",
    role: "UX Designer",
    company: "Global Agency",
  },
  {
    quote: "Finally, a tool that understands modern personal branding. The automated proof-of-work section is an absolute gamechanger.",
    name: "Samira Tariq",
    role: "Marketing Director",
    company: "Tech Unicorn",
  }
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function Testimonials() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-sm font-medium text-primary tracking-wider uppercase mb-3">
            Trusted by Professionals
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            What Professionals Say
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="columns-1 md:columns-2 lg:columns-3 gap-6 max-w-6xl mx-auto"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="break-inside-avoid mb-6 group relative rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-8 hover:border-primary/30 transition-colors duration-300"
            >
              {/* Glassmorphic highlight */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10">
                <Quote className="h-5 w-5 text-primary/40 mb-4" />
                <p
                  className="text-xl md:text-2xl leading-relaxed text-foreground/90 mb-6"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  "{t.quote}"
                </p>
                <div className="border-t border-border/40 pt-4">
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
