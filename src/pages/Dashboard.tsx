import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileProvider, useProfile } from '@/contexts/ProfileContext';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { SourceDataPanel } from '@/components/dashboard/SourceDataPanel';
import { LivePreviewPanel } from '@/components/dashboard/LivePreviewPanel';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PrintableResume } from '@/components/dashboard/templates/PrintableResume';
import { OnboardingTour } from '@/components/dashboard/OnboardingTour';
import { QuickStartModal } from '@/components/dashboard/QuickStartModal';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

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
    <ProfileProvider>
      <DashboardInner />
    </ProfileProvider>
  );
}

function DashboardInner() {
  const { profile, loading } = useProfile();
  const location = useLocation();
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // Check if we're on a section page
  const section = new URLSearchParams(location.search).get('section');
  const isMainDashboard = !section;
  
  // Show quick start modal for new users (no name set yet)
  useEffect(() => {
    if (!loading && !profile.fullName) {
      // Small delay for better UX
      const timer = setTimeout(() => setShowQuickStart(true), 500);
      return () => clearTimeout(timer);
    }
  }, [loading, profile.fullName]);
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          
          {isMainDashboard ? (
            /* Split View: Source Data (40%) | Live Preview (60%) */
            <div className="flex-1 overflow-hidden">
              <ResizablePanelGroup direction="horizontal" className="h-full">
                <ResizablePanel defaultSize={40} minSize={30} maxSize={50}>
                  <SourceDataPanel />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={60} minSize={40}>
                  <LivePreviewPanel 
                    editMode={editMode} 
                    onToggleEditMode={() => setEditMode(!editMode)} 
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          ) : (
            /* Section Content for Templates, Settings, Job Match */
            <div className="flex-1 overflow-auto">
              <DashboardContent />
            </div>
          )}
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
      
      {/* Quick Start Modal for new users */}
      <QuickStartModal 
        open={showQuickStart} 
        onClose={() => setShowQuickStart(false)} 
      />
      
      {/* Onboarding Tour */}
      <OnboardingTour />
    </SidebarProvider>
  );
}
