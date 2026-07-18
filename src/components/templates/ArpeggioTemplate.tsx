import { motion } from 'framer-motion';
import { ProfileData } from '@/contexts/ProfileContext';
import { ArrowUpRight, Mail, MapPin, Github, Linkedin, Twitter, UserCircle } from 'lucide-react';
import { getProjectHref } from '@/lib/urlUtils';

interface ArpeggioTemplateProps {
  profile?: ProfileData;
}

/* ── Demo Data ── */
const demoProfile = {
  fullName: 'Alex Rivera',
  headline: 'AI Product Manager & Creative Technologist',
  bio: 'I build systems that bridge design and engineering. Currently focused on spatial interfaces and design tooling for the next generation of creators.',
  location: 'San Francisco, CA',
  email: 'hello@alexrivera.design',
  skills: ['Product Design', 'Systems Thinking', 'Prototyping', 'Design Tokens', 'React', 'Figma', 'Motion Design', 'User Research'],
  projects: [
    { title: 'Modular Design System', category: 'Design Systems', year: '2024', image: '', description: 'A token-driven system used across 12 products serving 4M+ users.' },
    { title: 'Spatial Canvas', category: 'Spatial UI', year: '2024', image: '', description: 'An infinite canvas tool for collaborative 3D spatial design.' },
    { title: 'Kinetic Typography', category: 'Motion', year: '2023', image: '', description: 'Type that responds to cursor, scroll, and ambient audio input.' },
    { title: 'Zero Latency', category: 'Performance', year: '2023', image: '', description: 'Edge-optimized design tool with sub-50ms interaction latency.' },
    { title: 'Color Intelligence', category: 'AI / Design', year: '2023', image: '', description: 'ML-powered palette generation from brand voice and mood.' },
    { title: 'Component Forge', category: 'Dev Tools', year: '2022', image: '', description: 'Visual component builder that exports production React code.' },
  ],
  workExperience: [
    { year: '2022 — Present', role: 'AI Product Manager', company: 'Foliogen' },
    { year: '2020 — 2022', role: 'Senior Designer', company: 'Figma' },
    { year: '2018 — 2020', role: 'UI Engineer', company: 'Stripe' },
    { year: '2016 — 2018', role: 'Design Intern → Jr. Designer', company: 'Razorpay' },
  ],
  photoUrl: '',
  linkedinUrl: '#',
  githubUrl: '#',
  twitterUrl: '#',
};

