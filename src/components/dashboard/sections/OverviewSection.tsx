import { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Palette, TrendingUp, Clock, Eye, Globe, Circle, Upload, ChevronDown, ExternalLink, ArrowUpRight, Briefcase, Zap, CheckCircle2, Lightbulb, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SmartResumeParser } from '@/components/dashboard/SmartResumeParser';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { calculatePortfolioStrength } from '@/utils/scoringEngine';

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring' as const, stiffness: 120, damping: 20 },
  },
};

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Using react-circular-progressbar for Radial progress
function RadialProgress({ score, size = 120, strokeWidth = 8 }: { score: number; size?: number; strokeWidth?: number }) {
  const color = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#f87171'; // emerald-500, amber-500, red-400

  return (
    <div style={{ width: size, height: size }} className="relative">
      <CircularProgressbar
        value={score}
        strokeWidth={strokeWidth}
        styles={buildStyles({
          pathColor: color,
          trailColor: 'rgba(156, 163, 175, 0.2)', // muted
          strokeLinecap: 'round',
          pathTransition: 'stroke-dashoffset 1.2s ease 0s',
        })}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <motion.span
          className="text-2xl font-bold text-foreground tabular-nums"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        >
          {score}
        </motion.span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">/ 100</span>
      </div>
    </div>
  );
}

