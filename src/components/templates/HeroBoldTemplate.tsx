import { motion } from 'framer-motion';
import { ProfileData } from '@/contexts/ProfileContext';
import { UserCircle } from 'lucide-react';

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A', color: '#FAFAFA', fontFamily: "'Inter', sans-serif" }}>
      {/* Hero — full-bleed, massive type */}
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative min-h-[85vh] flex flex-col justify-end px-8 md:px-20 pb-16 md:pb-24"
      >
        {/* Accent line */}
        <motion.div variants={fadeUp} className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #E11D48, #F97316, #E11D48)' }} />

        <motion.span variants={fadeUp} className="text-xs tracking-[0.4em] uppercase mb-6 block" style={{ color: '#71717A' }}>
          Portfolio
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="text-6xl sm:text-8xl md:text-[9rem] font-black leading-[0.85] tracking-tighter uppercase"
        >
          {name.split(' ').map((word, i) => (
            <span key={i} className="block" style={{ color: i === 0 ? '#FAFAFA' : '#E11D48' }}>
              {word}
            </span>
          ))}
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-8 text-lg md:text-xl max-w-xl font-light leading-relaxed" style={{ color: '#A1A1AA' }}>
          {headline}
        </motion.p>
      </motion.section>

      {/* Bio strip */}
      <section className="border-t border-b px-8 md:px-20 py-16 md:py-24" style={{ borderColor: '#27272A' }}>
        <div className="flex flex-col md:flex-row gap-12 items-center md:items-start max-w-5xl">
            {(!profile || !profile.hidePhoto) && (
              <div className="shrink-0">
                {profile?.photoUrl ? (
                  <div className="relative group">
                    <img
                      src={profile.photoUrl}
                      alt={name}
                      className="w-32 h-32 md:w-48 md:h-48 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500 opacity-90 border-2"
                      style={{ borderColor: '#E11D48' }}
                    />
                    <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] pointer-events-none" />
                  </div>
                ) : (
                  <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl bg-[#111113] border-2 flex items-center justify-center transition-colors shadow-2xl" style={{ borderColor: '#27272A' }}>
                    <UserCircle className="w-16 h-16 md:w-24 md:h-24 text-[#333]" />
                  </div>
                )}
              </div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl"
            >
              <span className="text-xs tracking-[0.3em] uppercase block mb-6" style={{ color: '#71717A' }}>About</span>
              <p className="text-2xl md:text-3xl font-light leading-relaxed" style={{ color: '#D4D4D8' }}>
                {bio}
              </p>
            </motion.div>
        </div>
      </section>

      {/* Experience */}
      <section className="px-8 md:px-20 py-16 md:py-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
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
        >
          <motion.span variants={fadeUp} className="text-xs tracking-[0.3em] uppercase block mb-10" style={{ color: '#71717A' }}>Selected Work</motion.span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p) => (
              <motion.div
                key={p.id}
                variants={fadeUp}
                className="group rounded-2xl border transition-all duration-300 hover:border-[#E11D48]/50 overflow-hidden flex flex-col h-full"
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
                    {p.techStack?.map((t) => (
                      <span key={t} className="text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border" style={{ borderColor: '#27272A', color: '#A1A1AA' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Skills */}
      <section className="px-8 md:px-20 py-16 border-t" style={{ borderColor: '#27272A' }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-3"
        >
          {skills.map((s) => (
            <span key={s} className="text-xs tracking-widest uppercase px-4 py-2 rounded-full border font-medium" style={{ borderColor: '#E11D48', color: '#E11D48' }}>
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
