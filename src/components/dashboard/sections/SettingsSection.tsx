import { useAuth } from '@/contexts/AuthContext';
import { useProfile, FONT_OPTIONS, FontChoice } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Mail, Type, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useEffect } from 'react';

// Load Google Font dynamically
function loadGoogleFont(fontUrl: string) {
  if (!fontUrl) return;
  const id = `gfont-${fontUrl.replace(/[^a-zA-Z]/g, '')}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontUrl}&display=swap`;
  document.head.appendChild(link);
}

export function SettingsSection() {
  const { user, signOut } = useAuth();
  const { profile, updateProfile, saveProfile } = useProfile();
  const navigate = useNavigate();

  // Preload all fonts for preview
  useEffect(() => {
    FONT_OPTIONS.forEach((f) => loadGoogleFont(f.googleFont));
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleFontSelect = async (fontId: FontChoice) => {
    updateProfile({ selectedFont: fontId });
    const { error } = await saveProfile();
    if (error) {
      toast.error('Failed to save font preference');
    } else {
      toast.success('Font updated!');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences.
        </p>
      </div>

      {/* Font Selector */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Type className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Portfolio Font</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Choose a font for your public portfolio. The selected font will be applied across your entire portfolio page.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FONT_OPTIONS.map((font) => {
            const isSelected = (profile.selectedFont || 'default') === font.id;
            return (
              <button
                key={font.id}
                onClick={() => handleFontSelect(font.id)}
                className={`relative p-4 rounded-lg border-2 text-left transition-all hover:border-primary/50 ${
                  isSelected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                    : 'border-border bg-card hover:bg-muted/50'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                <p
                  className="text-lg text-foreground mb-1"
                  style={{ fontFamily: font.preview }}
                >
                  {font.label}
                </p>
                <p
                  className="text-sm text-muted-foreground"
                  style={{ fontFamily: font.preview }}
                >
                  The quick brown fox jumps over the lazy dog
                </p>
              </button>
            );
          })}
        </div>
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
          Sign out of your FolioGen account.
        </p>
        <Button variant="outline" onClick={handleSignOut} className="text-destructive border-destructive/50 hover:bg-destructive hover:text-destructive-foreground">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
