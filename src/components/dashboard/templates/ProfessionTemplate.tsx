import { ProfileData } from '@/contexts/ProfileContext';
import { getProfessionTemplate, ProfessionTemplate as TemplateMeta } from '@/lib/professionTemplates';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  profile: ProfileData;
  templateId: string;
}

/**
 * Universal renderer for the 20 profession templates.
 * Picks a base layout (clinical/technical/executive/trades) from the
 * template registry and decorates it with profession-specific section labels
 * and accent color.
 *
 * One component, four visually distinct base layouts — keeps the registry
 * lightweight while shipping 20 differentiated previews.
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

/* ── Shared bits ───────────────────────────────────────────────────────── */

function ProfessionIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (Icons as any)[name] ?? Icons.Sparkles;
  return <Icon className={className} />;
}

function SectionShell({
  label,
  children,
  accent,
}: {
  label: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="border-t border-border/60 pt-8 mt-8"
    >
      <h3
        className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4"
        style={accent ? { color: 'hsl(var(--tpl-accent))' } : undefined}
      >
        {label}
      </h3>
      {children}
    </motion.section>
  );
}

/* ── Base 1: Clinical (Healthcare) ─────────────────────────────────────── */

function ClinicalBase({
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
      className="min-h-full bg-white text-slate-900 px-8 md:px-14 py-12 font-sans"
    >
      {/* Hero — trust-first medical layout */}
      <header className="flex items-start gap-6 pb-10 border-b border-slate-200">
        {profile.photoUrl && !profile.hidePhoto && (
          <img
            src={profile.photoUrl}
            alt={profile.fullName}
            className="h-20 w-20 rounded-full object-cover border-2"
            style={{ borderColor: 'hsl(var(--tpl-accent))' }}
          />
        )}
        <div className="flex-1 min-w-0">
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase mb-2"
            style={{ background: `hsl(var(--tpl-accent) / 0.1)`, color: `hsl(var(--tpl-accent))` }}
          >
            <ProfessionIcon name={meta.icon} className="h-3 w-3" />
            {meta.name}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            {profile.fullName || 'Your Name'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">{profile.headline || meta.description}</p>
          {profile.location && (
            <p className="text-xs text-slate-500 mt-2">{profile.location}</p>
          )}
        </div>
      </header>

      {profile.bio && (
        <p className="mt-6 text-[15px] leading-relaxed text-slate-700 max-w-3xl">
          {profile.bio}
        </p>
      )}

      {/* Profession-specific sections from registry */}
      {meta.sections.map((s) => (
        <SectionShell key={s.key} label={s.label} accent>
          {renderSection(s.key, profile)}
        </SectionShell>
      ))}
    </div>
  );
}

/* ── Base 2: Technical (Tech / AI) ─────────────────────────────────────── */

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
      className="min-h-full bg-[#0a0a0b] text-zinc-100 px-8 md:px-14 py-12 font-mono"
    >
      {/* Hero — terminal aesthetic */}
      <header>
        <div className="flex items-center gap-2 text-[11px] text-zinc-500 mb-4">
          <span className="h-2 w-2 rounded-full" style={{ background: `hsl(var(--tpl-accent))` }} />
          <span>~/portfolio</span>
          <span>·</span>
          <ProfessionIcon name={meta.icon} className="h-3.5 w-3.5" />
          <span>{meta.name}</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight font-sans">
          {profile.fullName || 'Your Name'}
        </h1>
        <p
          className="mt-2 text-sm font-sans"
          style={{ color: `hsl(var(--tpl-accent))` }}
        >
          &gt; {profile.headline || meta.description}
        </p>
        {profile.bio && (
          <p className="mt-5 text-[14px] leading-relaxed text-zinc-300 max-w-3xl font-sans">
            {profile.bio}
          </p>
        )}
      </header>

      <div className="font-sans">
        {meta.sections.map((s) => (
          <SectionShell key={s.key} label={s.label} accent>
            {renderSection(s.key, profile)}
          </SectionShell>
        ))}
      </div>
    </div>
  );
}

/* ── Base 3: Executive (Business) ──────────────────────────────────────── */

function ExecutiveBase({
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
      className="min-h-full bg-[#0f172a] text-white px-8 md:px-16 py-14"
    >
      {/* Hero — boardroom serif */}
      <header className="grid md:grid-cols-[1fr_auto] gap-6 items-end pb-10 border-b border-white/10">
        <div>
          <div
            className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase mb-4"
            style={{ color: `hsl(var(--tpl-accent))` }}
          >
            <ProfessionIcon name={meta.icon} className="h-3.5 w-3.5" />
            {meta.name}
          </div>
          <h1 className="text-5xl font-serif tracking-tight leading-[1.05]">
            {profile.fullName || 'Your Name'}
          </h1>
          <p className="mt-3 text-base text-white/70 max-w-xl">
            {profile.headline || meta.description}
          </p>
        </div>
        {profile.photoUrl && !profile.hidePhoto && (
          <img
            src={profile.photoUrl}
            alt={profile.fullName}
            className="h-24 w-24 rounded-sm object-cover"
            style={{ outline: `2px solid hsl(var(--tpl-accent))`, outlineOffset: 4 }}
          />
        )}
      </header>

      {profile.bio && (
        <p className="mt-8 text-[15px] leading-relaxed text-white/80 max-w-3xl font-serif">
          {profile.bio}
        </p>
      )}

      {meta.sections.map((s) => (
        <SectionShell key={s.key} label={s.label} accent>
          {renderSection(s.key, profile, 'dark')}
        </SectionShell>
      ))}
    </div>
  );
}

