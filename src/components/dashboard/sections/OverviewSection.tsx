import { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FileText, Palette, TrendingUp, Clock, Eye, Globe, Circle, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SmartResumeParser } from '@/components/dashboard/SmartResumeParser';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';

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
    },
    {
      label: 'Work Experiences',
      value: profile.workExperience.length,
      icon: FileText,
      color: 'text-emerald-600',
    },
    {
      label: 'Projects',
      value: profile.projects.length,
      icon: Palette,
      color: 'text-amber-600',
    },
    {
      label: 'Skills',
      value: profile.skills.length,
      icon: Clock,
      color: 'text-violet-600',
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Welcome back{profile.fullName ? `, ${profile.fullName.split(' ')[0]}` : ''}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your portfolio progress.
        </p>
      </div>

      {/* Smart Resume Parser - Collapsible */}
      <Collapsible open={isParserOpen} onOpenChange={setIsParserOpen}>
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <CollapsibleTrigger asChild>
            <button className="w-full p-5 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
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
              <div className="p-2 rounded-lg hover:bg-muted transition-colors">
                {isParserOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
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
                        // This callback is for additional side effects if needed
                      }}
                    />
                  </div>
                </motion.div>
              </CollapsibleContent>
            )}
          </AnimatePresence>
        </div>
      </Collapsible>

      {/* Hero Stats Row - Glass/Bento Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Views Card */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-6">
          {/* Noise texture overlay */}
          <div 
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-primary/20 backdrop-blur-sm">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Total Views</span>
            </div>
            <p className="text-4xl font-bold text-foreground mb-1">
              {profile.views?.toLocaleString() || 0}
            </p>
            <p className="text-xs text-muted-foreground">
              Unique visitors to your portfolio
            </p>
          </div>
        </div>

        {/* Profile Status Card */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-emerald-500/5 p-6">
          {/* Noise texture overlay */}
          <div 
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 backdrop-blur-sm">
                <Globe className="h-5 w-5 text-emerald-500" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Profile Status</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Circle 
                className={`h-3 w-3 ${isLive ? 'text-emerald-500 fill-emerald-500' : 'text-muted-foreground fill-muted-foreground'}`} 
              />
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
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="space-y-3">
          <Link to="/dashboard?section=profile">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Edit Profile Data
            </Button>
          </Link>
          <Link to="/dashboard?section=templates">
            <Button variant="outline" className="w-full justify-start">
              <Palette className="h-4 w-4 mr-2" />
              Choose Template
            </Button>
          </Link>
        </div>
      </div>

      {/* Completion Tips - Only show if not empty but incomplete */}
      {completionScore < 100 && !isProfileEmpty && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="font-semibold text-foreground mb-2">Complete Your Profile</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Add more details to make your portfolio stand out.
          </p>
          <div className="space-y-2 text-sm">
            {!profile.bio && (
              <p className="text-muted-foreground">• Add a bio to introduce yourself</p>
            )}
            {profile.workExperience.length === 0 && (
              <p className="text-muted-foreground">• Add your work experience</p>
            )}
            {profile.projects.length === 0 && (
              <p className="text-muted-foreground">• Showcase your projects</p>
            )}
            {profile.skills.length === 0 && (
              <p className="text-muted-foreground">• List your skills</p>
            )}
          </div>
        </div>
      )}
    </div>
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
