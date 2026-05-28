import { ProfileData } from '@/contexts/ProfileContext';
import {
  getProfessionTemplate,
  ProfessionTemplate as TemplateMeta,
  SectionBlock,
  SampleItem,
} from '@/lib/professionTemplates';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  profile: ProfileData;
  templateId: string;
}

/**
 * Chameleon Engine — one component, four structurally distinct base layouts
 * (Clinical / Technical / Executive / Trades), each rendering a different
 * structural sub-component grammar driven by section.kind in the registry.
 */
export function ProfessionTemplate({ profile, templateId }: Props) {
  const meta = getProfessionTemplate(templateId);
  if (!meta) return null;

  const accentStyle = { ['--tpl-accent' as any]: meta.accent } as React.CSSProperties;

  switch (meta.base) {
    case 'clinical':
      return <ClinicalBase profile={profile} meta={meta} style={accentStyle} />;
    case 'technical':
      return <TechnicalBase profile={profile} meta={meta} style={accentStyle} />;
    case 'executive':
      return <ExecutiveBase profile={profile} meta={meta} style={accentStyle} />;
    case 'trades':
      return <TradesBase profile={profile} meta={meta} style={accentStyle} />;
  }
}

/* ── Shared helpers ────────────────────────────────────────────────────── */

function ProfessionIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (Icons as any)[name] ?? Icons.Sparkles;
  return <Icon className={className} />;
}

/**
 * Returns the items to render for a section based ONLY on populated profile
 * data. Never falls back to sample copy — empty profiles render empty states
 * so no placeholder/ghost content leaks into live previews or public views.
 */
function itemsFor(block: SectionBlock, profile: ProfileData, _meta: TemplateMeta): SampleItem[] {
  if (block.kind === 'timeline' && profile.workExperience?.length) {
    return profile.workExperience.slice(0, 6).map((w) => ({
      title: `${w.jobTitle}${w.company ? ` · ${w.company}` : ''}`,
      caption: w.description?.slice(0, 120),
      meta: `${w.startDate || ''}${w.current ? ' — Now' : w.endDate ? ` — ${w.endDate}` : ''}`.trim(),
    }));
  }

  if (block.kind === 'cards' && profile.projects?.length) {
    return profile.projects.slice(0, 4).map((p) => ({
      title: p.title,
      caption: p.description?.slice(0, 160),
    }));
  }

  if (block.kind === 'pill-cloud' && profile.skills?.length) {
    return profile.skills.slice(0, 14).map((s) => ({ title: s }));
  }

  if (block.kind === 'badge-grid' && profile.keyHighlights?.length) {
    return profile.keyHighlights.slice(0, 8).map((s) => ({ title: s }));
  }

  return [];
}


/* ── Structural primitives (theme-aware via parent's text/bg classes) ──── */

function PillCloud({ items, dark }: { items: SampleItem[]; dark?: boolean }) {
  if (!items.length) return <EmptyHint />;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it, i) => (
        <span
          key={i}
          className="text-[11px] font-medium px-2.5 py-1 rounded-full border"
          style={{
            borderColor: `hsl(var(--tpl-accent) / 0.45)`,
            color: dark ? 'rgba(255,255,255,0.92)' : `hsl(var(--tpl-accent))`,
            background: `hsl(var(--tpl-accent) / 0.10)`,
          }}
        >
          {it.title}
        </span>
      ))}
    </div>
  );
}

