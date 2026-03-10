import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, CheckCircle2, Loader2, RefreshCw, AlertCircle, Unlink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface GitHubConnectCardProps {
    currentUsername?: string | null;
    onConnected: (username: string | null) => void;
}

export function GitHubConnectCard({ currentUsername, onConnected }: GitHubConnectCardProps) {
    const { user } = useAuth();
    const [input, setInput] = useState(currentUsername || '');
    const [saving, setSaving] = useState(false);
    const [validating, setValidating] = useState(false);

    const validateAndSave = async () => {
        const trimmed = input.trim().replace(/^@/, '');
        if (!trimmed || !user?.id) return;

        setValidating(true);
        // Validate username against GitHub public API
        try {
            const res = await fetch(`https://api.github.com/users/${encodeURIComponent(trimmed)}`);
            if (!res.ok) {
                toast.error('GitHub user not found. Please check the username.');
                setValidating(false);
                return;
            }
        } catch {
            toast.error('Could not reach GitHub API. Please try again.');
            setValidating(false);
            return;
        }
        setValidating(false);
        setSaving(true);

        const { error } = await supabase
            .from('profiles')
            .update({ github_username: trimmed } as any)
            .eq('user_id', user.id);

        setSaving(false);
        if (error) {
            toast.error('Failed to save GitHub username.');
        } else {
            toast.success(`GitHub connected: @${trimmed}`);
            onConnected(trimmed);
        }
    };

    const disconnect = async () => {
        if (!user?.id) return;
        setSaving(true);
        await supabase.from('profiles').update({ github_username: null } as any).eq('user_id', user.id);
        setSaving(false);
        onConnected(null);
        setInput('');
        toast.success('GitHub disconnected.');
    };

    const isConnected = !!currentUsername;
    const isLoading = saving || validating;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className="rounded-2xl border border-border bg-gradient-to-br from-card via-card to-emerald-500/5 p-6"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-[#1a1a2e]/80 border border-[#30363d]">
                    <Github className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h3 className="font-semibold text-foreground">GitHub Integration</h3>
                    <p className="text-xs text-muted-foreground">Auto-sync your proof of work from GitHub</p>
                </div>
                {isConnected && (
                    <span className="ml-auto flex items-center gap-1 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" /> Connected
                    </span>
                )}
            </div>

            {isConnected ? (
                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/50">
                        <img
                            src={`https://github.com/${currentUsername}.png?size=40`}
                            alt={currentUsername!}
                            className="h-8 w-8 rounded-full border border-border"
                            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${currentUsername}&background=random`; }}
                        />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">@{currentUsername}</p>
                            <p className="text-xs text-muted-foreground">github.com/{currentUsername}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => { setInput(currentUsername || ''); onConnected(null); }}
                            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm rounded-xl border border-border text-foreground hover:bg-muted/50 transition-colors"
                        >
                            <RefreshCw className="h-3.5 w-3.5" /> Change
                        </button>
                        <button
                            onClick={disconnect}
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <Unlink className="h-3.5 w-3.5" /> Disconnect
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                            <input
                                id="github-username-input"
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && validateAndSave()}
                                placeholder="your-github-username"
                                className="w-full pl-7 pr-3 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                            />
                        </div>
                        <button
                            id="github-connect-btn"
                            onClick={validateAndSave}
                            disabled={!input.trim() || isLoading}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />}
                            {validating ? 'Validating…' : saving ? 'Saving…' : 'Connect'}
                        </button>
                    </div>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        Only public GitHub data will be fetched. No OAuth required.
                    </p>
                </div>
            )}
        </motion.div>
    );
}
