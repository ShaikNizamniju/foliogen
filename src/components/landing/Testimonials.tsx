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
  }
];

const firstRow = testimonials.slice(0, 4);
const secondRow = testimonials.slice(4);

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
        className="flex gap-6 whitespace-nowrap"
        whileHover={{ animationPlayState: 'paused' }}
      >
        {displayItems.map((t, i) => (
          <div
            key={i}
            className="min-w-[350px] max-w-[450px] group relative rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-8 hover:border-primary/30 transition-colors duration-300 whitespace-normal"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10 flex flex-col h-full">
              <Quote className="h-5 w-5 text-primary/40 mb-4 flex-shrink-0" />
              <p
                className="text-lg md:text-xl leading-snug text-foreground/90 mb-6 flex-grow"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                "{t.quote}"
              </p>
              <div className="border-t border-border/40 pt-4 mt-auto">
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t.role}, {t.company}
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
        <div className="relative space-y-4 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          {/* Desktop: Two rows in opposite directions */}
          <div className="hidden md:block space-y-8">
            <MarqueeRow items={firstRow} direction="left" speed={30} />
            <MarqueeRow items={secondRow} direction="right" speed={35} />
          </div>

          {/* Mobile: Single smooth scrolling row */}
          <div className="md:hidden">
            <MarqueeRow items={testimonials} direction="left" speed={25} />
          </div>
        </div>
      </div>
    </section>
  );
}

