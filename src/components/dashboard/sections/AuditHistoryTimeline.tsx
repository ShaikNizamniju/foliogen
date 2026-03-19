import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase_v2';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ShieldCheck, Clock, ArrowRight, Zap } from 'lucide-react';

interface AuditEntry {
  id: string;
  visitor_question: string;
  ai_response: string;
  created_at: string;
}

/**
 * AuditHistoryTimeline: Renders a high-end, vertical timeline of historical recruiter audits.
 * 
 * Logic:
 * - Fetches from `chat_queries` table.
 * - Filters by `profile_user_id` and prefix `[Recruiter Audit]`.
 * - Sorts by `created_at` descending.
 */
export function AuditHistoryTimeline() {
  const { user } = useAuth();
  const [audits, setAudits] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAuditHistory = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('chat_queries')
          .select('id, visitor_question, ai_response, created_at')
          .eq('profile_user_id', user.id)
          .like('visitor_question', '[Recruiter Audit]%')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAudits((data as AuditEntry[]) || []);
      } catch (err: any) {
        console.error("[AuditHistory] Error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditHistory();
  }, [user]);

  if (loading || audits.length === 0) return null;

  return (
    <div className="mt-16 space-y-8 max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8 border-b border-border/50 pb-6">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)] border border-emerald-500/20">
          <History className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground uppercase tracking-[0.2em]">Neural Memory</h2>
          <p className="text-xs text-muted-foreground font-medium mt-0.5 uppercase tracking-wider">Historical Audit Logs & Mission Successes</p>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative space-y-10 before:absolute before:inset-y-0 before:left-4 before:w-[2px] before:bg-gradient-to-b before:from-emerald-500/40 before:via-border/40 before:to-transparent">
        <AnimatePresence mode="popLayout">
          {audits.map((audit, idx) => {
            // Extract Mission Title: "[Recruiter Audit] Title Here" -> "Title Here"
            const missionTitle = audit.visitor_question.replace(/^\[Recruiter Audit\]\s*/, '').trim() || 'Untitled Mission';
            const outcomeSnippet = audit.ai_response;

            return (
              <motion.div 
                key={audit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
                className="relative pl-12 group"
              >
                {/* Timeline Node */}
                <div className="absolute left-[13px] top-1.5 h-3 w-3 rounded-full border-2 border-emerald-500 bg-background z-10 shadow-[0_0_10px_rgba(16,185,129,0.5)] group-hover:scale-125 transition-transform duration-300" />
                
                <div className="space-y-3">
                  {/* Metadata Bar */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest shadow-sm">
                      <Zap className="h-3 w-3 fill-emerald-500/20" />
                      Mission Success
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold bg-muted/40 px-3 py-1 rounded-full border border-border/50">
                      <Clock className="h-3 w-3" />
                      {format(new Date(audit.created_at), 'MMM dd, yyyy · p')}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="relative overflow-hidden group rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-sm transition-all duration-500 hover:border-emerald-500/40 hover:bg-card/60 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1),0_0_20px_rgba(16,185,129,0.05)]">
                    {/* Subtle glass effect highlight */}
                    <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/5 blur-[50px] pointer-events-none rounded-full" />
                    
                    <h3 className="text-xl font-extrabold text-foreground mb-4 flex items-center gap-3">
                      {missionTitle}
                      <ArrowRight className="h-5 w-5 text-emerald-500/30 group-hover:text-emerald-500 group-hover:translate-x-1.5 transition-all duration-300" />
                    </h3>

                    {/* Outcome Box */}
                    <div className="relative p-5 rounded-xl bg-black/5 dark:bg-white/5 border border-emerald-500/10 italic overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-emerald-700 opacity-60" />
                      <p className="text-sm text-foreground/80 leading-relaxed font-serif relative z-10">
                        <span className="text-emerald-500 font-black not-italic mr-3 uppercase tracking-tighter text-[11px] bg-emerald-500/10 px-1.5 py-0.5 rounded shadow-sm">Outcome:</span>
                        "{outcomeSnippet}"
                      </p>
                    </div>
                    
                    {/* Footer Info */}
                    <div className="mt-5 pt-4 border-t border-border/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground uppercase font-black tracking-[0.15em]">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500/60" />
                          Neural-Hash Reconstructed
                        </div>
                        <div className="flex gap-0.5">
                          {[1,2,3].map(i => <div key={i} className="h-1 w-1 rounded-full bg-emerald-500/20" />)}
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground/30 font-mono select-none">NODE_ID::{audit.id.slice(0, 10).toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