/* ── Base 4: Trades (Field / Industrial) ───────────────────────────────── */

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
    <div
      style={style}
      className="min-h-full bg-[#f5f5f0] text-stone-900 px-8 md:px-14 py-12"
    >
      {/* Hero — industrial badge */}
      <header className="flex items-start justify-between gap-6 pb-8 border-b-2 border-stone-900">
        <div className="flex items-center gap-5">
          {profile.photoUrl && !profile.hidePhoto && (
            <img
              src={profile.photoUrl}
              alt={profile.fullName}
              className="h-20 w-20 rounded-sm object-cover border-2 border-stone-900"
            />
          )}
          <div>
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase text-stone-900 mb-2"
              style={{ background: `hsl(var(--tpl-accent))` }}
            >
              <ProfessionIcon name={meta.icon} className="h-3 w-3" />
              {meta.name}
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-stone-900">
              {profile.fullName || 'Your Name'}
            </h1>
            <p className="text-sm text-stone-700 mt-1">
              {profile.headline || meta.description}
            </p>
          </div>
        </div>
      </header>

      {profile.bio && (
        <p className="mt-6 text-[15px] leading-relaxed text-stone-800 max-w-3xl">
          {profile.bio}
        </p>
      )}

      {meta.sections.map((s) => (
        <SectionShell key={s.key} label={s.label} accent>
          {renderSection(s.key, profile)}
        </SectionShell>
      ))}
    </div>
  );
}

/* ── Section content mapper ────────────────────────────────────────────── */

function renderSection(key: string, profile: ProfileData, theme: 'light' | 'dark' = 'light') {
  const textClass = theme === 'dark' ? 'text-white/80' : 'text-slate-700';
  const subClass = theme === 'dark' ? 'text-white/50' : 'text-slate-500';

  // Generic mapper — these keys all share a common data source
  if (key === 'experience') {
    if (!profile.workExperience?.length) {
      return <p className={`text-sm ${subClass}`}>No experience added yet.</p>;
    }
    return (
      <ul className="space-y-4">
        {profile.workExperience.slice(0, 6).map((w) => (
          <li key={w.id} className="grid grid-cols-[1fr_auto] gap-4">
            <div className="min-w-0">
              <p className={`text-sm font-semibold ${textClass}`}>
                {w.jobTitle} · {w.company}
              </p>
              {w.description && (
                <p className={`text-[13px] leading-relaxed mt-1 ${subClass} line-clamp-3`}>
                  {w.description}
                </p>
              )}
            </div>
            <p className={`text-[11px] tabular-nums whitespace-nowrap ${subClass}`}>
              {w.startDate} — {w.current ? 'Now' : w.endDate}
            </p>
          </li>
        ))}
      </ul>
    );
  }

  if (key === 'projects' || key === 'case-files' || key === 'case-studies' || key === 'models' || key === 'pipelines' || key === 'architectures') {
    if (!profile.projects?.length) {
      return <p className={`text-sm ${subClass}`}>No items added yet.</p>;
    }
    return (
      <div className="grid sm:grid-cols-2 gap-3">
        {profile.projects.slice(0, 4).map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-md border border-current/10 hover:border-current/30 transition-colors"
            style={{ borderColor: `hsl(var(--tpl-accent) / 0.25)` }}
          >
            <p className={`text-sm font-semibold ${textClass}`}>{p.title}</p>
            {p.description && (
              <p className={`text-[12px] leading-relaxed mt-1 ${subClass} line-clamp-3`}>
                {p.description}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (key === 'certifications' || key === 'licenses' || key === 'credentials' || key === 'training') {
    const items = profile.keyHighlights?.length ? profile.keyHighlights : profile.skills;
    if (!items?.length) {
      return <p className={`text-sm ${subClass}`}>None added yet.</p>;
    }
    return (
      <div className="flex flex-wrap gap-2">
        {items.slice(0, 12).map((s, i) => (
          <span
            key={i}
            className="text-[11px] font-medium px-2.5 py-1 rounded-full border"
            style={{
              borderColor: `hsl(var(--tpl-accent) / 0.4)`,
              color: theme === 'dark' ? 'white' : `hsl(var(--tpl-accent))`,
              background: `hsl(var(--tpl-accent) / 0.08)`,
            }}
          >
            {s}
          </span>
        ))}
      </div>
    );
  }

  // Default: render skills as pills (used for specialties / techniques / stack / etc.)
  if (!profile.skills?.length) {
    return <p className={`text-sm ${subClass}`}>None added yet.</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {profile.skills.slice(0, 16).map((s, i) => (
        <span
          key={i}
          className={`text-[12px] px-2.5 py-1 rounded-md ${
            theme === 'dark' ? 'bg-white/10 text-white/90' : 'bg-slate-100 text-slate-700'
          }`}
        >
          {s}
        </span>
      ))}
    </div>
  );
}
