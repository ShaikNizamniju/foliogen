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
  { id: 'font', label: 'Portfolio Font', icon: Type },
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
      case 'font': {
        const sizeMap: Record<string, string> = { sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem' };
        const activeFontId = profile.selectedFont || 'default';
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="block h-[2px] w-6 bg-[#E8390E]" aria-hidden />
                <h3 className="text-[20px] font-bold text-white" style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}>
                  Portfolio Font
                </h3>
              </div>
              <p className="text-[13px] text-white/45">
                Pick a typeface for your entire portfolio. Live preview updates instantly.
              </p>
            </div>

            {/* Font Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {FONT_OPTIONS.map((font) => {
                const isActive = activeFontId === font.id;
                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => handleFontChange(font.id)}
                    className={cn(
                      'group text-left rounded-[10px] bg-[#1A1A1A] px-4 py-4 transition-all duration-200',
                      isActive
                        ? 'border-2 border-[#E8390E] shadow-[0_0_0_3px_rgba(232,57,14,0.12)]'
                        : 'border border-white/[0.08] hover:border-white/20'
                    )}
                  >
                    <div
                      className="text-[18px] text-white leading-none mb-2 truncate"
                      style={{ fontFamily: font.preview }}
                    >
                      {font.label}
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.12em] text-white/35">
                      {font.category || 'Classic'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Formatting toolbar */}
            <div className="flex flex-wrap gap-3 items-center p-3 rounded-[10px] border border-white/[0.08] bg-[#1A1A1A] w-full">
              <div className="w-28">
                <Select value={profile.fontConfig?.size || 'base'} onValueChange={(v) => handleFontConfigChange({ size: v })}>
                  <SelectTrigger className="h-9 bg-transparent border-white/10 text-white text-xs">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="base">Normal</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                    <SelectItem value="xl">X-Large</SelectItem>
                    <SelectItem value="2xl">2X-Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-px h-7 bg-white/10 hidden sm:block" />
              <div className="flex items-center gap-1">
                <Button variant={profile.fontConfig?.isBold ? 'secondary' : 'ghost'} size="icon" className="h-9 w-9"
                  onClick={() => handleFontConfigChange({ isBold: !profile.fontConfig?.isBold })}><Bold className="h-4 w-4" /></Button>
                <Button variant={profile.fontConfig?.isItalic ? 'secondary' : 'ghost'} size="icon" className="h-9 w-9"
                  onClick={() => handleFontConfigChange({ isItalic: !profile.fontConfig?.isItalic })}><Italic className="h-4 w-4" /></Button>
                <Button variant={profile.fontConfig?.isUnderline ? 'secondary' : 'ghost'} size="icon" className="h-9 w-9"
                  onClick={() => handleFontConfigChange({ isUnderline: !profile.fontConfig?.isUnderline })}><Underline className="h-4 w-4" /></Button>
              </div>
              <div className="w-px h-7 bg-white/10 hidden sm:block" />
              <div className="flex items-center gap-1">
                <Button variant={profile.fontConfig?.alignment === 'left' ? 'secondary' : 'ghost'} size="icon" className="h-9 w-9"
                  onClick={() => handleFontConfigChange({ alignment: 'left' })}><AlignLeft className="h-4 w-4" /></Button>
                <Button variant={profile.fontConfig?.alignment === 'center' ? 'secondary' : 'ghost'} size="icon" className="h-9 w-9"
                  onClick={() => handleFontConfigChange({ alignment: 'center' })}><AlignCenter className="h-4 w-4" /></Button>
                <Button variant={profile.fontConfig?.alignment === 'right' ? 'secondary' : 'ghost'} size="icon" className="h-9 w-9"
                  onClick={() => handleFontConfigChange({ alignment: 'right' })}><AlignRight className="h-4 w-4" /></Button>
                <Button variant={profile.fontConfig?.alignment === 'justify' ? 'secondary' : 'ghost'} size="icon" className="h-9 w-9"
                  onClick={() => handleFontConfigChange({ alignment: 'justify' })}><AlignJustify className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* Live Preview */}
            <div className="mt-2 p-8 rounded-[10px] border border-white/[0.08] bg-[#111] min-h-[200px]">
              <div
                className="w-full max-w-2xl text-white"
                style={{
                  fontFamily: FONT_OPTIONS.find(f => f.id === activeFontId)?.preview || 'Inter',
                  fontSize: sizeMap[profile.fontConfig?.size || 'base'],
                  fontWeight: profile.fontConfig?.isBold ? 'bold' : 'normal',
                  fontStyle: profile.fontConfig?.isItalic ? 'italic' : 'normal',
                  textDecoration: profile.fontConfig?.isUnderline ? 'underline' : 'none',
                  textAlign: profile.fontConfig?.alignment || 'left',
                }}
              >
                The quick brown fox jumps over the lazy dog.
                <br /><br />
                Your exact formatting will apply across your live portfolio sections. This preview updates in real-time.
              </div>
            </div>
          </div>
        );
      }
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
