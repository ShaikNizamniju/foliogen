import { motion } from 'framer-motion';

const companies = [
  { name: 'Google', logo: '🔵' },
  { name: 'Meta', logo: '🔷' },
  { name: 'Amazon', logo: '📦' },
  { name: 'Apple', logo: '🍎' },
  { name: 'Microsoft', logo: '🪟' },
  { name: 'Netflix', logo: '🎬' },
  { name: 'Spotify', logo: '🎵' },
  { name: 'Stripe', logo: '💳' },
  { name: 'Airbnb', logo: '🏠' },
  { name: 'Uber', logo: '🚗' },
];

function MarqueeRow({ direction = 'left' }: { direction?: 'left' | 'right' }) {
  const duplicatedCompanies = [...companies, ...companies];
  
  return (
    <div className="flex overflow-hidden">
      <motion.div
        className="flex gap-8 py-4"
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 30,
            ease: 'linear',
          },
        }}
      >
        {duplicatedCompanies.map((company, index) => (
          <div
            key={`${company.name}-${index}`}
            className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 whitespace-nowrap"
          >
            <span className="text-2xl">{company.logo}</span>
            <span className="text-lg font-medium text-slate-300">{company.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function CompanyMarquee() {
  return (
    <section className="relative py-20 bg-slate-950 overflow-hidden">
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10" />
      
      <div className="container mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
            Trusted by professionals at
          </p>
          <h3 className="text-2xl font-bold text-white sm:text-3xl">
            World-Class Companies
          </h3>
        </motion.div>
      </div>

      <div className="space-y-4">
        <MarqueeRow direction="left" />
        <MarqueeRow direction="right" />
      </div>
    </section>
  );
}
