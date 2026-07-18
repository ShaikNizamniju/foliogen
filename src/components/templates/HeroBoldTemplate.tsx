import { motion } from 'framer-motion';
import { ProfileData } from '@/contexts/ProfileContext';
import { UserCircle, MapPin, Mail, Linkedin } from 'lucide-react';
import { getProjectHref } from '@/lib/urlUtils';

interface HeroBoldTemplateProps {
  profile?: ProfileData;
  onContactClick?: () => void;
}

const demoProjects = [
  { id: '1', title: 'Keynote: Future of AI', description: 'Opening address at DevConf 2024 on ethical AI systems.', techStack: ['Public Speaking', 'AI Ethics'] },
  { id: '2', title: 'Leadership Framework', description: 'A methodology adopted by 200+ teams worldwide.', techStack: ['Strategy', 'Management'] },
  { id: '3', title: 'The Disruption Playbook', description: 'Published best-seller on innovation in regulated industries.', techStack: ['Writing', 'Innovation'] },
];

const demoExperience = [
  { company: 'VisionaryLab', jobTitle: 'Chief Strategy Officer', startDate: '2022', endDate: '', current: true },
  { company: 'Apex Ventures', jobTitle: 'VP of Product', startDate: '2019', endDate: '2022', current: false },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

// Scoped CSS: skill-pill stagger + hover lift, respects prefers-reduced-motion.
const scopedCss = `
@keyframes hbFadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.hb-skill-pill {
  opacity: 0;
  animation: hbFadeUp 0.5s ease-out forwards;
  transition: transform 200ms ease, border-color 200ms ease, color 200ms ease, background-color 200ms ease;
}
.hb-skill-pill:hover {
  transform: translateY(-2px);
  border-color: #F43F5E;
  background-color: rgba(225,29,72,0.08);
}
@media (prefers-reduced-motion: reduce) {
  .hb-skill-pill { opacity: 1 !important; animation: none !important; transition: none !important; }
  .hb-skill-pill:hover { transform: none !important; }
}
`;

export function HeroBoldTemplate({ profile, onContactClick }: HeroBoldTemplateProps) {
  const name = profile?.fullName || 'ALEX RIVERA';
  const headline = profile?.headline || 'Thought Leader · Keynote Speaker · Author';
  const bio = profile?.bio || 'I help organizations navigate disruption with clarity. 15 years of strategy, 300+ keynotes, one mission: make complexity simple.';
  const skills = profile?.skills?.length ? profile.skills : ['Strategy', 'Public Speaking', 'Leadership', 'Innovation', 'AI Ethics', 'Product Vision'];
  const projects = profile?.projects?.length
    ? profile.projects.slice(0, 4).map((p) => ({ ...p, techStack: p.techStack || [], imageUrl: p.imageUrl || '' }))
    : demoProjects.map(p => ({ ...p, imageUrl: '' }));
  const experience = profile?.workExperience?.length ? profile.workExperience : demoExperience;
  const email = profile?.email || 'hello@alexrivera.com';
  const linkedin = profile?.linkedinUrl || '';
  const location = profile?.location || '';
  const showPhoto = !profile || !profile.hidePhoto;
  const words = name.trim().split(/\s+/);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A', color: '#FAFAFA', fontFamily: "'Inter', sans-serif" }}>
      <style>{scopedCss}</style>

      {/* Hero — balanced 2-column, vertically centered */}
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative min-h-[90vh] flex items-center px-8 md:px-20 py-20"
      >
        {/* Accent line */}
        <motion.div variants={fadeUp} className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #E11D48, #F97316, #E11D48)' }} />

        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left: eyebrow, name, headline, meta, CTA */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <motion.span variants={fadeUp} className="text-xs tracking-[0.4em] uppercase mb-6 block" style={{ color: '#71717A' }}>
              Portfolio
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="font-black leading-[0.9] tracking-tighter uppercase break-words [overflow-wrap:anywhere] text-5xl sm:text-6xl lg:text-7xl xl:text-8xl"
            >
              {words.map((word, i) => (
                <span
                  key={i}
                  className="break-words [overflow-wrap:anywhere]"
                  style={{ color: i === 0 ? '#FAFAFA' : '#E11D48' }}
                >
                  {word}{i < words.length - 1 ? ' ' : ''}
                </span>
              ))}
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-6 text-lg md:text-xl max-w-xl font-light leading-relaxed" style={{ color: '#A1A1AA' }}>
              {headline}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
              {(onContactClick || email) && (
                <button
                  onClick={onContactClick ? onContactClick : () => window.location.href = `mailto:${email}`}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold tracking-wider uppercase rounded-full min-h-[44px]"
                  style={{ backgroundColor: '#E11D48', color: '#FAFAFA' }}
                >
                  <Mail className="h-4 w-4" /> Get in Touch
                </button>
              )}
              {location && (
                <span className="inline-flex items-center gap-2 text-sm" style={{ color: '#A1A1AA' }}>
                  <MapPin className="h-4 w-4" /> {location}
                </span>
              )}
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm hover:text-white transition-colors" style={{ color: '#A1A1AA' }}>
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              )}
            </motion.div>
          </div>

          {/* Right: photo or meta column */}
          <motion.div variants={fadeUp} className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end">
            {showPhoto && profile?.photoUrl ? (
              <div className="relative w-full max-w-sm">
                <img
                  src={profile.photoUrl}
                  alt={name}
                  className="w-full aspect-[4/5] max-h-[300px] lg:max-h-none object-cover rounded-2xl border-2"
                  style={{ borderColor: '#E11D48', boxShadow: '0 0 60px -10px rgba(225,29,72,0.35)' }}
                />
              </div>
            ) : showPhoto ? (
              <div className="w-full max-w-sm aspect-[4/5] max-h-[300px] lg:max-h-none rounded-2xl bg-[#111113] border-2 flex items-center justify-center" style={{ borderColor: '#27272A' }}>
                <UserCircle className="w-24 h-24 text-[#333]" />
              </div>
            ) : (
              <div className="w-full max-w-sm flex flex-col gap-4 text-sm lg:text-right" style={{ color: '#A1A1AA' }}>
                {location && <div className="flex lg:justify-end items-center gap-2"><MapPin className="h-4 w-4" /> {location}</div>}
                {email && <a href={`mailto:${email}`} className="flex lg:justify-end items-center gap-2 hover:text-white transition-colors"><Mail className="h-4 w-4" /> {email}</a>}
                {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex lg:justify-end items-center gap-2 hover:text-white transition-colors"><Linkedin className="h-4 w-4" /> LinkedIn</a>}
              </div>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* About — centered text-only block */}
      <section className="border-t border-b px-6 md:px-20 py-16 md:py-24" style={{ borderColor: '#27272A' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="text-xs tracking-[0.3em] uppercase block mb-6" style={{ color: '#71717A' }}>About</span>
          <p className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed break-words" style={{ color: '#D4D4D8' }}>
            {bio}
          </p>
        </motion.div>
      </section>

      {/* Experience */}
      <section className="px-8 md:px-20 py-16 md:py-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="max-w-6xl mx-auto"
        >
          <motion.span variants={fadeUp} className="text-xs tracking-[0.3em] uppercase block mb-10" style={{ color: '#71717A' }}>Experience</motion.span>
          <div className="space-y-8">
            {experience.map((exp, i) => (
              <motion.div key={i} variants={fadeUp} className="flex items-baseline gap-6 border-b pb-6" style={{ borderColor: '#1C1C1E' }}>
                <span className="text-4xl md:text-5xl font-black tracking-tighter shrink-0" style={{ color: '#27272A' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-white">{exp.jobTitle}</h3>
                  <p className="text-sm mt-1" style={{ color: '#71717A' }}>
                    {exp.company} · {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Projects */}
      <section className="px-8 md:px-20 py-16 md:py-24 border-t" style={{ borderColor: '#27272A' }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="max-w-6xl mx-auto"
        >
          <motion.span variants={fadeUp} className="text-xs tracking-[0.3em] uppercase block mb-10" style={{ color: '#71717A' }}>Selected Work</motion.span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p: any) => {
              const href = getProjectHref(p);
              return (
              <motion.div
                key={p.id}
                variants={fadeUp}
                onClick={href ? () => window.open(href, '_blank', 'noopener,noreferrer') : undefined}
                className={`group rounded-2xl border transition-all duration-300 hover:border-[#E11D48]/50 overflow-hidden flex flex-col h-full ${href ? 'cursor-pointer' : ''}`}
                style={{ borderColor: '#27272A', backgroundColor: '#111113' }}
              >
                {p.imageUrl && (
                  <div className="relative h-48 md:h-64 overflow-hidden">
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111113] to-transparent opacity-60" />
                  </div>
                )}
                <div className={`p-6 md:p-8 flex flex-col flex-grow ${!p.imageUrl ? 'justify-center min-h-[220px]' : ''}`}>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-white group-hover:text-[#E11D48] transition-colors leading-tight">
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: '#71717A' }}>
                    {p.description}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {p.techStack?.map((t: string) => (
                      <span key={t} className="text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border" style={{ borderColor: '#27272A', color: '#A1A1AA' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Skills */}
      <section className="px-8 md:px-20 py-16 border-t" style={{ borderColor: '#27272A' }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto flex flex-wrap gap-3"
        >
          {skills.map((s, i) => (
            <span
              key={s}
              className="hb-skill-pill text-xs tracking-widest uppercase px-4 py-2 rounded-full border font-medium"
              style={{ borderColor: '#E11D48', color: '#E11D48', animationDelay: `${Math.min(i * 40, 600)}ms` }}
            >
              {s}
            </span>
          ))}
        </motion.div>
      </section>

      {/* Footer / CTA */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="px-8 md:px-20 py-20 md:py-28 text-center border-t"
        style={{ borderColor: '#27272A' }}
      >
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">
          Let&apos;s <span style={{ color: '#E11D48' }}>Talk</span>
        </h2>
        <p className="text-sm mb-8" style={{ color: '#71717A' }}>
          {email}
          {linkedin && <> · <a href={linkedin} target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">LinkedIn</a></>}
        </p>
        {onContactClick && (
          <button
            onClick={onContactClick}
            className="px-8 py-3 text-sm font-semibold tracking-wider uppercase rounded-full transition-colors"
            style={{ backgroundColor: '#E11D48', color: '#FAFAFA' }}
          >
            Get In Touch
          </button>
        )}
      </motion.footer>
    </div>
  );
}
