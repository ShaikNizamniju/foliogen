import { useProfile } from '@/contexts/ProfileContext';
import { MinimalistTemplate } from './templates/MinimalistTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye } from 'lucide-react';

export function TemplatePreview() {
  const { profile, updateProfile } = useProfile();

  return (
    <div className="hidden lg:flex flex-col w-[500px] border-l border-border bg-muted/20">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Eye className="h-4 w-4" />
          Live Preview
        </div>
        <Select 
          value={profile.selectedTemplate} 
          onValueChange={(value: 'minimalist' | 'creative') => updateProfile({ selectedTemplate: value })}
        >
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue placeholder="Template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minimalist">Minimalist</SelectItem>
            <SelectItem value="creative">Creative</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden transform scale-[0.6] origin-top-left w-[166%]">
          {profile.selectedTemplate === 'minimalist' ? (
            <MinimalistTemplate profile={profile} />
          ) : (
            <CreativeTemplate profile={profile} />
          )}
        </div>
      </div>
    </div>
  );
}
