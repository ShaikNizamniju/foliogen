import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Briefcase, User, Target, Flame, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface VisitLog {
  id: string;
  company_name: string | null;
  role_target: string | null;
  created_at: string;
}

export function RecruiterRadar() {
  const { user } = useAuth();
  const [visits, setVisits] = useState<VisitLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchVisits = async () => {
      const { data, error } = await supabase
        .from('visit_logs')
        .select('id, company_name, role_target, created_at')
        .eq('profile_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('[RecruiterRadar] Error fetching visits:', error);
      } else {
        setVisits(data || []);
      }
      setLoading(false);
    };

    fetchVisits();
  }, [user?.id]);

  // Check if visit is within last 24 hours (hot lead)
  const isHotLead = (createdAt: string) => {
    const visitTime = new Date(createdAt).getTime();
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return now - visitTime < twentyFourHours;
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 bg-muted animate-pulse rounded-xl" />
          <div className="h-5 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className="rounded-2xl border border-border bg-gradient-to-br from-card via-card to-amber-500/5 p-6 overflow-hidden relative"
    >
      {/* Subtle background pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <motion.div 
            className="p-2.5 rounded-xl bg-amber-500/20 backdrop-blur-sm"
            whileHover={{ scale: 1.15, rotate: -10 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Target className="h-5 w-5 text-amber-500" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-foreground">Recruiter Radar</h3>
            <p className="text-xs text-muted-foreground">Track personalized link visits</p>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {visits.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6"
            >
              <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-3">
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">No tracked visits yet</p>
              <p className="text-xs text-muted-foreground/70">
                Share a <code className="text-primary bg-primary/10 px-1 py-0.5 rounded">?company=</code> link to start tracking!
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {visits.map((visit, index) => (
                <motion.div
                  key={visit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/50 hover:bg-background/80 transition-colors"
                >
                  {/* Icon */}
                  <div className={`p-2 rounded-lg ${visit.company_name ? 'bg-primary/10' : 'bg-violet-500/10'}`}>
                    {visit.company_name ? (
                      <Briefcase className="h-4 w-4 text-primary" />
                    ) : (
                      <User className="h-4 w-4 text-violet-500" />
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      <span className="font-semibold">
                        {visit.company_name || visit.role_target || 'Unknown'}
                      </span>
                      {' '}
                      <span className="text-muted-foreground font-normal">
                        visited your portfolio
                      </span>
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <Clock className="h-3 w-3" />
                      <span>{formatDistanceToNow(new Date(visit.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>

                  {/* Hot Lead Badge */}
                  {isHotLead(visit.created_at) && (
                    <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 border-orange-500/20 gap-1">
                      <Flame className="h-3 w-3" />
                      Hot
                    </Badge>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
