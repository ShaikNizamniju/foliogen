import { useState, useCallback, useMemo } from 'react';
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
import { TemplateErrorBoundary } from './TemplateErrorBoundary';
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

// Device configurations with proper responsive container sizing
const deviceConfigs: Record<DeviceSize, { 
  width: number; 
  scale: number;
  label: string;
}> = {
  desktop: { width: 1280, scale: 0.5, label: 'Desktop' },
  tablet: { width: 768, scale: 0.6, label: 'Tablet' },
  mobile: { width: 375, scale: 0.75, label: 'Mobile' },
};

// Template registry for safe rendering
const templateRegistry = {
  minimalist: MinimalistTemplate,
  creative: CreativeTemplate,
  aipm: AiPmTemplate,
  dev: DevTemplate,
  brutalist: BrutalistTemplate,
  academic: AcademicTemplate,
  studio: StudioTemplate,
  executive: ExecutiveTemplate,
  influencer: InfluencerTemplate,
  swiss: SwissTemplate,
  noir: NoirTemplate,
} as const;

type TemplateKey = keyof typeof templateRegistry;

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

  // Safely get the template component with fallback
  const getTemplateComponent = useCallback(() => {
    const templateKey = profile.selectedTemplate as TemplateKey;
    
    // Check if template exists in registry
    if (templateKey && templateRegistry[templateKey]) {
      return templateRegistry[templateKey];
    }
    
    // Fallback to minimalist if template doesn't exist
    console.warn(`Template "${templateKey}" not found, falling back to minimalist`);
    return MinimalistTemplate;
  }, [profile.selectedTemplate]);

  // Memoize template props to prevent unnecessary re-renders
  const templateProps = useMemo(() => ({
    profile,
    editMode,
  }), [profile, editMode]);

  const renderTemplate = () => {
    const TemplateComponent = getTemplateComponent();
    const templateName = profile.selectedTemplate || 'minimalist';
    
    return (
      <TemplateErrorBoundary
        templateName={templateName}
        fallbackTemplate={<MinimalistTemplate key={refreshKey} {...templateProps} />}
      >
        <TemplateComponent key={refreshKey} {...templateProps} />
      </TemplateErrorBoundary>
    );
  };

  const currentDevice = deviceConfigs[deviceSize];

  return (
    <div className="h-full flex flex-col bg-muted/30">
      {/* Header with Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 sm:p-3 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
                  <ToggleGroupItem value="desktop" size="sm" className="h-6 w-6 sm:h-7 sm:w-7 p-0 data-[state=on]:bg-background">
                    <Monitor className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Desktop</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="tablet" size="sm" className="h-6 w-6 sm:h-7 sm:w-7 p-0 data-[state=on]:bg-background">
                    <Tablet className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Tablet</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="mobile" size="sm" className="h-6 w-6 sm:h-7 sm:w-7 p-0 data-[state=on]:bg-background">
                    <Smartphone className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Mobile</TooltipContent>
              </Tooltip>
            </ToggleGroup>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Edit Mode Toggle */}
          <Button
            variant={editMode ? 'default' : 'outline'}
            size="sm"
            onClick={onToggleEditMode}
            className={cn(
              "gap-1 sm:gap-1.5 h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3",
              editMode && "shadow-glow"
            )}
          >
            <Pencil className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="hidden xs:inline sm:inline">{editMode ? 'Editing' : 'Edit'}</span>
          </Button>

          {/* Template Selector */}
          <Select 
            value={profile.selectedTemplate || 'minimalist'} 
            onValueChange={(value) => updateProfile({ selectedTemplate: value as any })}
          >
            <SelectTrigger className="w-[100px] sm:w-[120px] h-7 sm:h-8 text-xs">
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
                  className="h-7 w-7 sm:h-8 sm:w-8" 
                  onClick={handleRefresh}
                >
                  <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
                  className="h-7 w-7 sm:h-8 sm:w-8" 
                  onClick={handleOpenLiveSite}
                >
                  <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
                      className="h-7 w-7 sm:h-8 sm:w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      disabled={resetting}
                    >
                      <Trash2 className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", resetting && "animate-spin")} />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Reset all data</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <AlertDialogContent className="max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-destructive">Reset All Profile Data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your profile data including:
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
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

      {/* Preview Content with Responsive Device Frame */}
      <ScrollArea className="flex-1">
        <div className="p-4 flex justify-center min-h-full">
          {/* Device Frame Container */}
          <div 
            className={cn(
              "relative bg-card rounded-xl border border-border shadow-lg overflow-hidden transition-all duration-300",
              editMode && "ring-2 ring-primary ring-offset-2 ring-offset-muted/30"
            )}
            style={{ 
              width: `${currentDevice.width}px`,
              maxWidth: '100%',
              transform: `scale(${currentDevice.scale})`,
              transformOrigin: 'top center',
            }}
          >
            {/* Device label */}
            <div className="absolute top-2 right-2 z-20 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full">
              {currentDevice.label} • {currentDevice.width}px
            </div>
            
            {/* Template Content */}
            <div id="portfolio-export-container" className="min-h-screen">
              {renderTemplate()}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
