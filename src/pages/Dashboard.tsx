import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { TemplatePreview } from '@/components/dashboard/TemplatePreview';
import { SidebarProvider } from '@/components/ui/sidebar';

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
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-muted/30">
          <DashboardSidebar />
          <div className="flex-1 flex">
            <DashboardContent />
            <TemplatePreview />
          </div>
        </div>
      </SidebarProvider>
    </ProfileProvider>
  );
}
