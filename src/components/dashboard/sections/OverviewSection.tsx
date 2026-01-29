import { useProfile } from '@/contexts/ProfileContext';
import { Link } from 'react-router-dom';
import { FileText, Palette, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function OverviewSection() {
  const { profile, loading } = useProfile();

  const completionScore = calculateCompletionScore(profile);

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
