import { motion, useInView } from 'framer-motion';
import { Database, Sparkles, Rocket } from 'lucide-react';
import { useRef } from 'react';

const steps = [
  {
    icon: Database,
    title: 'Ingest',
    description: 'Import from LinkedIn or Resume.',
    gradient: 'from-primary to-blue-400',
  },
  {
    icon: Sparkles,
    title: 'Synthesize',
    description: 'AI structures your data into a 3D narrative.',
    gradient: 'from-accent to-teal-400',
  },
  {
    icon: Rocket,
    title: 'Deploy',
    description: 'Launch a live portfolio and export an ATS-PDF.',
    gradient: 'from-emerald-500 to-green-400',
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="container relative mx-auto px-4" ref={containerRef}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            From Resume to Portfolio{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              in 3 Steps
            </span>
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Our AI-powered pipeline transforms your career data into a compelling story.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-accent/20 to-emerald-500/20 -translate-y-1/2" />
          
          {/* Animated progress line */}
          <motion.div
            className="hidden md:block absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-primary via-accent to-emerald-500 -translate-y-1/2"
            initial={{ width: 0 }}
            animate={isInView ? { width: '100%' } : { width: 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
          />

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Icon circle */}
                <motion.div
                  className={`relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} p-0.5 mb-6`}
                  initial={{ scale: 0.8 }}
                  animate={isInView ? { scale: 1 } : { scale: 0.8 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.2, type: 'spring' }}
                >
                  <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-foreground" />
                  </div>
                  
                  {/* Pulsing ring */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    animate={{
                      boxShadow: [
                        '0 0 0 0 rgba(59, 130, 246, 0.4)',
                        '0 0 0 8px rgba(59, 130, 246, 0)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  />
                </motion.div>

                {/* Step number badge */}
                <div className="absolute top-0 right-1/2 translate-x-12 -translate-y-1 w-6 h-6 rounded-full bg-muted border-2 border-primary flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{index + 1}</span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm max-w-[200px]">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
