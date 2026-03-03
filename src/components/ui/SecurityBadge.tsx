import { Shield } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function SecurityBadge() {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/5 backdrop-blur-sm cursor-default transition-all hover:border-amber-500/50 hover:shadow-[0_0_12px_-2px_hsl(38,92%,50%,0.25)]">
            <Shield className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs font-medium text-amber-400/90">
              Security Verified by Foliogen AI
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-[220px] bg-card border-border text-foreground"
        >
          <ul className="space-y-1 text-xs">
            <li className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-emerald-500 shrink-0" />
              Constant-Time Auth
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-emerald-500 shrink-0" />
              Encrypted Data Streams
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-emerald-500 shrink-0" />
              RLS-Protected Profiles
            </li>
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}