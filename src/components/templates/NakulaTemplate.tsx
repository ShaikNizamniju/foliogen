import { motion } from 'framer-motion';
import { ProfileData } from '@/contexts/ProfileContext';
import { ArrowUpRight, Mail, MapPin, ExternalLink, UserCircle } from 'lucide-react';

interface NakulaTemplateProps {
  profile?: ProfileData;
}

/* ── Demo Data ── */
const demoProfile = {
  fullName: 'Alex Rivera',
  headline: 'Brand Designer & Art Director',
  bio: 'I craft visual identities that feel both timeless and alive. My work lives at the intersection of editorial design, motion, and meticulous craft — where every curve, color, and composition is an intentional conversation with the viewer.',
  location: 'New York, NY',
  email: 'hello@alexrivera.design',
  skills: ['Brand Strategy', 'Visual Identity', 'Editorial Design', 'Art Direction', 'Typography', 'Motion Graphics'],
  projects: [
    { title: 'Solstice', desc: 'Brand identity for a wellness retreat.', category: 'Identity', image: '' },
    { title: 'Ethereal', desc: 'Editorial design for a luxury magazine.', category: 'Editorial', image: '' },
    { title: 'Prism', desc: 'Visual system for a fintech startup.', category: 'Systems', image: '' },
    { title: 'Vesper', desc: 'Packaging for an artisan fragrance brand.', category: 'Packaging', image: '' },
    { title: 'Lunar', desc: 'Campaign visuals for a fashion label.', category: 'Campaign', image: '' },
    { title: 'Cadence', desc: 'Motion identity for a music platform.', category: 'Motion', image: '' },
  ],
  workExperience: [
    { period: '2022 — Now', role: 'Creative Director', company: 'Studio Nakula', desc: 'Leading brand and identity projects for premium clients worldwide.' },
    { period: '2019 — 2022', role: 'Sr. Art Director', company: 'Pentagram', desc: 'Directed visual identities for Fortune 500 brands.' },
    { period: '2017 — 2019', role: 'Designer', company: 'Landor', desc: 'Crafted brand systems and packaging design.' },
  ],
  photoUrl: '',
  linkedinUrl: '#',
  githubUrl: '#',
  twitterUrl: '#',
  website: '#',
};

