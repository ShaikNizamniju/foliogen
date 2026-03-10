import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase_v2';
import { toast } from '@/hooks/use-toast';
import { Sparkles, Loader2, Check, ExternalLink } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AiRewriteButtonProps {
    text: string;
    onResult: (newText: string) => void;
}

export function AiRewriteButton({ text, onResult }: AiRewriteButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleRewrite = async (action: string) => {
        if (!text || text.trim().length < 5) {
            toast({
                title: "Text too short",
                description: "Please write a bit more before using AI rewrite.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Not authenticated");

            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rewrite-text`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text, action }),
                }
            );

            if (!response.ok) {
                if (response.status === 402) {
                    toast({
                        title: "Pro Feature",
                        description: "Upgrading to Pro unlocks unlimited AI Writing Assistance.",
                        variant: "destructive",
                    });
                    return;
                }
                throw new Error("Rewrite failed");
            }

            const { result } = await response.json();
            if (result) {
                onResult(result);
                toast({ title: "AI Rewrite applied!" });
            }

        } catch (err: any) {
            console.error(err);
            toast({
                title: "Rewrite failed",
                description: "An error occurred while calling the AI. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={loading || !text.trim()}
                    className="gap-1.5 h-8 text-xs font-medium bg-indigo-50/50 text-indigo-600 hover:bg-indigo-100/50 border border-indigo-200/50"
                >
                    {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                    AI Rewrite
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleRewrite('Fix Grammar')} className="gap-2 cursor-pointer">
                    <Check className="h-4 w-4 text-emerald-500" />
                    Fix Grammar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRewrite('Make Professional')} className="gap-2 cursor-pointer">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    Make Professional
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRewrite('Shorten')} className="gap-2 cursor-pointer">
                    <ExternalLink className="h-4 w-4 text-amber-500 rotate-180" />
                    Shorten
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
