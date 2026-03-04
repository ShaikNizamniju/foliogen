import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Loader2, Map } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const SECTIONS = [
    { id: 'hero', label: 'Hero / Intro' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' },
];

interface SectionStat {
    section_id: string;
    avg_time: number;
    visit_count: number;
}

function getHeatColor(normalized: number): string {
    // 0 = cold blue, 0.5 = warm amber, 1 = hot red
    if (normalized < 0.2) return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
    if (normalized < 0.4) return 'bg-cyan-500/15 border-cyan-500/25 text-cyan-400';
    if (normalized < 0.6) return 'bg-amber-500/15 border-amber-500/25 text-amber-400';
    if (normalized < 0.80) return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
    return 'bg-red-500/20 border-red-500/30 text-red-400';
}

function getHeatLabel(normalized: number): string {
    if (normalized < 0.2) return 'Cold';
    if (normalized < 0.4) return 'Light';
    if (normalized < 0.6) return 'Warm';
    if (normalized < 0.8) return 'Hot';
    return '🔥 Hottest';
}

export function SectionHeatmap() {
    const { user } = useAuth();
    const [stats, setStats] = useState<SectionStat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) { setLoading(false); return; }

        supabase
            .from('section_events' as any)
            .select('section_id, time_spent_ms')
            .eq('profile_user_id', user.id)
            .then(({ data, error }) => {
                if (error || !data) { setLoading(false); return; }

                const agg: Record<string, { total: number; count: number }> = {};
                (data as any[]).forEach((row) => {
                    if (!agg[row.section_id]) agg[row.section_id] = { total: 0, count: 0 };
                    agg[row.section_id].total += row.time_spent_ms;
                    agg[row.section_id].count += 1;
                });

                const result = SECTIONS.map((s) => ({
                    section_id: s.id,
                    avg_time: agg[s.id] ? agg[s.id].total / agg[s.id].count : 0,
                    visit_count: agg[s.id]?.count || 0,
                }));

                setStats(result);
                setLoading(false);
            });
    }, [user?.id]);

    const maxAvg = Math.max(...stats.map((s) => s.avg_time), 1);
    const hasData = stats.some((s) => s.visit_count > 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-6"
        >
            <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-orange-500/15">
                    <Flame className="h-4 w-4 text-orange-400" />
                </div>
                <div>
                    <h3 className="font-semibold text-foreground text-sm">Section Heatmap</h3>
                    <p className="text-xs text-muted-foreground">Where recruiters spend the most time</p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : !hasData ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                    <Map className="h-8 w-8 text-muted-foreground/40 mb-2" />
                    <p className="text-sm text-muted-foreground">No heatmap data yet</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Scroll events are collected when visitors browse your portfolio</p>
                </div>
            ) : (
                <div className="space-y-2.5">
                    {SECTIONS.map((section) => {
                        const stat = stats.find((s) => s.section_id === section.id);
                        const normalized = stat ? stat.avg_time / maxAvg : 0;
                        const colorClass = getHeatColor(normalized);
                        const label = getHeatLabel(normalized);
                        const seconds = stat ? (stat.avg_time / 1000).toFixed(1) : '0.0';

                        return (
                            <motion.div
                                key={section.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`flex items-center gap-3 p-3 rounded-xl border ${colorClass} transition-all`}
                            >
                                {/* Width bar */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium">{section.label}</span>
                                        <span className="text-xs opacity-70">{label}</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-current/10">
                                        <motion.div
                                            className="h-full rounded-full bg-current"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${normalized * 100}%` }}
                                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                                        />
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xs font-bold">{seconds}s</p>
                                    <p className="text-xs opacity-60">{stat?.visit_count || 0} views</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Legend */}
            <div className="flex items-center gap-3 mt-4 justify-center">
                {['Cold', 'Light', 'Warm', 'Hot', '🔥'].map((label, i) => (
                    <div key={i} className="flex items-center gap-1">
                        <div className={`h-2.5 w-2.5 rounded-full ${['bg-blue-400', 'bg-cyan-400', 'bg-amber-400', 'bg-orange-400', 'bg-red-400'][i]}`} />
                        <span className="text-xs text-muted-foreground">{label}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
