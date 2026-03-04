import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star, GitFork, Code2, ExternalLink, RefreshCw, Loader2,
    GitCommit, Zap, TrendingUp
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts';

interface GitHubRepo {
    id: number;
    name: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    html_url: string;
    updated_at: string;
    topics: string[];
}

interface GitHubEvent {
    type: string;
    repo: { name: string };
    created_at: string;
    payload: {
        commits?: { message: string }[];
        pull_request?: { title: string };
    };
}

interface CommitDay {
    day: string;
    commits: number;
}

const LANG_COLORS: Record<string, string> = {
    TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5',
    Rust: '#dea584', Go: '#00ADD8', Java: '#b07219', 'C++': '#f34b7d',
    CSS: '#563d7c', HTML: '#e34c26', Ruby: '#701516', Swift: '#F05138',
};

interface GitHubActivityFeedProps {
    username: string;
    onRefresh?: () => void;
}

export function GitHubActivityFeed({ username, onRefresh }: GitHubActivityFeedProps) {
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [events, setEvents] = useState<GitHubEvent[]>([]);
    const [commitDays, setCommitDays] = useState<CommitDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastSynced, setLastSynced] = useState<Date | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [reposRes, eventsRes] = await Promise.all([
                fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`),
                fetch(`https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=30`),
            ]);

            if (!reposRes.ok || !eventsRes.ok) throw new Error('GitHub API error');

            const reposData: GitHubRepo[] = await reposRes.json();
            const eventsData: GitHubEvent[] = await eventsRes.json();

            setRepos(reposData.filter((r) => !r.name.includes('.github.com')));
            setEvents(eventsData.filter((e) => e.type === 'PushEvent' || e.type === 'PullRequestEvent').slice(0, 8));

            // Build last-7-days commit sparkline
            const days: Record<string, number> = {};
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                days[d.toISOString().split('T')[0]] = 0;
            }
            eventsData.forEach((e) => {
                if (e.type !== 'PushEvent') return;
                const day = e.created_at.split('T')[0];
                if (day in days) days[day] += (e.payload.commits?.length || 0);
            });
            setCommitDays(Object.entries(days).map(([day, commits]) => ({ day: day.slice(5), commits })));

            setLastSynced(new Date());
            onRefresh?.();
        } catch (e) {
            setError('Failed to load GitHub data. Check the username or try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [username]);

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400 text-center">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* Sparkline + refresh */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> Commits — last 7 days
                    </p>
                    <div className="h-12 w-52">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={commitDays} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                <Bar dataKey="commits" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                                <Tooltip
                                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11 }}
                                    labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                                    cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <button
                    id="github-sync-btn"
                    onClick={fetchData}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                    <RefreshCw className="h-3 w-3" />
                    {lastSynced ? `Synced ${lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Sync'}
                </button>
            </div>

            {/* Repos grid */}
            <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Code2 className="h-3 w-3" /> Top Repositories
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {repos.map((repo, i) => (
                        <motion.a
                            key={repo.id}
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="group flex flex-col gap-2 p-3.5 rounded-xl bg-background/60 border border-border/50 hover:border-primary/30 hover:bg-background transition-all"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                    {repo.name}
                                </p>
                                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
                            </div>
                            {repo.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2">{repo.description}</p>
                            )}
                            <div className="flex items-center gap-3 mt-auto">
                                {repo.language && (
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <span
                                            className="h-2.5 w-2.5 rounded-full"
                                            style={{ background: LANG_COLORS[repo.language] || '#8b8b8b' }}
                                        />
                                        {repo.language}
                                    </span>
                                )}
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Star className="h-3 w-3" /> {repo.stargazers_count}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <GitFork className="h-3 w-3" /> {repo.forks_count}
                                </span>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>

            {/* Recent commits feed */}
            {events.length > 0 && (
                <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                        <GitCommit className="h-3 w-3" /> Recent Activity
                    </p>
                    <AnimatePresence>
                        <div className="space-y-2">
                            {events.map((ev, i) => {
                                const isPR = ev.type === 'PullRequestEvent';
                                const repoName = ev.repo.name.split('/')[1];
                                const message = isPR
                                    ? ev.payload.pull_request?.title
                                    : ev.payload.commits?.[0]?.message?.split('\n')[0];
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-muted/30 transition-colors"
                                    >
                                        <div className={`p-1.5 rounded-md shrink-0 mt-0.5 ${isPR ? 'bg-violet-500/10' : 'bg-primary/10'}`}>
                                            {isPR ? <Zap className="h-3 w-3 text-violet-500" /> : <GitCommit className="h-3 w-3 text-primary" />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-foreground truncate">{message || 'No message'}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {repoName} · {new Date(ev.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
