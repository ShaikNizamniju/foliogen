import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function SettingsSection() {
  const { user, signOut } = useAuth();
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

      {/* Danger Zone */}
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
        <h2 className="font-semibold text-foreground mb-4">Sign Out</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Sign out of your Foliogen account.
        </p>
        <Button variant="outline" onClick={handleSignOut} className="text-destructive border-destructive/50 hover:bg-destructive hover:text-destructive-foreground">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
