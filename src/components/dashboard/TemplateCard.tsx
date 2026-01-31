import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemplateCardProps {
  id: string;
  name: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}

// Mini preview components for each template style
const TemplatePreviewContent = ({ id }: { id: string }) => {
  switch (id) {
    case 'minimalist':
      return (
        <div className="h-full w-full bg-white p-3 flex flex-col">
          <div className="w-8 h-8 rounded-full bg-gray-200 mb-2" />
          <div className="h-2 w-16 bg-gray-900 rounded mb-1" />
          <div className="h-1.5 w-12 bg-gray-300 rounded mb-3" />
          <div className="flex-1 grid grid-cols-2 gap-1.5">
            <div className="bg-gray-100 rounded" />
            <div className="bg-gray-100 rounded" />
          </div>
        </div>
      );
    
    case 'creative':
      return (
        <div className="h-full w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-3 flex flex-col">
          <div className="flex gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur" />
            <div className="flex-1">
              <div className="h-1.5 w-10 bg-white/80 rounded mb-1" />
              <div className="h-1 w-8 bg-white/40 rounded" />
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-1.5">
            <div className="bg-white/20 backdrop-blur rounded-lg" />
            <div className="bg-white/20 backdrop-blur rounded-lg" />
            <div className="col-span-2 bg-white/20 backdrop-blur rounded-lg" />
          </div>
        </div>
      );
    
    case 'saas':
      return (
        <div className="h-full w-full bg-gradient-to-b from-violet-50 to-white p-3 flex flex-col">
          <div className="h-2 w-14 bg-violet-600 rounded mb-1" />
          <div className="h-1 w-20 bg-gray-300 rounded mb-3" />
          <div className="flex gap-2 mb-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 bg-white rounded shadow-sm p-1.5">
                <div className="h-1.5 w-4 bg-violet-200 rounded mb-1" />
                <div className="h-3 w-full bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      );
    
    case 'dev':
      return (
        <div className="h-full w-full bg-[#0D1117] p-3 flex flex-col font-mono">
          <div className="flex gap-1 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-500/60" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
            <div className="w-2 h-2 rounded-full bg-green-500/60" />
          </div>
          <div className="space-y-1">
            <div className="flex gap-1">
              <div className="h-1 w-3 bg-purple-400 rounded" />
              <div className="h-1 w-6 bg-green-400 rounded" />
            </div>
            <div className="flex gap-1 pl-2">
              <div className="h-1 w-4 bg-blue-400 rounded" />
              <div className="h-1 w-8 bg-amber-400 rounded" />
            </div>
            <div className="h-1 w-2 bg-gray-500 rounded" />
          </div>
        </div>
      );
    
    case 'brutalist':
      return (
        <div className="h-full w-full bg-[#FFE962] p-2 flex flex-col">
          <div className="border-4 border-black p-1.5 mb-2 bg-white shadow-[4px_4px_0_0_#000]">
            <div className="h-2 w-12 bg-black rounded-sm" />
          </div>
          <div className="flex-1 grid grid-cols-2 gap-1.5">
            <div className="border-3 border-black bg-white shadow-[3px_3px_0_0_#000]" />
            <div className="border-3 border-black bg-[#FF6B6B] shadow-[3px_3px_0_0_#000]" />
          </div>
        </div>
      );
    
    case 'academic':
      return (
        <div className="h-full w-full bg-[#fdfbf7] p-3 flex flex-col" style={{ fontFamily: 'Georgia, serif' }}>
          <div className="border-b-2 border-[#8b7355] pb-1 mb-2">
            <div className="h-2 w-16 bg-[#1a1a1a] rounded-sm" />
          </div>
          <div className="space-y-1.5">
            <div className="h-1 w-full bg-[#d4c5b0] rounded-sm" />
            <div className="h-1 w-4/5 bg-[#d4c5b0] rounded-sm" />
            <div className="h-1 w-full bg-[#d4c5b0] rounded-sm" />
          </div>
        </div>
      );
    
    case 'studio':
      return (
        <div className="h-full w-full bg-[#1a1a1a] p-2 flex flex-col">
          <div className="h-1.5 w-8 bg-white/80 rounded mb-2" />
          <div className="flex-1 grid grid-cols-3 gap-1">
            <div className="col-span-2 row-span-2 bg-gradient-to-br from-gray-600 to-gray-800 rounded" />
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded" />
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded" />
          </div>
        </div>
      );
    
    case 'executive':
      return (
        <div className="h-full w-full bg-[#0f172a] p-3 flex flex-col">
          <div className="flex items-center gap-2 mb-2 pb-1 border-b border-amber-400/30">
            <div className="w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400/50" />
            <div className="h-1.5 w-10 bg-amber-400 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-2 flex-1">
            <div className="space-y-1">
              <div className="h-1 w-8 bg-white/60 rounded" />
              <div className="h-1 w-6 bg-white/30 rounded" />
            </div>
            <div className="space-y-1">
              <div className="h-1 w-8 bg-white/60 rounded" />
              <div className="h-1 w-6 bg-white/30 rounded" />
            </div>
          </div>
        </div>
      );
    
    case 'influencer':
      return (
        <div className="h-full w-full bg-gradient-to-br from-pink-200 via-purple-200 to-cyan-200 p-3 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-white/60 backdrop-blur border-2 border-white/80 mb-2" />
          <div className="h-1.5 w-10 bg-white/80 rounded mb-1" />
          <div className="flex-1 w-full space-y-1.5 mt-2">
            <div className="h-4 w-full bg-white/40 backdrop-blur rounded-lg" />
            <div className="h-4 w-full bg-white/40 backdrop-blur rounded-lg" />
          </div>
        </div>
      );
    
    case 'swiss':
      return (
        <div className="h-full w-full bg-white p-2 flex flex-col">
          <div className="h-3 w-16 bg-black mb-1" />
          <div className="h-0.5 w-full bg-red-500 mb-2" />
          <div className="flex-1 grid grid-cols-3 gap-1">
            <div className="col-span-2 bg-black" />
            <div className="bg-gray-200" />
            <div className="bg-gray-200" />
            <div className="bg-red-500" />
            <div className="bg-gray-200" />
          </div>
        </div>
      );
    
    case 'noir':
      return (
        <div className="h-full w-full bg-black p-3 flex flex-col relative overflow-hidden">
          {/* Film grain effect */}
          <div className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
          <div className="relative z-10">
            <div className="h-2 w-12 bg-white mb-1" style={{ fontFamily: 'Georgia, serif' }} />
            <div className="h-1 w-16 bg-white/40 mb-3" />
            <div className="grid grid-cols-2 gap-1.5">
              <div className="h-8 bg-gradient-to-b from-white/20 to-transparent rounded" />
              <div className="h-8 bg-gradient-to-b from-white/20 to-transparent rounded" />
            </div>
          </div>
        </div>
      );
    
    default:
      return (
        <div className="h-full w-full bg-gray-100 p-3 flex items-center justify-center">
          <div className="h-2 w-12 bg-gray-300 rounded" />
        </div>
      );
  }
};

export function TemplateCard({ id, name, description, isSelected, onSelect }: TemplateCardProps) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative w-full text-left rounded-xl overflow-hidden transition-all duration-300",
        "bg-card border-2",
        isSelected
          ? "border-primary ring-2 ring-primary/20 shadow-lg"
          : "border-border hover:border-primary/40 hover:shadow-md"
      )}
    >
      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 z-20 h-6 w-6 rounded-full bg-primary flex items-center justify-center shadow-lg"
        >
          <Check className="h-3.5 w-3.5 text-primary-foreground" />
        </motion.div>
      )}

      {/* Mini Preview */}
      <div className="aspect-[4/3] w-full overflow-hidden">
        <motion.div
          className="h-full w-full"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <TemplatePreviewContent id={id} />
        </motion.div>
      </div>

      {/* Info */}
      <div className="p-4 bg-card">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
          {description}
        </p>
      </div>

      {/* Hover overlay */}
      <div className={cn(
        "absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-300",
        "group-hover:opacity-100"
      )} />
    </motion.button>
  );
}
