import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { handleLsPayment as handlePayment } from '@/lib/payment-lemonsqueezy';
import { useAuth } from '@/contexts/AuthContext';
import { usePro } from '@/contexts/ProContext';
import { Timer, Sparkles, CheckCircle2 } from 'lucide-react';

export function ProUpsellBanner() {
    const { user } = useAuth();
    const { refreshProStatus } = usePro();
    const [timeLeft, setTimeLeft] = useState(15 * 60);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleUpgrade = async () => {
        if (!user) return;
        try {
            await handlePayment(
                { id: user.id, email: user.email, name: user.user_metadata?.full_name },
                'PRO',
                () => refreshProStatus()
            );
        } catch (error) {
        }
    };

    return (
        <div className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/10 via-background to-amber-500/10 p-6 md:p-8 mt-6 mb-8 w-full max-w-5xl mx-auto shadow-xl">
            {/* Red Ribbon Badge */}
            <div className="absolute top-5 -right-14 rotate-45 bg-red-600 text-white text-[10px] font-bold py-1 px-14 shadow-lg z-10 hidden sm:block">
                SAVE $1,188
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-500">
                        <Timer className="h-4 w-4 animate-pulse" />
                        Offer expires in: <span className="font-mono">{formatTime(timeLeft)}</span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                        Unlock the Professional AI Suite
                    </h2>

                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> All Premium & Domain-Specific Templates</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> AI Interview Prep & Career Analytics</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Custom Subdomain & No Foliogen Branding</li>
                    </ul>
                </div>

                <div className="flex flex-col items-center md:items-end justify-center space-y-4">
                    <div className="flex flex-col items-center md:items-end">
                        <span className="text-sm font-medium text-muted-foreground line-through decoration-red-500/50">$499/year</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold text-foreground">$199</span>
                            <span className="text-sm text-muted-foreground font-medium">/ year</span>
                        </div>
                        <p className="text-emerald-500 text-xs font-bold mt-1">60% OFF Launch Promo</p>
                    </div>

                    <Button
                        onClick={handleUpgrade}
                        size="lg"
                        className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all hover:scale-105 rounded-xl px-8"
                    >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Claim 60% OFF Now
                    </Button>
                    <p className="text-[10px] text-muted-foreground text-center">Secure 256-bit automated processing</p>
                </div>
            </div>
        </div>
    );
}
