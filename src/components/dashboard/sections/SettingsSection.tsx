import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Mail, Linkedin, RefreshCw, MessageSquare } from 'lucide-react';
import { FoundersFeedback } from '@/components/dashboard/FoundersFeedback';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function SettingsSection() {
  const { user, signOut } = useAuth();
  const { saveProfile } = useProfile();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences.
        </p>
      </div>

      {/* Account Info */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold text-foreground mb-4">Account Information</h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Account ID</p>
              <p className="font-medium text-foreground font-mono text-sm">{user?.id?.slice(0, 8)}...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications & Automation */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold text-foreground mb-4">Notifications & Automation</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 h-fit">
                <Linkedin className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">LinkedIn Pulse Sync</p>
                <p className="text-xs text-muted-foreground">Receive a monthly nudge to sync your latest LinkedIn accomplishments.</p>
              </div>
            </div>
            <button 
              className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-primary"
              onClick={() => toast.success("Notification preferences updated.")}
            >
              <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out" />
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-foreground mb-1">Danger Zone</h2>
          <p className="text-xs text-muted-foreground">Manage sensitive account actions and data resets.</p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-4">
          <Button 
            variant="outline" 
            onClick={async () => {
              if (window.confirm("Are you sure you want to reset your portfolio? This will clear all professional data (Bio, Headline, Experience, Projects) but keep your account. This cannot be undone.")) {
                await saveProfile({
                  bio: '',
                  headline: '',
                  workExperience: [],
                  projects: [],
                  skills: [],
                  keyHighlights: [],
                  narrativeVariants: {
                    general: { bio: "", headline: "" },
                    startup: { bio: "", headline: "" },
                    bigtech: { bio: "", headline: "" },
                    fintech: { bio: "", headline: "" },
                  }
                });
                toast.success("Portfolio data has been reset.");
              }
            }} 
            className="text-amber-500 border-amber-500/30 hover:bg-amber-500 hover:text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Portfolio Data
          </Button>

          <Button 
            variant="outline" 
            onClick={handleSignOut} 
            className="text-destructive border-destructive/50 hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
        <h2 className="font-semibold text-foreground mb-1">Help me build FolioGen</h2>
        <p className="text-xs text-muted-foreground mb-4">Have a feature request or found a bug? I'd love to hear from you directly.</p>
        <FoundersFeedback 
          trigger={
            <Button variant="default" className="w-full sm:w-auto">
              <MessageSquare className="h-4 w-4 mr-2" />
              Submit Feedback
            </Button>
          }
        />
      </div>
    </div>
  );
}
