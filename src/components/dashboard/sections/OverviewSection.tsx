import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase_v2';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePro } from '@/contexts/ProContext';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Palette, TrendingUp, Clock, Eye, Globe, Circle, Upload, ChevronDown, ExternalLink, ArrowUpRight, Briefcase, Zap, CheckCircle2, Lightbulb, FolderOpen, Sparkles, ShieldCheck, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SmartResumeParser } from '@/components/dashboard/SmartResumeParser';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { calculatePortfolioStrength } from '@/utils/scoringEngine';
import { ResumeInsights } from '@/components/dashboard/ResumeInsights';

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
  const { isPro } = usePro();
  const navigate = useNavigate();

  const strength = calculatePortfolioStrength(profile);
  const completionScore = calculateCompletionScore(profile);
  const isLive = !!(profile.fullName && profile.headline && profile.bio);
  const isProfileEmpty = profile.workExperience.length === 0 && profile.skills.length === 0;
  
  let totalAchieved = 0;
  let totalPossible = profile.projects.length * 100;
  profile.projects.forEach(p => {
     let projScore = (p.proofValidationScore || 0) + (p.metricDensityScore || 0) + (p.frameworkAlignmentScore || 0);
     totalAchieved += projScore;
  });
  const trustScore = totalPossible > 0 ? Math.round((totalAchieved / totalPossible) * 100) : 0;

  const [isParserOpen, setIsParserOpen] = useState(isProfileEmpty);
  const [isPulseModalOpen, setIsPulseModalOpen] = useState(false);
  const [chameleonStats, setChameleonStats] = useState<{industry_context: string, views: number}[]>([]);
  const [pulseViews, setPulseViews] = useState<any[]>([]);
  const [pingCount, setPingCount] = useState(0);

  useEffect(() => {
    if (user?.id) {
      // Fetch chameleon link stats
      supabase.from('chameleon_links')
        .select('industry_context, views')
        .eq('user_id', user.id)
        .then(({ data }) => {
          if (data) {
             const aggr = data.reduce((acc: any, curr: any) => {
               const industry = curr.industry_context === 'none' ? 'General' : curr.industry_context;
               acc[industry] = (acc[industry] || 0) + (curr.views || 0);
               return acc;
             }, {});
             const formatted = Object.entries(aggr).map(([k, v]) => ({ industry_context: k, views: v as number }));
             setChameleonStats(formatted);
          }
        });

      // Fetch total pings
      supabase.from('visit_logs')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_ping', true)
        .then(({ count }) => {
          setPingCount(count || 0);
        });

      // Real-time subscription for new pings
      const channel = supabase
        .channel('recruiter-pings')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'visit_logs',
          filter: `user_id=eq.${user.id}`,
        }, (payload: any) => {
          if (payload.new?.is_ping) {
            setPingCount(prev => prev + 1);
            toast.success('New Recruiter Interest', {
              description: `${payload.new.company || 'A recruiter'} just pinged your portfolio.`,
              icon: <Sparkles className="h-4 w-4 text-blue-400" />,
              style: {
                background: '#0a0a0a',
                border: '1px solid rgba(59, 130, 246, 0.5)',
                color: 'white',
                boxShadow: '0 0 25px rgba(59, 130, 246, 0.2)',
              },
            });
          }
        })
        .subscribe();

      // Fetch detailed Pulse views from the new analytics table
      supabase.from('portfolio_views')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)
        .then(({ data }) => {
          if (data) {
            setPulseViews(data);
          }
        });

      return () => { supabase.removeChannel(channel); };
    }
  }, [user]);

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
          Welcome back{typeof profile.fullName === 'string' && profile.fullName.trim() ? `, ${profile.fullName.split(' ')[0]}` : ''}
        </h1>
        <p className="text-muted-foreground mt-1">
          Your portfolio at a glance. Keep it sharp for recruiters.
        </p>
      </motion.div>

      {/* Onboarding Checklist */}
      <motion.div variants={fadeUp}>
        <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-6 shadow-[0_0_20px_rgba(99,102,241,0.05)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">Quick Start</h2>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Your launch sequence</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { 
                id: 'resume', 
                label: 'Resume Upload', 
                desc: 'Import your career history',
                isDone: profile.workExperience.length > 0,
                action: () => setIsParserOpen(true)
              },
              { 
                id: 'template', 
                label: 'Template Select', 
                desc: 'Choose your visual dialect',
                isDone: !!profile.selectedTemplate,
                action: () => navigate('/dashboard?section=templates')
              },
              { 
                id: 'url', 
                label: 'Claim URL', 
                desc: 'Deploy your identity',
                isDone: isLive,
                action: () => navigate('/dashboard?section=profile') // Assuming they can publish from profile
              }
            ].map((step, idx) => (
              <motion.div
                key={step.id}
                whileHover={{ y: -2 }}
                onClick={step.action}
                className={`relative cursor-pointer p-4 rounded-xl border transition-all duration-300 ${
                  step.isDone 
                  ? 'bg-emerald-500/5 border-emerald-500/20' 
                  : 'bg-indigo-500/5 border-indigo-500/20 hover:border-indigo-500/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${step.isDone ? 'text-emerald-500' : 'text-indigo-400'}`}>
                    Step {idx + 1}
                  </span>
                  {step.isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-indigo-500/30" />
                  )}
                </div>
                <h3 className={`text-sm font-bold ${step.isDone ? 'text-emerald-200/80 line-through opacity-60' : 'text-foreground'}`}>
                  {step.label}
                </h3>
                <p className="text-[11px] text-muted-foreground mt-1 leading-tight">
                  {step.desc}
                </p>
                {step.isDone && (
                  <div className="absolute top-0 right-0 p-2 pointer-events-none">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500/10" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Views */}
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
              <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">Total Views</span>
            </div>
            <motion.p
              className="text-4xl font-bold text-foreground tabular-nums"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              {profile.views?.toLocaleString() || '0'}
            </motion.p>
            <p className="text-xs text-muted-foreground mt-1">Main portfolio visitors</p>
          </div>
        </motion.div>

        {/* Pulse Chart: Recruiter Views */}
        <motion.div
          variants={fadeUp}
          whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400 } }}
          className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 cursor-default"
          onClick={() => setIsPulseModalOpen(false)}
        >

          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10 relative">
                <TrendingUp className="h-4 w-4 text-blue-500 relative z-10" />
                <motion.div 
                  className="absolute inset-0 bg-blue-500/20 rounded-xl"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">Recruiter Pulse</span>
            </div>
            <div className="flex items-baseline gap-4">
              <motion.p
                className="text-2xl font-bold text-foreground tabular-nums"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {chameleonStats.reduce((acc, curr) => acc + curr.views, 0).toLocaleString()}
                <span className="text-xs text-blue-400 font-normal ml-1">Views</span>
              </motion.p>
              <motion.p
                className="text-2xl font-bold text-foreground tabular-nums"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {pingCount}
                <span className="text-xs text-blue-400 font-normal ml-1">Pings</span>
              </motion.p>
            </div>
            <div className="mt-2 space-y-1">
              {pulseViews.length > 0 ? pulseViews.slice(0, 3).map((view, idx) => {
                const city = (typeof view.viewer_region === 'string' ? view.viewer_region.split(',')[0] : null) || 'Unknown City';
                const displayLocation = view.viewer_company && view.viewer_company !== 'Individual Visitor' 
                  ? `🏢 ${view.viewer_company}` 
                  : `📍 ${city}`;
                
                return (
                  <div key={view.id || idx} className="flex justify-between items-center text-[10px] text-muted-foreground">
                    <span className="truncate max-w-[120px]" title={displayLocation}>{displayLocation}</span>
                    <span className="capitalize text-blue-400/70 font-mono">{view.persona_active}</span>
                  </div>
                );
              }) : chameleonStats.length > 0 ? chameleonStats.slice(0, 2).map((stat) => (
                <div key={stat.industry_context} className="flex justify-between items-center text-[10px] text-muted-foreground">
                  <span className="truncate max-w-[80px] capitalize">📍 {stat.industry_context.replace('_', ' ')}</span>
                  <span>{stat.views}</span>
                </div>
              )) : (
                <p className="text-xs text-muted-foreground mt-1">No activity yet.</p>
              )}
            </div>
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
                <a href={`/u/${profile.username || user?.id}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
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
          className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 cursor-default md:col-span-1 col-span-1"
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
            <div className="mt-2 text-xs truncate">
              <Progress value={completionScore} className="h-1.5 bg-muted mb-1" />
              <span className="text-muted-foreground">Profile depth</span>
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
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Experiences', value: profile.workExperience.length, icon: Briefcase, accent: 'bg-emerald-500/10 text-emerald-500' },
          { label: 'Projects', value: profile.projects.length, icon: Palette, accent: 'bg-amber-500/10 text-amber-500' },
          { label: 'Skills', value: profile.skills.length, icon: Zap, accent: 'bg-violet-500/10 text-violet-500' },
          { label: 'Strength', value: `${profile.profileStrength || strength.totalScore}`, icon: TrendingUp, accent: 'bg-primary/10 text-primary' },
          { label: 'Trust Score', value: `${Math.round(trustScore)}%`, icon: ShieldCheck, accent: 'bg-blue-500/10 text-blue-500', isMono: true },
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
              className={`text-2xl font-bold text-foreground tabular-nums ${stat.isMono ? 'font-mono tracking-widest text-[#00E5FF]' : ''}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.05 }}
            >
              {stat.value}
            </motion.p>
            {stat.label === 'Trust Score' && (
              <div className="mt-2 h-1 w-full bg-muted rounded-full overflow-hidden">
                 <motion.div 
                   className="h-full bg-[#00E5FF]" 
                   initial={{ width: 0 }}
                   animate={{ width: `${trustScore}%` }}
                   transition={{ duration: 1, ease: 'easeOut' }}
                 />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Identity Roadmap Teaser */}
      <motion.div variants={fadeUp}>
        <div className="rounded-2xl border border-primary/30 bg-indigo-950/20 p-6 relative overflow-hidden group transition-all duration-500 hover:border-primary/50 hover:brightness-110 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]">
          {/* Constant Slow Shimmer (Idle & Hover) */}
          <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-indigo-400/[0.05] to-transparent -translate-x-full animate-[shimmer_5s_infinite_linear] pointer-events-none" />
          
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
            <ShieldCheck className="h-12 w-12 text-indigo-400" />
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-300">
              <Target className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold text-indigo-200/90 uppercase tracking-widest">Identity Roadmap</h2>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="text-lg font-bold text-foreground">AI Interview Coach</h3>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">Target</span>
              </div>
              <p className="text-sm text-slate-100/90 max-w-lg leading-relaxed font-medium">
                Practice role-specific interviews based on your unique portfolio narratives. Master the dialects of Startup and Big Tech before you step into the room.
              </p>
            </div>
            
            <div className="shrink-0 flex flex-col items-end">
              <span className="text-xs font-mono font-bold text-emerald-400 tracking-tighter">LAUNCHING: Oct 15, 2026</span>
              <div className="mt-2 text-[10px] text-indigo-300/70 uppercase tracking-tighter bg-indigo-900/40 px-3 py-1 rounded-md border border-indigo-500/20">
                Research Phase
              </div>
            </div>
          </div>
        </div>
      </motion.div>

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

      {/* Professional ATS Scoring Section */}
      <motion.div variants={fadeUp}>
        <ResumeInsights />
      </motion.div>

      {/* Recruiter Pulse Upgrade Modal */}
      <AnimatePresence>
        {isPulseModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPulseModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-popover border border-border rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-[#00E5FF] to-blue-500" />
              
              <div className="p-8">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#00E5FF]/20 blur-2xl rounded-full" />
                    <div className="relative p-4 rounded-2xl bg-zinc-900 border border-white/10">
                      <TrendingUp className="h-8 w-8 text-[#00E5FF]" />
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-2xl font-bold text-white tracking-tight">Unlock Recruiter Insights</h2>
                  <p className="text-zinc-400 text-sm">
                    See exactly who is viewing your work and which industry persona is winning the most clicks.
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    { label: "Company Verification", desc: "Identify visitors from top tech companies" },
                    { label: "Regional Tracking", desc: "Know where in the world your work is being viewed" },
                    { label: "Persona Performance", desc: "Compare Startup vs. Big Tech interest in real-time" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                      <div className="p-1 rounded-full bg-[#00E5FF]/10 mt-0.5">
                        <CheckCircle2 className="h-4 w-4 text-[#00E5FF]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{item.label}</p>
                        <p className="text-xs text-zinc-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={() => {
                      setIsPulseModalOpen(false);
                      navigate('/dashboard?section=billing');
                    }}
                    className="w-full h-12 bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-[#0a0a0a] font-bold rounded-xl"
                  >
                    Upgrade to Sprint Pass
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsPulseModalOpen(false)}
                    className="w-full h-12 text-zinc-500 hover:text-white"
                  >
                    Maybe later
                  </Button>
                </div>
              </div>

              <div className="px-8 py-4 bg-zinc-900/50 border-t border-white/5 text-center">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
                  Matches average job search lifecycle | No Subscription
                </p>
              </div>
            </motion.div>
          </div>
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
  checks.forEach((check) => { if (check) score += 12.5; });
  return Math.round(score);
}
