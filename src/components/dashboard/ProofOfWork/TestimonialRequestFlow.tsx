import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareHeart, Copy, Check, QrCode, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';

export function TestimonialRequestFlow() {
    const { user } = useAuth();
    const { profile } = useProfile();
    const [requesterName, setRequesterName] = useState('');
    const [copied, setCopied] = useState(false);
    const [showQR, setShowQR] = useState(false);

    const username = (profile as any)?.username || user?.id || '';
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://foliogen.app';
    const link = `${baseUrl}/${username}?testimonial=1${requesterName.trim() ? `&from=${encodeURIComponent(requesterName.trim())}` : ''}`;

    const copyLink = async () => {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.1 }}
            className="rounded-2xl border border-border bg-gradient-to-br from-card via-card to-violet-500/5 p-6"
        >
            <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-violet-500/15">
                    <MessageSquareHeart className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                    <h3 className="font-semibold text-foreground">Testimonial Request</h3>
                    <p className="text-xs text-muted-foreground">Generate a "Vouch for Me" link to share</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        Who are you requesting from? <span className="text-muted-foreground/50">(optional)</span>
                    </label>
                    <input
                        id="testimonial-requester-input"
                        type="text"
                        value={requesterName}
                        onChange={(e) => setRequesterName(e.target.value)}
                        placeholder="e.g. John Smith, Acme Corp"
                        className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    />
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">Generated link</p>
                    <p className="text-xs font-mono text-foreground break-all leading-relaxed">{link}</p>
                </div>

                <div className="flex gap-2">
                    <button
                        id="testimonial-copy-btn"
                        onClick={copyLink}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                    <button
                        onClick={() => setShowQR(!showQR)}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 text-sm rounded-xl border border-border hover:bg-muted/50 transition-colors"
                    >
                        <QrCode className="h-4 w-4" />
                    </button>
                    {typeof navigator !== 'undefined' && 'share' in navigator && (
                        <button
                            onClick={() => (navigator as any).share({ url: link, title: 'Vouch for me on Foliogen' })}
                            className="flex items-center justify-center gap-2 py-2.5 px-4 text-sm rounded-xl border border-border hover:bg-muted/50 transition-colors"
                        >
                            <Share2 className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {showQR && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex justify-center pt-2"
                    >
                        <div className="p-4 bg-white rounded-2xl shadow-lg">
                            <QRCodeSVG value={link} size={140} level="M" />
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
