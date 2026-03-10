import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase_v2';

interface SectionEvent {
    section_id: string;
    first_seen_at: string;
    time_spent_ms: number;
}

/**
 * Tracks section visibility using IntersectionObserver.
 * Sends accumulated events to Supabase `section_events` table on page 
 * hide / unload. Non-blocking — does not affect rendering.
 *
 * Usage: mount once in PublicPortfolio, pass the portfolio owner's user_id.
 * Sections must have data-section-id="<id>" attributes to be tracked.
 */
export function useScrollDepthTracker(profileUserId: string | undefined, ownerUserId: string | undefined) {
    const sessionIdRef = useRef<string>('');
    const eventsRef = useRef<Map<string, SectionEvent>>(new Map());
    const entryTimesRef = useRef<Map<string, number>>(new Map());
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        // Don't track owner's own visits or missing profile ids
        if (!profileUserId || profileUserId === ownerUserId) return;

        // Generate / reuse session id
        const storedSession = sessionStorage.getItem(`scroll_session_${profileUserId}`);
        if (storedSession) {
            sessionIdRef.current = storedSession;
        } else {
            const newId = crypto.randomUUID();
            sessionStorage.setItem(`scroll_session_${profileUserId}`, newId);
            sessionIdRef.current = newId;
        }

        const handleEntry = (entries: IntersectionObserverEntry[]) => {
            const now = Date.now();
            entries.forEach((entry) => {
                const sectionId = (entry.target as HTMLElement).dataset.sectionId;
                if (!sectionId) return;

                if (entry.isIntersecting) {
                    // Section entered viewport
                    if (!eventsRef.current.has(sectionId)) {
                        eventsRef.current.set(sectionId, {
                            section_id: sectionId,
                            first_seen_at: new Date().toISOString(),
                            time_spent_ms: 0,
                        });
                    }
                    entryTimesRef.current.set(sectionId, now);
                } else {
                    // Section left viewport — accumulate time
                    const entryTime = entryTimesRef.current.get(sectionId);
                    if (entryTime !== undefined) {
                        const existing = eventsRef.current.get(sectionId);
                        if (existing) {
                            existing.time_spent_ms += now - entryTime;
                        }
                        entryTimesRef.current.delete(sectionId);
                    }
                }
            });
        };

        observerRef.current = new IntersectionObserver(handleEntry, {
            threshold: 0.25, // section must be 25% visible
        });

        // Observe all sections with data-section-id
        const sections = document.querySelectorAll('[data-section-id]');
        sections.forEach((el) => observerRef.current!.observe(el));

        // Flush on page hide
        const flush = async () => {
            // Add remaining open-intervals
            const now = Date.now();
            entryTimesRef.current.forEach((entryTime, sectionId) => {
                const existing = eventsRef.current.get(sectionId);
                if (existing) existing.time_spent_ms += now - entryTime;
            });

            const rows = Array.from(eventsRef.current.values()).map((ev) => ({
                session_id: sessionIdRef.current,
                profile_user_id: profileUserId,
                section_id: ev.section_id,
                first_seen_at: ev.first_seen_at,
                time_spent_ms: ev.time_spent_ms,
            }));

            if (rows.length === 0) return;

            console.log('[ScrollDepthTracker] Flushing', rows.length, 'section events');
            await supabase.from('section_events' as any).insert(rows as any[]);
        };

        window.addEventListener('pagehide', flush);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') flush();
        });

        return () => {
            observerRef.current?.disconnect();
            window.removeEventListener('pagehide', flush);
        };
    }, [profileUserId, ownerUserId]);
}
