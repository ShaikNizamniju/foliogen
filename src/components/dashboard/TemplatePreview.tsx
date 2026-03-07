import { useProfile } from "@/contexts/ProfileContext";
import { MinimalistTemplate } from "./templates/MinimalistTemplate";
import { CreativeTemplate } from "./templates/CreativeTemplate";
import { SaasTemplate } from "./templates/SaasTemplate";
import { DevTemplate } from "./templates/DevTemplate";
import { BrutalistTemplate } from "./templates/BrutalistTemplate";
import { AcademicTemplate } from "./templates/AcademicTemplate";
import { StudioTemplate } from "./templates/StudioTemplate";
import { ExecutiveTemplate } from "./templates/ExecutiveTemplate";
import { InfluencerTemplate } from "./templates/InfluencerTemplate";
import { SwissTemplate } from "./templates/SwissTemplate";
import { NoirTemplate } from "./templates/NoirTemplate";
import { ModernDarkTemplate } from "./templates/ModernDarkTemplate";
import { GasparTemplate } from "@/components/templates/GasparTemplate";
import { DestelloTemplate } from "@/components/templates/DestelloTemplate";
import { FrqncyTemplate } from "@/components/templates/FrqncyTemplate";
import { ArpeggioTemplate } from "@/components/templates/ArpeggioTemplate";
import { NakulaTemplate } from "@/components/templates/NakulaTemplate";
import { HeroBoldTemplate } from "@/components/templates/HeroBoldTemplate";
import { MinimalSaasTemplate } from "@/components/templates/MinimalSaasTemplate";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye } from "lucide-react";
import { FONT_OPTIONS, FontChoice } from "@/contexts/ProfileContext";
import { Helmet } from "react-helmet-async";

export function TemplatePreview() {
  const { profile, updateProfile } = useProfile();

  return (
    <>
      {/* Real-time Font Sync: Load currently selected font */}
      {profile.selectedFont && profile.selectedFont !== 'default' && (() => {
        const fontOption = FONT_OPTIONS.find(f => f.id === profile.selectedFont);
        if (!fontOption) return null;
        return (
          <Helmet>
            <link
              rel="stylesheet"
              href={`https://fonts.googleapis.com/css2?family=${fontOption.googleFont}&display=swap`}
            />
          </Helmet>
        );
      })()}

      <div data-template-preview className="hidden lg:flex flex-col w-[500px] border-l border-border bg-muted/20 h-full">
        {/* Preview Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card shrink-0 gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground shrink-0">
            <Eye className="h-4 w-4" />
            Live Preview
          </div>
          <div className="flex items-center gap-2">
            {/* Font Selector */}
            <Select
              value={profile.selectedFont}
              onValueChange={(value) => updateProfile({ selectedFont: value as FontChoice })}
            >
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue placeholder="Font" />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((font) => (
                  <SelectItem key={font.id} value={font.id} className="text-xs" style={{ fontFamily: font.preview }}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Template Selector */}
            <Select
              value={profile.selectedTemplate}
              onValueChange={(value) => updateProfile({ selectedTemplate: value as any })}
            >
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue placeholder="Template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimalist">Minimalist</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="saas">The Founder</SelectItem>
                <SelectItem value="dev">The Terminal</SelectItem>
                <SelectItem value="brutalist">The Creative</SelectItem>
                <SelectItem value="academic">The Academic</SelectItem>
                <SelectItem value="studio">The Studio</SelectItem>
                <SelectItem value="executive">The Executive</SelectItem>
                <SelectItem value="influencer">The Influencer</SelectItem>
                <SelectItem value="swiss">The Swiss</SelectItem>
                <SelectItem value="noir">The Noir</SelectItem>
                <SelectItem value="modern-dark">Modern Dark</SelectItem>
                <SelectItem value="gaspar">Gaspar</SelectItem>
                <SelectItem value="destello">Destello</SelectItem>
                <SelectItem value="frqncy">Frqncy</SelectItem>
                <SelectItem value="arpeggio">Arpeggio</SelectItem>
                <SelectItem value="nakula">Nakula</SelectItem>
                <SelectItem value="niju-bold">Hero Bold</SelectItem>
                <SelectItem value="minimal-saas">Minimal SaaS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Preview Content - Natural scrolling */}
        <div className="flex-1 overflow-auto p-4 print:p-0 print:overflow-visible">
          <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden transform scale-[0.55] origin-top-left w-[182%] print:transform-none print:w-full print:border-0 print:shadow-none print:rounded-none">
            <div
              id="portfolio-export-container"
              className="min-h-0 print:w-full"
              style={{
                fontFamily: (() => {
                  const fontOption = FONT_OPTIONS.find(f => f.id === profile.selectedFont);
                  return fontOption && profile.selectedFont !== 'default'
                    ? `'${fontOption.preview}', sans-serif`
                    : undefined;
                })(),
              }}
            >
              {(() => {
                const displayProfile = { ...profile, photoUrl: profile.hidePhoto ? "" : profile.photoUrl };
                switch (profile.selectedTemplate) {
                  case "minimalist": return <MinimalistTemplate profile={displayProfile} />;
                  case "creative": return <CreativeTemplate profile={displayProfile} />;
                  case "saas": return <SaasTemplate profile={displayProfile} />;
                  case "dev": return <DevTemplate profile={displayProfile} />;
                  case "brutalist": return <BrutalistTemplate profile={displayProfile} />;
                  case "academic": return <AcademicTemplate profile={displayProfile} />;
                  case "studio": return <StudioTemplate profile={displayProfile} />;
                  case "executive": return <ExecutiveTemplate profile={displayProfile} />;
                  case "influencer": return <InfluencerTemplate profile={displayProfile} />;
                  case "swiss": return <SwissTemplate profile={displayProfile} />;
                  case "noir": return <NoirTemplate profile={displayProfile} />;
                  case "modern-dark": return <ModernDarkTemplate profile={displayProfile} />;
                  case "gaspar": return <GasparTemplate profile={displayProfile} />;
                  case "destello": return <DestelloTemplate profile={displayProfile} />;
                  case "frqncy": return <FrqncyTemplate profile={displayProfile} />;
                  case "arpeggio": return <ArpeggioTemplate profile={displayProfile} />;
                  case "nakula": return <NakulaTemplate profile={displayProfile} />;
                  case "niju-bold": return <HeroBoldTemplate profile={displayProfile} />;
                  case "minimal-saas": return <MinimalSaasTemplate profile={displayProfile} />;
                  default: return <MinimalistTemplate profile={displayProfile} />;
                }
              })()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
