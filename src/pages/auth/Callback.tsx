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
        const handleCallback = async () => {
            try {
                // 1. Check for explicit errors in the URL (hash or query)
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const searchParams = new URLSearchParams(window.location.search);

                const error = hashParams.get('error') || searchParams.get('error');
                const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');

                if (error) {
                    throw new Error(errorDescription || error);
                }

                // 2. PKCE Code Exchange: If Supabase sent a ?code= param, exchange it for a session
                const code = searchParams.get('code');
                if (code) {
                    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
                    if (exchangeError) {
                        throw new Error(exchangeError.message);
                    }
                    if (data?.session) {
                        toast.success('Identity verified. Welcome to the Vault.', {
                            style: { background: '#000', border: '1px solid #4f46e5', color: '#fff' },
                        });
                        navigate('/dashboard?section=overview', { replace: true });
                        return;
                    }
                }

                // 3. Hash-based tokens (implicit flow fallback)
                const accessToken = hashParams.get('access_token');
                if (accessToken) {
                    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                    if (sessionError) throw new Error(sessionError.message);
                    if (session) {
                        toast.success('Identity verified. Welcome to the Vault.', {
                            style: { background: '#000', border: '1px solid #4f46e5', color: '#fff' },
                        });
                        navigate('/dashboard?section=overview', { replace: true });
                        return;
                    }
                }

                // 4. Final fallback: check if a session already exists
                const { data: { session }, error: fallbackError } = await supabase.auth.getSession();
                if (fallbackError) throw new Error(fallbackError.message);

                if (session) {
                    toast.success('Session restored. Welcome back.', {
                        style: { background: '#000', border: '1px solid #4f46e5', color: '#fff' },
                    });
                    navigate('/dashboard?section=overview', { replace: true });
                } else {
                    // No session, no code, no token — redirect to login
                    toast.error('No active session found. Please sign in.');
                    navigate('/auth', { replace: true });
                }
            } catch (err: any) {
                console.error('Auth Callback Error:', err);
                const message = err?.message || 'Authentication failed';
                setErrorDetails(message);
                toast.error('Auth Error: ' + message);
                // Redirect to login after a brief delay so the user can see the error
                setTimeout(() => navigate('/auth', { replace: true }), 2500);
            }
        };

        handleCallback();
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
