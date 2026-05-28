import { Check, Heart, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface TemplateCardProps {
  id: string;
  name: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

/* ============================================================
   Inline SVG preview mockups — one per template id.
   viewBox 400x300 (4:3). No external assets, no fetch.
   ============================================================ */
const TemplateSVG = ({ id }: { id: string }) => {
  const common = { viewBox: '0 0 400 300', preserveAspectRatio: 'xMidYMid slice', width: '100%', height: '100%' } as const;

  switch (id) {
    case 'minimalist':
      return (
        <svg {...common}>
          <rect width="400" height="300" fill="#ffffff" />
          <rect x="0" y="0" width="400" height="8" fill="#0a0a0a" />
          <rect x="32" y="40" width="120" height="6" fill="#9ca3af" />
          <rect x="32" y="58" width="180" height="4" fill="#d1d5db" />
          <rect x="32" y="74" width="160" height="4" fill="#d1d5db" />
          <rect x="32" y="120" width="336" height="1" fill="#e5e7eb" />
          <rect x="32" y="140" width="240" height="4" fill="#d1d5db" />
          <rect x="32" y="156" width="200" height="4" fill="#d1d5db" />
          <rect x="32" y="172" width="280" height="4" fill="#d1d5db" />
          <rect x="32" y="220" width="80" height="3" fill="#9ca3af" />
        </svg>
      );
    case 'modern-dark':
      return (
        <svg {...common}>
          <rect width="400" height="300" fill="#0a0a0a" />
          <rect x="0" y="0" width="400" height="4" fill="#00E5FF" />
          <rect x="24" y="32" width="120" height="8" rx="2" fill="#1f2937" />
          <rect x="24" y="52" width="80" height="4" rx="1" fill="#00E5FF" opacity="0.6" />
          <rect x="24" y="96" width="160" height="100" rx="10" fill="#111827" stroke="#1f2937" />
          <rect x="200" y="96" width="160" height="100" rx="10" fill="#111827" stroke="#1f2937" />
          <circle cx="340" cy="60" r="40" fill="#00E5FF" opacity="0.15" />
        </svg>
      );
    case 'creative':
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="creativeBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <radialGradient id="creativeGlow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="400" height="300" fill="url(#creativeBg)" />
          <circle cx="200" cy="150" r="90" fill="url(#creativeGlow)" />
          <rect x="24" y="24" width="170" height="120" rx="12" fill="#ffffff" opacity="0.18" />
          <rect x="206" y="24" width="170" height="120" rx="12" fill="#ffffff" opacity="0.12" />
          <rect x="24" y="156" width="170" height="120" rx="12" fill="#ffffff" opacity="0.12" />
          <rect x="206" y="156" width="170" height="120" rx="12" fill="#ffffff" opacity="0.18" />
        </svg>
      );
    case 'saas':
      return (
        <svg {...common}>
          <rect width="400" height="300" fill="#ffffff" />
          <rect x="0" y="0" width="400" height="10" fill="#0a0a0a" />
          <rect x="24" y="36" width="140" height="10" fill="#0a0a0a" />
          <rect x="24" y="56" width="200" height="4" fill="#9ca3af" />
          <g>
            <rect x="24" y="110" width="108" height="80" rx="6" fill="#f3f4f6" />
            <rect x="40" y="125" width="40" height="10" fill="#0a0a0a" />
            <rect x="40" y="145" width="60" height="4" fill="#6b7280" />
            <rect x="146" y="110" width="108" height="80" rx="6" fill="#f3f4f6" />
            <rect x="162" y="125" width="40" height="10" fill="#0a0a0a" />
            <rect x="162" y="145" width="60" height="4" fill="#6b7280" />
            <rect x="268" y="110" width="108" height="80" rx="6" fill="#f3f4f6" />
            <rect x="284" y="125" width="40" height="10" fill="#0a0a0a" />
            <rect x="284" y="145" width="60" height="4" fill="#6b7280" />
          </g>
        </svg>
      );
    case 'dev':
      return (
        <svg {...common}>
          <rect width="400" height="300" fill="#0d1117" />
          <g fill="#00FF41" fontFamily="monospace" fontSize="11">
            <text x="20" y="40">$ whoami</text>
            <text x="20" y="62">$ cat profile.md</text>
            <text x="20" y="84"># Senior Engineer</text>
            <text x="20" y="106">- React · TS · Node</text>
            <text x="20" y="128">- 8+ years building</text>
            <text x="20" y="150">$ ls projects/</text>
            <text x="20" y="172">portfolio  api  cli</text>
            <text x="20" y="200">$ _</text>
          </g>
          <rect x="44" y="192" width="8" height="12" fill="#00FF41">
            <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
          </rect>
        </svg>
      );
    case 'brutalist':
      return (
        <svg {...common}>
          <rect width="400" height="300" fill="#ffffff" />
          <rect x="20" y="20" width="360" height="80" fill="#ffffff" stroke="#000" strokeWidth="6" />
          <text x="36" y="78" fontFamily="Impact, sans-serif" fontSize="48" fill="#000">BOLD.</text>
          <rect x="20" y="120" width="14" height="160" fill="#E8390E" />
          <rect x="50" y="120" width="330" height="14" fill="#000" />
          <rect x="50" y="150" width="200" height="10" fill="#000" />
          <rect x="50" y="170" width="160" height="10" fill="#000" />
          <rect x="50" y="220" width="120" height="60" fill="#ffffff" stroke="#000" strokeWidth="6" />
          <rect x="190" y="220" width="120" height="60" fill="#E8390E" stroke="#000" strokeWidth="6" />
        </svg>
      );
    case 'academic':
      return (
        <svg {...common}>
          <rect width="400" height="300" fill="#F5F0E8" />
          <rect x="0" y="0" width="400" height="40" fill="#1B2A4A" />
          <text x="24" y="27" fontFamily="Georgia, serif" fontSize="16" fill="#F5F0E8">Curriculum Vitae</text>
          <g fontFamily="Georgia, serif" fill="#1B2A4A">
            <rect x="24" y="60" width="160" height="3" fill="#1B2A4A" />
            <rect x="24" y="74" width="160" height="3" fill="#bfb19a" />
            <rect x="24" y="86" width="140" height="3" fill="#bfb19a" />
            <rect x="24" y="98" width="160" height="3" fill="#bfb19a" />
            <rect x="24" y="110" width="120" height="3" fill="#bfb19a" />
            <rect x="216" y="60" width="160" height="3" fill="#1B2A4A" />
            <rect x="216" y="74" width="160" height="3" fill="#bfb19a" />
            <rect x="216" y="86" width="140" height="3" fill="#bfb19a" />
            <rect x="216" y="98" width="160" height="3" fill="#bfb19a" />
            <rect x="216" y="110" width="120" height="3" fill="#bfb19a" />
          </g>
        </svg>
      );
    case 'studio':
      return (
        <svg {...common}>
          <rect width="400" height="300" fill="#111111" />
          <rect x="20" y="20" width="120" height="180" rx="6" fill="#1f1f1f" />
          <rect x="150" y="20" width="120" height="80" rx="6" fill="#F59E0B" opacity="0.85" />
          <rect x="150" y="110" width="120" height="90" rx="6" fill="#1f1f1f" />
          <rect x="280" y="20" width="100" height="120" rx="6" fill="#1f1f1f" />
          <rect x="280" y="150" width="100" height="50" rx="6" fill="#F59E0B" opacity="0.6" />
          <rect x="20" y="210" width="360" height="70" rx="6" fill="#1f1f1f" />
        </svg>
      );
    case 'executive':
      return (
        <svg {...common}>
          <rect width="400" height="300" fill="#0A1628" />
          <rect x="24" y="28" width="160" height="2" fill="#C9A84C" />
          <text x="24" y="58" fontFamily="Georgia, serif" fontSize="18" fill="#C9A84C">EXECUTIVE</text>
          <rect x="24" y="70" width="80" height="2" fill="#C9A84C" />
          <g fill="#ffffff" opacity="0.7">
            <rect x="24" y="100" width="160" height="3" />
            <rect x="24" y="112" width="140" height="3" />
            <rect x="24" y="124" width="160" height="3" />
            <rect x="216" y="100" width="160" height="3" />
            <rect x="216" y="112" width="140" height="3" />
            <rect x="216" y="124" width="160" height="3" />
          </g>
          <rect x="24" y="170" width="352" height="1" fill="#C9A84C" opacity="0.4" />
          <g fill="#ffffff" opacity="0.5">
            <rect x="24" y="190" width="100" height="3" />
            <rect x="24" y="202" width="80" height="3" />
            <rect x="216" y="190" width="100" height="3" />
            <rect x="216" y="202" width="80" height="3" />
          </g>
        </svg>
      );
    case 'influencer':
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="infBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E8D5FF" />
              <stop offset="100%" stopColor="#FFD5E8" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#infBg)" />
          <circle cx="200" cy="60" r="28" fill="#ffffff" opacity="0.85" />
          <rect x="160" y="100" width="80" height="6" rx="3" fill="#7c3aed" opacity="0.6" />
          <rect x="80" y="130" width="240" height="34" rx="17" fill="#ffffff" opacity="0.55" />
          <rect x="80" y="174" width="240" height="34" rx="17" fill="#ffffff" opacity="0.55" />
          <rect x="80" y="218" width="240" height="34" rx="17" fill="#ffffff" opacity="0.55" />
        </svg>
      );
    case 'swiss':
      return (
        <svg {...common}>
          <rect width="400" height="300" fill="#ffffff" />
          <line x1="100" y1="0" x2="100" y2="300" stroke="#E8390E" strokeWidth="1" />
          <line x1="0" y1="80" x2="400" y2="80" stroke="#E8390E" strokeWidth="1" />
          <text x="24" y="62" fontFamily="Helvetica, Arial" fontWeight="700" fontSize="40" fill="#0a0a0a">Helvetica.</text>
          <rect x="110" y="100" width="180" height="6" fill="#0a0a0a" />
          <rect x="110" y="118" width="240" height="3" fill="#9ca3af" />
          <rect x="110" y="130" width="200" height="3" fill="#9ca3af" />
          <rect x="110" y="142" width="220" height="3" fill="#9ca3af" />
          <rect x="110" y="200" width="80" height="80" fill="#E8390E" />
          <rect x="200" y="200" width="80" height="80" fill="#0a0a0a" />
        </svg>
      );
    case 'noir':
      return (
        <svg {...common}>
          <defs>
            <filter id="noirGrain">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
              <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.06 0" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="#0a0a0a" />
          <text x="24" y="80" fontFamily="Georgia, serif" fontSize="38" fill="#ffffff" letterSpacing="2">NOIR</text>
          <rect x="24" y="110" width="180" height="2" fill="#ffffff" opacity="0.6" />
          <rect x="24" y="140" width="220" height="2" fill="#ffffff" opacity="0.3" />
          <rect x="24" y="156" width="200" height="2" fill="#ffffff" opacity="0.3" />
          <rect x="24" y="172" width="240" height="2" fill="#ffffff" opacity="0.3" />
          <rect x="24" y="220" width="160" height="60" fill="#ffffff" opacity="0.06" />
          <rect x="200" y="220" width="160" height="60" fill="#ffffff" opacity="0.06" />
          <rect width="400" height="300" filter="url(#noirGrain)" opacity="0.5" />
        </svg>
      );
    case 'gaspar':
      return (
        <svg {...common}>
          <rect width="400" height="300" fill="#FAF7F0" />
          <circle cx="22" cy="22" r="2" fill="#1a1a1a" />
          <circle cx="32" cy="22" r="2" fill="#1a1a1a" />
          <circle cx="42" cy="22" r="2" fill="#1a1a1a" />
          <text x="378" y="25" textAnchor="end" fontFamily="Georgia, serif" fontSize="9" letterSpacing="1.5" fill="#1a1a1a">WORK  ABOUT  CONTACT</text>
          <rect x="24" y="70" width="320" height="32" fill="#1a1a1a" />
          <rect x="24" y="112" width="240" height="24" fill="#1a1a1a" />
          <rect x="24" y="160" width="352" height="1" fill="#1a1a1a" opacity="0.3" />
          <g fill="#1a1a1a" opacity="0.55">
            <rect x="24" y="176" width="150" height="3" />
            <rect x="24" y="186" width="130" height="3" />
            <rect x="24" y="196" width="150" height="3" />
            <rect x="216" y="176" width="150" height="3" />
            <rect x="216" y="186" width="130" height="3" />
            <rect x="216" y="196" width="150" height="3" />
          </g>
          <text x="24" y="276" fontFamily="Georgia, serif" fontSize="11" letterSpacing="2" fill="#1a1a1a">GASPAR</text>
          <g fill="#1a1a1a" opacity="0.7">
            <circle cx="320" cy="272" r="4" />
            <circle cx="340" cy="272" r="4" />
            <circle cx="360" cy="272" r="4" />
          </g>
        </svg>
      );
    case 'destello':
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="destBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1a0533" />
              <stop offset="100%" stopColor="#2d1065" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#destBg)" />
          <text x="24" y="32" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="700" fill="#ffffff">destello</text>
          <text x="24" y="84" fontFamily="Inter, sans-serif" fontSize="28" fontWeight="700" fill="#FF3CAC">01</text>
          <rect x="70" y="74" width="220" height="8" fill="#ffffff" opacity="0.85" />
          <text x="24" y="138" fontFamily="Inter, sans-serif" fontSize="28" fontWeight="700" fill="#FF3CAC">02</text>
          <rect x="70" y="128" width="220" height="8" fill="#ffffff" opacity="0.85" />
          <text x="24" y="192" fontFamily="Inter, sans-serif" fontSize="28" fontWeight="700" fill="#FF3CAC">03</text>
          <rect x="70" y="182" width="220" height="8" fill="#ffffff" opacity="0.85" />
          <rect x="24" y="220" width="60" height="20" rx="4" fill="#FF3CAC" />
          <rect x="24" y="268" width="352" height="1" fill="#FF3CAC" opacity="0.6" />
        </svg>
      );
    case 'frqncy':
      return (
        <svg {...common}>
          <rect width="400" height="300" fill="#0a0a0a" />
          <text x="20" y="26" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="12" fill="#ffffff">FRQNCY</text>
          <g fill="#ffffff" opacity="0.7">
            <rect x="300" y="20" width="20" height="3" />
            <rect x="330" y="20" width="20" height="3" />
            <rect x="360" y="20" width="20" height="3" />
          </g>
          <text x="20" y="78" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="24" fill="#39FF14" letterSpacing="1">YOUR NAME</text>
          <rect x="20" y="100" width="150" height="80" rx="6" fill="#39FF14" />
          <rect x="180" y="100" width="200" height="80" rx="6" fill="#0a0a0a" stroke="#1a1a1a" strokeWidth="2" />
          <rect x="20" y="190" width="80" height="80" rx="6" fill="#BF5AF2" />
          <g fill="#ffffff" opacity="0.7">
            <rect x="115" y="200" width="180" height="4" />
            <rect x="115" y="214" width="220" height="4" />
            <rect x="115" y="228" width="160" height="4" />
            <rect x="115" y="242" width="200" height="4" />
          </g>
          <line x1="0" y1="300" x2="140" y2="160" stroke="#FF6B1A" strokeWidth="2" />
        </svg>
      );
    case 'arpeggio':
      return (
        <svg {...common}>
          <rect width="400" height="300" fill="#0f0f0f" />
          <rect x="24" y="0" width="108" height="135" fill="#1a1a1a" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <rect x="24" y="0" width="108" height="2" fill="#FFD700" />
          <rect x="146" y="45" width="108" height="135" fill="#1a1a1a" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <rect x="268" y="90" width="108" height="135" fill="#1a1a1a" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <g fill="#ffffff" opacity="0.6">
            <rect x="34" y="18" width="80" height="3" />
            <rect x="34" y="28" width="60" height="3" />
            <rect x="156" y="63" width="80" height="3" />
            <rect x="156" y="73" width="60" height="3" />
            <rect x="278" y="108" width="80" height="3" />
            <rect x="278" y="118" width="60" height="3" />
          </g>
        </svg>
      );
    case 'nakula':
      return (
        <svg {...common}>
          <defs>
            <pattern id="nakDots" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="rgba(0,0,0,0.06)" />
            </pattern>
          </defs>
          <rect width="400" height="300" fill="rgba(255,255,255,0.92)" />
          <rect width="400" height="300" fill="url(#nakDots)" />
          <circle cx="200" cy="80" r="20" fill="rgba(0,0,0,0.08)" />
          <text x="200" y="135" textAnchor="middle" fontFamily="Georgia, serif" fontSize="14" fill="#1a1a1a">Nakula Sharma</text>
          <text x="200" y="155" textAnchor="middle" fontFamily="Georgia, serif" fontSize="10" fill="#1a1a1a" opacity="0.6">Product Designer</text>
          <rect x="130" y="180" width="140" height="22" rx="11" fill="none" stroke="rgba(0,0,0,0.18)" />
          <rect x="130" y="210" width="140" height="22" rx="11" fill="none" stroke="rgba(0,0,0,0.18)" />
          <rect x="130" y="240" width="140" height="22" rx="11" fill="none" stroke="rgba(0,0,0,0.18)" />
        </svg>
      );
    case 'niju-bold':
      return (
        <svg {...common}>
          <rect width="400" height="300" fill="#ffffff" />
          <rect x="20" y="80" width="320" height="40" fill="#0a0a0a" />
          <rect x="20" y="130" width="120" height="4" fill="#E8390E" />
          <rect x="20" y="170" width="200" height="3" fill="#9ca3af" />
          <rect x="20" y="184" width="160" height="3" fill="#9ca3af" />
        </svg>
      );
    case 'minimal-saas':
      return (
        <svg {...common}>
          <rect width="400" height="300" fill="#ffffff" />
          <rect x="0" y="0" width="400" height="32" fill="#f3f4f6" />
          <rect x="20" y="12" width="60" height="8" fill="#0a0a0a" />
          <rect x="300" y="12" width="50" height="8" rx="2" fill="#0EA5E9" />
          <rect x="0" y="32" width="100" height="268" fill="#f9fafb" />
          <rect x="14" y="56" width="72" height="6" fill="#0EA5E9" />
          <rect x="14" y="76" width="60" height="4" fill="#9ca3af" />
          <rect x="14" y="92" width="60" height="4" fill="#9ca3af" />
          <rect x="14" y="108" width="60" height="4" fill="#9ca3af" />
          <rect x="120" y="56" width="160" height="10" fill="#0a0a0a" />
          <rect x="120" y="76" width="240" height="3" fill="#9ca3af" />
          <rect x="120" y="86" width="200" height="3" fill="#9ca3af" />
          <rect x="120" y="120" width="120" height="80" rx="6" fill="#f3f4f6" />
          <rect x="252" y="120" width="120" height="80" rx="6" fill="#f3f4f6" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect width="400" height="300" fill="#1a1a1a" />
          <rect x="40" y="120" width="320" height="60" rx="6" fill="#2a2a2a" />
        </svg>
      );
  }
};

