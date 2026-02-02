import { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { SyncStatusBadge } from './SyncStatusBadge';
import { ResumeUpload } from './forms/ResumeUpload';
import { LinkedInPdfUpload } from './forms/LinkedInPdfUpload';
import { BasicInfoForm } from './forms/BasicInfoForm';
import { WorkExperienceForm } from './forms/WorkExperienceForm';
import { ProjectsForm } from './forms/ProjectsForm';
import { SkillsForm } from './forms/SkillsForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, FileText, Linkedin, User, Briefcase, FolderKanban, Sparkles, Link } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

export function SourceDataPanel() {
  const { profile, updateProfile, saveProfile, saving } = useProfile();
  const [activeSourceTab, setActiveSourceTab] = useState<'import' | 'manual'>('import');
  const [activeManualTab, setActiveManualTab] = useState('basic');
  const [syncSource, setSyncSource] = useState<'resume' | 'linkedin' | null>(
    profile.fullName ? 'resume' : null
  );

  const handleSave = async () => {
    const { error } = await saveProfile();
    if (error) {
      toast.error('Failed to save profile');
    } else {
      toast.success('Profile saved successfully');
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Source Data</h2>
          <Button onClick={handleSave} disabled={saving} size="sm" className="gap-1.5">
            <Save className="h-3.5 w-3.5" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
        <SyncStatusBadge source={syncSource} />
      </div>

      {/* Tabs for Import vs Manual */}
      <Tabs value={activeSourceTab} onValueChange={(v) => setActiveSourceTab(v as any)} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-full grid-cols-2 mx-4 mt-4" style={{ width: 'calc(100% - 2rem)' }}>
          <TabsTrigger value="import" className="gap-1.5" data-tour="profile">
            <FileText className="h-3.5 w-3.5" />
            Import
          </TabsTrigger>
          <TabsTrigger value="manual" className="gap-1.5">
            <User className="h-3.5 w-3.5" />
            Edit Fields
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="import" className="p-4 space-y-4 mt-0">
            {/* Nested tabs for Resume vs LinkedIn */}
            <Tabs defaultValue="resume" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="resume" className="gap-1.5 text-xs">
                  <FileText className="h-3.5 w-3.5" />
                  Upload Resume
                </TabsTrigger>
                <TabsTrigger value="linkedin" className="gap-1.5 text-xs">
                  <Linkedin className="h-3.5 w-3.5 text-[#0A66C2]" />
                  LinkedIn PDF
                </TabsTrigger>
              </TabsList>

              <TabsContent value="resume" className="mt-0 space-y-4">
                <div className="rounded-lg border border-dashed border-border p-4 bg-muted/30">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Upload Your Resume
                  </h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Upload a PDF resume and our AI will extract your experience, skills, and projects automatically.
                  </p>
                  <ResumeUpload />
                </div>
              </TabsContent>

              <TabsContent value="linkedin" className="mt-0 space-y-4">
                <div className="rounded-lg border border-dashed border-border p-4 bg-muted/30">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                    Import LinkedIn Profile
                  </h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Export your LinkedIn profile as a PDF and upload it here. 
                    <span className="block mt-1 text-muted-foreground/80">
                      Go to LinkedIn → Your Profile → More → Save to PDF
                    </span>
                  </p>
                  <LinkedInPdfUpload />
                </div>

                {/* LinkedIn URL Input */}
                <div className="space-y-2 pt-4 border-t border-border">
                  <Label className="flex items-center gap-2 text-sm">
                    <Link className="h-4 w-4 text-muted-foreground" />
                    LinkedIn Profile URL (for display)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={profile.linkedinUrl}
                      onChange={(e) => updateProfile({ linkedinUrl: e.target.value })}
                      className="flex-1 text-sm"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This URL will be displayed on your public portfolio
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="manual" className="p-4 mt-0">
            {/* Manual Edit Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
              {[
                { id: 'basic', label: 'Basic', icon: User },
                { id: 'experience', label: 'Experience', icon: Briefcase },
                { id: 'projects', label: 'Projects', icon: FolderKanban },
                { id: 'skills', label: 'Skills', icon: Sparkles },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveManualTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    activeManualTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form Content */}
            <div className="space-y-4">
              {activeManualTab === 'basic' && <BasicInfoForm />}
              {activeManualTab === 'experience' && <WorkExperienceForm />}
              {activeManualTab === 'projects' && <ProjectsForm />}
              {activeManualTab === 'skills' && <SkillsForm />}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
