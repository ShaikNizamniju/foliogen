import { useState, useCallback, useEffect, useRef } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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
import { Eye, ExternalLink, Pencil, Monitor, Tablet, Smartphone, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface LivePreviewPanelProps {
  editMode?: boolean;
  onToggleEditMode?: () => void;
}

type DeviceSize = 'desktop' | 'tablet' | 'mobile';

const deviceSizes: Record<DeviceSize, { width: string; scale: string; containerWidth: string }> = {
  desktop: { width: '100%', scale: 'scale-[0.55]', containerWidth: 'w-[182%]' },
  tablet: { width: '768px', scale: 'scale-[0.65]', containerWidth: 'w-[153%]' },
  mobile: { width: '375px', scale: 'scale-[0.8]', containerWidth: 'w-[125%]' },
};

export function LivePreviewPanel({ editMode = false, onToggleEditMode }: LivePreviewPanelProps) {
  const { profile, updateProfile } = useProfile();
  const { user } = useAuth();
  const [deviceSize, setDeviceSize] = useState<DeviceSize>('desktop');
  const [refreshKey, setRefreshKey] = useState(0);
  const [resetting, setResetting] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const handleOpenLiveSite = useCallback(() => {
    if (user?.id) {
      window.open(`/p/${user.id}`, '_blank');
    }
  }, [user?.id]);

  const handleFactoryReset = async () => {
    if (!user?.id) {
      toast.error('You must be logged in to reset your profile');
      return;
    }

    setResetting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: '',
          headline: '',
          bio: '',
          location: '',
          website: '',
          linkedin_url: '',
          github_url: '',
          twitter_url: '',
          photo_url: '',
          work_experience: [],
          projects: [],
          skills: [],
          key_highlights: [],
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Profile data cleared. Reloading...');
      setTimeout(() => window.location.reload(), 500);
    } catch (err) {
      console.error('Reset failed:', err);
      toast.error('Failed to reset profile data');
      setResetting(false);
    }
  };

  const renderTemplate = () => {
    const props = { profile, editMode };
    
    switch (profile.selectedTemplate) {
      case 'minimalist':
        return <MinimalistTemplate key={refreshKey} {...props} />;
      case 'creative':
        return <CreativeTemplate key={refreshKey} {...props} />;
      case 'aipm':
        return <AiPmTemplate key={refreshKey} {...props} />;
      case 'dev':
        return <DevTemplate key={refreshKey} {...props} />;
      case 'brutalist':
        return <BrutalistTemplate key={refreshKey} {...props} />;
      case 'academic':
        return <AcademicTemplate key={refreshKey} {...props} />;
      case 'studio':
        return <StudioTemplate key={refreshKey} {...props} />;
      case 'executive':
        return <ExecutiveTemplate key={refreshKey} {...props} />;
      case 'influencer':
        return <InfluencerTemplate key={refreshKey} {...props} />;
      case 'swiss':
        return <SwissTemplate key={refreshKey} {...props} />;
      case 'noir':
        return <NoirTemplate key={refreshKey} {...props} />;
      default:
        return <MinimalistTemplate key={refreshKey} {...props} />;
    }
  };

  const currentDevice = deviceSizes[deviceSize];

  return (
    <div className="h-full flex flex-col bg-muted/30">
      {/* Header with Controls */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Live Preview</span>
          </div>
          
          {/* Device Toggles */}
          <TooltipProvider>
            <ToggleGroup 
              type="single" 
              value={deviceSize} 
              onValueChange={(value) => value && setDeviceSize(value as DeviceSize)}
              className="bg-muted rounded-lg p-0.5"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="desktop" size="sm" className="h-7 w-7 p-0 data-[state=on]:bg-background">
                    <Monitor className="h-3.5 w-3.5" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Desktop</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="tablet" size="sm" className="h-7 w-7 p-0 data-[state=on]:bg-background">
                    <Tablet className="h-3.5 w-3.5" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Tablet</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="mobile" size="sm" className="h-7 w-7 p-0 data-[state=on]:bg-background">
                    <Smartphone className="h-3.5 w-3.5" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Mobile</TooltipContent>
              </Tooltip>
            </ToggleGroup>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-2">
          {/* Edit Mode Toggle */}
          <Button
            variant={editMode ? 'default' : 'outline'}
            size="sm"
            onClick={onToggleEditMode}
            className="gap-1.5 h-8"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{editMode ? 'Editing' : 'Click to Edit'}</span>
          </Button>

          {/* Template Selector */}
          <Select 
            value={profile.selectedTemplate} 
            onValueChange={(value) => updateProfile({ selectedTemplate: value as any })}
          >
            <SelectTrigger className="w-[120px] h-8 text-xs">
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

          {/* Refresh Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={handleRefresh}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh animations</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Open Live Site */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={handleOpenLiveSite}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open live site</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Reset Button with Confirmation Dialog */}
          <AlertDialog>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      disabled={resetting}
                    >
                      <Trash2 className={cn("h-4 w-4", resetting && "animate-spin")} />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Reset all data</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-destructive">Reset All Profile Data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your profile data including:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Name, Headline, Bio</li>
                    <li>All Work Experience</li>
                    <li>All Projects</li>
                    <li>All Skills</li>
                    <li>Profile Photo</li>
                  </ul>
                  <p className="mt-3 font-medium text-destructive">This action cannot be undone.</p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleFactoryReset}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {resetting ? 'Resetting...' : 'Yes, Wipe Everything'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Preview Content with Device Frame */}
      <ScrollArea className="flex-1">
        <div className="p-4 flex justify-center">
          <div 
            className={cn(
              'rounded-xl border border-border bg-card shadow-lg overflow-hidden transition-all duration-300',
              currentDevice.scale,
              'origin-top',
              currentDevice.containerWidth,
              editMode && 'ring-2 ring-primary ring-offset-2',
              deviceSize !== 'desktop' && 'mx-auto'
            )}
            style={{ 
              maxWidth: deviceSize !== 'desktop' ? currentDevice.width : undefined,
            }}
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
