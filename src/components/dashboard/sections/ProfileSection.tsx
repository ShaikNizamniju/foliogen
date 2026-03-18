import { useState, useEffect } from 'react';
import { useProfile, FONT_OPTIONS, FontChoice } from '@/contexts/ProfileContext';
import { BasicInfoForm } from '../forms/BasicInfoForm';
import { WorkExperienceForm } from '../forms/WorkExperienceForm';
import { ProjectsForm } from '../forms/ProjectsForm';
import { SkillsForm } from '../forms/SkillsForm';
import { ResumeUpload } from '../forms/ResumeUpload';
import { LinkedInPdfUpload } from '../forms/LinkedInPdfUpload';
import { Button } from '@/components/ui/button';
import { Save, User, Briefcase, FolderKanban, Sparkles, Upload, Linkedin, Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
      case 'skills':
        return <SkillsForm />;
      case 'font':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Typography & Formatting</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Customize the typography and layout for your entire portfolio page. Word-style controls for real-time edits.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 items-center p-2 rounded-lg border border-border bg-muted/30 w-full max-w-3xl">
              {/* Font Family */}
              <div className="w-48">
                 <Select value={profile.selectedFont || 'default'} onValueChange={handleFontChange}>
                   <SelectTrigger className="h-10">
                     <SelectValue placeholder="Select a font" />
                   </SelectTrigger>
                   <SelectContent>
                     <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Classic</div>
                     {FONT_OPTIONS.filter(f => (f.category || 'Classic') === 'Classic').map(font => (
                       <SelectItem key={font.id} value={font.id}>
                         <span style={{ fontFamily: font.preview }}>{font.label}</span>
                       </SelectItem>
                     ))}
                     <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">Modern</div>
                     {FONT_OPTIONS.filter(f => f.category === 'Modern').map(font => (
                       <SelectItem key={font.id} value={font.id}>
                         <span style={{ fontFamily: font.preview }}>{font.label}</span>
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
              </div>
              
              <div className="w-px h-8 bg-border hidden sm:block"></div>
              
              {/* Font Size */}
              <div className="w-24">
                <Select value={profile.fontConfig?.size || 'base'} onValueChange={(v) => handleFontConfigChange({ size: v })}>
                  <SelectTrigger className="h-10">
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

              <div className="w-px h-8 bg-border hidden sm:block"></div>

              {/* Toggles: B, I, U */}
              <div className="flex items-center gap-1">
                 <Button 
                   variant={profile.fontConfig?.isBold ? 'secondary' : 'ghost'} 
                   size="icon" className="h-10 w-10"
                   onClick={() => handleFontConfigChange({ isBold: !profile.fontConfig?.isBold })}
                 >
                   <Bold className="h-4 w-4" />
                 </Button>
                 <Button 
                   variant={profile.fontConfig?.isItalic ? 'secondary' : 'ghost'} 
                   size="icon" className="h-10 w-10"
                   onClick={() => handleFontConfigChange({ isItalic: !profile.fontConfig?.isItalic })}
                 >
                   <Italic className="h-4 w-4" />
                 </Button>
                 <Button 
                   variant={profile.fontConfig?.isUnderline ? 'secondary' : 'ghost'} 
                   size="icon" className="h-10 w-10"
                   onClick={() => handleFontConfigChange({ isUnderline: !profile.fontConfig?.isUnderline })}
                 >
                   <Underline className="h-4 w-4" />
                 </Button>
              </div>

              <div className="w-px h-8 bg-border hidden sm:block"></div>

              {/* Alignment */}
              <div className="flex items-center gap-1">
                 <Button 
                   variant={profile.fontConfig?.alignment === 'left' ? 'secondary' : 'ghost'} 
                   size="icon" className="h-10 w-10"
                   onClick={() => handleFontConfigChange({ alignment: 'left' })}
                 >
                   <AlignLeft className="h-4 w-4" />
                 </Button>
                 <Button 
                   variant={profile.fontConfig?.alignment === 'center' ? 'secondary' : 'ghost'} 
                   size="icon" className="h-10 w-10"
                   onClick={() => handleFontConfigChange({ alignment: 'center' })}
                 >
                   <AlignCenter className="h-4 w-4" />
                 </Button>
                 <Button 
                   variant={profile.fontConfig?.alignment === 'right' ? 'secondary' : 'ghost'} 
                   size="icon" className="h-10 w-10"
                   onClick={() => handleFontConfigChange({ alignment: 'right' })}
                 >
                   <AlignRight className="h-4 w-4" />
                 </Button>
                 <Button 
                   variant={profile.fontConfig?.alignment === 'justify' ? 'secondary' : 'ghost'} 
                   size="icon" className="h-10 w-10"
                   onClick={() => handleFontConfigChange({ alignment: 'justify' })}
                 >
                   <AlignJustify className="h-4 w-4" />
                 </Button>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-8 p-8 rounded-lg border border-border bg-muted/10 min-h-[250px] flex items-center justify-center overflow-hidden">
              <div
                className={`w-full max-w-2xl text-${profile.fontConfig?.alignment || 'left'} text-${profile.fontConfig?.size || 'base'} ${profile.fontConfig?.isBold ? 'font-bold' : ''} ${profile.fontConfig?.isItalic ? 'italic' : ''} ${profile.fontConfig?.isUnderline ? 'underline' : ''}`}
                style={{ fontFamily: FONT_OPTIONS.find(f => f.id === profile.selectedFont)?.preview || 'Inter' }}
              >
                The quick brown fox jumps over the lazy dog. 
                <br /><br />
                Your exact formatting will apply across your live portfolio sections. This preview updates in real-time.
              </div>
            </div>
          </div>
        );
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
