import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to track portfolio views
 * - Only runs on public portfolio pages
 * - Prevents counting owner's own views
 * - Uses sessionStorage to prevent duplicate counts on refresh
 * - Calls the server-side rate-limited increment_views RPC
 * - Logs visits with company/role params to visit_logs table
 */
export function useViewTracker(profileUserId: string | undefined) {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const viewCounted = useRef(false);

  useEffect(() => {
    // Guard: no profile ID or already counted this render
    if (!profileUserId || viewCounted.current) return;

    // Don't count if the visitor is the profile owner
    if (user?.id === profileUserId) {
      return;
    }

    // Check sessionStorage to prevent counting refreshes in the same session
    const sessionKey = `viewed_${profileUserId}`;
    if (sessionStorage.getItem(sessionKey)) {
      return;
    }

    // Additionally check localStorage for 1-hour cooldown across sessions
    const localKey = `foliogen_visited_${profileUserId}`;
    const lastVisit = localStorage.getItem(localKey);
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;

    if (lastVisit && now - parseInt(lastVisit, 10) < ONE_HOUR) {
      return;
    }

    // Mark as counted to prevent duplicate calls
    viewCounted.current = true;
    
    // Set both storage flags
    sessionStorage.setItem(sessionKey, 'true');
    localStorage.setItem(localKey, now.toString());

    // Get personalization params for visit logging
    const companyName = searchParams.get('company');
    const roleTarget = searchParams.get('role');

    // Call the rate-limited RPC function for view count
    supabase
      .rpc('increment_views', { p_user_id: profileUserId })
      .then(({ error }) => {
        if (error) {
          // Silently fail - view tracking is non-critical
        }
      });

    // If company or role param exists, log to visit_logs for recruiter tracking
    if (companyName || roleTarget) {
      supabase
        .from('visit_logs')
        .insert({
          profile_user_id: profileUserId,
          company_name: companyName,
          role_target: roleTarget,
        })
        .then(({ error }) => {
          if (error) {
            // Silently fail - visit logging is non-critical
          }
        });
    }
  }, [profileUserId, user?.id, searchParams]);
}
