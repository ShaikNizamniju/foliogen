import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Sparkles, Building2, Rocket, Landmark } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { useProfile, Persona } from "@/contexts/ProfileContext";
import { usePro } from "@/contexts/ProContext";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";

const PERSONAS: { id: Persona; label: string; icon: any; description: string; isPro?: boolean }[] = [
  { id: "general", label: "General Fit", icon: Sparkles, description: "Standard professional narrative.", isPro: false },
  { id: "bigtech", label: "Big Tech", icon: Building2, description: "Scale, Systems, Stakeholders.", isPro: true },
  { id: "startup", label: "Startup", icon: Rocket, description: "0-to-1, Velocity, Ambiguity.", isPro: true },
  { id: "fintech", label: "Fintech", icon: Landmark, description: "Trust, Compliance, Security.", isPro: true },
];

export function PersonaSwitcher() {
  const { profile, updateProfile } = useProfile();
  const { isPro } = usePro();
  const [searchParams, setSearchParams] = useSearchParams();
  const activePersona = profile.activePersona || "general";

  useEffect(() => {
    const handleNavigate = () => {
      setSearchParams({ section: 'billing' });
    };
    window.addEventListener('navigate-to-billing', handleNavigate);
    return () => window.removeEventListener('navigate-to-billing', handleNavigate);
  }, []);

  const handleSelect = (id: Persona) => {
    if (id === activePersona) return;
    
    // Optimistic UI updates
    updateProfile({ activePersona: id });
    
    // Dispatch global event for the Neural Sync animation on the dashboard
    window.dispatchEvent(new CustomEvent("persona-recalibrating", { detail: id }));

    // Log North Star Metric
    trackEvent('persona_switch', { persona: id });
  };

  const currentPersona = PERSONAS.find(i => i.id === activePersona) || PERSONAS[0];
  const Icon = currentPersona.icon;

  return (
    <div className="relative group mr-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-slate-200 dark:border-white/10 rounded-lg bg-white/40 dark:bg-black/40 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-black/60 transition-all text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white dark:shadow-[0_0_15px_rgba(255,255,255,0.02)] focus:outline-none focus:ring-1 focus:ring-slate-500/50 outline-none">
            <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
            <span>{currentPersona.label}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-50 ml-1" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-popover/95 backdrop-blur-xl border border-border shadow-xl rounded-xl p-1.5"
        >
          {PERSONAS.map((ind) => {
            const IndIcon = ind.icon;
            const isActive = ind.id === activePersona;
            return (
              <DropdownMenuItem
                key={ind.id}
                onClick={() => handleSelect(ind.id)}
                className={cn(
                  "flex justify-between items-center px-3 py-2.5 rounded-lg cursor-pointer transition-all outline-none my-0.5",
                  isActive 
                    ? "bg-slate-800/60 text-white" 
                    : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <IndIcon className={cn("w-4 h-4", isActive ? "text-blue-400" : "opacity-70")} />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className={cn("font-medium", isActive ? "font-semibold" : "")}>{ind.label}</span>
                    </div>
                    <span className="text-[10px] text-neutral-500">{ind.description}</span>
                  </div>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* The Noir Detail Micro-copy */}
      <div className="absolute -bottom-6 right-0 w-max pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
        <p className="text-[10px] text-neutral-500 font-mono tracking-wider bg-black/80 px-2 py-0.5 rounded border border-white/5 shadow-lg">
          Calibrating narrative for {currentPersona.label}...
        </p>
      </div>
    </div>
  );
}
