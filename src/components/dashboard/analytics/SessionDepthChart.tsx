import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';
import { TrendingUp, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SessionRow {
    session_id: string;
    max_section_index: number;
}

const SECTION_ORDER = ['hero', 'skills', 'experience', 'projects', 'education', 'contact'];

type DateRange = '7d' | '30d';

export function SessionDepthChart() {
    const { user } = useAuth();
    const [data, setData] = useState<{ section: string; pct: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState<DateRange>('7d');

    useEffect(() => {
        if (!user?.id) { setLoading(false); return; }

        const fetchDepth = async () => {
            setLoading(true);
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - (range === '7d' ? 7 : 30));

            const { data: rows, error } = await supabase
                .from('section_events' as any)
                .select('session_id, section_id, time_spent_ms')
                .eq('profile_user_id', user.id)
                .gte('first_seen_at', cutoff.toISOString()) as any;

            if (error || !rows) { setLoading(false); return; }

            // Calculate avg time per section
            const totals: Record<string, { total: number; count: number }> = {};
            (rows as any[]).forEach((row) => {
                if (!totals[row.section_id]) totals[row.section_id] = { total: 0, count: 0 };
                totals[row.section_id].total += row.time_spent_ms;
                totals[row.section_id].count += 1;
            });

            const maxTime = Math.max(...Object.values(totals).map((t) => t.total / t.count), 1);
            const chartData = SECTION_ORDER.map((s) => ({
                section: s.charAt(0).toUpperCase() + s.slice(1),
                pct: totals[s] ? Math.round((totals[s].total / totals[s].count / maxTime) * 100) : 0,
            }));

            setData(chartData);
            setLoading(false);
        };

        fetchDepth();
    }, [user?.id, range]);

    const barColor = (pct: number) =>
        pct >= 70 ? '#22c55e' : pct >= 40 ? '#f59e0b' : '#6366f1';

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card p-6"
        >
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10">
                        <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground text-sm">Section Engagement</h3>
                        <p className="text-xs text-muted-foreground">Average dwell time per section</p>
                    </div>
                </div>
                <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
                    {(['7d', '30d'] as DateRange[]).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-all ${range === r ? 'bg-card shadow-sm text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Calendar className="h-3 w-3" /> {r}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : data.every((d) => d.pct === 0) ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                    <TrendingUp className="h-8 w-8 text-muted-foreground/40 mb-2" />
                    <p className="text-sm text-muted-foreground">No session data yet</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Share your portfolio to start collecting data</p>
                </div>
            ) : (
                <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                            <XAxis dataKey="section" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} unit="%" />
                            <Tooltip
                                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 10, fontSize: 12 }}
                                formatter={(v: number) => [`${v}%`, 'Engagement']}
                                cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                            />
                            <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
                                {data.map((entry, i) => (
                                    <Cell key={i} fill={barColor(entry.pct)} fillOpacity={0.85} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </motion.div>
    );
}
