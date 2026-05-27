import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase_v2';
import { toast } from 'sonner';
import { AuthLoadingOverlay } from '@/components/AuthLoadingOverlay';

export default function AuthCallback() {
    const navigate = useNavigate();
    const [errorDetails, setErrorDetails] = useState<string | null>(null);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const searchParams = new URLSearchParams(window.location.search);

                const error = hashParams.get('error') || searchParams.get('error');
                const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');
                if (error) throw new Error(errorDescription || error);

                const code = searchParams.get('code');
                if (code) {
                    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
                    if (exchangeError) throw new Error(exchangeError.message);
                    if (data?.session) {
                        toast.success('Welcome to Foliogen');
                        navigate('/dashboard?section=overview', { replace: true });
                        return;
                    }
                }

                const accessToken = hashParams.get('access_token');
                if (accessToken) {
                    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                    if (sessionError) throw new Error(sessionError.message);
                    if (session) {
                        toast.success('Welcome to Foliogen');
                        navigate('/dashboard?section=overview', { replace: true });
                        return;
                    }
                }

                const { data: { session }, error: fallbackError } = await supabase.auth.getSession();
                if (fallbackError) throw new Error(fallbackError.message);

                if (session) {
                    navigate('/dashboard?section=overview', { replace: true });
                } else {
                    toast.error('No active session found. Please sign in.');
                    navigate('/auth', { replace: true });
                }
            } catch (err: any) {
                const message = err?.message || 'Authentication failed';
                setErrorDetails(message);
                toast.error('Auth Error: ' + message);
                setTimeout(() => navigate('/auth', { replace: true }), 2500);
            }
        };

        handleCallback();
    }, [navigate]);

    return (
        <>
            <AuthLoadingOverlay show={true} />
            {errorDetails && (
                <div style={{ position: 'fixed', bottom: 24, left: 0, right: 0, zIndex: 10000, textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#e8401a', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    {errorDetails}
                </div>
            )}
        </>
    );
}
