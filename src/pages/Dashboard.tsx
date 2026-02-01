import { useEffect, useState } from 'react';
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
import { QuickStartModal } from '@/components/dashboard/QuickStartModal';

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
  const [showQuickStart, setShowQuickStart] = useState(false);
  
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
