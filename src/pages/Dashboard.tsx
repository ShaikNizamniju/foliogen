import { useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileProvider, useProfile } from '@/contexts/ProfileContext';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { TemplatePreview } from '@/components/dashboard/TemplatePreview';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PrintableResume } from '@/components/dashboard/templates/PrintableResume';
import { OnboardingTour } from '@/components/dashboard/OnboardingTour';
import { OnboardingQuestionnaire } from '@/components/dashboard/OnboardingQuestionnaire';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { supabase } from '@/lib/supabase_v2';
import { createContext, useContext, useState, ReactNode } from 'react';
import { usePro } from '@/contexts/ProContext';
import { ProVaultWaitlistModal } from '@/components/dashboard/ProVaultWaitlistModal';
import { FoundersFeedback } from '@/components/dashboard/FoundersFeedback';
import { MobileSprintCTA } from '@/components/ui/MobileSprintCTA';
import { toast } from "sonner";

// Global Data Context to avoid loading spinners on tab switch
export const GlobalDataContext = createContext<any>(null);

export const useGlobalData = () => useContext(GlobalDataContext);

function GlobalDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [globalData, setGlobalData] = useState({
    jobsStatus: 'idle', // idle, loading, success
    jobs: [],
    chatStatus: 'idle',
    chats: [],
  });

  useEffect(() => {
    if (!user) return;

    const fetchGlobalData = async () => {
      // Fetch Jobs
      setGlobalData(prev => ({ ...prev, jobsStatus: 'loading' }));
      const { data: jobs } = await supabase.from('job_applications').select('*').eq('user_id', user.id).order('created_at', { ascending: false });

      // Fetch Chats
      setGlobalData(prev => ({ ...prev, jobsStatus: 'success', jobs: jobs || [], chatStatus: 'loading' }));
      try {
        const { data: chats, error: chatError } = await supabase
          .from('chat_queries')
          .select('*')
          .eq('profile_user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100);
        
        if (chatError) throw chatError;
        setGlobalData(prev => ({ ...prev, chatStatus: 'success', chats: chats || [] }));
      } catch (error: any) {
        console.error("[Dashboard] Global Chat Fetch Error:", error.message || error);
        setGlobalData(prev => ({ ...prev, chatStatus: 'error', chats: [] }));
      }
    };
    fetchGlobalData();
  }, [user]);

  return (
    <GlobalDataContext.Provider value={{ ...globalData, setGlobalData }}>
      {children}
    </GlobalDataContext.Provider>
  );
}
export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSection = searchParams.get('section');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    // Enforce overview as default route if accessing base dashboard without a section
    if (user && !loading && location.pathname === '/dashboard' && !currentSection) {
      navigate('/dashboard?section=overview', { replace: true });
    }
  }, [user, loading, navigate, location.pathname, currentSection]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <GlobalDataProvider>
      <ProfileProvider>
        <ErrorBoundary fallbackMessage="Dashboard encountered an error">
          <DashboardInner />
        </ErrorBoundary>
      </ProfileProvider>
    </GlobalDataProvider>
  );
}

function DashboardInner() {
  const { profile } = useProfile();
  const { user } = useAuth();
  const { isBasicOrAbove } = usePro();
  const navigate = useNavigate();
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  // Proactive Identity Watcher Agency
  const prevCounts = useRef<{ projects: number; experiences: number } | null>(null);
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (!profile || triggeredRef.current) return;

    const currentProjectCount = profile.projects?.length || 0;
    const currentExperienceCount = profile.workExperience?.length || 0;

    // Set baseline on first valid profile load
    if (prevCounts.current === null) {
      prevCounts.current = {
        projects: currentProjectCount,
        experiences: currentExperienceCount
      };
      return;
    }

    const addedProject = currentProjectCount > prevCounts.current.projects;
    const addedExperience = currentExperienceCount > prevCounts.current.experiences;

    if (addedProject || addedExperience) {
      toast("New Identity Detected", {
        description: "Your portfolio might be out of sync. Run a Recruiter Audit to optimize for the market?",
        action: {
          label: "Audit Now",
          onClick: () => navigate("/dashboard?section=recruiter-audit")
        },
      });
      triggeredRef.current = true;
    }

    // Update baseline to track future additions within the same session
    prevCounts.current = {
      projects: currentProjectCount,
      experiences: currentExperienceCount
    };
  }, [profile?.projects?.length, profile?.workExperience?.length, navigate]);

  // 60-second activity timer
  useEffect(() => {
    if (isBasicOrAbove) return;

    const hasSeen = localStorage.getItem('pro_vault_waitlist_seen');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setWaitlistOpen(true);
        localStorage.setItem('pro_vault_waitlist_seen', 'true');
      }, 60000);
      return () => clearTimeout(timer);
    }
  }, [isBasicOrAbove]);

  // Listen for custom trigger event
  useEffect(() => {
    const handleOpen = () => {
      if (!isBasicOrAbove) {
        setWaitlistOpen(true);
        localStorage.setItem('pro_vault_waitlist_seen', 'true');
      }
    };
    window.addEventListener('trigger-waitlist-modal', handleOpen);
    return () => window.removeEventListener('trigger-waitlist-modal', handleOpen);
  }, [isBasicOrAbove]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <div className="flex-1 flex overflow-hidden">
            <DashboardContent />
            <div className="hidden lg:flex">
              <TemplatePreview />
            </div>
          </div>
        </div>
      </div>

      {/* Off-screen ATS-friendly resume for PDF export */}
      <div
        id="printable-resume-container"
        className="fixed -left-[9999px] top-0 bg-white"
        style={{ width: '210mm' }}
      >
        <PrintableResume profile={profile} />
      </div>

      {/* Onboarding Tour disabled for production */}

      {/* Domain Questionnaire */}
      <OnboardingQuestionnaire />

      {/* Waitlist Modal for Free/Basic users */}
      <ProVaultWaitlistModal
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
        userEmail={user?.email}
      />

      {/* Floating mobile CTA for non-pro users */}
      {!isBasicOrAbove && <MobileSprintCTA />}
    </SidebarProvider>
  );
}
