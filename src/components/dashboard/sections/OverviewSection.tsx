import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FileText, Palette, TrendingUp, Clock, Eye, Globe, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function OverviewSection() {
  const { profile, loading } = useProfile();
  const { user } = useAuth();

  const completionScore = calculateCompletionScore(profile);
  
  // Check if profile is "live" (has minimum required data)
  const isLive = !!(profile.fullName && profile.headline && profile.bio);

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

      {/* Hero Stats Row - Glass/Bento Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Views Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-6">
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
              <span className="text-sm font-medium text-slate-400">Total Views</span>
            </div>
            <p className="text-4xl font-bold text-white mb-1">
              {profile.views?.toLocaleString() || 0}
            </p>
            <p className="text-xs text-slate-500">
              Unique visitors to your portfolio
            </p>
          </div>
        </div>

        {/* Profile Status Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-6">
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
                <Globe className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="text-sm font-medium text-slate-400">Profile Status</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Circle 
                className={`h-3 w-3 ${isLive ? 'text-emerald-400 fill-emerald-400' : 'text-slate-500 fill-slate-500'}`} 
              />
              <p className="text-4xl font-bold text-white">
                {isLive ? 'Live' : 'Draft'}
              </p>
            </div>
            <p className="text-xs text-slate-500">
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

      {/* Completion Tips */}
      {completionScore < 100 && (
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
