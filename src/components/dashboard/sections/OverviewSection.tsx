import { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FileText, Palette, TrendingUp, Clock, Eye, Globe, Circle, Upload, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SmartResumeParser } from '@/components/dashboard/SmartResumeParser';
import { FavoritesSection } from './FavoritesSection';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const cardHoverVariants = {
  rest: { y: 0, scale: 1 },
  hover: { 
    y: -5, 
    scale: 1.02,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 20,
    },
  },
};

export function OverviewSection() {
  const { profile, loading } = useProfile();
  const { user } = useAuth();

  const completionScore = calculateCompletionScore(profile);
  
  // Check if profile is "live" (has minimum required data)
  const isLive = !!(profile.fullName && profile.headline && profile.bio);
  
  // Check if profile is empty (no work experience)
  const isProfileEmpty = profile.workExperience.length === 0 && profile.skills.length === 0;
  
  // Resume parser should be expanded by default if profile is empty
  const [isParserOpen, setIsParserOpen] = useState(isProfileEmpty);

  const stats = [
    {
      label: 'Profile Completion',
      value: `${completionScore}%`,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Work Experiences',
      value: profile.workExperience.length,
      icon: FileText,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Projects',
      value: profile.projects.length,
      icon: Palette,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: 'Skills',
      value: profile.skills.length,
      icon: Clock,
      color: 'text-violet-600',
      bgColor: 'bg-violet-500/10',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Welcome Message */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Welcome back{profile.fullName ? `, ${profile.fullName.split(' ')[0]}` : ''}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your portfolio progress.
        </p>
      </motion.div>

      {/* Smart Resume Parser - Collapsible */}
      <motion.div variants={itemVariants}>
        <Collapsible open={isParserOpen} onOpenChange={setIsParserOpen}>
          <motion.div 
            className="rounded-2xl border border-border bg-card overflow-hidden"
            initial="rest"
            whileHover="hover"
            variants={{
              rest: { boxShadow: '0 0 0 rgba(0,0,0,0)' },
              hover: { boxShadow: '0 10px 40px -15px rgba(0,0,0,0.15)' },
            }}
          >
            <CollapsibleTrigger asChild>
              <button className="w-full p-5 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <Upload className="h-5 w-5 text-primary" />
                  </motion.div>
                  <div className="text-left">
                    <h3 className="font-semibold text-foreground">
                      {isProfileEmpty ? 'Get Started - Import Your Resume' : 'Update from Resume'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isProfileEmpty 
                        ? 'Drop your resume PDF to auto-build your portfolio in seconds'
                        : 'Import new data from a resume or LinkedIn PDF'
                      }
                    </p>
                  </div>
                </div>
                <motion.div 
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  animate={{ rotate: isParserOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                </motion.div>
              </button>
            </CollapsibleTrigger>
            
            <AnimatePresence>
              {isParserOpen && (
                <CollapsibleContent forceMount>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="border-t border-border"
                  >
                    <div className="p-6">
                      <SmartResumeParser 
                        onTemplateChange={(templateId) => {
                          // Template change is handled via updateProfile in SmartResumeParser
                        }}
                      />
                    </div>
                  </motion.div>
                </CollapsibleContent>
              )}
            </AnimatePresence>
          </motion.div>
        </Collapsible>
      </motion.div>

      {/* Hero Stats Row - Glass/Bento Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Views Card */}
        <motion.div 
          variants={itemVariants}
          initial="rest"
          whileHover="hover"
          className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-6 cursor-default"
        >
          <motion.div
            variants={cardHoverVariants}
            className="relative z-10"
          >
            {/* Noise texture overlay */}
            <div 
              className="absolute inset-0 opacity-30 pointer-events-none -z-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />
            <div className="flex items-center gap-3 mb-4">
              <motion.div 
                className="p-2.5 rounded-xl bg-primary/20 backdrop-blur-sm"
                whileHover={{ scale: 1.15, rotate: -10 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Eye className="h-5 w-5 text-primary" />
              </motion.div>
              <span className="text-sm font-medium text-muted-foreground">Total Views</span>
            </div>
            <motion.p 
              className="text-4xl font-bold text-foreground mb-1"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            >
              {profile.views?.toLocaleString() || 0}
            </motion.p>
            <p className="text-xs text-muted-foreground">
              Unique visitors to your portfolio
            </p>
          </motion.div>
        </motion.div>

        {/* Profile Status Card */}
        <motion.div 
          variants={itemVariants}
          initial="rest"
          whileHover="hover"
          className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-emerald-500/5 p-6 cursor-default"
        >
          <motion.div
            variants={cardHoverVariants}
            className="relative z-10"
          >
            {/* Noise texture overlay */}
            <div 
              className="absolute inset-0 opacity-30 pointer-events-none -z-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />
            <div className="flex items-center gap-3 mb-4">
              <motion.div 
                className="p-2.5 rounded-xl bg-emerald-500/20 backdrop-blur-sm"
                whileHover={{ scale: 1.15, rotate: 10 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Globe className="h-5 w-5 text-emerald-500" />
              </motion.div>
              <span className="text-sm font-medium text-muted-foreground">Profile Status</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <motion.div
                animate={isLive ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Circle 
                  className={`h-3 w-3 ${isLive ? 'text-emerald-500 fill-emerald-500' : 'text-muted-foreground fill-muted-foreground'}`} 
                />
              </motion.div>
              <p className="text-4xl font-bold text-foreground">
                {isLive ? 'Live' : 'Draft'}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              {isLive ? (
                <a 
                  href={`/p/${user?.id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View your public portfolio →
                </a>
              ) : (
                'Complete your profile to go live'
              )}
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div 
            key={stat.label} 
            variants={itemVariants}
            initial="rest"
            whileHover="hover"
            custom={index}
            className="rounded-xl border border-border bg-card p-5 cursor-default"
          >
            <motion.div variants={cardHoverVariants}>
              <div className="flex items-center gap-3 mb-3">
                <motion.div 
                  className={`p-2 rounded-lg ${stat.bgColor}`}
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </motion.div>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <motion.p 
                className="text-3xl font-bold text-foreground"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                {stat.value}
              </motion.p>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Favorites Section */}
      <motion.div variants={itemVariants}>
        <FavoritesSection />
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        variants={itemVariants}
        className="rounded-xl border border-border bg-card p-6"
      >
        <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="space-y-3">
          <Link to="/dashboard?section=profile">
            <motion.div
              whileHover={{ x: 5, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Edit Profile Data
              </Button>
            </motion.div>
          </Link>
          <Link to="/dashboard?section=templates">
            <motion.div
              whileHover={{ x: 5, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Button variant="outline" className="w-full justify-start">
                <Palette className="h-4 w-4 mr-2" />
                Choose Template
              </Button>
            </motion.div>
          </Link>
        </div>
      </motion.div>

      {/* Completion Tips - Only show if not empty but incomplete */}
      <AnimatePresence>
        {completionScore < 100 && !isProfileEmpty && (
          <motion.div 
            variants={itemVariants}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="rounded-xl border border-primary/20 bg-primary/5 p-6"
          >
            <h2 className="font-semibold text-foreground mb-2">Complete Your Profile</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Add more details to make your portfolio stand out.
            </p>
            <div className="space-y-2 text-sm">
              {!profile.bio && (
                <motion.p 
                  className="text-muted-foreground"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  • Add a bio to introduce yourself
                </motion.p>
              )}
              {profile.workExperience.length === 0 && (
                <motion.p 
                  className="text-muted-foreground"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  • Add your work experience
                </motion.p>
              )}
              {profile.projects.length === 0 && (
                <motion.p 
                  className="text-muted-foreground"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  • Showcase your projects
                </motion.p>
              )}
              {profile.skills.length === 0 && (
                <motion.p 
                  className="text-muted-foreground"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  • List your skills
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function calculateCompletionScore(profile: ReturnType<typeof useProfile>['profile']): number {
  let score = 0;
  const checks = [
    !!profile.fullName,
    !!profile.headline,
    !!profile.bio,
    !!profile.location,
    !!profile.email,
    profile.workExperience.length > 0,
    profile.projects.length > 0,
    profile.skills.length > 0,
  ];
  
  checks.forEach((check) => {
    if (check) score += 12.5;
  });
  
  return Math.round(score);
}
