import { Project } from '@/contexts/ProfileContext';
import { getSmartCover, getSmartCoverWithSize } from '@/utils/smartCovers';

type CoverStyle = 'minimal' | 'creative' | 'terminal' | 'bold';

// Per-style palettes aligned with each template's existing theme.
// These are the SAME accent colors already used by the templates —
// no new random colors are introduced.
const STYLE_PALETTES: Record<CoverStyle, { bg: string; bg2: string; fg: string; sub: string }> = {
  minimal:  { bg: '#FAFAF8', bg2: '#EFEDE8', fg: '#1A1A1A', sub: '#6B6B6B' },
  creative: { bg: '#1A1A2E', bg2: '#4F46E5', fg: '#FFFFFF', sub: '#E8A427' },
  terminal: { bg: '#0A0A0A', bg2: '#111827', fg: '#10F58A', sub: '#94A3B8' },
  bold:     { bg: '#0F172A', bg2: '#E8A427', fg: '#FFFFFF', sub: '#FDE68A' },
};

function escapeXml(s: string): string {
  return s.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c] as string));
}

/**
 * Build a branded SVG placeholder tile for a project (used as fallback
 * when no custom image is uploaded). Same visual system across all cards
 * so the Selected Work grid reads as one consistent set.
 */
function buildBrandedPlaceholder(title: string, style: CoverStyle): string {
  const p = STYLE_PALETTES[style];
  const safeTitle = escapeXml((title || 'Project').trim());
  const initial = escapeXml((safeTitle[0] || 'P').toUpperCase());
  const display = safeTitle.length > 38 ? safeTitle.slice(0, 36) + '…' : safeTitle;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${p.bg}"/>
        <stop offset="100%" stop-color="${p.bg2}"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#g)"/>
    <text x="60" y="320" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Inter,sans-serif" font-size="320" font-weight="700" fill="${p.fg}" opacity="0.10">${initial}</text>
    <text x="60" y="520" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Inter,sans-serif" font-size="44" font-weight="600" fill="${p.fg}">${display}</text>
    <text x="60" y="560" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Inter,sans-serif" font-size="18" font-weight="500" letter-spacing="3" fill="${p.sub}">PROJECT</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Returns the cover image for a project card in Selected Work.
 * - If the project has an uploaded/custom image, return it as-is.
 * - Otherwise return a consistent branded placeholder tile that uses the
 *   portfolio's existing palette and shows the project name.
 */
export function getProjectImageUrl(
  project: Project,
  style: CoverStyle = 'minimal'
): string {
  if (project.imageUrl) return project.imageUrl;
  return buildBrandedPlaceholder(project.title || 'Project', style);
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use getProjectImageUrl instead
 */
export function getProjectImageUrlLegacy(
  project: Project, 
  style: 'minimal' | 'creative' | 'terminal' | 'bold' = 'minimal'
): string {
  if (project.imageUrl) return project.imageUrl;
  
  const prompt = project.visualPrompt || project.title || 'abstract tech';
  
  const styleModifiers: Record<string, string> = {
    minimal: 'high quality UI design clean minimal modern',
    creative: 'high quality UI design abstract gradient',
    terminal: 'dark mode tech interface neon',
    bold: 'bright colorful bold graphic design',
  };
  
  const modifier = styleModifiers[style] || styleModifiers.minimal;
  
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ' ' + modifier)}?width=800&height=600&nologo=true`;
}
