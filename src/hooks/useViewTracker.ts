import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to track portfolio views
 * - Only runs on public portfolio pages
 * - Prevents counting owner's own views
 * - Uses sessionStorage to prevent duplicate counts on refresh
 * - Calls the server-side rate-limited increment_views RPC
 */
export function useViewTracker(profileUserId: string | undefined) {
  const { user } = useAuth();
  const viewCounted = useRef(false);

  useEffect(() => {
    // Guard: no profile ID or already counted this render
    if (!profileUserId || viewCounted.current) return;

    // Don't count if the visitor is the profile owner
    if (user?.id === profileUserId) {
      console.log('[ViewTracker] Owner visit - not counting');
      return;
    }

    // Check sessionStorage to prevent counting refreshes in the same session
    const sessionKey = `viewed_${profileUserId}`;
    if (sessionStorage.getItem(sessionKey)) {
      console.log('[ViewTracker] Already viewed this session - not counting');
      return;
    }

    // Additionally check localStorage for 1-hour cooldown across sessions
    const localKey = `foliogen_visited_${profileUserId}`;
    const lastVisit = localStorage.getItem(localKey);
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;

    if (lastVisit && now - parseInt(lastVisit, 10) < ONE_HOUR) {
      console.log('[ViewTracker] Visited within last hour - not counting');
      return;
    }

    // Mark as counted to prevent duplicate calls
    viewCounted.current = true;
    
    // Set both storage flags
    sessionStorage.setItem(sessionKey, 'true');
    localStorage.setItem(localKey, now.toString());

    // Call the rate-limited RPC function
    supabase
      .rpc('increment_views', { p_user_id: profileUserId })
      .then(({ error }) => {
        if (error) {
          console.error('[ViewTracker] Failed to increment views:', error);
        } else {
          console.log('[ViewTracker] View counted successfully');
        }
      });
  }, [profileUserId, user?.id]);
}
