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
import { NijuBoldTemplate } from "@/components/templates/NijuBoldTemplate";
import { MinimalSaasTemplate } from "@/components/templates/MinimalSaasTemplate";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye } from "lucide-react";

export function TemplatePreview() {
  const { profile, updateProfile } = useProfile();

  return (
    <div data-template-preview className="hidden lg:flex flex-col w-[500px] border-l border-border bg-muted/20 h-full">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Eye className="h-4 w-4" />
          Live Preview
        </div>
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
            <SelectItem value="niju-bold">Niju Bold</SelectItem>
            <SelectItem value="minimal-saas">Minimal SaaS</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Preview Content - Natural scrolling */}
      <div className="flex-1 overflow-auto p-4 print:p-0 print:overflow-visible">
        <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden transform scale-[0.55] origin-top-left w-[182%] print:transform-none print:w-full print:border-0 print:shadow-none print:rounded-none">
          <div id="portfolio-export-container" className="min-h-0 print:w-full">
            {profile.selectedTemplate === "minimalist" && <MinimalistTemplate profile={profile} />}
            {profile.selectedTemplate === "creative" && <CreativeTemplate profile={profile} />}
            {profile.selectedTemplate === "saas" && <SaasTemplate profile={profile} />}
            {profile.selectedTemplate === "dev" && <DevTemplate profile={profile} />}
            {profile.selectedTemplate === "brutalist" && <BrutalistTemplate profile={profile} />}
            {profile.selectedTemplate === "academic" && <AcademicTemplate profile={profile} />}
            {profile.selectedTemplate === "studio" && <StudioTemplate profile={profile} />}
            {profile.selectedTemplate === "executive" && <ExecutiveTemplate profile={profile} />}
            {profile.selectedTemplate === "influencer" && <InfluencerTemplate profile={profile} />}
            {profile.selectedTemplate === "swiss" && <SwissTemplate profile={profile} />}
            {profile.selectedTemplate === "noir" && <NoirTemplate profile={profile} />}
            {profile.selectedTemplate === "modern-dark" && <ModernDarkTemplate profile={profile} />}
            {profile.selectedTemplate === "gaspar" && <GasparTemplate profile={profile} />}
            {profile.selectedTemplate === "destello" && <DestelloTemplate profile={profile} />}
            {profile.selectedTemplate === "frqncy" && <FrqncyTemplate profile={profile} />}
            {profile.selectedTemplate === "arpeggio" && <ArpeggioTemplate profile={profile} />}
            {profile.selectedTemplate === "nakula" && <NakulaTemplate profile={profile} />}
            {profile.selectedTemplate === "niju-bold" && <NijuBoldTemplate profile={profile} />}
            {profile.selectedTemplate === "minimal-saas" && <MinimalSaasTemplate profile={profile} />}
          </div>
        </div>
      </div>
    </div>
  );
}
