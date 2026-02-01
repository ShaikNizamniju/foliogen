import { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { MinimalistTemplate } from './templates/MinimalistTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { AiPmTemplate } from './templates/AiPmTemplate';
import { DevTemplate } from './templates/DevTemplate';
import { BrutalistTemplate } from './templates/BrutalistTemplate';
import { AcademicTemplate } from './templates/AcademicTemplate';
import { StudioTemplate } from './templates/StudioTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { InfluencerTemplate } from './templates/InfluencerTemplate';
import { SwissTemplate } from './templates/SwissTemplate';
import { NoirTemplate } from './templates/NoirTemplate';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function TemplatePreview() {
  const { profile, updateProfile } = useProfile();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Toggle button when closed */}
      {!isOpen && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-50 h-10 w-10 rounded-full shadow-lg border-border bg-card hover:bg-accent"
          title="Open Preview"
        >
          <PanelRightOpen className="h-5 w-5" />
        </Button>
      )}

      {/* Preview Panel */}
      <div 
        className={cn(
          "hidden lg:flex flex-col border-l border-border bg-muted/20 h-full transition-all duration-300 ease-in-out",
          isOpen ? "w-[600px]" : "w-0 overflow-hidden border-l-0"
        )}
      >
        {/* Preview Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Eye className="h-4 w-4" />
            Live Preview
          </div>
          <div className="flex items-center gap-2">
            <Select 
              value={profile.selectedTemplate} 
              onValueChange={(value) => updateProfile({ selectedTemplate: value as any })}
            >
              <SelectTrigger className="w-[160px] h-8">
                <SelectValue placeholder="Template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimalist">Minimalist</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="aipm">The AI PM</SelectItem>
                <SelectItem value="dev">The Terminal</SelectItem>
                <SelectItem value="brutalist">The Creative</SelectItem>
                <SelectItem value="academic">The Academic</SelectItem>
                <SelectItem value="studio">The Studio</SelectItem>
                <SelectItem value="executive">The Executive</SelectItem>
                <SelectItem value="influencer">The Influencer</SelectItem>
                <SelectItem value="swiss">The Swiss</SelectItem>
                <SelectItem value="noir">The Noir</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
              title="Close Preview"
            >
              <PanelRightClose className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Preview Content - Natural scrolling */}
        <div className="flex-1 overflow-auto p-4 print:p-0 print:overflow-visible">
          <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden transform scale-[0.50] origin-top-left w-[200%] print:transform-none print:w-full print:border-0 print:shadow-none print:rounded-none">
            <div id="portfolio-export-container" className="min-h-0 print:w-full">
              {profile.selectedTemplate === 'minimalist' && <MinimalistTemplate profile={profile} />}
              {profile.selectedTemplate === 'creative' && <CreativeTemplate profile={profile} />}
              {profile.selectedTemplate === 'aipm' && <AiPmTemplate profile={profile} />}
              {profile.selectedTemplate === 'dev' && <DevTemplate profile={profile} />}
              {profile.selectedTemplate === 'brutalist' && <BrutalistTemplate profile={profile} />}
              {profile.selectedTemplate === 'academic' && <AcademicTemplate profile={profile} />}
              {profile.selectedTemplate === 'studio' && <StudioTemplate profile={profile} />}
              {profile.selectedTemplate === 'executive' && <ExecutiveTemplate profile={profile} />}
              {profile.selectedTemplate === 'influencer' && <InfluencerTemplate profile={profile} />}
              {profile.selectedTemplate === 'swiss' && <SwissTemplate profile={profile} />}
              {profile.selectedTemplate === 'noir' && <NoirTemplate profile={profile} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
