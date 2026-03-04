import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link2, Copy, Check, QrCode, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';

interface ChameleonLinkGeneratorProps {
    chameleonId: string;
    matchScore?: number;
    jobLabel?: string;
}

export function ChameleonLinkGenerator({
    chameleonId,
    matchScore,
    jobLabel,
}: ChameleonLinkGeneratorProps) {
    const { profile } = useProfile();
    const { user } = useAuth();
    const [copied, setCopied] = useState(false);
    const [showQR, setShowQR] = useState(false);

    const username = (profile as any)?.username || user?.id || '';
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://foliogen.app';
    const link = `${baseUrl}/${username}?chameleon=${chameleonId}`;

    const copy = async () => {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success('Chameleon link copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="rounded-2xl border border-primary/20 bg-gradient-to-br from-blue-500/5 via-violet-500/5 to-card p-5 space-y-4"
        >
            <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Shareable Chameleon Link</span>
                {matchScore !== undefined && (
                    <span className="ml-auto text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                        {matchScore}% match
                    </span>
                )}
            </div>

            {jobLabel && (
                <p className="text-xs text-muted-foreground truncate">For: {jobLabel}</p>
            )}

            <div className="p-3 rounded-xl bg-background/60 border border-border/50">
                <p className="text-xs font-mono text-foreground break-all leading-relaxed">{link}</p>
            </div>

            <div className="flex gap-2">
                <button
                    id="chameleon-copy-link-btn"
                    onClick={copy}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy Link'}
                </button>
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 px-3 text-sm rounded-xl border border-border hover:bg-muted/50 transition-colors"
                >
                    <ExternalLink className="h-4 w-4" />
                </a>
                <button
                    onClick={() => setShowQR(!showQR)}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 text-sm rounded-xl border border-border hover:bg-muted/50 transition-colors"
                >
                    <QrCode className="h-4 w-4" />
                </button>
            </div>

            {showQR && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex justify-center"
                >
                    <div className="p-4 bg-white rounded-2xl shadow-lg">
                        <QRCodeSVG value={link} size={140} level="M" />
                    </div>
                </motion.div>
            )}

            <p className="text-xs text-muted-foreground text-center">
                Share this link with recruiters — they'll see your AI-tailored portfolio
            </p>
        </motion.div>
    );
}
