import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Sparkles, Building2, Rocket, Landmark, Stethoscope } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const INDUSTRIES = [
  { id: "none", label: "General Fit", icon: Sparkles },
  { id: "big tech", label: "Big Tech", icon: Building2 },
  { id: "startup", label: "Early-Stage Startup", icon: Rocket },
  { id: "fintech", label: "Fintech", icon: Landmark },
  { id: "healthtech", label: "Healthtech", icon: Stethoscope },
];

export function PersonaSwitcher() {
  const [industry, setIndustry] = useState("none");

  useEffect(() => {
    const saved = localStorage.getItem("foliogen_target_industry");
    if (saved) {
      setIndustry(saved);
    }
  }, []);

  const handleSelect = (id: string) => {
    if (id === industry) return;
    
    // Optimistic UI updates
    setIndustry(id);
    localStorage.setItem("foliogen_target_industry", id);
    
    // Dispatch global event for the Neural Sync animation on the dashboard
    window.dispatchEvent(new CustomEvent("persona-recalibrating", { detail: id }));
  };

  const currentIndustry = INDUSTRIES.find(i => i.id === industry) || INDUSTRIES[0];
  const Icon = currentIndustry.icon;

  return (
    <div className="relative group mr-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-slate-200 dark:border-white/10 rounded-lg bg-white/40 dark:bg-black/40 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-black/60 transition-all text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white dark:shadow-[0_0_15px_rgba(255,255,255,0.02)] focus:outline-none focus:ring-1 focus:ring-slate-500/50 outline-none">
            <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
            <span>{currentIndustry.label}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-50 ml-1" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.8)] rounded-xl p-1.5"
        >
          {INDUSTRIES.map((ind) => {
            const IndIcon = ind.icon;
            const isActive = ind.id === industry;
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
                  <span className={cn("font-medium", isActive ? "font-semibold" : "")}>{ind.label}</span>
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
          Calibrating narrative for {currentIndustry.label}...
        </p>
      </div>
    </div>
  );
}
