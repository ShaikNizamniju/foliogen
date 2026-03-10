import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
      const { data: chats } = await supabase.from('chat_queries').select('*').eq('profile_user_id', user.id).order('created_at', { ascending: false }).limit(100);

      setGlobalData(prev => ({ ...prev, chatStatus: 'success', chats: chats || [] }));
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
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    // Enforce overview as default route if accessing base dashboard
    if (user && !loading) {
      if (location.pathname === '/profile') {
        return; // Allow direct profile route
      } else if (!location.search.includes('section=')) {
        navigate('/dashboard?section=overview', { replace: true });
      }
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4f46e5] border-t-transparent mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
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
  const [waitlistOpen, setWaitlistOpen] = useState(false);

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
            <TemplatePreview />
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
    </SidebarProvider>
  );
}
