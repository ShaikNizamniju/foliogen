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
import { Pencil, Eye, UserPlus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
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
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const isMobile = useIsMobile();
  
  // Check if we're on a section page
  const section = new URLSearchParams(location.search).get('section');
  const isMainDashboard = !section;
  
  // SAFETY CHECK: Defensively check if profile exists and has an id
  // This prevents crashes when profile is null/undefined or not yet loaded
  const isProfileEmpty = !profile || !profile.id;
  
  // Show quick start modal for new users (no name set yet)
  // SAFETY: Use optional chaining when accessing profile properties
  useEffect(() => {
    if (!loading && !isProfileEmpty && !profile?.fullName) {
      // Small delay for better UX
      const timer = setTimeout(() => setShowQuickStart(true), 500);
      return () => clearTimeout(timer);
    }
  }, [loading, isProfileEmpty, profile?.fullName]);
  
  // SAFETY CHECK #1: Show loading skeleton while auth is checking
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="w-full max-w-md p-8 space-y-6">
          <div className="flex items-center justify-center">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
          <p className="text-muted-foreground text-center text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
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
  
  // SAFETY CHECK #2: Show loading skeleton while profile data loads
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="w-full max-w-md p-8 space-y-6">
          <div className="flex items-center justify-center">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-2/3 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
          <p className="text-muted-foreground text-center text-sm">Setting up your workspace...</p>
        </div>
      </div>
    );
  }
  
  // SAFETY CHECK #3: Empty Data Handling - Show welcome state if profile is null/empty
  // This prevents crashes from trying to access properties on undefined profile
  if (isProfileEmpty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-8 p-8 max-w-lg">
          {/* Welcome Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <UserPlus className="w-10 h-10 text-primary" />
          </div>
          
          {/* Welcome Message */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold tracking-tight">Welcome to FolioGen!</h1>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Create your professional portfolio in minutes. Let's set up your profile to get started.
            </p>
          </div>
          
          {/* Create Profile Button */}
          <Button
            onClick={initializeProfile}
            disabled={initializing}
            size="lg"
            className="gap-2 px-8 py-6 text-lg font-semibold"
          >
            {initializing ? (
              <>
                <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Creating Profile...
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                Create Your Profile
              </>
            )}
          </Button>
          
          {/* Help text */}
          <p className="text-xs text-muted-foreground">
            This will only take a moment
          </p>
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
