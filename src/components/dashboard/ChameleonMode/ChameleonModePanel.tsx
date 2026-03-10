import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wand2, Link2, Loader2, CheckCircle2, AlertTriangle,
    Briefcase, Brain, ArrowRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase_v2';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { toast } from 'sonner';

interface TailoredResult {
    id: string;
    tailored_bio: string;
    emphasized_skills: string[];
    match_score: number;
    reordered_sections: string[];
}

interface ChameleonModePanelProps {
    onGenerated?: (id: string, score: number) => void;
}

/**
 * ChameleonModePanel
 * Allows the user to paste a Job URL or raw JD text and get an AI-tailored
 * portfolio overlay. Uses a Gemini mock (or real Supabase edge fn when deployed).
 * Saves result to `chameleon_profiles` table.
 */
export function ChameleonModePanel({ onGenerated }: ChameleonModePanelProps) {
    const { user } = useAuth();
    const { profile } = useProfile();
    const [mode, setMode] = useState<'url' | 'text'>('url');
    const [jobUrl, setJobUrl] = useState('');
    const [jdText, setJdText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<TailoredResult | null>(null);

    const handleGenerate = async () => {
        if (!user?.id) return;
        const input = mode === 'url' ? jobUrl.trim() : jdText.trim();
        if (!input) return;

        setLoading(true);
        setResult(null);

        try {
            // ------------------------------------------------------------------
            // Attempt real Supabase Edge Function; fall back to smart mock on error.
            // To deploy the real function: supabase functions new chameleon-tailor
            // ------------------------------------------------------------------
            let tailoredResult: Omit<TailoredResult, 'id'> | null = null;

            try {
                const { data, error } = await supabase.functions.invoke('chameleon-tailor', {
                    body: {
                        profile: { bio: profile?.bio, skills: profile?.skills, headline: profile?.headline },
                        job_url: mode === 'url' ? input : undefined,
                        jd_text: mode === 'text' ? input : undefined,
                    },
                });
                if (!error && data) tailoredResult = data;
            } catch {
                /* Edge function not deployed — use demo mock */
            }

            if (!tailoredResult) {
                // Smart demo mock — extracts keywords from JD text or uses generic data
                const keywords = input.toLowerCase().match(/\b(react|node|python|typescript|aws|design|ux|ai|ml|backend|frontend|fullstack|product|data|cloud)\b/g) || [];
                const uniqueKw = [...new Set(keywords)].slice(0, 5);
                const skills = profile?.skills || [];
                const matchingSkills = skills.filter((s) =>
                    uniqueKw.some((k) => s.toLowerCase().includes(k))
                );
                const score = Math.min(95, 55 + matchingSkills.length * 8 + uniqueKw.length * 3);

                tailoredResult = {
                    tailored_bio: `Experienced professional with a strong background in ${uniqueKw.slice(0, 3).join(', ') || 'software development'}. Proven track record of delivering high-impact projects. ${profile?.bio?.split('.')[0] || 'Passionate about building great products.'}.`,
                    emphasized_skills: matchingSkills.length > 0 ? matchingSkills.slice(0, 6) : skills.slice(0, 4),
                    match_score: score,
                    reordered_sections: ['hero', 'skills', 'projects', 'experience', 'education'],
                };
            }

            // Save to chameleon_profiles
            const { data: saved, error: saveErr } = await supabase
                .from('chameleon_profiles' as any)
                .insert({
                    user_id: user.id,
                    job_url: mode === 'url' ? input : null,
                    jd_text: mode === 'text' ? input : null,
                    tailored_bio: tailoredResult.tailored_bio,
                    emphasized_skills: tailoredResult.emphasized_skills,
                    match_score: tailoredResult.match_score,
                    reordered_sections: tailoredResult.reordered_sections,
                } as any)
                .select('id')
                .single();

            if (saveErr || !saved) {
                // Table not yet created — show result without persistence
                const tempId = crypto.randomUUID();
                setResult({ id: tempId, ...tailoredResult });
                onGenerated?.(tempId, tailoredResult.match_score);
                toast.warning('Chameleon result generated (table not yet migrated — run SQL migration to persist).');
            } else {
                const newId = (saved as any).id;
                setResult({ id: newId, ...tailoredResult });
                onGenerated?.(newId, tailoredResult.match_score);
                toast.success('Chameleon profile created!');
            }
        } catch (e) {
            toast.error('Failed to generate tailored profile.');
        } finally {
            setLoading(false);
        }
    };

    const scoreColor = !result ? '' : result.match_score >= 80
        ? 'text-emerald-400' : result.match_score >= 60 ? 'text-amber-400' : 'text-red-400';

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className="rounded-2xl border border-border bg-gradient-to-br from-card via-card to-blue-500/5 p-6 space-y-5"
        >
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/15">
                    <Wand2 className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                    <h3 className="font-semibold text-foreground">Chameleon Mode</h3>
                    <p className="text-xs text-muted-foreground">AI re-tailors your portfolio for any job listing</p>
                </div>
            </div>

            {/* Mode toggle */}
            <div className="flex gap-2 p-1 bg-muted/50 rounded-xl">
                {(['url', 'text'] as const).map((m) => (
                    <button
                        key={m}
                        id={`chameleon-mode-${m}`}
                        onClick={() => setMode(m)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg transition-all ${mode === m ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {m === 'url' ? <Link2 className="h-3 w-3" /> : <Briefcase className="h-3 w-3" />}
                        {m === 'url' ? 'Job URL' : 'Paste JD'}
                    </button>
                ))}
            </div>

            {/* Input */}
            {mode === 'url' ? (
                <input
                    id="chameleon-url-input"
                    type="url"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    placeholder="https://jobs.lever.co/company/role or LinkedIn URL…"
                    className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
            ) : (
                <textarea
                    id="chameleon-jd-input"
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    placeholder="Paste the full job description here…"
                    rows={5}
                    className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
                />
            )}

            <button
                id="chameleon-generate-btn"
                onClick={handleGenerate}
                disabled={loading || (mode === 'url' ? !jobUrl.trim() : !jdText.trim())}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Tailoring with AI…</>
                ) : (
                    <><Brain className="h-4 w-4" /> Generate Chameleon Profile</>
                )}
            </button>

            {/* Result */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4 pt-2 border-t border-border"
                    >
                        {/* Match score */}
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground font-medium">Match Score</span>
                            <span className={`text-2xl font-black ${scoreColor}`}>{result.match_score}%</span>
                        </div>

                        {/* Tailored bio preview */}
                        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50">
                            <p className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Tailored Bio
                            </p>
                            <p className="text-sm text-foreground leading-relaxed">{result.tailored_bio}</p>
                        </div>

                        {/* Emphasized skills */}
                        {result.emphasized_skills.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                                    <ArrowRight className="h-3 w-3" /> Highlighted Skills
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {result.emphasized_skills.map((skill) => (
                                        <span key={skill} className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                            <span>This is a <strong>temporary overlay</strong> — your stored portfolio data is unchanged.</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
