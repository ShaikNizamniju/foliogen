import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export interface ChameleonOverride {
    id: string;
    tailored_bio: string | null;
    reordered_sections: string[] | null;
    emphasized_skills: string[] | null;
    match_score: number | null;
    job_url: string | null;
}

/**
 * Hook consumed by the public portfolio page.
 * Detects ?chameleon=<id> URL param and fetches the tailored profile overlay
 * from the `chameleon_profiles` table.
 */
export function useChameleonMode() {
    const [searchParams] = useSearchParams();
    const chameleonId = searchParams.get('chameleon');
    const [override, setOverride] = useState<ChameleonOverride | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!chameleonId) {
            setOverride(null);
            return;
        }

        setLoading(true);
        supabase
            .from('chameleon_profiles' as any)
            .select('id, tailored_bio, reordered_sections, emphasized_skills, match_score, job_url')
            .eq('id', chameleonId)
            .maybeSingle()
            .then(({ data, error }) => {
                if (!error && data) {
                    setOverride(data as unknown as ChameleonOverride);
                }
                setLoading(false);
            });
    }, [chameleonId]);

    return {
        isActive: !!chameleonId && !!override,
        override,
        loading,
        chameleonId,
    };
}