const serif = "'Instrument Serif', serif";
const sans = "'Plus Jakarta Sans', sans-serif";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function NakulaTemplate({ profile }: NakulaTemplateProps) {
  const p = profile || demoProfile as any;
  const name = p.fullName || demoProfile.fullName;
  const headline = p.headline || demoProfile.headline;
  const bio = p.bio || demoProfile.bio;
  const location = p.location || demoProfile.location;
  const email = p.email || demoProfile.email;
  const skills = p.skills?.length ? p.skills : demoProfile.skills;
  const photoUrl = p.photoUrl || demoProfile.photoUrl;
  const website = p.website || demoProfile.website;

  const projects = p.projects?.length
    ? p.projects.map((proj: any, i: number) => ({
        title: proj.title,
        desc: proj.description || '',
        category: proj.techStack?.[0] || 'Project',
        image: proj.imageUrl || '',
      }))
    : demoProfile.projects;

  const experience = p.workExperience?.length
    ? p.workExperience.map((w: any) => ({
        period: `${w.startDate || ''} — ${w.current ? 'Now' : w.endDate || ''}`,
        role: w.jobTitle,
        company: w.company,
        desc: w.description || '',
      }))
    : demoProfile.workExperience;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8', color: '#1A1A1A', fontFamily: sans }}>
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-30 flex items-center justify-between px-8 md:px-16 py-5 backdrop-blur-xl"
        style={{ backgroundColor: 'rgba(250,250,248,0.85)', borderBottom: '1px solid #E8E8E4' }}
      >
        <span className="text-lg font-medium tracking-tight">{name.split(' ')[0]}</span>
        <div className="hidden md:flex gap-8 text-sm" style={{ color: '#888' }}>
          {['Work', 'About', 'Experience', 'Contact'].map((l) => (
            <span key={l} className="cursor-pointer hover:text-[#1A1A1A] transition-colors">{l}</span>
          ))}
        </div>
      </motion.nav>

      {/* Hero — Elegant centered */}
      <section className="px-8 md:px-16 pt-20 md:pt-32 pb-16">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-5xl mx-auto">
          <motion.p variants={fadeUp} className="text-sm tracking-wider uppercase mb-6" style={{ color: '#999' }}>
            {headline}
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-[88px] font-normal leading-[1.05] tracking-tight" style={{ fontFamily: serif }}>
            Designing brands that{' '}
            <span className="italic">resonate</span>{' '}
            <span className={`inline-block w-16 md:w-24 h-8 md:h-12 rounded-full overflow-hidden align-middle mx-1 ${(!profile?.photoUrl) ? 'border border-[#E8E8E4]' : ''}`}>
              {(!profile || !profile.hidePhoto) && (
                 profile?.photoUrl ? (
                   <img src={profile.photoUrl} alt="" className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full bg-[#E8E8E4] flex items-center justify-center">
                     <UserCircle className="w-6 h-6 md:w-8 md:h-8 text-[#999]" />
                   </div>
                 )
              )}
            </span>{' '}
            and inspire.
          </motion.h1>
          <motion.div variants={fadeUp} className="flex items-center gap-6 mt-10">
            <a href={`mailto:${email}`} className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-full text-white" style={{ backgroundColor: '#1A1A1A' }}>
              <Mail className="h-4 w-4" />
              Get in Touch
            </a>
            <div className="flex items-center gap-2 text-sm" style={{ color: '#888' }}>
              <MapPin className="h-3.5 w-3.5" />
              {location}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* About — Glassmorphic card */}
      <section className="px-8 md:px-16 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto p-8 md:p-12 rounded-3xl"
          style={{
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              {(!profile || !profile.hidePhoto) ? (
                 profile?.photoUrl ? (
                   <img src={profile.photoUrl} alt={name} className="w-full aspect-[4/5] object-cover rounded-2xl" />
                 ) : (
                   <div className="w-full aspect-[4/5] bg-[#E8E8E4] rounded-2xl flex items-center justify-center">
                     <UserCircle className="w-24 h-24 text-[#999]" />
                   </div>
                 )
              ) : null}
            </div>
            <div className="md:col-span-2 flex flex-col justify-center">
              <span className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: '#999' }}>About</span>
              <p className="text-xl md:text-2xl font-light leading-relaxed" style={{ fontFamily: serif }}>
                {bio}
              </p>
              <div className="flex flex-wrap gap-2 mt-8">
                {skills.map((s: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 text-xs tracking-wider rounded-full" style={{ backgroundColor: '#F0EDE8', color: '#666' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Projects — Clean grid */}
      <section className="px-8 md:px-16 py-16 md:py-24">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs tracking-[0.2em] uppercase block mb-3" style={{ color: '#999' }}>Portfolio</span>
              <h2 className="text-4xl md:text-5xl font-normal tracking-tight" style={{ fontFamily: serif }}>Selected <em>Work</em></h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.slice(0, 6).map((proj: any, i: number) => (
              <motion.div key={i} variants={fadeUp} className="group cursor-pointer flex flex-col h-full">
                {proj.image ? (
                  <div className="relative overflow-hidden rounded-2xl" style={{ border: '1px solid #E8E8E4' }}>
                    <motion.img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full aspect-[4/3] object-cover"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/40 transition-colors duration-400 flex items-center justify-center">
                      <motion.div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 text-white text-sm font-medium px-5 py-2.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                        View Project <ArrowUpRight className="h-4 w-4" />
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col justify-center p-8 md:p-12 rounded-2xl bg-[#E8E8E4]/20 border border-[#E8E8E4] hover:bg-[#E8E8E4]/30 transition-colors mb-4">
                    <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-4" style={{ fontFamily: serif }}>{proj.title}</h3>
                    <p className="text-base leading-relaxed text-[#666]">{proj.desc}</p>
                    <span className="text-xs tracking-wider uppercase mt-6 block" style={{ color: '#BBB' }}>{proj.category}</span>
                  </div>
                )}
                {proj.image && (
                  <div className="mt-4 flex items-start justify-between px-1">
                    <div>
                      <h3 className="text-lg font-medium tracking-tight" style={{ fontFamily: serif }}>{proj.title}</h3>
                      <p className="text-sm mt-0.5" style={{ color: '#888' }}>{proj.desc}</p>
                    </div>
                    <span className="text-xs tracking-wider uppercase mt-1 shrink-0" style={{ color: '#BBB' }}>{proj.category}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Experience — Timeline */}
      <section className="px-8 md:px-16 py-16 md:py-24" style={{ backgroundColor: '#F5F3EE' }}>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} className="mb-12">
            <span className="text-xs tracking-[0.2em] uppercase block mb-3" style={{ color: '#999' }}>Career</span>
            <h2 className="text-4xl md:text-5xl font-normal tracking-tight" style={{ fontFamily: serif }}>Experience</h2>
          </motion.div>

          {experience.map((e: any, i: number) => (
            <motion.div key={i} variants={fadeUp} className="flex flex-col md:flex-row gap-4 md:gap-12 py-8" style={{ borderBottom: '1px solid #E0DDD6' }}>
              <span className="text-sm shrink-0 w-40" style={{ color: '#999' }}>{e.period}</span>
              <div>
                <h3 className="text-lg font-medium" style={{ fontFamily: serif }}>{e.role}</h3>
                <span className="text-sm" style={{ color: '#888' }}>{e.company}</span>
                {e.desc && <p className="text-sm mt-2" style={{ color: '#999' }}>{e.desc}</p>}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Contact — Refined */}
      <section className="px-8 md:px-16 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="text-xs tracking-[0.2em] uppercase block mb-6" style={{ color: '#999' }}>Contact</span>
          <h2 className="text-4xl md:text-6xl font-normal tracking-tight mb-6" style={{ fontFamily: serif }}>
            Let's create something <em>beautiful</em>.
          </h2>
          <p className="text-base mb-8" style={{ color: '#888' }}>
            Open for freelance projects and creative collaborations.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href={`mailto:${email}`} className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium rounded-full text-white" style={{ backgroundColor: '#1A1A1A' }}>
              <Mail className="h-4 w-4" />
              {email}
            </a>
            {website && website !== '#' && (
              <a href={website} className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium rounded-full" style={{ border: '1px solid #DDD', color: '#666' }}>
                <ExternalLink className="h-4 w-4" />
                Website
              </a>
            )}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-8 md:px-16 py-8" style={{ borderTop: '1px solid #E8E8E4' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm" style={{ color: '#BBB' }}>© {new Date().getFullYear()} {name}</span>
          <span className="text-xs" style={{ color: '#CCC' }}>Built with Foliogen</span>
        </div>
      </footer>
    </div>
  );
}
