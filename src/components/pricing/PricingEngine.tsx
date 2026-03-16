import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PricingEngineProps {
  showTitle?: boolean;
}

const PricingEngine = ({ showTitle = true }: PricingEngineProps) => {
  const [countryCode, setCountryCode] = useState<'US' | 'IN'>('IN'); // Mocked to IN for verification
  const price = countryCode === 'IN' ? '₹999' : '$29';
  const isRegionalOffer = countryCode === 'IN';

  const plans = [
    {
      name: 'Free',
      price: countryCode === 'IN' ? '₹0' : '$0',
      period: 'Forever — no card needed',
      description: 'Foundational access for students',
      features: [
        { name: '1 Contextual Persona', included: true },
        { name: 'Standard Templates', included: true },
        { name: 'Foliogen subdomain', included: true },
        { name: 'Standard AI Parsing', included: true },
        { name: 'Custom domain', included: false },
        { name: 'Persona Switcher', included: false },
        { name: 'Recruiter Pulse', included: false },
      ],
      cta: 'Start Building',
      variant: 'default',
    },
    {
      name: 'Starter',
      price: countryCode === 'IN' ? '₹199' : '$7',
      period: 'One-time payment. Lifetime.',
      description: 'Perfect for entry-level pros',
      features: [
        { name: '1 Contextual Persona', included: true },
        { name: 'All 19+ Design Systems', included: true },
        { name: 'Custom Domain Support', included: true },
        { name: 'Standard Analytics', included: true },
        { name: 'Standard AI Parsing', included: true },
        { name: 'Persona Switcher', included: false },
        { name: 'Recruiter Pulse', included: false },
      ],
      cta: 'Get Starter',
      variant: 'default',
    },
    {
      name: 'Sprint Pass',
      price: price,
      period: 'One-time payment. 90-day access.',
      description: 'The ultimate career moat',
      badge: 'Most Popular',
      regionalOffer: isRegionalOffer,
      features: [
        { name: 'Persona Switcher (Startup mode)', included: true },
        { name: 'Persona Switcher (Big Tech mode)', included: true },
        { name: 'Persona Switcher (Fintech mode)', included: true },
        { name: 'Recruiter Pulse (Real-time)', included: true },
        { name: 'LinkedIn Auto-Sync engine', included: true },
        { name: 'Recognized Company Resolution', included: true },
        { name: 'All 19+ Design Systems', included: true },
      ],
      cta: 'Get the Sprint Pass',
      variant: 'noir',
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
            The Pay-Once Model
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-['Plus_Jakarta_Sans'] font-medium text-[#181a2a] dark:text-white"
          >
            One pass. <em className="font-['Instrument_Serif'] italic font-normal text-[#3a5cf5]">Zero</em> subscriptions.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Matches the average job search lifecycle. No hidden fees or recurring bills. Pay for the duration of your hunt.
          </motion.p>
        </div>
      )}

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "relative flex flex-col p-8 rounded-3xl border border-[rgba(17,17,16,0.09)] transition-all duration-300 hover:shadow-2xl",
              plan.variant === 'noir' 
              ? "bg-[#181a2a] text-white border-transparent shadow-[0_20px_50px_rgba(58,92,245,0.1)] scale-105 z-10" 
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
              <div className="flex items-center gap-2 mb-8">
                <h3 className="text-sm font-bold uppercase tracking-widest opacity-60">{plan.name}</h3>
                {plan.regionalOffer && plan.name === 'Sprint Pass' && (
                   <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                     Regional Offer
                   </span>
                )}
              </div>
              <div className="relative h-16 flex items-baseline gap-2">
                <span className="text-5xl font-medium tracking-tighter">
                  {plan.price}
                </span>
                {plan.name === 'Sprint Pass' && (
                  <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">/ Pass</span>
                )}
              </div>
              <div className="mt-2 text-xs opacity-60 min-h-[40px]">
                {plan.period}
              </div>
            </div>

            <div className="h-px bg-current opacity-10 mb-8" />

            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature) => (
                <li key={feature.name} className="flex items-center gap-3 text-xs">
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

            <Link to="/auth" className="w-full">
              <Button
                className={cn(
                  "w-full h-14 rounded-2xl font-bold transition-all duration-300 text-lg",
                  plan.variant === 'noir'
                  ? "bg-[#3a5cf5] hover:bg-[#3a5cf5]/90 text-white shadow-lg shadow-blue-500/20"
                  : "bg-white hover:bg-zinc-50 text-[#181a2a] border border-zinc-200 shadow-sm"
                )}
              >
                {plan.cta}
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
          <CreditCard className="h-3 w-3" />
          Secured by Stripe • Instant Access • Limited Time Pricing
        </p>
      </div>
    </div>
  );
};

export default PricingEngine;
