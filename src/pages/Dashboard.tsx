import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { supabase } from '@/integrations/supabase/client';
import { createContext, useContext, useState, ReactNode } from 'react';

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

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

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
    </SidebarProvider>
  );
}