export function OverviewSection() {
  const { profile, loading } = useProfile();
  const { user } = useAuth();
  const navigate = useNavigate();

  const strength = calculatePortfolioStrength(profile);
  const completionScore = calculateCompletionScore(profile);
  const isLive = !!(profile.fullName && profile.headline && profile.bio);
  const isProfileEmpty = profile.workExperience.length === 0 && profile.skills.length === 0;
  const [isParserOpen, setIsParserOpen] = useState(isProfileEmpty);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-5 w-96 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8 max-w-4xl"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      {/* Welcome */}
      <motion.div variants={fadeUp}>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Welcome back{profile.fullName ? `, ${profile.fullName.split(' ')[0]}` : ''}
        </h1>
        <p className="text-muted-foreground mt-1">
          Your portfolio at a glance. Keep it sharp for recruiters.
        </p>
      </motion.div>

      {/* Portfolio Strength Score */}
      <motion.div variants={fadeUp}>
        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Radial score */}
            <div className="shrink-0">
              <RadialProgress score={strength.totalScore} />
            </div>

            {/* Breakdown + Tips */}
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-foreground mb-3">Portfolio Strength</h2>

              {/* Score breakdown */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Projects', value: strength.breakdown.projects, max: 30 },
                  { label: 'Contact', value: strength.breakdown.contact, max: 20 },
                  { label: 'Skill Map', value: strength.breakdown.mapping, max: 50 },
                ].map((seg) => (
                  <div key={seg.label}>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{seg.label}</span>
                      <span className="text-xs font-semibold text-foreground tabular-nums">{seg.value}/{seg.max}</span>
                    </div>
                    <Progress value={(seg.value / seg.max) * 100} className="h-1.5 bg-muted" />
                  </div>
                ))}
              </div>

              {/* Tips to improve */}
              {strength.recommendations.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-xs font-medium text-muted-foreground">Tips to Improve</span>
                  </div>
                  <AnimatePresence mode="popLayout">
                    {strength.recommendations.slice(0, 4).map((rec) => (
                      <motion.div
                        key={rec.id}
                        layout
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8, height: 0 }}
                        onClick={() => navigate('/dashboard?section=profile')}
                        className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer hover:text-primary transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0 mt-0.5" />
                        <span>{rec.label}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {strength.totalScore === 100 && (
                <div className="flex items-center gap-2 text-sm text-emerald-500 font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Perfect score! Your portfolio is fully optimized.
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Views */}
        <motion.div
          variants={fadeUp}
          whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400 } }}
          className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 cursor-default"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Eye className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">Views</span>
            </div>
            <motion.p
              className="text-4xl font-bold text-foreground tabular-nums"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              {profile.views?.toLocaleString() || '0'}
            </motion.p>
            <p className="text-xs text-muted-foreground mt-1">Total portfolio visitors</p>
          </div>
        </motion.div>

        {/* Profile Status */}
        <motion.div
          variants={fadeUp}
          whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400 } }}
          className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 cursor-default"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10">
                <Globe className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex items-center gap-1.5">
                <motion.div
                  animate={isLive ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className={`h-2 w-2 rounded-full ${isLive ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`}
                />
                <span className={`text-xs font-medium ${isLive ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                  {isLive ? 'Live' : 'Draft'}
                </span>
              </div>
            </div>
            <p className="text-4xl font-bold text-foreground">
              {isLive ? 'Live' : 'Draft'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {isLive ? (
                <a href={`/p/${user?.id}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                  View portfolio <ArrowUpRight className="h-3 w-3" />
                </a>
              ) : 'Complete profile to go live'}
            </p>
          </div>
        </motion.div>

        {/* Completion */}
        <motion.div
          variants={fadeUp}
          whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400 } }}
          className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 cursor-default"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-violet-500/10">
                <TrendingUp className="h-4 w-4 text-violet-500" />
              </div>
              <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">Score</span>
            </div>
            <motion.p
              className="text-4xl font-bold text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {completionScore}%
            </motion.p>
            <div className="mt-2">
              <Progress value={completionScore} className="h-1.5 bg-muted" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Resume Upload */}
      <motion.div variants={fadeUp}>
        <Collapsible open={isParserOpen} onOpenChange={setIsParserOpen}>
          <div className="rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-border transition-colors">
            <CollapsibleTrigger asChild>
              <button className="w-full p-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="p-3 rounded-xl bg-primary/10"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <Upload className="h-5 w-5 text-primary" />
                  </motion.div>
                  <div className="text-left">
                    <h3 className="font-semibold text-foreground text-sm">
                      {isProfileEmpty ? 'Get Started — Import Resume' : 'Update from Resume'}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isProfileEmpty
                        ? 'Drop your resume PDF to build your portfolio instantly'
                        : 'Import new data from a resume or LinkedIn PDF'
                      }
                    </p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isParserOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-2 rounded-lg text-muted-foreground"
                >
                  <ChevronDown className="h-4 w-4" />
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
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="border-t border-border/50"
                  >
                    <div className="p-6">
                      <SmartResumeParser onTemplateChange={() => { }} />
                    </div>
                  </motion.div>
                </CollapsibleContent>
              )}
            </AnimatePresence>
          </div>
        </Collapsible>
      </motion.div>

      {/* Portfolio Preview Card */}
      <motion.div variants={fadeUp}>
        <motion.div
          className="rounded-2xl border border-border/60 bg-card overflow-hidden cursor-pointer group"
          onClick={() => navigate('/dashboard?section=profile')}
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-foreground">Portfolio Preview</h2>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary gap-1" asChild>
                <Link to={`/p/${user?.id}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                  <ExternalLink className="h-3 w-3" />
                  View Live
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-5 p-4 rounded-xl bg-muted/40 border border-border/40 group-hover:border-primary/20 transition-colors">
              <div className="relative">
                <Avatar className="h-16 w-16 border-2 border-border ring-2 ring-primary/10 ring-offset-2 ring-offset-card">
                  <AvatarImage src={profile.photoUrl} alt={profile.fullName} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                    {profile.fullName?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                {isLive && (
                  <motion.div
                    className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-emerald-500 rounded-full border-2 border-card"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate text-base">{profile.fullName || 'Your Name'}</p>
                <p className="text-sm text-muted-foreground truncate">{profile.headline || 'Add a headline'}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><FolderOpen className="h-3 w-3" />{profile.projects.length} projects</span>
                  <span className="flex items-center gap-1"><Zap className="h-3 w-3" />{profile.skills.length} skills</span>
                  <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{profile.workExperience.length} roles</span>
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Experiences', value: profile.workExperience.length, icon: Briefcase, accent: 'bg-emerald-500/10 text-emerald-500' },
          { label: 'Projects', value: profile.projects.length, icon: Palette, accent: 'bg-amber-500/10 text-amber-500' },
          { label: 'Skills', value: profile.skills.length, icon: Zap, accent: 'bg-violet-500/10 text-violet-500' },
          { label: 'Strength', value: `${strength.totalScore}`, icon: TrendingUp, accent: 'bg-primary/10 text-primary' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            whileHover={{ y: -3 }}
            className="rounded-xl border border-border/50 bg-card p-4 cursor-default"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className={`p-1.5 rounded-lg ${stat.accent}`}>
                <stat.icon className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <motion.p
              className="text-2xl font-bold text-foreground tabular-nums"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.05 }}
            >
              {stat.value}
            </motion.p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
        <Link to="/dashboard?section=profile">
          <Button variant="outline" size="sm" className="rounded-xl gap-2 hover:border-primary/30 hover:bg-primary/5">
            <FileText className="h-3.5 w-3.5" />
            Edit Profile
          </Button>
        </Link>
        <Link to="/dashboard?section=templates">
          <Button variant="outline" size="sm" className="rounded-xl gap-2 hover:border-primary/30 hover:bg-primary/5">
            <Palette className="h-3.5 w-3.5" />
            Choose Template
          </Button>
        </Link>
        <Link to="/dashboard?section=settings">
          <Button variant="outline" size="sm" className="rounded-xl gap-2 hover:border-primary/30 hover:bg-primary/5">
            <Clock className="h-3.5 w-3.5" />
            Settings
          </Button>
        </Link>
      </motion.div>
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
  checks.forEach((check) => { if (check) score += 12.5; });
  return Math.round(score);
}
