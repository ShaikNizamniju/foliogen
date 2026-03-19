import { useCallback } from 'react';
import { supabase } from '@/lib/supabase_v2';

/**
 * Hook to fire the on-auth-success edge function after a user signs up or first logs in.
 * Call `triggerWelcomeEmail` right after signIn/signUp succeeds.
 */
export function useWelcomeEmail() {
    const triggerWelcomeEmail = useCallback(
        async (name: string, provider: 'email' | 'google' = 'email') => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.access_token) return;

                await fetch(
                    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/on-auth-success`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${session.access_token}`,
                        },
                        body: JSON.stringify({ name, provider }),
                    }
                );
            } catch (e) {
                // Non-blocking – email failure should never block auth flow
            }
        },
        []
    );

    return { triggerWelcomeEmail };
}
