import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Building2, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProRecruiterBannerProps {
  profileUserId: string;
}

export function ProRecruiterBanner({ profileUserId }: ProRecruiterBannerProps) {
  const [searchParams] = useSearchParams();
  const [dismissed, setDismissed] = useState(false);
  const [isOwnerPro, setIsOwnerPro] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  
  const company = searchParams.get('company');
  const role = searchParams.get('role');
  
  // Check if profile owner is Pro
  useEffect(() => {
    const checkProStatus = async () => {
      if (!profileUserId) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('profiles_public')
        .select('is_pro')
        .eq('user_id', profileUserId)
        .maybeSingle();
      
      if (data && !error) {
        setIsOwnerPro((data as any).is_pro || false);
      }
      setLoading(false);
    };
    
    checkProStatus();
  }, [profileUserId]);
  
  // If no personalization params, don't render anything
  if (!company && !role) return null;
  if (dismissed) return null;
  if (loading) return null;
  
  // If profile owner is not Pro, don't show the banner
  if (!isOwnerPro) return null;
  
  const target = company || role;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-50"
      >
        <div className="bg-gradient-to-r from-violet-600/90 via-blue-600/90 to-cyan-600/90 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-violet-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left side - Icon and message */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="shrink-0 p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                  {company ? (
                    <Building2 className="w-5 h-5 text-white" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-white" />
                  )}
                </div>
                <p className="text-white text-sm sm:text-base font-medium truncate">
                  <span className="hidden sm:inline">👋 </span>
                  <span className="font-bold">Hello {target} Team!</span>
                  <span className="hidden md:inline text-white/80 ml-2">
                    I've curated this portfolio to showcase my most relevant work for you.
                  </span>
                </p>
              </div>
              
              {/* Right side - Dismiss button */}
              <button
                onClick={() => setDismissed(true)}
                className="shrink-0 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white/80 hover:text-white"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Subtle glow effect below the banner */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      </motion.div>
    </AnimatePresence>
  );
}

// Hook to get recruiter personalization data
export function useRecruiterPersonalization() {
  const [searchParams] = useSearchParams();
  
  const company = searchParams.get('company');
  const role = searchParams.get('role');
  
  return {
    company,
    role,
    isPersonalized: !!(company || role),
    target: company || role,
    targetType: company ? 'company' : role ? 'role' : null,
  };
}
