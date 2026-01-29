import { Linkedin, Wand2, Layout, Zap, Shield, Globe } from 'lucide-react';

const features = [
  {
    icon: Linkedin,
    title: 'LinkedIn Import',
    description: 'Import your profile data directly from LinkedIn. No manual entry required.',
  },
  {
    icon: Wand2,
    title: 'AI Writing Assistant',
    description: 'Our AI rewrites your experience into compelling, professional copy.',
  },
  {
    icon: Layout,
    title: '3 Pro Templates',
    description: 'Choose from minimalist, creative, or corporate designs. All fully responsive.',
  },
  {
    icon: Zap,
    title: 'Instant Publishing',
    description: 'Go live in seconds with your custom subdomain. No hosting required.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data stays secure. Control what you share and with whom.',
  },
  {
    icon: Globe,
    title: 'Custom Domains',
    description: 'Connect your own domain for a truly professional presence.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to stand out
          </h2>
          <p className="text-lg text-muted-foreground">
            Build a portfolio that showcases your best work and lands you opportunities.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/20 hover:shadow-lg animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
