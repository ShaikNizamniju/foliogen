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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Smartphone, Monitor, ChevronRight } from "lucide-react";
import { FONT_OPTIONS, FontChoice } from "@/contexts/ProfileContext";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function LivePreviewPane() {
  const { profile, updateProfile } = useProfile();
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <>
      <AnimatePresence>
        {profile.selectedFont && profile.selectedFont !== 'default' && (() => {
          const fontOption = FONT_OPTIONS.find(f => f.id === profile.selectedFont);
          if (!fontOption) return null;
          return (
            <Helmet key={profile.selectedFont}>
              <link
                rel="stylesheet"
                href={`https://fonts.googleapis.com/css2?family=${fontOption.googleFont}&display=swap`}
              />
            </Helmet>
          );
        })()}
      </AnimatePresence>

      <div className="hidden lg:flex flex-col w-[450px] xl:w-[500px] border-l border-border bg-muted/10 h-full overflow-hidden shrink-0">
        {/* Enhanced Preview Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50 backdrop-blur-md shrink-0 gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest shrink-0">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Preview
          </div>
          
          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-muted rounded-lg p-0.5 mr-2">
              <button 
                onClick={() => setViewMode('desktop')}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewMode === 'desktop' ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Monitor className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={() => setViewMode('mobile')}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewMode === 'mobile' ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Smartphone className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Template Selector */}
            <Select
              value={profile.selectedTemplate}
              onValueChange={(value) => updateProfile({ selectedTemplate: value as any })}
            >
              <SelectTrigger className="w-[120px] h-8 text-[11px] font-medium bg-muted/50 border-none shadow-none focus:ring-1">
                <SelectValue placeholder="Template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern-dark">Modern Dark</SelectItem>
                <SelectItem value="minimalist">Minimalist</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="saas">The Founder</SelectItem>
                <SelectItem value="dev">The Terminal</SelectItem>
                <SelectItem value="noir">The Noir</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Live Preview Scrollable Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 custom-scrollbar bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-muted/20 to-transparent">
          <motion.div 
            layout
            className={cn(
              "mx-auto rounded-xl border border-border bg-card shadow-2xl overflow-hidden transition-all duration-500 origin-top",
              viewMode === 'desktop' 
                ? "w-[180%] transform scale-[0.52] -translate-x-1/2 left-1/2 relative" 
                : "w-full max-w-[320px] transform scale-[0.85]"
            )}
          >
            <div
              id="portfolio-live-container"
              className="min-h-0 w-full"
              style={{
                fontFamily: (() => {
                  const fontOption = FONT_OPTIONS.find(f => f.id === profile.selectedFont);
                  return fontOption && profile.selectedFont !== 'default'
                    ? `'${fontOption.preview}', sans-serif`
                    : undefined;
                })(),
              }}
            >
              {/* Force re-animation on major profile changes via key */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={profile.selectedTemplate + (profile.fullName || 'empty')}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {(() => {
                    const activePersona = profile.activePersona || "general";
                    const variant = profile.narrativeVariants?.[activePersona];
                    const displayProfile = { 
                      ...profile, 
                      bio: variant?.bio || profile.bio,
                      headline: variant?.headline || profile.headline,
                      photoUrl: profile.hidePhoto ? "" : profile.photoUrl 
                    };

                    switch (profile.selectedTemplate) {
                      case "modern-dark": return <ModernDarkTemplate profile={displayProfile} />;
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
                      default: return <ModernDarkTemplate profile={displayProfile} />;
                    }
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
          
          {/* Helpful Hint */}
          <div className="mt-8 text-center">
            <p className="text-[10px] text-muted-foreground/60 flex items-center justify-center gap-1">
              Changes sync in real-time <ChevronRight className="h-2.5 w-2.5" /> Select template to swap looks
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
