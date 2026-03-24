import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePro } from '@/contexts/ProContext';
import { supabase } from '@/lib/supabase_v2';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Plus, Trash2, ExternalLink, ShieldAlert, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const fadeUp = {
    hidden: { opacity: 0, y: 16, filter: 'blur(8px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { type: 'spring' as const, stiffness: 120, damping: 20 },
    },
};

export function IdentityVaultSection() {
    const { user } = useAuth();
    const { isPro } = usePro();
    const navigate = useNavigate();

    const [portfolios, setPortfolios] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modals
    const [freeWarningOpen, setFreeWarningOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [portfolioToDelete, setPortfolioToDelete] = useState<any>(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchPortfolios();
    }, [user]);

    const fetchPortfolios = async () => {
        if (!user) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('portfolios')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (data) {
            setPortfolios(data);
        }
        setLoading(false);
    };

    const handleCopyLink = async (portfolio: Record<string, unknown>) => {
        // Prefer the professional sequential slug (/u/{custom_slug})
        const customSlug = portfolio.custom_slug as string | undefined;
        if (customSlug) {
            const url = `https://www.foliogen.in/u/${customSlug}`;
            await navigator.clipboard.writeText(url);
            toast({
                title: 'Link Copied! 🎉',
                description: `Ready to share your professional story.`,
            });
            return;
        }

        // Fallback to legacy URL format
        const slug = portfolio.slug as string;
        const { data: profile } = await supabase.from('profiles').select('username').eq('user_id', user?.id).single();
        const identifier = profile?.username || user?.id;
        const url = slug === 'default'
            ? `https://www.foliogen.in/p/${identifier}`
            : `https://www.foliogen.in/p/${identifier}/${slug}`;

        await navigator.clipboard.writeText(url);
        toast({
            title: 'Link Copied! 🎉',
            description: 'Ready to share your professional story.',
        });
    };

    const handleGenerateClick = () => {
        // All users are treated as Pro in Beta
        navigate('/dashboard?section=profile');
        toast({
            title: 'New Identity',
            description: 'Update your data and click Publish to create a new portfolio slug.',
        });
    };

    const confirmDelete = (portfolio: any) => {
        setPortfolioToDelete(portfolio);
        setDeleteConfirmText('');
        setDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        if (!portfolioToDelete || deleteConfirmText !== portfolioToDelete.slug) return;
        setIsDeleting(true);

        const { error } = await supabase
            .from('portfolios')
            .delete()
            .eq('id', portfolioToDelete.id);

        setIsDeleting(false);

        if (error) {
            toast({ title: 'Error', description: 'Failed to delete portfolio', variant: 'destructive' });
        } else {
            toast({ title: 'Deleted', description: 'Portfolio identity destroyed.' });
            setDeleteModalOpen(false);
            setPortfolios(p => p.filter(x => x.id !== portfolioToDelete.id));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-4xl font-instrument text-foreground tracking-tight">Identity Vault</h1>
                    <Button
                        onClick={handleGenerateClick}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-glow transition-all"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Generate New Identity
                    </Button>
                </div>
                <p className="text-muted-foreground">Manage your deployed portfolio instances and custom links.</p>
            </motion.div>

            {portfolios.length === 0 ? (
                <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center py-20 border border-border rounded-2xl bg-card">
                    <ShieldAlert className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-instrument text-foreground mb-2">No active identities found</h3>
                    <p className="text-muted-foreground mb-2 max-w-md mx-auto">You haven't published any portfolios yet. Head over to the Profile section to build and deploy your first identity.</p>
                    <p className="text-xs text-muted-foreground/60 mb-6">Your portfolio goes live instantly with a shareable link.</p>
                    <Button onClick={handleGenerateClick} variant="outline" className="border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-400">
                        Publish Your First Portfolio →
                    </Button>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {portfolios.map((portfolio, i) => (
                            <motion.div
                                key={portfolio.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-indigo-500/50 transition-all duration-300"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h3 className="text-xl font-instrument text-foreground capitalize mb-1">
                                                {portfolio.template_name.replace('-', ' ')}
                                            </h3>
                                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                Live
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            disabled={portfolios.length <= 1}
                                            onClick={() => confirmDelete(portfolio)}
                                            className="text-muted-foreground hover:text-red-400 hover:bg-red-400/10 -mr-2 -mt-2 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                                            title={portfolios.length <= 1 ? "Cannot delete the last remaining identity" : "Destroy Identity"}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Professional URL</div>
                                            <div className="font-mono text-sm text-indigo-300 bg-indigo-500/5 px-3 py-2 rounded-lg border border-indigo-500/10 truncate">
                                                {portfolio.custom_slug
                                                    ? <>foliogen.in/u/<span className="font-bold text-primary">{portfolio.custom_slug}</span></>
                                                    : <>/{portfolio.slug}</>
                                                }
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleCopyLink(portfolio)}
                                                className="w-full bg-secondary border-border text-foreground/80 hover:bg-accent hover:text-foreground"
                                            >
                                                <Copy className="h-3.5 w-3.5 mr-2" />
                                                Copy Link
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                                className="w-full bg-secondary border-border text-foreground/80 hover:bg-accent hover:text-foreground"
                                            >
                                                <a
                                                    href={portfolio.custom_slug ? `/u/${portfolio.custom_slug}` : `/p/${user?.id}/${portfolio.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <ExternalLink className="h-3.5 w-3.5 mr-2" />
                                                    View Site
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative glow */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}



            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent className="border-red-900/30 bg-card text-foreground sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-instrument text-2xl text-red-500">Destroy Identity</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            This action cannot be undone. This will permanently delete the portfolio instance at <strong className="text-foreground uppercase font-mono tracking-wider px-1 bg-muted rounded">{portfolioToDelete?.slug}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-3">
                        <Label className="text-muted-foreground">Type the slug name to confirm</Label>
                        <Input
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            placeholder={portfolioToDelete?.slug}
                            className="bg-muted border-border focus-visible:ring-red-500 font-mono"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={executeDelete}
                            disabled={deleteConfirmText !== portfolioToDelete?.slug || isDeleting}
                            className="bg-red-600 hover:bg-red-700 font-medium"
                        >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Permanently Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
