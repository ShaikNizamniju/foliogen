import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { handlePayment, PlanKey } from '@/lib/payment';
import { useAuth } from '@/contexts/AuthContext';
import { usePro } from '@/contexts/ProContext';
import { Timer, Sparkles, CheckCircle2 } from 'lucide-react';
import { SecureCheckoutModal } from '../SecureCheckoutModal';

export function ProUpsellBanner() {
    const { user } = useAuth();
    const { refreshProStatus } = usePro();
    const [timeLeft, setTimeLeft] = useState(15 * 60);
    const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string>('Pro');

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

    const handleUpgrade = async (planKey: PlanKey, planName: string) => {
        if (!user) return;
        try {
            await handlePayment(
                { id: user.id, email: user.email, name: user.user_metadata?.full_name },
                planKey,
                () => refreshProStatus()
            );
        } catch (error: any) {
            if (error?.message === 'STRIPE_NOT_CONFIGURED') {
                setSelectedPlan(planName);
                setCheckoutModalOpen(true);
            }
        }
    };

    return (
        <>
            <div className="relative overflow-hidden rounded-2xl border border-[#4f46e5]/30 bg-gradient-to-br from-[#4f46e5]/10 via-background to-[#4f46e5]/5 p-6 md:p-8 mt-6 mb-8 w-full max-w-5xl mx-auto shadow-[0_0_30px_rgba(79,70,229,0.15)]">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-[#4f46e5]" />
                            Unlock the Professional AI Suite
                        </h2>
                        <p className="text-sm text-muted-foreground mt-2">
                            Join 12,400+ narrative architects engineering their professional legacy.
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-1.5 text-sm font-medium text-red-500 border border-red-500/20">
                        <Timer className="h-4 w-4 animate-pulse" />
                        Offer expires in: <span className="font-mono tracking-wider">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Basic Tier */}
                    <div className="relative p-6 rounded-xl border border-white/5 bg-black/40 hover:bg-black/60 transition-all flex flex-col h-full group">
                        <div className="absolute top-0 right-0 bg-white/10 text-white text-[10px] font-bold py-1 px-4 rounded-bl-lg tracking-wider">
                            LAUNCH60
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-white">Basic</h3>

                        <div className="flex flex-col mb-6">
                            <span className="text-sm font-medium text-muted-foreground line-through decoration-red-500/50">₹499/month</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-foreground">₹199</span>
                                <span className="text-sm text-muted-foreground font-medium">/ month</span>
                            </div>
                        </div>

                        <ul className="space-y-3 text-sm text-muted-foreground mb-8 flex-1">
                            <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" /> 1 Hosted Portfolio</li>
                            <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" /> Standard Template Library</li>
                            <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" /> Dynamic QR Code Gen</li>
                        </ul>

                        <Button
                            onClick={() => handleUpgrade('BASIC', 'Basic')}
                            variant="outline"
                            className="w-full border-white/10 hover:bg-white/5 text-white bg-transparent h-12"
                        >
                            Claim Basic Access
                        </Button>
                    </div>

                    {/* Pro Tier */}
                    <div className="relative p-6 rounded-xl border border-[#4f46e5]/50 bg-gradient-to-b from-[#4f46e5]/20 to-black/40 hover:from-[#4f46e5]/30 transition-all flex flex-col h-full shadow-[0_0_30px_rgba(79,70,229,0.1)] group">
                        <div className="absolute -top-3 right-6 bg-[#4f46e5] text-white text-[10px] font-bold py-1 px-4 rounded-full shadow-lg tracking-wider uppercase">
                            Best Value
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-[#4f46e5]">Pro Vault</h3>

                        <div className="flex flex-col mb-6">
                            <span className="text-sm font-medium text-muted-foreground line-through decoration-[#4f46e5]/50">₹2,388/year</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-white">₹999</span>
                                <span className="text-sm text-white/70 font-medium">/ year</span>
                            </div>
                        </div>

                        <ul className="space-y-3 text-sm text-white/80 mb-8 flex-1">
                            <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" /> Unlimited Identities</li>
                            <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" /> All Premium & Niche Templates</li>
                            <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" /> AI Recruiter Chatbot Integ.</li>
                            <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" /> Custom Routing & SEO</li>
                        </ul>

                        <div className="space-y-3">
                            <Button
                                onClick={() => handleUpgrade('PRO', 'Pro')}
                                className="w-full bg-gradient-to-r from-[#4f46e5] to-indigo-600 hover:from-[#4338ca] hover:to-indigo-700 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all group-hover:scale-[1.02] h-12"
                            >
                                <Sparkles className="h-4 w-4 mr-2" />
                                Claim Full AI Suite
                            </Button>
                            <p className="text-[10px] text-center text-[#4f46e5]/70">Secure 256-bit automated encryption</p>
                        </div>
                    </div>
                </div>
            </div>

            <SecureCheckoutModal
                isOpen={checkoutModalOpen}
                onClose={() => setCheckoutModalOpen(false)}
                userEmail={user?.email}
                planName={selectedPlan}
            />
        </>
    );
}
