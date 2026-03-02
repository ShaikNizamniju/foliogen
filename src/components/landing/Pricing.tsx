import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '1 Portfolio',
      'Minimalist Template',
      'AI Portfolio Scoring',
      'FolioGen Subdomain',
      'Basic Analytics',
      'Email Support',
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '₹199',
    period: 'lifetime',
    description: 'Launch offer — one-time payment',
    features: [
      'Unlimited Portfolios',
      'All 7+ Design Systems',
      'Custom Domain',
      'AI Writing Assistant',
      'LinkedIn Import',
      'Advanced Analytics',
      'Priority Support',
      'Remove FolioGen Branding',
    ],
    cta: 'Start Pro Trial',
    popular: true,
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

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 lg:grid-cols-2">
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
                <p className="mt-1 text-muted-foreground">{plan.description}</p>
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
                    <span className="text-foreground">{feature}</span>
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
      </div>
    </section>
  );
}
