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
  },
  {
    quote: "The Recruiter Pulse tracking gave me insights I never had before. Knowing which companies were viewing my work changed my outreach strategy.",
    name: "Marcus Chen",
    role: "Senior PM",
    company: "Stripe",
  },
  {
    quote: "Chameleon mode is like magic. One link that adapts to different job applications? It saved me dozens of hours of manual tailoring.",
    name: "Sarah Jenkins",
    role: "Fullstack Dev",
    company: "Growth Series-A",
  },
  {
    quote: "The identity vault is where I store all my metrics. It's my single source of truth for every interview and promotion cycle.",
    name: "Liam O'Connor",
    role: "Data Scientist",
    company: "Meta",
  },
  {
    quote: "Foliogen successfully translated my decade of consulting experience into a sleek, 1-page digital narrative. The ATS workflow alone is worth the Sprint Pass.",
    name: "Sarah Jenkins",
    role: "Strategy Consultant",
    company: "Deloitte",
  },
  {
    quote: "The Cobalt theme perfectly encapsulates the engineering aesthetic I wanted. It's not just a portfolio, it's a command center.",
    name: "David Chen",
    role: "Senior Full-Stack Developer",
    company: "Atlassian",
  }
];

const firstRow = testimonials.slice(0, 5);
const secondRow = testimonials.slice(5, 10);

interface MarqueeRowProps {
  items: typeof testimonials;
  direction: 'left' | 'right';
  speed?: number;
}

function MarqueeRow({ items, direction, speed = 40 }: MarqueeRowProps) {
  // Triple the items to ensure seamless loop
  const displayItems = [...items, ...items, ...items];
  
  return (
    <div className="flex overflow-hidden py-4 select-none">
      <motion.div
        animate={{
          x: direction === 'left' ? [0, '-33.33%'] : ['-33.33%', 0],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex gap-6 flex-nowrap"
      >
        {displayItems.map((t, i) => (
          <div
            key={i}
            className="w-[400px] flex-shrink-0 group relative rounded-2xl border border-primary/20 bg-black p-8 hover:border-primary/50 transition-all duration-300"
          >
            <div className="flex gap-1 text-primary mb-4">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <p className="font-['Instrument_Serif',serif] text-xl md:text-2xl text-slate-200 leading-relaxed italic mb-8">
              "{t.quote}"
            </p>
            <div className="flex items-center gap-4 mt-auto border-t border-white/10 pt-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br from-primary to-indigo-800 shadow-inner">
                {t.name[0]}
              </div>
              <div>
                <p className="font-sans font-medium text-white">{t.name}</p>
                <p className="font-sans text-xs text-slate-400">
                  {t.role} · {t.company}
                </p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.01] to-transparent pointer-events-none" />
      
      <div className="mx-auto px-4 relative z-10">
        <div className="text-center mb-16 px-4">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-medium text-primary tracking-wider uppercase mb-3"
          >
            Trusted by Professionals
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-foreground tracking-tight"
          >
            Verified Career Results
          </motion.h2>
        </div>

        {/* Marquee Container with Edge Fade Mask */}
        <div className="relative space-y-4 [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
          {/* Desktop: Two rows in opposite directions */}
          <div className="hidden md:block space-y-8">
            <MarqueeRow items={firstRow} direction="left" speed={25} />
            <MarqueeRow items={secondRow} direction="right" speed={30} />
          </div>

          {/* Mobile: Single smooth scrolling row */}
          <div className="md:hidden">
            <MarqueeRow items={testimonials} direction="left" speed={20} />
          </div>
        </div>
      </div>
    </section>
  );
}

