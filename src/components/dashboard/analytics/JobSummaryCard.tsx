import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Briefcase, MessageSquare, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface JobSummary {
  interviewing: number;
  applied: number;
  offers: number;
}

export function JobSummaryCard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<JobSummary>({ interviewing: 0, applied: 0, offers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchSummary = async () => {
      const { data, error } = await supabase
        .from('job_applications')
        .select('status')
        .eq('user_id', user.id);

      if (!error && data) {
        setSummary({
          interviewing: data.filter((j) => j.status === 'interviewing').length,
          applied: data.filter((j) => j.status === 'applied').length,
          offers: data.filter((j) => j.status === 'offer').length,
        });
      }
      setLoading(false);
    };

    fetchSummary();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="h-16 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  const hasActivity = summary.interviewing > 0 || summary.applied > 0 || summary.offers > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className="rounded-2xl border border-border bg-gradient-to-br from-card via-card to-violet-500/5 p-6 overflow-hidden relative"
    >
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div 
              className="p-2.5 rounded-xl bg-violet-500/20 backdrop-blur-sm"
              whileHover={{ scale: 1.15, rotate: -10 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Briefcase className="h-5 w-5 text-violet-500" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-foreground">Job Tracker</h3>
              <p className="text-xs text-muted-foreground">Your application pipeline</p>
            </div>
          </div>
          <Link 
            to="/dashboard?section=jobs"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            View All
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Summary */}
        {hasActivity ? (
          <div className="space-y-2">
            {summary.interviewing > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <MessageSquare className="h-4 w-4 text-amber-500" />
                <span className="text-foreground">
                  <strong>{summary.interviewing}</strong> active interview{summary.interviewing !== 1 ? 's' : ''}
                </span>
                <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs">
                  Hot
                </Badge>
              </div>
            )}
            {summary.applied > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{summary.applied} application{summary.applied !== 1 ? 's' : ''} pending</span>
              </div>
            )}
            {summary.offers > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-emerald-500 font-medium">🎉 {summary.offers} offer{summary.offers !== 1 ? 's' : ''}!</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No job applications yet. Start tracking your job hunt!
          </p>
        )}
      </div>
    </motion.div>
  );
}
