import { useState, useEffect } from 'react';
import { useProfile, FONT_OPTIONS, FontChoice } from '@/contexts/ProfileContext';
import { BasicInfoForm } from '../forms/BasicInfoForm';
import { WorkExperienceForm } from '../forms/WorkExperienceForm';
import { ProjectsForm } from '../forms/ProjectsForm';
import { SkillsForm } from '../forms/SkillsForm';
import { ResumeUpload } from '../forms/ResumeUpload';
import { LinkedInPdfUpload } from '../forms/LinkedInPdfUpload';
import { Button } from '@/components/ui/button';
import { Save, User, Briefcase, FolderKanban, Sparkles, Upload, Linkedin, Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, Images } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

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

const tabs = [
  { id: 'basic', label: 'Basic Info', icon: User },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'assets', label: 'Asset Manager', icon: Images },
  { id: 'skills', label: 'Skills', icon: Sparkles },
  
  { id: 'resume', label: 'Resume Upload', icon: Upload },
  { id: 'linkedin', label: 'LinkedIn Auto-Sync', icon: Linkedin },
];

export function ProfileSection() {
  const [activeTab, setActiveTab] = useState('basic');
  const { profile, updateProfile, saveProfile, saving } = useProfile();

  const handleSave = async () => {
    const { error } = await saveProfile();
    if (error) {
      toast.error('Failed to save profile');
    } else {
      toast.success('Profile saved successfully');
    }
  };

  // Preload fonts for dropdown preview
  useEffect(() => {
    FONT_OPTIONS.forEach((f) => loadGoogleFont(f.googleFont));
  }, []);

  // Allow child components (e.g. ResumeUpload failure fallback) to jump the user
  // to the manual-entry tab.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail === 'string') setActiveTab(detail);
    };
    window.addEventListener('profile:switchTab', handler);
    return () => window.removeEventListener('profile:switchTab', handler);
  }, []);


  const handleFontChange = (fontId: string) => {
    updateProfile({ selectedFont: fontId as FontChoice });
  };

  const handleFontConfigChange = (updates: any) => {
    updateProfile({
      fontConfig: { ...(profile.fontConfig || { size: 'base', isBold: false, isItalic: false, isUnderline: false, alignment: 'left' } as any), ...updates }
    });
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicInfoForm />;
      case 'experience':
        return <WorkExperienceForm />;
      case 'projects':
        return <ProjectsForm />;
      case 'assets':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Asset Manager</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Manage your profile images, project highlights, and custom assets. Reorder or delete them at any time.
              </p>
            </div>
            
            <div className="p-8 border-2 border-dashed border-border rounded-2xl bg-muted/20 text-center">
              <Images className="h-10 w-10 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-sm text-muted-foreground font-medium mb-4">You can manage project images directly within each project card.</p>
              <Button variant="outline" onClick={() => setActiveTab('projects')} className="gap-2">
                <FolderKanban className="h-4 w-4" />
                Go to Projects
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-border">
              <h4 className="text-sm font-semibold mb-4">Quick Profile Photo Sync</h4>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-full overflow-hidden border border-border">
                     {profile.photoUrl ? (
                        <img src={profile.photoUrl} alt="" className="w-full h-full object-cover" />
                     ) : (
                        <User className="w-full h-full p-2 text-muted-foreground bg-muted" />
                     )}
                   </div>
                   <div>
                     <p className="text-sm font-medium">Main Profile Photo</p>
                     <p className="text-xs text-muted-foreground">{profile.photoUrl ? 'Synced and active' : 'No photo uploaded yet'}</p>
                   </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('basic')} className="text-primary hover:text-primary hover:bg-primary/5">
                  Update in Basic Info
                </Button>
              </div>
            </div>
          </div>
        );
      case 'skills':
        return <SkillsForm />;
      case 'font':
        return null;

      case 'resume':
        return <ResumeUpload />;
      case 'linkedin':
        return <LinkedInPdfUpload />;
      default:
        return <BasicInfoForm />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile Data</h1>
          <p className="text-muted-foreground">
            Fill in your information to generate your portfolio.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setActiveTab('linkedin')} 
            className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
          >
            <Linkedin className="h-4 w-4 mr-2" />
            Check for LinkedIn Updates
          </Button>
          <Button onClick={handleSave} disabled={saving} className="shadow-glow">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Vertical Sub-Navigation */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-1" data-tour="profile">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              data-tour={tab.id === 'projects' ? 'projects' : undefined}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="flex-1 w-full rounded-2xl border border-border bg-card p-6 shadow-sm min-h-[500px]">
          {renderForm()}
        </div>
      </div>
    </div>
  );
}
