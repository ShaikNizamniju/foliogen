import { useEffect } from 'react';
import { supabase } from '@/lib/supabase_v2';

/**
 * Recruiter Pulse Tracking Hook
 * Logs portfolio views with regional context and anonymized IP
 */
export function useRecruiterPulse(profileUserId: string | undefined, personaActive: string = 'general') {
  useEffect(() => {
    if (!profileUserId) return;

    const trackView = async () => {
      try {
        // 1. Owner check: Don't track if the current user is the portfolio owner
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser?.id === profileUserId) return;

        // 2. Anti-spam: check sessionStorage to prevent double-counting in one session
        const sessionKey = `pulse_tracked_${profileUserId}_${personaActive}`;
        if (sessionStorage.getItem(sessionKey)) return;

        // 3. Get viewer context (IP, Region, and Organization)
        const ipResponse = await fetch('https://ipapi.co/json/');
        if (!ipResponse.ok) throw new Error('IP lookup failed');
        const ipData = await ipResponse.json();

        // 4. Noise Filter for Organization Detection
        const rawOrg = ipData.org || '';
        let detectedCompany = null;

        if (rawOrg) {
          const ispKeywords = ['jio', 'airtel', 'comcast', 'verizon', 'spectrum', 'at&t', 'vodafone', 'reliance', 'broadband', 'telecom', 'mobile', 'orange', 'telefonica', 'cox', 'charter', 'bsnl', 'act', 'hathway'];
          const isISP = ispKeywords.some(keyword => rawOrg.toLowerCase().includes(keyword));
          
          if (isISP) {
            detectedCompany = 'Individual Visitor';
          } else {
            // Clean up common corporate suffixes for cleaner display
            detectedCompany = rawOrg.replace(/\b(inc|corp|ltd|llc|plc|corporation|technologies|systems|services)\.?\b/gi, '').trim();
          }
        }

        // 5. Resolve the profile row ID from the user_id
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', profileUserId)
          .single();

        if (!profile) return;

        // 6. Anonymize IP (simple hashing for privacy compliance)
        const anonymizedIP = hashString(ipData.ip || '0.0.0.0');

        // 7. Log the view
        await supabase.from('portfolio_views').insert({
          profile_id: profile.id,
          viewer_ip: anonymizedIP,
          viewer_region: `${ipData.city || 'Unknown'}, ${ipData.region_code || ''} ${ipData.country_name || 'Unknown'}`,
          referrer: document.referrer || 'Direct',
          persona_active: personaActive,
          viewer_company: detectedCompany
        });

        // Mark as tracked
        sessionStorage.setItem(sessionKey, 'true');
      } catch (error) {
        // Silently fail - tracking should never break the user experience
        console.warn('Pulse tracking failed:', error);
      }
    };

    // Execute tracking asynchronously
    trackView();
  }, [profileUserId, personaActive]);
}

/**
 * Simple hash function to anonymize IP addresses
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `anon_${Math.abs(hash).toString(36)}`;
}