export function TemplateCard({
  id,
  name,
  description,
  isSelected,
  onSelect,
  isFavorite = false,
  onToggleFavorite,
}: TemplateCardProps) {
  const navigate = useNavigate();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    navigate(`/dashboard?section=profile`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(id);
  };

  return (
    <div
      onClick={onSelect}
      className={cn(
        'group relative cursor-pointer overflow-hidden transition-all duration-200',
        'rounded-[12px] bg-[#1A1A1A]',
        isSelected
          ? 'border-2 border-[#E8390E] shadow-[0_0_0_4px_rgba(232,57,14,0.12)]'
          : 'border border-white/[0.08] hover:border-[rgba(232,57,14,0.4)] hover:-translate-y-[2px]'
      )}
    >
      {isSelected && (
        <div className="absolute top-2 left-2 z-20 h-6 w-6 rounded-full bg-[#E8390E] flex items-center justify-center shadow-md">
          <Check className="h-3.5 w-3.5 text-white" />
        </div>
      )}

      <div className="absolute top-2 right-2 z-20 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleFavoriteClick}
          className="h-7 w-7 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/80"
          aria-label="Favorite"
        >
          <Heart
            className={cn(
              'h-3.5 w-3.5 transition-colors',
              isFavorite ? 'fill-red-500 text-red-500' : 'text-white/70 hover:text-red-400'
            )}
          />
        </button>
        <button
          onClick={handleEditClick}
          className="h-7 w-7 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/80"
          aria-label="Edit"
        >
          <Pencil className="h-3.5 w-3.5 text-white/70" />
        </button>
      </div>

      {/* Preview */}
      <div className="w-full aspect-[4/3] overflow-hidden bg-[#0d0d0d]">
        <TemplateSVG id={id} />
      </div>

      {/* Footer */}
      <div className="bg-[#1A1A1A] px-[14px] py-3">
        <h3 className="text-[13px] font-semibold text-white leading-tight truncate">{name}</h3>
        <p
          className="text-[11px] mt-[2px] text-white/45 line-clamp-2"
          style={{ lineHeight: 1.4 }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
