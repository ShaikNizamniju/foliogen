import { useProfile } from '@/contexts/ProfileContext';
import { TemplateCard } from '../TemplateCard';
import { useFavorites } from '@/hooks/useFavorites';
import { templates } from './FavoritesSection';

export function TemplatesSection() {
  const { profile, updateProfile } = useProfile();
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleTemplateSelect = (templateId: string) => {
    updateProfile({ selectedTemplate: templateId as any });
  };

  const handleReset = () => {
    // Reuse existing selection logic; clear to default template id 'creative' (free default)
    try {
      updateProfile({ selectedTemplate: 'creative' as any });
    } catch {
      // Fallback: notify any listener that wants to handle reset
      window.dispatchEvent(new CustomEvent('template:reset'));
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
              className="text-[24px] font-bold text-white"
              style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}
            >
              Choose Your Template
            </h1>
          </div>
          <p className="text-[13px] text-white/45">
            Select a design that best represents your professional style.
          </p>
          {profile.predictedDomain && (
            <div className="mt-3 inline-block px-3 py-1.5 rounded-md bg-[#E8390E]/[0.08] border border-[#E8390E]/25 text-[12px] text-white/80">
              <span className="font-medium text-[#E8390E]">Optimized for {profile.predictedDomain}.</span>{' '}
              <span className="text-white/50">Changing templates may reduce effectiveness.</span>
            </div>
          )}
        </div>

        <button
          onClick={handleReset}
          className="shrink-0 text-[12px] text-white/60 bg-transparent border border-white/15 hover:border-white/30 hover:text-white/90 rounded-md px-3 py-1.5 transition-colors"
        >
          Reset to Default
        </button>
      </div>

      {/* Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        style={{ paddingBottom: 24 }}
      >
        {templates.map((template) => (
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
        ))}
      </div>

      {/* Bottom note */}
      <p
        className="text-center text-white/30"
        style={{ fontSize: 11, paddingBottom: 24 }}
      >
        Your choice is saved automatically. Preview updates in real-time.
      </p>
    </div>
  );
}
