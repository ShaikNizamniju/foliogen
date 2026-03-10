import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase_v2';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import logoImg from '@/assets/logo.png';

export default function AuthCallback() {
    const navigate = useNavigate();
    const [errorDetails, setErrorDetails] = useState<string | null>(null);

    useEffect(() => {
        // Check if the URL contains an error from Supabase
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const searchParams = new URLSearchParams(window.location.search);

        const error = hashParams.get('error') || searchParams.get('error');
        const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');

        if (error) {
            console.error('Auth Callback Error:', error, errorDescription);
            setErrorDetails(errorDescription || error);
            toast.error('Authentication failed: ' + (errorDescription || error));
            navigate('/auth', { replace: true });
            return;
        }

        // Set up standard session detection
        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    navigate('/dashboard?section=overview', { replace: true });
                } else if (event === 'SIGNED_OUT') {
                    navigate('/auth', { replace: true });
                }
            }
        );

        // Fallback manual check in case event is missed
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) {
                console.error('Session get error:', error.message);
                toast.error('Session retrieval failed.');
                navigate('/auth', { replace: true });
            } else if (session) {
                navigate('/dashboard?section=overview', { replace: true });
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--cobalt)) 40%, hsl(var(--sidebar-background)) 70%, hsl(var(--background)) 100%)', opacity: 0.5 }} />
            <div className="relative z-10 flex flex-col items-center space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-xl bg-indigo-500/20 animate-pulse" />
                    <img src={logoImg} alt="Foliogen" className="h-16 w-16 object-contain relative z-10 dark:invert" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Authenticating Identity
                </h2>
                <div className="flex items-center space-x-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                    <span>Establishing secure connection to the vault...</span>
                </div>
                {errorDetails && (
                    <p className="text-xs text-red-400 mt-4 max-w-sm text-center">
                        Debug Info: {errorDetails}
                    </p>
                )}
            </div>
        </div>
    );
}
