import { useState } from 'react';
import { toast } from 'sonner';
import { useProfile } from '@/contexts/ProfileContext';
import { TemplateCard } from '../TemplateCard';
import { useFavorites } from '@/hooks/useFavorites';
import { templates } from './FavoritesSection';

const DEFAULT_TEMPLATE = 'minimalist';

export function TemplatesSection() {
  const { profile, updateProfile, saveProfile } = useProfile();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [resetting, setResetting] = useState(false);
  const [justSelected, setJustSelected] = useState<string | null>(null);

  const handleTemplateSelect = (templateId: string) => {
    updateProfile({ selectedTemplate: templateId as any });
    setJustSelected(templateId);
    window.setTimeout(() => setJustSelected(null), 300);
  };

  const handleReset = async () => {
    if (resetting) return;
    setResetting(true);
    try {
      updateProfile({ selectedTemplate: DEFAULT_TEMPLATE as any });
      const { error } = await saveProfile({ selectedTemplate: DEFAULT_TEMPLATE as any });
      if (error) throw error;
      toast.success('Reset complete');
    } catch (e) {
      toast.error('Reset failed, please try again');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="block h-[2px] w-6 bg-[#E8390E]" aria-hidden />
            <h1
              className="text-[24px] font-bold text-foreground"
              style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}
            >
              Choose Your Template
            </h1>
          </div>
          <p className="text-[13px] text-muted-foreground">
            Select a design that best represents your professional style.
          </p>
          {profile.predictedDomain && (
            <div className="mt-3 inline-block px-3 py-1.5 rounded-md bg-[#E8390E]/[0.08] border border-[#E8390E]/25 text-[12px] text-foreground/80">
              <span className="font-medium text-[#E8390E]">Optimized for {profile.predictedDomain}.</span>{' '}
              <span className="text-muted-foreground">Changing templates may reduce effectiveness.</span>
            </div>
          )}
        </div>

        <button
          onClick={handleReset}
          disabled={resetting}
          className="shrink-0 text-[12px] text-muted-foreground bg-transparent border border-border hover:border-foreground/30 hover:text-foreground rounded-md px-3 py-1.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {resetting ? 'Resetting…' : 'Reset to Default'}
        </button>
      </div>

      {/* Grid */}
      <div className="tpl-grid" style={{ paddingBottom: 24 }}>
        {templates.map((template) => {
          const isLast = template.id === templates[templates.length - 1].id;
          const aloneInRow = templates.length % 3 === 1;
          const card = (
            <TemplateCard
              key={template.id}
              id={template.id}
              name={template.name}
              description={template.description}
              isSelected={profile.selectedTemplate === template.id}
              onSelect={() => handleTemplateSelect(template.id)}
              isFavorite={isFavorite(template.id)}
              onToggleFavorite={toggleFavorite}
            />
          );
          // Wrap last lonely card so it left-aligns instead of stretching
          if (isLast && aloneInRow) {
            return (
              <div
                key={template.id}
                style={{ gridColumn: '1 / 2' }}
                className={justSelected === template.id ? 'just-selected-wrap' : undefined}
              >
                {card}
              </div>
            );
          }
          return (
            <div
              key={template.id}
              className={justSelected === template.id ? 'just-selected-wrap' : undefined}
            >
              {card}
            </div>
          );
        })}
      </div>

      <p
        className="text-center text-muted-foreground"
        style={{ fontSize: 11, padding: '16px 0 24px' }}
      >
        Your choice is saved automatically. Preview updates in real-time.
      </p>
    </div>
  );
}
