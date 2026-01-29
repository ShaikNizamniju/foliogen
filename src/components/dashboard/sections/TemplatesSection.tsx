import { useProfile } from '@/contexts/ProfileContext';
import { Check } from 'lucide-react';

const templates = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean, black & white design with heavy typography and elegant spacing.',
    preview: 'bg-gradient-to-br from-gray-50 to-white border-2',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Vibrant gradient background with card-based layout and bold colors.',
    preview: 'bg-gradient-creative',
  },
];

export function TemplatesSection() {
  const { profile, updateProfile } = useProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Choose Your Template</h1>
        <p className="text-muted-foreground">
          Select a design that best represents your professional style.
        </p>
      </div>

      <div className="grid gap-6">
        {templates.map((template) => {
          const isSelected = profile.selectedTemplate === template.id;
          return (
            <button
              key={template.id}
              onClick={() => updateProfile({ selectedTemplate: template.id as 'minimalist' | 'creative' })}
              className={`relative text-left rounded-xl border-2 p-6 transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              
              <div className="flex gap-6">
                {/* Preview Thumbnail */}
                <div className={`w-32 h-24 rounded-lg ${template.preview} flex items-center justify-center shrink-0`}>
                  <span className="text-xs text-muted-foreground font-medium">Preview</span>
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-border bg-muted/50 p-6">
        <h3 className="font-semibold text-foreground mb-2">Pro Templates Coming Soon</h3>
        <p className="text-sm text-muted-foreground">
          We're working on more stunning templates including Corporate, Modern, and Developer themes.
          Upgrade to Pro to get early access!
        </p>
      </div>
    </div>
  );
}