const heading = "'Space Grotesk', sans-serif";
const mono = "'IBM Plex Mono', monospace";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function ArpeggioTemplate({ profile }: ArpeggioTemplateProps) {
  const p = profile || demoProfile as any;
  const name = p.fullName || demoProfile.fullName;
  const headline = p.headline || demoProfile.headline;
  const bio = p.bio || demoProfile.bio;
  const location = p.location || demoProfile.location;
  const email = p.email || demoProfile.email;
  const skills = p.skills?.length ? p.skills : demoProfile.skills;
  const photoUrl = p.photoUrl || demoProfile.photoUrl;
  const linkedinUrl = p.linkedinUrl || demoProfile.linkedinUrl;
  const githubUrl = p.githubUrl || demoProfile.githubUrl;
  const twitterUrl = p.twitterUrl || demoProfile.twitterUrl;

  const projects = p.projects?.length
    ? p.projects.map((proj: any) => ({
        title: proj.title,
        category: proj.techStack?.[0] || '',
        year: proj.year || proj.endDate || '',
        image: proj.imageUrl || '',
        description: proj.description || '',
        link: proj.link || '',
        proofOfImpact: proj.proofOfImpact || '',
      }))
    : demoProfile.projects;

  const experience = p.workExperience?.length
    ? p.workExperience.map((w: any) => ({
        year: `${w.startDate || ''} — ${w.current ? 'Present' : w.endDate || ''}`,
        role: w.jobTitle,
        company: w.company,
      }))
    : demoProfile.workExperience;


  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A', color: '#FAFAFA', fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar — brutalist thick top border */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-14 py-5"
        style={{ backgroundColor: '#0A0A0A', borderTop: '4px solid #FAFAFA' }}
      >
        <span className="text-sm tracking-[0.2em] uppercase font-bold" style={{ fontFamily: mono }}>
          {name.split(' ')[0]?.toUpperCase() || 'ARPEGGIO'}
        </span>
        <div className="hidden md:flex gap-8 text-xs tracking-[0.25em] uppercase" style={{ fontFamily: mono, color: '#888' }}>
          {['Work', 'About', 'Experience', 'Contact'].map((l) => (
            <span key={l} className="cursor-pointer hover:text-white transition-colors">{l}</span>
          ))}
        </div>
      </motion.nav>

      {/* Hero — Name dominant, photo constrained */}
      <section className="px-6 md:px-14 py-14 md:py-20 lg:min-h-[85vh] flex items-center">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 w-full items-center">
          {/* Left — Big name (dominant) */}
          <motion.div variants={fadeUp} className="lg:col-span-8 order-1 flex flex-col justify-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.88] tracking-tighter" style={{ fontFamily: heading }}>
              {name.split(' ').map((w: string, i: number) => (
                <span key={i} className="block">{w}</span>
              ))}
            </h1>
            <p className="mt-6 text-xl md:text-2xl font-light max-w-2xl" style={{ color: '#BBB' }}>{headline}</p>
            <div className="flex items-center gap-2 mt-5">
              <MapPin className="h-3 w-3" style={{ color: '#666' }} />
              <span className="text-xs tracking-widest uppercase" style={{ fontFamily: mono, color: '#666' }}>{location}</span>
            </div>
            {bio && (
              <p className="mt-6 text-base md:text-lg font-light leading-relaxed max-w-2xl" style={{ color: '#888' }}>{bio}</p>
            )}
          </motion.div>

          {/* Right — Photo constrained */}
          <motion.div variants={fadeUp} className="lg:col-span-4 order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm">
              <div className="relative overflow-hidden" style={{ border: '2px solid #222' }}>
                {(!profile || !profile.hidePhoto) && (
                   profile?.photoUrl ? (
                     <img src={profile.photoUrl} alt={name} className="w-full max-h-[320px] lg:max-h-[420px] object-cover grayscale" />
                   ) : (
                     <div className="w-full aspect-[4/5] max-h-[320px] lg:max-h-[420px] bg-[#111] flex items-center justify-center">
                       <UserCircle className="w-20 h-20 text-[#333]" />
                     </div>
                   )
                )}
                {/* Grid overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  backgroundImage: 'linear-gradient(#FAFAFA08 1px, transparent 1px), linear-gradient(90deg, #FAFAFA08 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>


      {/* About — Bold statement */}
      <section className="px-6 md:px-14 py-16 md:py-24" style={{ borderTop: '1px solid #1A1A1A' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <span className="text-xs tracking-[0.3em] uppercase block mb-6" style={{ fontFamily: mono, color: '#555' }}>About</span>
          <p className="text-2xl md:text-4xl lg:text-5xl font-light leading-[1.3] max-w-5xl" style={{ fontFamily: heading }}>
            {bio}
          </p>

        </motion.div>
      </section>

      {/* Skills — Grid chips */}
      <section className="px-6 md:px-14 py-12" style={{ borderTop: '1px solid #1A1A1A' }}>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.span variants={fadeUp} className="text-xs tracking-[0.3em] uppercase block mb-8" style={{ fontFamily: mono, color: '#555' }}>Capabilities</motion.span>
          <div className="flex flex-wrap gap-3">
            {skills.map((s: string, i: number) => (
              <motion.span key={i} variants={fadeUp} className="px-4 py-2 text-xs tracking-wider uppercase" style={{ fontFamily: mono, border: '1px solid #333', color: '#AAA' }}>
                {s}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Projects — Bento masonry */}
      <section className="px-6 md:px-14 py-16 md:py-28" style={{ borderTop: '1px solid #1A1A1A' }}>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.div variants={fadeUp} className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase block mb-3" style={{ fontFamily: mono, color: '#555' }}>Selected Work</span>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter" style={{ fontFamily: heading }}>Projects</h2>
            </div>
            <span className="text-xs tracking-widest uppercase hidden md:block" style={{ fontFamily: mono, color: '#555' }}>{projects.length} Works</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
            {projects.slice(0, 6).map((proj: any, i: number) => {
              const isFullWidth = i === 0;
              const href = getProjectHref(proj);
              const hasMeta = proj.category || proj.year;
              return (
                <motion.article
                  key={i}
                  variants={fadeUp}
                  onClick={href ? () => window.open(href, '_blank', 'noopener,noreferrer') : undefined}
                  className={`group flex flex-col p-6 md:p-7 bg-[#0F0F0F] hover:bg-[#141414] transition-colors ${href ? 'cursor-pointer' : ''} ${isFullWidth ? 'lg:col-span-2' : ''}`}
                  style={{ border: '1px solid #1F1F1F', minHeight: '200px' }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-2xl md:text-3xl font-semibold tracking-tight leading-tight group-hover:text-[#64BFFF] transition-colors" style={{ fontFamily: heading }}>
                      {proj.title}
                    </h3>
                    {href && (
                      <ArrowUpRight className="h-5 w-5 shrink-0 mt-1 text-[#666] group-hover:text-white transition-colors" />
                    )}
                  </div>
                  {proj.description && (
                    <p className="mt-3 text-sm md:text-base leading-relaxed line-clamp-3 flex-1" style={{ color: '#999' }}>
                      {proj.description}
                    </p>
                  )}
                  {hasMeta && (
                    <div className="mt-5 pt-4 flex items-center gap-3 text-[10px] tracking-[0.25em] uppercase" style={{ fontFamily: mono, color: '#555', borderTop: '1px solid #1A1A1A' }}>
                      {proj.category && <span>{proj.category}</span>}
                      {proj.category && proj.year && <span>·</span>}
                      {proj.year && <span>{proj.year}</span>}
                    </div>
                  )}
                </motion.article>
              );
            })}
          </div>

        </motion.div>
      </section>

      {/* Experience — Timeline */}
      <section className="px-6 md:px-14 py-16 md:py-24" style={{ borderTop: '1px solid #1A1A1A' }}>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.span variants={fadeUp} className="text-xs tracking-[0.3em] uppercase block mb-10" style={{ fontFamily: mono, color: '#555' }}>Experience</motion.span>
          <div className="space-y-0">
            {experience.map((e: any, i: number) => (
              <motion.div key={i} variants={fadeUp} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12 py-7" style={{ borderBottom: '1px solid #1A1A1A' }}>
                <span className="text-xs md:text-sm tracking-widest w-48 shrink-0" style={{ fontFamily: mono, color: '#666' }}>{e.year}</span>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-semibold" style={{ fontFamily: heading }}>{e.role}</h3>
                  <span className="text-base md:text-lg" style={{ color: '#999' }}>{e.company}</span>
                </div>
              </motion.div>

            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact — Brutalist footer */}
      <footer className="px-6 md:px-14 py-20 md:py-28" style={{ borderTop: '4px solid #FAFAFA' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="text-xs tracking-[0.3em] uppercase block mb-6" style={{ fontFamily: mono, color: '#555' }}>Get in Touch</span>
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8" style={{ fontFamily: heading }}>
            Let's build<br />something.
          </h2>
          <a href={`mailto:${email}`} className="inline-flex items-center gap-3 text-lg hover:text-[#64BFFF] transition-colors" style={{ fontFamily: mono }}>
            <Mail className="h-5 w-5" />
            {email}
          </a>

          <div className="flex gap-6 mt-10">
            {githubUrl && githubUrl !== '#' && (
              <a href={githubUrl} className="p-3 hover:bg-white/10 transition-colors" style={{ border: '1px solid #333' }}>
                <Github className="h-5 w-5" />
              </a>
            )}
            {linkedinUrl && linkedinUrl !== '#' && (
              <a href={linkedinUrl} className="p-3 hover:bg-white/10 transition-colors" style={{ border: '1px solid #333' }}>
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {twitterUrl && twitterUrl !== '#' && (
              <a href={twitterUrl} className="p-3 hover:bg-white/10 transition-colors" style={{ border: '1px solid #333' }}>
                <Twitter className="h-5 w-5" />
              </a>
            )}
            {/* Show demo socials if no profile */}
            {!profile && (
              <>
                <a href="#" className="p-3 hover:bg-white/10 transition-colors" style={{ border: '1px solid #333' }}><Github className="h-5 w-5" /></a>
                <a href="#" className="p-3 hover:bg-white/10 transition-colors" style={{ border: '1px solid #333' }}><Linkedin className="h-5 w-5" /></a>
                <a href="#" className="p-3 hover:bg-white/10 transition-colors" style={{ border: '1px solid #333' }}><Twitter className="h-5 w-5" /></a>
              </>
            )}
          </div>
        </motion.div>

        <div className="mt-16 pt-6 flex items-center justify-between text-xs" style={{ borderTop: '1px solid #1A1A1A', fontFamily: mono, color: '#444' }}>
          <span>© {new Date().getFullYear()} {name}</span>
          <span>Built with Foliogen</span>
        </div>
      </footer>
    </div>
  );
}
