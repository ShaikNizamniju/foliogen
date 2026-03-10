import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Eye, TrendingUp, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase_v2';
import { useAuth } from '@/contexts/AuthContext';
import { RecruiterRadar } from './RecruiterRadar';
import { SessionDepthChart } from './SessionDepthChart';
import { SectionHeatmap } from './SectionHeatmap';

export function AnalyticsDashboard() {
    const { user } = useAuth();
    const [totalViews, setTotalViews] = useState<number | null>(null);
    const [viewTrend, setViewTrend] = useState<number>(0);

    useEffect(() => {
        if (!user?.id) return;
        supabase
            .from('profiles_public')
            .select('views')
            .eq('user_id', user.id)
            .maybeSingle()
            .then(({ data }) => {
                if (data) setTotalViews((data as any).views || 0);
            });
    }, [user?.id]);

    const statCards = [
        {
            id: 'total-views-stat',
            label: 'Total Portfolio Views',
            value: totalViews !== null ? totalViews.toLocaleString() : '—',
            icon: Eye,
            color: 'text-primary',
            bg: 'bg-primary/10',
            sub: 'All time',
        },
        {
            id: 'section-tracking-stat',
            label: 'Section Tracking',
            value: 'Live',
            icon: TrendingUp,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            sub: 'IntersectionObserver active',
        },
        {
            id: 'recruiter-intel-stat',
            label: 'Recruiter Intel',
            value: 'Enabled',
            icon: Users,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            sub: '?company=&role= tracking',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                    <BarChart2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h2 className="font-bold text-foreground text-lg">Analytics</h2>
                    <p className="text-xs text-muted-foreground">Track how recruiters engage with your portfolio</p>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statCards.map((card, i) => (
                    <motion.div
                        key={card.id}
                        id={card.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="rounded-2xl border border-border bg-card p-4"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <div className={`p-2 rounded-lg ${card.bg}`}>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </div>
                            <span className="text-xs text-muted-foreground">{card.label}</span>
                        </div>
                        <p className={`text-2xl font-black ${card.color}`}>{card.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SessionDepthChart />
                <SectionHeatmap />
            </div>

            {/* Recruiter Radar */}
            <RecruiterRadar />
        </div>
    );
}
