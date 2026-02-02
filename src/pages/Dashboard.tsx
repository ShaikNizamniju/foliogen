import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ProfileProvider, useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil, Eye } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Dashboard() {
  // Note: Route protection is handled by ProtectedRoute wrapper in App.tsx
  // This component will only render when user is authenticated
  
  return (
    <ProfileProvider>
      <DashboardInner />
    </ProfileProvider>
  );
}

function DashboardInner() {
  const { profile, loading, initializeProfile, initializing } = useProfile();
  const { user } = useAuth();
  const location = useLocation();
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const isMobile = useIsMobile();
  
  // Check if we're on a section page
  const section = new URLSearchParams(location.search).get('section');
  const isMainDashboard = !section;
  
  // Check if profile is empty (no id means profile wasn't found/created)
  const isProfileEmpty = !profile.id;
  
  // Show quick start modal for new users (no name set yet)
  useEffect(() => {
    if (!loading && !isProfileEmpty && !profile.fullName) {
      // Small delay for better UX
      const timer = setTimeout(() => setShowQuickStart(true), 500);
      return () => clearTimeout(timer);
    }
  }, [loading, isProfileEmpty, profile.fullName]);
  
  // Prevent white screen on auth failure - show visible error
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-4 p-10">
          <p className="text-lg text-muted-foreground">No user found. Authentication may have failed.</p>
          <Link to="/auth" className="text-primary underline hover:text-primary/80">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }
  
  // Show loading spinner while setting up workspace
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Setting up your workspace...</p>
        </div>
      </div>
    );
  }
  
  // Failsafe: If profile is empty after loading, show initialize button
  if (isProfileEmpty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-6 p-8 max-w-md">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Welcome to FolioGen!</h2>
            <p className="text-muted-foreground">
              Let's set up your profile to get started with your portfolio.
            </p>
          </div>
          <button
            onClick={initializeProfile}
            disabled={initializing}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {initializing ? (
              <>
                <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Initializing...
              </>
            ) : (
              'Initialize Profile'
            )}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          
          {isMainDashboard ? (
            /* Split View: Source Data (40%) | Live Preview (60%) */
            <div className="flex-1 overflow-hidden">
              {isMobile ? (
                /* Mobile: Stacked tabs for Edit vs Preview */
                <Tabs value={mobileTab} onValueChange={(v) => setMobileTab(v as 'edit' | 'preview')} className="h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-2 shrink-0 rounded-none border-b">
                    <TabsTrigger value="edit" className="gap-1.5 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                      <Pencil className="h-4 w-4" />
                      Edit
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="gap-1.5 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                      <Eye className="h-4 w-4" />
                      Preview
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="edit" className="flex-1 overflow-hidden mt-0">
                    <SourceDataPanel />
                  </TabsContent>
                  <TabsContent value="preview" className="flex-1 overflow-hidden mt-0">
                    <LivePreviewPanel 
                      editMode={editMode} 
                      onToggleEditMode={() => setEditMode(!editMode)} 
                    />
                  </TabsContent>
                </Tabs>
              ) : (
                /* Desktop: Side-by-side resizable panels */
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
              )}
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
