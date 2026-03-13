import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PricingEngineProps {
  showTitle?: boolean;
}

const PricingEngine = ({ showTitle = true }: PricingEngineProps) => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Free',
      monthlyPrice: 0,
      annualPrice: 0,
      period: 'Forever — no card needed',
      features: [
        { name: '1 portfolio', included: true },
        { name: '3 basic templates', included: true },
        { name: 'Foliogen subdomain', included: true },
        { name: 'Custom domain', included: false },
        { name: 'Analytics dashboard', included: false },
        { name: 'AI content generation', included: false },
      ],
      cta: 'Get started free',
      variant: 'default',
    },
    {
      name: 'Basic',
      monthlyPrice: 199,
      annualPrice: 139,
      period: 'per month',
      savings: '₹720/year',
      features: [
        { name: '3 portfolios', included: true },
        { name: 'All 19+ templates', included: true },
        { name: 'Custom domain', included: true },
        { name: 'Analytics dashboard', included: true },
        { name: 'AI content generation', included: true },
        { name: 'White-label & API', included: false },
      ],
      cta: 'Start building →',
      variant: 'popular',
      badge: 'Most Popular',
    },
    {
      name: 'Pro',
      monthlyPrice: 999,
      annualPrice: 699,
      period: 'per year',
      savings: '₹3,600/year',
      features: [
        { name: 'Unlimited portfolios', included: true },
        { name: 'Priority AI generation', included: true },
        { name: 'White-label & custom CSS', included: true },
        { name: 'Advanced analytics + heatmaps', included: true },
        { name: 'Team collaboration', included: true },
        { name: 'API access', included: true },
      ],
      cta: 'Go Pro →',
      variant: 'noir',
      badge: 'Best Value',
    },
  ];

  return (
    <div className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-[#edeae3]/50 dark:bg-transparent transition-colors duration-300">
      {showTitle && (
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[12px] uppercase tracking-[0.2em] font-bold text-[#3a5cf5]"
          >
            Pricing
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-['Plus_Jakarta_Sans'] font-medium text-[#181a2a] dark:text-white"
          >
            Simple, <em className="font-['Instrument_Serif'] italic font-normal text-[#3a5cf5]">transparent</em> pricing.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground"
          >
            Start free. No credit card required. Upgrade when you're ready.
          </motion.p>
        </div>
      )}

      {/* Billing Toggle */}
      <div className="flex flex-col items-center justify-center mb-12 space-y-4">
        <div className="flex items-center gap-4">
          <span className={cn("text-sm font-medium transition-colors", !isAnnual ? "text-[#181a2a] dark:text-white" : "text-muted-foreground")}>Monthly</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-12 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#3a5cf5]/20"
          >
            <motion.div
              animate={{ x: isAnnual ? 24 : 0 }}
              className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
          <span className={cn("text-sm font-medium transition-colors", isAnnual ? "text-[#181a2a] dark:text-white" : "text-muted-foreground")}>Annual</span>
          <div className="bg-[#19a451]/10 text-[#19a451] text-[10px] font-bold px-2 py-1 rounded-full border border-[#19a451]/20 animate-pulse">
            SAVE 30%
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "relative flex flex-col p-8 rounded-[14px] border border-[rgba(17,17,16,0.09)] transition-all duration-300 hover:shadow-xl",
              plan.variant === 'noir' 
              ? "bg-[#181a2a] text-white border-transparent" 
              : "bg-white text-[#181a2a]"
            )}
          >
            {plan.badge && (
              <div className={cn(
                "absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase",
                plan.variant === 'noir' ? "bg-[#3a5cf5] text-white" : "bg-zinc-100 text-[#181a2a] border border-zinc-200"
              )}>
                {plan.badge}
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-8">{plan.name}</h3>
              <div className="relative h-16 flex items-baseline gap-2">
                <span className="text-2xl font-medium">₹</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isAnnual ? 'annual' : 'monthly'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-6xl font-medium tracking-tighter"
                  >
                    {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </motion.span>
                </AnimatePresence>
                {isAnnual && plan.monthlyPrice > 0 && (
                  <span className="text-lg line-through opacity-40 absolute -top-4 left-6">
                    ₹{plan.monthlyPrice}
                  </span>
                )}
              </div>
              <div className="mt-2 text-sm opacity-60 min-h-[40px]">
                {isAnnual && plan.annualPrice > 0 ? (
                  <div className="flex flex-col gap-1">
                    <span>Billed as ₹{plan.annualPrice * 12} per year</span>
                    <span className="text-[#19a451] font-bold">You save {plan.savings}</span>
                  </div>
                ) : (
                  <span>{plan.period}</span>
                )}
              </div>
            </div>

            <div className="h-px bg-current opacity-10 mb-8" />

            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature) => (
                <li key={feature.name} className="flex items-center gap-3 text-sm">
                  {feature.included ? (
                    <Check className="h-4 w-4 text-[#19a451] shrink-0" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground/30 shrink-0" />
                  )}
                  <span className={cn(!feature.included && "text-muted-foreground/40")}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              className={cn(
                "w-full h-12 rounded-xl font-bold transition-all duration-300",
                plan.variant === 'noir'
                ? "bg-[#3a5cf5] hover:bg-[#3a5cf5]/90 text-white"
                : "bg-white hover:bg-zinc-50 text-[#181a2a] border border-zinc-200 shadow-sm"
              )}
            >
              {plan.cta}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <div className="mt-24 max-w-5xl mx-auto overflow-hidden rounded-2xl border border-[rgba(17,17,16,0.09)] bg-white dark:bg-zinc-900 shadow-sm hidden md:block">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-950">
              <th className="p-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">Feature</th>
              <th className="p-6 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">Free</th>
              <th className="p-6 text-center text-xs font-bold uppercase tracking-widest text-[#3a5cf5]">Basic</th>
              <th className="p-6 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">Pro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {[
              { name: 'Portfolio slots', desc: 'Published live portfolios', free: '1', basic: '3', pro: 'Unlimited' },
              { name: 'Design templates', desc: 'Industry-standard layouts', free: '3 basic', basic: 'All 19+', pro: 'All 19+' },
              { name: 'Custom domain', free: false, basic: true, pro: true },
              { name: 'AI content generation', desc: 'Rewrites resume in recruiter language', free: false, basic: true, pro: true },
              { name: 'Analytics', free: false, basic: 'Standard', pro: 'Advanced + heatmaps' },
              { name: 'White-label & API', free: false, basic: false, pro: true },
              { name: 'Team collaboration', free: false, basic: false, pro: true },
              { name: 'Priority support', free: false, basic: false, pro: true },
            ].map((row, idx) => (
              <tr key={row.name} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="p-6">
                  <div className="font-medium text-sm text-[#181a2a] dark:text-white">{row.name}</div>
                  {row.desc && <div className="text-[11px] text-muted-foreground mt-1">{row.desc}</div>}
                </td>
                <td className="p-6 text-center align-middle">
                  {typeof row.free === 'boolean' 
                    ? (row.free ? <Check className="h-4 w-4 text-[#19a451] mx-auto" /> : <X className="h-4 w-4 text-muted-foreground/20 mx-auto" />)
                    : <span className="text-sm opacity-60">{row.free}</span>
                  }
                </td>
                <td className="p-6 text-center align-middle bg-[#3a5cf5]/5">
                  {typeof row.basic === 'boolean'
                    ? (row.basic ? <Check className="h-4 w-4 text-[#19a451] mx-auto" /> : <X className="h-4 w-4 text-muted-foreground/20 mx-auto" />)
                    : <span className="text-sm font-bold text-[#3a5cf5]">{row.basic}</span>
                  }
                </td>
                <td className="p-6 text-center align-middle">
                  {typeof row.pro === 'boolean'
                    ? (row.pro ? <Check className="h-4 w-4 text-[#19a451] mx-auto" /> : <X className="h-4 w-4 text-muted-foreground/20 mx-auto" />)
                    : <span className="text-sm opacity-60">{row.pro}</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PricingEngine;
