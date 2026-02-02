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
import { Eye, ExternalLink, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface LivePreviewPanelProps {
  editMode?: boolean;
  onToggleEditMode?: () => void;
}

export function LivePreviewPanel({ editMode = false, onToggleEditMode }: LivePreviewPanelProps) {
  const { profile, updateProfile } = useProfile();

  const renderTemplate = () => {
    const props = { profile, editMode };
    
    switch (profile.selectedTemplate) {
      case 'minimalist':
        return <MinimalistTemplate {...props} />;
      case 'creative':
        return <CreativeTemplate {...props} />;
      case 'aipm':
        return <AiPmTemplate {...props} />;
      case 'dev':
        return <DevTemplate {...props} />;
      case 'brutalist':
        return <BrutalistTemplate {...props} />;
      case 'academic':
        return <AcademicTemplate {...props} />;
      case 'studio':
        return <StudioTemplate {...props} />;
      case 'executive':
        return <ExecutiveTemplate {...props} />;
      case 'influencer':
        return <InfluencerTemplate {...props} />;
      case 'swiss':
        return <SwissTemplate {...props} />;
      case 'noir':
        return <NoirTemplate {...props} />;
      default:
        return <MinimalistTemplate {...props} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-muted/30">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Eye className="h-4 w-4" />
          Live Preview
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={editMode ? 'default' : 'outline'}
            size="sm"
            onClick={onToggleEditMode}
            className="gap-1.5"
          >
            <Pencil className="h-3.5 w-3.5" />
            {editMode ? 'Editing' : 'Click to Edit'}
          </Button>
          <Select 
            value={profile.selectedTemplate} 
            onValueChange={(value) => updateProfile({ selectedTemplate: value as any })}
          >
            <SelectTrigger className="w-[140px] h-8">
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
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Open in new tab">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div 
            className={cn(
              'rounded-xl border border-border bg-card shadow-lg overflow-hidden',
              'transform scale-[0.55] origin-top-left w-[182%]',
              editMode && 'ring-2 ring-primary ring-offset-2'
            )}
          >
            <div id="portfolio-export-container" className="min-h-0">
              {renderTemplate()}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
