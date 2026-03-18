import { motion } from 'framer-motion';
import { ProfileData } from '@/contexts/ProfileContext';
import { ArrowUpRight, Mail, MapPin, Github, Linkedin, Twitter, UserCircle } from 'lucide-react';

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
    { title: 'Modular Design System', category: 'Design Systems', year: '2024', image: 'https://picsum.photos/seed/arp1/800/600', description: 'A token-driven system used across 12 products serving 4M+ users.' },
    { title: 'Spatial Canvas', category: 'Spatial UI', year: '2024', image: 'https://picsum.photos/seed/arp2/800/600', description: 'An infinite canvas tool for collaborative 3D spatial design.' },
    { title: 'Kinetic Typography', category: 'Motion', year: '2023', image: 'https://picsum.photos/seed/arp3/800/600', description: 'Type that responds to cursor, scroll, and ambient audio input.' },
    { title: 'Zero Latency', category: 'Performance', year: '2023', image: 'https://picsum.photos/seed/arp4/800/600', description: 'Edge-optimized design tool with sub-50ms interaction latency.' },
    { title: 'Color Intelligence', category: 'AI / Design', year: '2023', image: 'https://picsum.photos/seed/arp5/800/600', description: 'ML-powered palette generation from brand voice and mood.' },
    { title: 'Component Forge', category: 'Dev Tools', year: '2022', image: 'https://picsum.photos/seed/arp6/800/600', description: 'Visual component builder that exports production React code.' },
  ],
  workExperience: [
    { year: '2022 — Present', role: 'AI Product Manager', company: 'Foliogen' },
    { year: '2020 — 2022', role: 'Senior Designer', company: 'Figma' },
    { year: '2018 — 2020', role: 'UI Engineer', company: 'Stripe' },
    { year: '2016 — 2018', role: 'Design Intern → Jr. Designer', company: 'Razorpay' },
  ],
  photoUrl: 'https://picsum.photos/seed/arp-profile/400/400',
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
    ? p.projects.map((proj: any, i: number) => ({
        title: proj.title,
        category: proj.techStack?.[0] || 'Project',
        year: '2024',
        image: proj.imageUrl || `https://picsum.photos/seed/arp${i + 1}/800/600`,
        description: proj.description || '',
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

      {/* Hero — Grid split */}
      <section className="px-6 md:px-14 py-16 md:py-28">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Left — Big name */}
          <motion.div variants={fadeUp} className="md:col-span-7 flex flex-col justify-end">
            <h1 className="text-6xl md:text-8xl lg:text-[110px] font-bold leading-[0.88] tracking-tighter" style={{ fontFamily: heading }}>
              {name.split(' ').map((w: string, i: number) => (
                <span key={i} className="block">{w}</span>
              ))}
            </h1>
            <p className="mt-6 text-lg md:text-xl font-light max-w-lg" style={{ color: '#888' }}>{headline}</p>
          </motion.div>

          {/* Right — Photo with grid overlay */}
          <motion.div variants={fadeUp} className="md:col-span-5 relative">
            <div className="relative overflow-hidden" style={{ border: '2px solid #222' }}>
              {(!profile || !profile.hidePhoto) ? (
                 profile?.photoUrl && profile.photoUrl !== 'https://picsum.photos/seed/arp-profile/400/400' ? (
                   <img src={profile.photoUrl} alt={name} className="w-full aspect-[4/5] object-cover grayscale" />
                 ) : (
                   <div className="w-full aspect-[4/5] bg-[#111] flex items-center justify-center">
                     <UserCircle className="w-24 h-24 text-[#333]" />
                   </div>
                 )
              ) : null}
              {/* Grid overlay */}
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(#FAFAFA08 1px, transparent 1px), linear-gradient(90deg, #FAFAFA08 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }} />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <MapPin className="h-3 w-3" style={{ color: '#666' }} />
              <span className="text-xs tracking-widest uppercase" style={{ fontFamily: mono, color: '#666' }}>{location}</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* About — Bold statement */}
      <section className="px-6 md:px-14 py-16 md:py-24" style={{ borderTop: '1px solid #1A1A1A' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <span className="text-xs tracking-[0.3em] uppercase block mb-6" style={{ fontFamily: mono, color: '#555' }}>About</span>
          <p className="text-2xl md:text-4xl font-light leading-relaxed max-w-4xl" style={{ fontFamily: heading }}>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {projects.slice(0, 6).map((proj: any, i: number) => {
              const isLarge = i === 0 || i === 3;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className={`group cursor-pointer ${isLarge ? 'md:col-span-2' : ''}`}
                >
                  <div className="relative overflow-hidden" style={{ border: '1px solid #1A1A1A' }}>
                    <motion.img
                      src={proj.image}
                      alt={proj.title}
                      className={`w-full object-cover ${isLarge ? 'aspect-[21/9]' : 'aspect-[3/2]'}`}
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-[#0A0A0A]/0 group-hover:bg-[#0A0A0A]/60 transition-colors duration-400 flex items-end p-6">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                        <p className="text-sm text-white/70 mb-1" style={{ fontFamily: mono }}>{proj.description}</p>
                        <div className="flex items-center gap-2 text-white">
                          <span className="text-sm font-medium">View Project</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <h3 className="text-lg md:text-xl font-semibold tracking-tight group-hover:text-[#64BFFF] transition-colors" style={{ fontFamily: heading }}>{proj.title}</h3>
                    <span className="text-[10px] tracking-[0.25em] uppercase" style={{ fontFamily: mono, color: '#555' }}>{proj.category} · {proj.year}</span>
                  </div>
                </motion.div>
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
              <motion.div key={i} variants={fadeUp} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12 py-6" style={{ borderBottom: '1px solid #1A1A1A' }}>
                <span className="text-xs tracking-widest w-48 shrink-0" style={{ fontFamily: mono, color: '#555' }}>{e.year}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold" style={{ fontFamily: heading }}>{e.role}</h3>
                  <span className="text-sm" style={{ color: '#888' }}>{e.company}</span>
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
