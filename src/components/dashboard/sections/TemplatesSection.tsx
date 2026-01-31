import { useProfile } from '@/contexts/ProfileContext';
import { Check } from 'lucide-react';

const templates = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean, black & white design with heavy typography and elegant spacing.',
    preview: 'bg-gradient-to-br from-gray-50 to-white border-2',
    emoji: '◼️',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Vibrant gradient background with card-based layout and bold colors.',
    preview: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    emoji: '🎨',
  },
  {
    id: 'saas',
    name: 'The Founder',
    description: 'Clean, modern, expensive. Stripe/Linear inspired with smooth scroll animations.',
    preview: 'bg-gradient-to-br from-violet-50 to-white border',
    emoji: '🚀',
  },
  {
    id: 'dev',
    name: 'The Terminal',
    description: 'Dark mode IDE style with typewriter effects and syntax highlighting.',
    preview: 'bg-[#0D1117] border border-green-500/30',
    emoji: '💻',
  },
  {
    id: 'brutalist',
    name: 'The Creative',
    description: 'Neo-brutalist design with thick borders, hard shadows, and bouncy animations.',
    preview: 'bg-[#FFE962] border-4 border-black',
    emoji: '⚡',
  },
  {
    id: 'academic',
    name: 'The Academic',
    description: 'Ivy League elegance with serif fonts, paper textures, and formal CV structure.',
    preview: 'bg-[#fdfbf7] border-2 border-[#e5e2db]',
    emoji: '📜',
  },
  {
    id: 'studio',
    name: 'The Studio',
    description: 'Design agency style with massive project visuals and minimal text.',
    preview: 'bg-[#1a1a1a] border border-white/10',
    emoji: '📷',
  },
  {
    id: 'executive',
    name: 'The Executive',
    description: 'Fortune 500 CEO style with navy blue, gold accents, and executive summary.',
    preview: 'bg-[#0f172a] border border-amber-400/30',
    emoji: '👔',
  },
  {
    id: 'influencer',
    name: 'The Influencer',
    description: 'Premium link-in-bio style with mesh gradients and glassmorphism cards.',
    preview: 'bg-gradient-to-br from-pink-200 via-purple-200 to-cyan-200',
    emoji: '🔗',
  },
  {
    id: 'swiss',
    name: 'The Swiss',
    description: 'International Typographic Style with strict grids, massive headers, and red accents.',
    preview: 'bg-white border-4 border-black',
    emoji: '🇨🇭',
  },
  {
    id: 'noir',
    name: 'The Noir',
    description: 'Cinematic black & white with film grain overlay and elegant serif typography.',
    preview: 'bg-black border border-white/20',
    emoji: '🎬',
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
              onClick={() => updateProfile({ selectedTemplate: template.id as any })}
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
                <div className={`w-32 h-24 rounded-lg ${template.preview} flex items-center justify-center shrink-0 shadow-sm`}>
                  <span className="text-2xl">{template.emoji}</span>
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

    </div>
  );
}