function BadgeGrid({ items, dark }: { items: SampleItem[]; dark?: boolean }) {
  if (!items.length) return <EmptyHint />;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
      {items.map((it, i) => (
        <div
          key={i}
          className={`rounded-md border px-3 py-2.5 ${
            dark ? 'border-white/15 bg-white/[0.04]' : 'border-slate-200 bg-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full shrink-0"
              style={{ background: `hsl(var(--tpl-accent))` }}
            />
            <p className={`text-[12px] font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>
              {it.title}
            </p>
          </div>
          {it.caption && (
            <p className={`text-[10.5px] mt-1 ml-3.5 ${dark ? 'text-white/55' : 'text-slate-500'}`}>
              {it.caption}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function MetricGrid({ items, dark }: { items: SampleItem[]; dark?: boolean }) {
  if (!items.length) return <EmptyHint />;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((it, i) => (
        <div
          key={i}
          className={`rounded-lg p-4 border ${
            dark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50/60'
          }`}
        >
          <p
            className="text-2xl font-semibold tabular-nums tracking-tight"
            style={{ color: `hsl(var(--tpl-accent))` }}
          >
            {it.title}
          </p>
          {it.caption && (
            <p className={`text-[11px] mt-1.5 ${dark ? 'text-white/60' : 'text-slate-600'}`}>
              {it.caption}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function Checklist({ items, dark }: { items: SampleItem[]; dark?: boolean }) {
  if (!items.length) return <EmptyHint />;
  return (
    <ul className={`divide-y ${dark ? 'divide-white/10' : 'divide-slate-200'}`}>
      {items.map((it, i) => (
        <li key={i} className="flex items-center justify-between gap-3 py-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <Icons.CheckCircle2
              className="h-3.5 w-3.5 shrink-0"
              style={{ color: `hsl(var(--tpl-accent))` }}
            />
            <p className={`text-[13px] truncate ${dark ? 'text-white/90' : 'text-slate-800'}`}>
              {it.title}
            </p>
          </div>
          {it.meta && (
            <span
              className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full"
              style={{
                color: `hsl(var(--tpl-accent))`,
                background: `hsl(var(--tpl-accent) / 0.10)`,
              }}
            >
              {it.meta}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function CardsGrid({ items, dark }: { items: SampleItem[]; dark?: boolean }) {
  if (!items.length) return <EmptyHint />;
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {items.map((it, i) => (
        <div
          key={i}
          className={`p-4 rounded-md border ${
            dark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-white'
          }`}
          style={{ borderLeft: `2px solid hsl(var(--tpl-accent))` }}
        >
          <p className={`text-[13px] font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>
            {it.title}
          </p>
          {it.caption && (
            <p className={`text-[12px] leading-relaxed mt-1 ${dark ? 'text-white/65' : 'text-slate-600'}`}>
              {it.caption}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function VerticalTimeline({ items, dark }: { items: SampleItem[]; dark?: boolean }) {
  if (!items.length) return <EmptyHint />;
  return (
    <ol className="relative ml-2 pl-5 space-y-5 border-l" style={{ borderColor: `hsl(var(--tpl-accent) / 0.35)` }}>
      {items.map((it, i) => (
        <li key={i} className="relative">
          <span
            className="absolute -left-[27px] top-1 h-2.5 w-2.5 rounded-full ring-4"
            style={{
              background: `hsl(var(--tpl-accent))`,
              boxShadow: `0 0 0 4px ${dark ? 'rgba(15,23,42,1)' : '#ffffff'}`,
            }}
          />
          <div className="flex items-baseline justify-between gap-4">
            <p className={`text-[13px] font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>
              {it.title}
            </p>
            {it.meta && (
              <span className={`text-[10.5px] tabular-nums whitespace-nowrap ${dark ? 'text-white/50' : 'text-slate-500'}`}>
                {it.meta}
              </span>
            )}
          </div>
          {it.caption && (
            <p className={`text-[12px] leading-relaxed mt-0.5 ${dark ? 'text-white/65' : 'text-slate-600'}`}>
              {it.caption}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}

function CodeBlock({ items }: { items: SampleItem[] }) {
  if (!items.length) return <EmptyHint />;
  return (
    <div className="rounded-lg border border-white/10 bg-black/60 overflow-hidden font-mono">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10 bg-white/[0.03]">
        <span className="h-2 w-2 rounded-full bg-red-400/70" />
        <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
        <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
        <span className="ml-2 text-[10px] text-white/40 tracking-wider">~/stack.ts</span>
      </div>
      <pre className="px-4 py-3.5 text-[12px] leading-relaxed text-zinc-100 whitespace-pre-wrap">
        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-[1.25rem_1fr] gap-3">
            <span className="text-zinc-600 select-none text-right">{(i + 1).toString().padStart(2, '0')}</span>
            <div>
              <span style={{ color: `hsl(var(--tpl-accent))` }}>const </span>
              <span className="text-zinc-100">stack_{i + 1}</span>
              <span className="text-zinc-500"> = </span>
              <span className="text-emerald-300">"{it.title}"</span>
              {it.caption && <div className="text-zinc-500">{`// ${it.caption}`}</div>}
            </div>
          </div>
        ))}
      </pre>
    </div>
  );
}

function EmptyHint() {
  return <p className="text-[12px] text-muted-foreground italic">Add content to populate this section.</p>;
}

function renderByKind(block: SectionBlock, items: SampleItem[], dark: boolean) {
  switch (block.kind) {
    case 'pill-cloud': return <PillCloud items={items} dark={dark} />;
    case 'badge-grid': return <BadgeGrid items={items} dark={dark} />;
    case 'metric-grid': return <MetricGrid items={items} dark={dark} />;
    case 'checklist': return <Checklist items={items} dark={dark} />;
    case 'cards': return <CardsGrid items={items} dark={dark} />;
    case 'timeline': return <VerticalTimeline items={items} dark={dark} />;
    case 'code-block': return <CodeBlock items={items} />;
  }
}

/* ── Section header (layout-aware styling) ─────────────────────────────── */

function SectionHeader({
  label,
  variant = 'default',
  dark,
}: {
  label: string;
  variant?: 'default' | 'serif' | 'mono' | 'industrial';
  dark?: boolean;
}) {
  if (variant === 'serif') {
    return (
      <h3 className={`font-serif text-2xl tracking-tight mb-5 ${dark ? 'text-white' : 'text-slate-900'}`}>
        {label}
      </h3>
    );
  }
  if (variant === 'mono') {
    return (
      <h3 className="font-mono text-[11px] tracking-[0.18em] uppercase mb-4 flex items-center gap-2">
        <span style={{ color: `hsl(var(--tpl-accent))` }}>$</span>
        <span className={dark ? 'text-white/85' : 'text-slate-700'}>{label}</span>
      </h3>
    );
  }
  if (variant === 'industrial') {
    return (
      <div className="flex items-center gap-3 mb-5">
        <span
          className="text-[10px] font-black tracking-[0.22em] uppercase text-stone-900 px-2 py-0.5"
          style={{ background: `hsl(var(--tpl-accent))` }}
        >
          {label}
        </span>
        <span className="h-px flex-1 bg-stone-900/20" />
      </div>
    );
  }
  return (
    <h3
      className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4"
      style={{ color: `hsl(var(--tpl-accent))` }}
    >
      {label}
    </h3>
  );
}

function SectionShell({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`pt-8 mt-8 border-t ${dark ? 'border-white/10' : 'border-slate-200/80'}`}
    >
      {children}
    </motion.section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   BASE 1 — CLINICAL
   Sterile, trust-first multi-column profile. Sidebar for certifications,
   vertical timeline for clinical experience. Always white-canvas.
   ══════════════════════════════════════════════════════════════════════ */

function ClinicalBase({
  profile,
  meta,
  style,
}: {
  profile: ProfileData;
  meta: TemplateMeta;
  style: React.CSSProperties;
}) {
  const sidebarSection = meta.sections.find((s) => s.kind === 'badge-grid');
  const mainSections = meta.sections.filter((s) => s !== sidebarSection);

  return (
    <div style={style} className="min-h-full bg-white text-slate-900 font-sans">
      {/* Sterile header bar */}
      <div className="border-b border-slate-200">
        <div className="px-8 md:px-14 py-10 flex items-start gap-6">
          {profile.photoUrl && !profile.hidePhoto && (
            <img
              src={profile.photoUrl}
              alt={profile.fullName}
              className="h-24 w-24 rounded-full object-cover border-2"
              style={{ borderColor: 'hsl(var(--tpl-accent))' }}
            />
          )}
          <div className="flex-1 min-w-0">
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase mb-2.5"
              style={{ background: `hsl(var(--tpl-accent) / 0.10)`, color: `hsl(var(--tpl-accent))` }}
            >
              <ProfessionIcon name={meta.icon} className="h-3 w-3" />
              {meta.name}
            </div>
            <h1 className="text-[34px] font-semibold tracking-tight text-slate-900 leading-tight">
              {profile.fullName || 'Your Name'}
            </h1>
            <p className="text-[15px] text-slate-600 mt-1.5">{profile.headline || meta.tagline}</p>
            {profile.location && (
              <p className="text-[12px] text-slate-500 mt-2 flex items-center gap-1.5">
                <Icons.MapPin className="h-3 w-3" />
                {profile.location}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Two-column body */}
      <div className="px-8 md:px-14 py-10 grid lg:grid-cols-[1fr_280px] gap-10">
        <div className="min-w-0">
          {profile.bio && (
            <p className="text-[15px] leading-relaxed text-slate-700 max-w-2xl">{profile.bio}</p>
          )}
          {mainSections.map((s) => (
            <SectionShell key={s.key}>
              <SectionHeader label={s.label} variant="default" />
              {renderByKind(s, itemsFor(s, profile, meta), false)}
            </SectionShell>
          ))}
        </div>

        {/* Sterile sidebar */}
        {sidebarSection && (
          <aside className="lg:sticky lg:top-6 self-start">
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5">
              <p
                className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-3"
                style={{ color: `hsl(var(--tpl-accent))` }}
              >
                {sidebarSection.label}
              </p>
              <div className="space-y-2">
                {itemsFor(sidebarSection, profile, meta).map((it, i) => (
                  <div key={i} className="rounded-md bg-white border border-slate-200 px-3 py-2">
                    <p className="text-[12px] font-semibold text-slate-900">{it.title}</p>
                    {it.caption && <p className="text-[10.5px] text-slate-500 mt-0.5">{it.caption}</p>}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   BASE 2 — TECHNICAL
   Sleek, high-contrast terminal grid with code-syntax accents and data
   streams. Mono headers. Dark canvas.
   ══════════════════════════════════════════════════════════════════════ */

function TechnicalBase({
  profile,
  meta,
  style,
}: {
  profile: ProfileData;
  meta: TemplateMeta;
  style: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className="min-h-full bg-[#0b0b0d] text-zinc-100 px-8 md:px-14 py-12 font-sans"
    >
      {/* Terminal-style hero */}
      <header>
        <div className="flex items-center gap-2 text-[11px] text-zinc-500 mb-5 font-mono">
          <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: `hsl(var(--tpl-accent))` }} />
          <span>~/portfolio</span>
          <span className="text-zinc-700">›</span>
          <ProfessionIcon name={meta.icon} className="h-3.5 w-3.5" />
          <span style={{ color: `hsl(var(--tpl-accent))` }}>{meta.name.toLowerCase().replace(/\s+/g, '-')}.tsx</span>
        </div>
        <div className="grid md:grid-cols-[1fr_auto] gap-6 items-end">
          <div>
            <h1 className="text-[42px] font-bold tracking-tight leading-[1.05]">
              {profile.fullName || 'Your Name'}
            </h1>
            <p className="mt-2.5 text-[14px] font-mono" style={{ color: `hsl(var(--tpl-accent))` }}>
              <span className="text-zinc-500">{'>'}</span> {profile.headline || meta.tagline}
            </p>
          </div>
          {profile.photoUrl && !profile.hidePhoto && (
            <img
              src={profile.photoUrl}
              alt={profile.fullName}
              className="h-20 w-20 rounded-md object-cover border-2 border-white/10"
            />
          )}
        </div>
        {profile.bio && (
          <p className="mt-6 text-[14px] leading-relaxed text-zinc-300 max-w-3xl">{profile.bio}</p>
        )}
      </header>

      {/* Grid sections */}
      {meta.sections.map((s) => (
        <SectionShell key={s.key} dark>
          <SectionHeader label={s.label} variant="mono" dark />
          {renderByKind(s, itemsFor(s, profile, meta), true)}
        </SectionShell>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   BASE 3 — EXECUTIVE
   Wide-margin asymmetric boardroom. Premium serif hierarchy, minimalist
   borders, prominent metric callouts in featured first row.
   ══════════════════════════════════════════════════════════════════════ */

function ExecutiveBase({
  profile,
  meta,
  style,
}: {
  profile: ProfileData;
  meta: TemplateMeta;
  style: React.CSSProperties;
}) {
  const featuredMetric = meta.sections.find((s) => s.kind === 'metric-grid');
  const rest = meta.sections.filter((s) => s !== featuredMetric);

  return (
    <div
      style={style}
      className="min-h-full bg-[#0f172a] text-white"
    >
      <div className="px-8 md:px-20 py-16 max-w-6xl mx-auto">
        {/* Asymmetric serif hero */}
        <header className="grid md:grid-cols-12 gap-6 items-end pb-12 border-b border-white/10">
          <div className="md:col-span-9">
            <div
              className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.25em] uppercase mb-5"
              style={{ color: `hsl(var(--tpl-accent))` }}
            >
              <ProfessionIcon name={meta.icon} className="h-3.5 w-3.5" />
              {meta.name}
            </div>
            <h1 className="text-[56px] md:text-[68px] font-serif tracking-tight leading-[0.98]">
              {profile.fullName || 'Your Name'}
            </h1>
            <p className="mt-4 text-[16px] text-white/70 max-w-xl font-serif italic">
              {profile.headline || meta.tagline}
            </p>
          </div>
          <div className="md:col-span-3 flex md:justify-end">
            {profile.photoUrl && !profile.hidePhoto && (
              <img
                src={profile.photoUrl}
                alt={profile.fullName}
                className="h-28 w-28 rounded-sm object-cover"
                style={{ outline: `2px solid hsl(var(--tpl-accent))`, outlineOffset: 5 }}
              />
            )}
          </div>
        </header>

        {profile.bio && (
          <p className="mt-10 text-[16px] leading-[1.75] text-white/80 max-w-3xl font-serif">
            {profile.bio}
          </p>
        )}

        {/* Prominent metric callouts */}
        {featuredMetric && (
          <section className="mt-12">
            <SectionHeader label={featuredMetric.label} variant="default" dark />
            <MetricGrid items={itemsFor(featuredMetric, profile, meta)} dark />
          </section>
        )}

        {/* Remaining sections in serif rhythm */}
        {rest.map((s) => (
          <SectionShell key={s.key} dark>
            <SectionHeader label={s.label} variant="serif" dark />
            {renderByKind(s, itemsFor(s, profile, meta), true)}
          </SectionShell>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   BASE 4 — TRADES
   Rugged industrial layout. Structured cards, bold compliance badge grids,
   project summary blocks with high-vis accent tape.
   ══════════════════════════════════════════════════════════════════════ */

function TradesBase({
  profile,
  meta,
  style,
}: {
  profile: ProfileData;
  meta: TemplateMeta;
  style: React.CSSProperties;
}) {
  return (
    <div style={style} className="min-h-full bg-[#f5f5f0] text-stone-900 font-sans">
      {/* Hi-vis hero band */}
      <div className="relative">
        <div
          className="absolute inset-x-0 top-0 h-2"
          style={{
            background: `repeating-linear-gradient(45deg, hsl(var(--tpl-accent)) 0 14px, #111 14px 28px)`,
          }}
        />
        <div className="px-8 md:px-14 pt-12 pb-10 border-b-[3px] border-stone-900">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-5">
              {profile.photoUrl && !profile.hidePhoto && (
                <img
                  src={profile.photoUrl}
                  alt={profile.fullName}
                  className="h-24 w-24 rounded-sm object-cover border-[3px] border-stone-900"
                />
              )}
              <div>
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black tracking-[0.2em] uppercase text-stone-900 mb-2.5"
                  style={{ background: `hsl(var(--tpl-accent))` }}
                >
                  <ProfessionIcon name={meta.icon} className="h-3 w-3" />
                  {meta.name}
                </div>
                <h1 className="text-[36px] font-black uppercase tracking-tight text-stone-900 leading-none">
                  {profile.fullName || 'Your Name'}
                </h1>
                <p className="text-[14px] text-stone-700 mt-2 max-w-xl">
                  {profile.headline || meta.tagline}
                </p>
              </div>
            </div>
            {profile.location && (
              <div className="border-2 border-stone-900 px-3 py-2">
                <p className="text-[9px] font-black tracking-widest uppercase text-stone-600">Region</p>
                <p className="text-[13px] font-bold uppercase text-stone-900">{profile.location}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-8 md:px-14 py-12">
        {profile.bio && (
          <p className="text-[15px] leading-relaxed text-stone-800 max-w-3xl mb-8">{profile.bio}</p>
        )}

        {meta.sections.map((s) => (
          <SectionShell key={s.key}>
            <SectionHeader label={s.label} variant="industrial" />
            {renderByKind(s, itemsFor(s, profile, meta), false)}
          </SectionShell>
        ))}
      </div>
    </div>
  );
}
