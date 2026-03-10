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
import { toast } from 'sonner';

export function ProVaultWaitlistModal({
    isOpen,
    onClose,
    userEmail
}: {
    isOpen: boolean;
    onClose: () => void;
    userEmail?: string;
}) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // Initialize email when modal opens if empty
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
                .insert([{ email }]);

            if (error && error.code !== '23505') throw error; // Ignore unique constraint if already joined

            toast.success('Access secured. You are on the elite waitlist.');
            onClose();
        } catch (err: any) {
            console.error('Waitlist submission error:', err);
            const errorMessage = err?.message || 'Failed to join waitlist. Please try again.';
            toast.error(errorMessage.includes('fetch')
                ? 'Database Connection Error. Please verify your network.'
                : errorMessage
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-[#000000] border border-[#4f46e5] shadow-[0_0_40px_rgba(79,70,229,0.15)] text-white gap-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold tracking-tight">The Pro Vault is Expanding.</DialogTitle>
                    <DialogDescription className="text-slate-400 mt-2 text-base leading-relaxed">
                        Join 12,400+ narrative architects on the elite waitlist. Get notified the second 12+ new cinematic narratives drop.
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
                        {loading ? 'Securing Spot...' : 'Secure My Spot'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
