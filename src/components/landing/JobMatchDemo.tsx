import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ExternalLink, ArrowRight, Briefcase, Code, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useJobMatch } from '@/hooks/useJobMatch';
import { Project } from '@/contexts/ProfileContext';

// Demo projects to showcase the Job Match feature
const DEMO_PROJECTS: Project[] = [
  {
    id: 'demo-1',
    title: 'E-Commerce Platform Redesign',
    description: 'Led the complete redesign of a major e-commerce platform, improving conversion rates by 40% through data-driven UX decisions.',
    imageUrl: '',
    link: '',
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Stripe'],
    targetKeywords: ['E-commerce', 'Retail', 'Shopify', 'Amazon'],
    visible: true,
  },
  {
    id: 'demo-2',
    title: 'AI-Powered Analytics Dashboard',
    description: 'Built a real-time analytics dashboard with ML-powered insights for enterprise clients, processing 1M+ events daily.',
    imageUrl: '',
    link: '',
    techStack: ['Python', 'TensorFlow', 'React', 'AWS', 'Kubernetes'],
    targetKeywords: ['Google', 'Meta', 'AI', 'Machine Learning', 'Data Science'],
    visible: true,
  },
  {
    id: 'demo-3',
    title: 'Electric Vehicle Fleet Management',
    description: 'Developed a comprehensive fleet management system for EV logistics, optimizing routes and reducing energy costs by 25%.',
    imageUrl: '',
    link: '',
    techStack: ['React Native', 'GraphQL', 'Python', 'GCP', 'IoT'],
    targetKeywords: ['Tesla', 'Rivian', 'EV', 'Automotive', 'Sustainability'],
    visible: true,
  },
  {
    id: 'demo-4',
    title: 'Fintech Payment Gateway',
    description: 'Architected a secure payment processing system handling $50M+ in transactions with 99.99% uptime.',
    imageUrl: '',
    link: '',
    techStack: ['Go', 'React', 'PostgreSQL', 'Redis', 'Docker'],
    targetKeywords: ['Stripe', 'PayPal', 'Fintech', 'Banking', 'Payments'],
    visible: true,
  },
  {
    id: 'demo-5',
    title: 'Social Media Content Platform',
    description: 'Created a creator-first content platform with advanced scheduling, analytics, and AI-powered content suggestions.',
    imageUrl: '',
    link: '',
    techStack: ['Next.js', 'TypeScript', 'Prisma', 'OpenAI', 'Vercel'],
    targetKeywords: ['Meta', 'TikTok', 'Social Media', 'Creator Economy'],
    visible: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function JobMatchDemo() {
  const [searchParams] = useSearchParams();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  
  // Get the target from URL params
  const target = searchParams.get('company') || searchParams.get('skill') || searchParams.get('target') || '';
  const matchType = searchParams.get('company') ? 'company' : searchParams.get('skill') ? 'skill' : 'target';
  
  // Use the Job Match hook with demo projects
  const { sortedProjects, matchMode, highlightedProjectIds } = useJobMatch(DEMO_PROJECTS);

  return (
    <div className="min-h-screen">
      {/* Recruiter Welcome Banner */}
      <AnimatePresence>
        {matchMode && !bannerDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="sticky top-0 z-50 px-4 sm:px-8 py-4"
          >
            <div className="max-w-5xl mx-auto bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 backdrop-blur-xl border border-primary/30 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-primary/5">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <p className="text-foreground text-sm md:text-base text-center sm:text-left">
                  👋 Portfolio curated for{' '}
                  <span className="font-bold text-primary">
                    {target}
                  </span>
                  {matchType === 'company' ? ' hiring team' : matchType === 'skill' ? ' role' : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/auth">
                  <Button size="sm" className="shadow-glow">
                    Create Your Portfolio
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <button
                  onClick={() => setBannerDismissed(true)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="Dismiss banner"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-8 py-16 sm:py-24 max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <motion.div variants={itemVariants}>
            <Badge variant="secondary" className="mb-6 text-sm">
              <Target className="w-3.5 h-3.5 mr-2" />
              Job Match Demo
            </Badge>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            Portfolios that{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              adapt to recruiters
            </span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Share personalized links like{' '}
            <code className="px-2 py-1 rounded bg-muted text-sm font-mono">
              yourportfolio.com?company={target || 'Google'}
            </code>{' '}
            and relevant projects automatically rise to the top.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="shadow-glow">
                <Sparkles className="w-4 h-4 mr-2" />
                Build Your Smart Portfolio
              </Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline">
                View Full Landing Page
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Sorted Projects Section */}
      <section className="relative z-10 px-4 sm:px-8 py-16 max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Projects{' '}
              {matchMode && (
                <span className="text-primary">
                  matching "{target}"
                </span>
              )}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Notice how projects with matching keywords are automatically prioritized and highlighted.
            </p>
          </motion.div>

          <div className="grid gap-6">
            {sortedProjects.map((project, idx) => {
              const isHighlighted = highlightedProjectIds.has(project.id);
              
              return (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  className={`
                    group relative rounded-2xl border p-6 transition-all duration-300
                    ${isHighlighted 
                      ? 'bg-primary/5 border-primary/40 shadow-lg shadow-primary/10' 
                      : 'bg-card border-border hover:border-muted-foreground/30'
                    }
                  `}
                >
                  {/* Best Match Badge */}
                  {isHighlighted && idx < 2 && (
                    <div className="absolute -top-3 left-6">
                      <Badge className="bg-primary text-primary-foreground shadow-glow">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Best Match
                      </Badge>
                    </div>
                  )}

                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Project Icon */}
                    <div className={`
                      w-16 h-16 rounded-xl flex items-center justify-center shrink-0
                      ${isHighlighted 
                        ? 'bg-gradient-to-br from-primary/20 to-accent/20' 
                        : 'bg-muted'
                      }
                    `}>
                      <Briefcase className={`w-7 h-7 ${isHighlighted ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>

                    {/* Project Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                        {project.title}
                        {project.link && (
                          <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.techStack?.map((tech) => {
                          const isMatchingTech = target && tech.toLowerCase().includes(target.toLowerCase());
                          return (
                            <Badge 
                              key={tech} 
                              variant={isMatchingTech ? 'default' : 'secondary'}
                              className={isMatchingTech ? 'shadow-glow' : ''}
                            >
                              <Code className="w-3 h-3 mr-1" />
                              {tech}
                            </Badge>
                          );
                        })}
                      </div>

                      {/* Target Keywords */}
                      {project.targetKeywords && project.targetKeywords.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.targetKeywords.map((keyword) => {
                            const isMatchingKeyword = target && keyword.toLowerCase().includes(target.toLowerCase());
                            return (
                              <Badge 
                                key={keyword} 
                                variant="outline"
                                className={isMatchingKeyword ? 'border-primary text-primary' : ''}
                              >
                                <Target className="w-3 h-3 mr-1" />
                                {keyword}
                              </Badge>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 sm:px-8 py-20 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to make your portfolio work smarter?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Create your own Job Match-enabled portfolio in minutes. Stand out to every recruiter with personalized experiences.
          </p>
          <Link to="/auth">
            <Button size="lg" className="shadow-glow text-lg px-8 py-6">
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
