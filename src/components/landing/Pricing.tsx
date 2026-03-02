import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'The hook — see your Portfolio Strength Score',
    features: [
      '1 Standard Template',
      'Basic Resume Parsing',
      'Foliogen Subdomain',
      'Community Support',
    ],
    cta: 'Start for Free',
    popular: false,
  },
  {
    name: 'Basic',
    price: '₹199',
    period: 'mo',
    description: 'Unlock professional templates & better AI tips',
    features: [
      '4 Portfolio Templates',
      'AI Portfolio Scoring',
      'Foliogen Subdomain',
      'Standard AI Suggestions',
      'Basic Analytics',
      'Email Support',
    ],
    cta: 'Start Basic',
    popular: false,
  },
  {
    name: 'Pro',
    price: '₹999',
    period: 'year',
    description: 'Best value — everything unlimited',
    features: [
      'All 19+ Design Systems',
      'Unlimited Portfolios',
      'Custom Domain',
      'Priority AI Processing',
      'AI Writing Assistant',
      'LinkedIn Import',
      'SpyGlass Analytics',
      'AI Interview Coach',
      'Chameleon Mode',
      'Remove Foliogen Branding',
    ],
    cta: 'Go Pro',
    popular: true,
  },
];

const comparisonRows = [
  {
    feature: 'Design Systems',
    free: '1 Template',
    basic: '4 Templates',
    pro: '19+ Templates',
  },
  {
    feature: 'AI Strategy',
    free: 'Basic',
    basic: 'Standard',
    pro: 'Priority + SpyGlass',
  },
  {
    feature: 'Branding',
    free: 'Foliogen Branding',
    basic: 'Foliogen Branding',
    pro: 'Custom Domain / No Branding',
  },
  {
    feature: 'Portfolio Strength',
    free: 'Score Only',
    basic: 'Score + Tips',
    pro: 'Full Optimization Engine',
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-muted/30 py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Start for free, upgrade when you're ready.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border bg-card p-8 transition-all ${
                plan.popular
                  ? 'border-primary shadow-glow'
                  : 'border-border hover:border-primary/20 hover:shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`w-full ${
                  plan.popular
                    ? 'shadow-glow transition-all hover:shadow-glow-lg'
                    : ''
                }`}
                variant={plan.popular ? 'default' : 'outline'}
                size="lg"
              >
                <Link to="/auth">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <motion.div
          className="mx-auto mt-16 max-w-5xl overflow-x-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
        >
          <motion.h3
            className="mb-6 text-center text-xl font-semibold text-foreground"
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
          >
            Compare Plans
          </motion.h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="py-4 px-4 text-left font-medium text-muted-foreground">Feature</th>
                <th className="py-4 px-4 text-center font-medium text-muted-foreground">Free</th>
                <th className="py-4 px-4 text-center font-medium text-muted-foreground">Basic</th>
                <th className="py-4 px-4 text-center font-medium text-primary">Pro</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <motion.tr
                  key={row.feature}
                  className={`border-b border-border/30 ${i % 2 === 0 ? 'bg-muted/5' : ''}`}
                  variants={{
                    hidden: { opacity: 0, x: -16, filter: 'blur(4px)' },
                    visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 120, damping: 20 } },
                  }}
                >
                  <td className="py-4 px-4 font-medium text-foreground">{row.feature}</td>
                  <td className="py-4 px-4 text-center text-muted-foreground">{row.free}</td>
                  <td className="py-4 px-4 text-center text-foreground">{row.basic}</td>
                  <td className="py-4 px-4 text-center font-medium text-primary">{row.pro}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
