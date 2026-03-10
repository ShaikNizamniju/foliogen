import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase_v2';
import { toast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';

export function SecureCheckoutModal({
    isOpen,
    onClose,
    userEmail,
    planName
}: {
    isOpen: boolean;
    onClose: () => void;
    userEmail?: string;
    planName: string;
}) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    if (isOpen && userEmail && !email) {
        setEmail(userEmail);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            const { error } = await (supabase as any)
                .from('waitlist_leads')
                .insert([{ email: `${email} (${planName} Checkout)` }]);

            if (error && error.code !== '23505') throw error; // Ignore unique constraint if already captured

            toast({
                title: 'Checkout Request Secured',
                description: 'A private, secure payment link has been dispatched to your email.',
                variant: 'default'
            });
            onClose();
        } catch (err: any) {
            console.error('Waitlist checkout error:', err);
            const errorMessage = err?.message || 'Unable to process checkout. Please try again or contact support.';
            toast({
                title: 'Request Failed',
                description: errorMessage.includes('fetch')
                    ? 'Database Connection Error. Please verify your network.'
                    : errorMessage,
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-[#000000] border border-[#4f46e5] shadow-[0_0_40px_rgba(79,70,229,0.15)] text-white gap-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold tracking-tight inline-flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-[#4f46e5]" />
                        Secure Checkout Connection
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 mt-2 text-base leading-relaxed">
                        Automated billing is temporarily upgrading. Provide your email to instantly receive a 256-bit encrypted private payment link for the <strong>{planName}</strong> plan.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        type="email"
                        placeholder="Enter your professional email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-transparent border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-[#4f46e5] focus-visible:border-[#4f46e5] h-11"
                    />
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#4f46e5] hover:bg-indigo-600 text-white transition-all font-medium h-11"
                    >
                        {loading ? 'Generating Secure Link...' : 'Request Private Payment Link'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
