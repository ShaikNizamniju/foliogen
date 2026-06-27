# Make Featured Project cards clickable across all templates

## Goal
On the public portfolio, clicking any project card (or its "View Project" arrow) opens the project's URL in a new tab. URL resolution:
1. `project.link` (Project Link / Demo URL)
2. fallback `project.proofOfImpact` (Proof Link)
3. if both empty → card is not clickable (no broken/blank tab)

External links use `target="_blank"` and `rel="noopener noreferrer"`. URLs are normalized via the existing `ensureProtocol()` helper in `src/lib/urlUtils.ts` so values like `github.com/foo` still open correctly.

## Implementation

Add a tiny helper at the top of each template file (or import from `urlUtils`):

```ts
import { ensureProtocol } from '@/lib/urlUtils';
const getProjectHref = (p: { link?: string; proofOfImpact?: string }) =>
  ensureProtocol(p.link || p.proofOfImpact || '') || undefined;
```

Then for each template's project card, wrap the card's existing JSX in a conditional anchor — keep the visual markup, classNames, animations, and content untouched:

```tsx
const href = getProjectHref(p);
const Card = (<div className="...existing classes...">...existing card content...</div>);
return href
  ? <a key={p.id} href={href} target="_blank" rel="noopener noreferrer" className="contents">{Card}</a>
  : Card;
```

Using `className="contents"` on the anchor means it adds no box of its own — the grid/flex layout of the card is preserved exactly. For templates whose project card is already a `motion.div`, wrap that motion element in the anchor the same way.

For templates that render a separate "View Project →" arrow/link inside the card (e.g. GasparTemplate, ModernDarkTemplate), no extra change is needed — the whole card becomes the link, which also covers the arrow. We do NOT add a second nested `<a>`.

## Files to edit (21)
All templates that render `profile.projects`:

- `src/components/dashboard/templates/AcademicTemplate.tsx`
- `src/components/dashboard/templates/BrutalistTemplate.tsx`
- `src/components/dashboard/templates/CreativeTemplate.tsx`
- `src/components/dashboard/templates/DevTemplate.tsx`
- `src/components/dashboard/templates/ExecutiveTemplate.tsx`
- `src/components/dashboard/templates/InfluencerTemplate.tsx`
- `src/components/dashboard/templates/MinimalistTemplate.tsx`
- `src/components/dashboard/templates/ModernDarkTemplate.tsx`
- `src/components/dashboard/templates/NoirTemplate.tsx`
- `src/components/dashboard/templates/ProfessionTemplate.tsx`
- `src/components/dashboard/templates/SaasTemplate.tsx`
- `src/components/dashboard/templates/StudioTemplate.tsx`
- `src/components/dashboard/templates/SwissTemplate.tsx`
- `src/components/templates/ArpeggioTemplate.tsx`
- `src/components/templates/DestelloTemplate.tsx`
- `src/components/templates/FrqncyTemplate.tsx`
- `src/components/templates/GasparTemplate.tsx`
- `src/components/templates/HeroBoldTemplate.tsx`
- `src/components/templates/MinimalSaasTemplate.tsx`
- `src/components/templates/NakulaTemplate.tsx`

Skipping: `PrintableResume.tsx` (print-only, not a clickable view).

## Out of scope
- No design/layout/copy changes to any card.
- No changes to upload behavior, other sections, or other pages.
- No changes to project link inputs in the dashboard.
