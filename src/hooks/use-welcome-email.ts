import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Hook to fire the on-auth-success edge function after a user signs up or first logs in.
 * Call `triggerWelcomeEmail` right after signIn/signUp succeeds.
 */
export function useWelcomeEmail() {
    const triggerWelcomeEmail = useCallback(
        async (email: string, name: string, provider: 'email' | 'google' = 'email') => {
            try {
                await fetch(
                    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/on-auth-success`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, name, provider }),
                    }
                );
            } catch (e) {
                // Non-blocking – email failure should never block auth flow
                console.warn('Welcome email failed (non-critical):', e);
            }
        },
        []
    );

    return { triggerWelcomeEmail };
}
