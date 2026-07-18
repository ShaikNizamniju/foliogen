import { motion } from 'framer-motion';
import { ProfileData } from '@/contexts/ProfileContext';
import { UserCircle, Mail, Linkedin, Github, Twitter, Globe, MapPin } from 'lucide-react';
import { getProjectHref } from '@/lib/urlUtils';

interface FrqncyTemplateProps {
  profile?: ProfileData;
}

const DEFAULT_ROTATIONS = ['-3deg', '2deg', '-1deg', '3deg'];
const mono = "'IBM Plex Mono', monospace";
const heading = "'Space Grotesk', sans-serif";

const bg_palettes = ['#CDFF64', '#FF6B6B', '#64BFFF', '#111111', '#E8E0FF', '#FFE4B5'];
const text_palettes = ['#111111', '#FFFFFF', '#111111', '#FFFFFF', '#111111', '#111111'];

/* (ScrollingSkills removed — hero now renders static wrapped pills) */

/* ── Skills Marquee (horizontal) ── */
function SkillMarquee({ items }: { items: string[] }) {
  const text = items.map(s => s.toUpperCase()).join('  →  ') + '  →  ';
  return (
    <div className="overflow-hidden py-5" style={{ backgroundColor: '#111111' }}>
      <motion.div
        className="flex whitespace-nowrap gap-0"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      >
        {[0, 1].map((k) => (
          <span key={k} className="text-sm md:text-base tracking-[0.25em] uppercase text-white select-none px-4" style={{ fontFamily: mono }}>
            {text.repeat(3)}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function FrqncyTemplate({ profile }: FrqncyTemplateProps) {
  const name = profile?.fullName || 'Your Name';
  const role = profile?.headline || '';
  const bio = profile?.bio || '';
  const location = profile?.location || '';
  const email = profile?.email || '';
  const year = new Date().getFullYear();
  const skills = profile?.skills || [];
  const experience = profile?.workExperience || [];

  const projects = (profile?.projects || []).slice(0, 6).map((p, i) => ({
    title: p.title || 'Project',
    category: p.techStack?.[0] || '',
    description: p.description || '',
    bg: bg_palettes[i % bg_palettes.length],
    text: text_palettes[i % text_palettes.length],
    image: p.imageUrl || '',
    link: p.link || '',
    proofOfImpact: p.proofOfImpact || '',
  }));

  const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  const contactHref = email ? `mailto:${email}` : '#contact';

  const nameParts = name.split(' ');
  const first = nameParts[0] || name;
  const last = nameParts.slice(1).join(' ');

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#F0F0F0', color: '#111111', fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-30 flex items-center justify-between gap-4 px-6 md:px-14 py-4"
        style={{ backgroundColor: '#FFFFFF', borderBottom: '3px solid #111111' }}
      >
        <span className="text-base tracking-wider truncate" style={{ fontFamily: mono }}>{name}</span>
        <div className="hidden md:flex gap-6 text-sm" style={{ fontFamily: mono }}>
          <a href="#work" className="cursor-pointer hover:text-[#CDFF64] transition-colors">work</a>
          {experience.length > 0 && <a href="#experience" className="cursor-pointer hover:text-[#CDFF64] transition-colors">experience</a>}
          {skills.length > 0 && <a href="#skills" className="cursor-pointer hover:text-[#CDFF64] transition-colors">skills</a>}
          <a href="#contact" className="cursor-pointer hover:text-[#CDFF64] transition-colors">contact</a>
        </div>
      </motion.nav>

      {/* Hero — Bento */}
      <section className="px-6 md:px-14 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 md:auto-rows-fr">
          {/* 1 — Name / bio / location */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="order-1 md:order-1 flex flex-col justify-between gap-6 p-8 md:p-10 rounded-2xl min-h-[320px]"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tighter break-words" style={{ fontFamily: heading }}>
                {first}{last && <><br />{last}</>}
              </h1>
              {(role || location) && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {role && (
                    <span className="text-xs tracking-widest uppercase px-3 py-1.5 rounded-full border max-w-full break-words" style={{ fontFamily: mono, borderColor: '#CDFF64', backgroundColor: '#CDFF64' }}>
                      {role}
                    </span>
                  )}
                  {location && (
                    <span className="inline-flex items-center gap-1 text-xs tracking-widest uppercase px-3 py-1.5 rounded-full border max-w-full break-words" style={{ fontFamily: mono, borderColor: '#111111', color: '#111111' }}>
                      <MapPin className="h-3 w-3" />{location}
                    </span>
                  )}
                </div>
              )}
            </div>
            {bio && (
              <p className="text-sm md:text-base leading-relaxed line-clamp-4" style={{ color: '#444' }}>
                {bio}
              </p>
            )}
          </motion.div>

          {/* 2 — Photo */}
          {!profile?.hidePhoto && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="order-2 md:order-2 rounded-2xl overflow-hidden relative min-h-[320px]"
            >
              {profile?.photoUrl ? (
                <img src={profile.photoUrl} alt={name} className="w-full h-full object-cover min-h-[320px]" />
              ) : (
                <div className="w-full h-full min-h-[320px] bg-[#E5E5E5] flex items-center justify-center">
                  <UserCircle className="w-24 h-24 text-[#CCCCCC]" />
                </div>
              )}
            </motion.div>
          )}

          {/* 3 — CTA (mobile before skills; desktop bottom-right) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`order-3 md:order-4 rounded-2xl p-8 md:p-10 flex flex-col justify-between gap-6 min-h-[320px] ${skills.length === 0 ? 'md:col-span-2' : ''}`}
            style={{ backgroundColor: '#111111' }}
          >
            <div>
              <span className="text-sm tracking-wider mb-3 block" style={{ fontFamily: mono, color: '#CDFF64' }}>Open to opportunities</span>
              <p className="text-white text-lg md:text-xl leading-snug" style={{ fontFamily: heading }}>Let's build something great together.</p>
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm break-all hover:text-[#CDFF64] transition-colors"
                  style={{ fontFamily: mono, color: '#CCC' }}
                >
                  <Mail className="h-4 w-4 shrink-0" />{email}
                </a>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <motion.a
                href={contactHref}
                onClick={(e) => { if (!email) { e.preventDefault(); scrollToContact(); } }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-7 py-3 rounded-full text-sm font-semibold tracking-wider inline-block w-fit min-h-[44px]"
                style={{ backgroundColor: '#CDFF64', color: '#111111', fontFamily: heading }}
              >
                Let's Talk →
              </motion.a>
              {(profile?.linkedinUrl || profile?.githubUrl || profile?.twitterUrl || profile?.website) && (
                <div className="flex flex-wrap items-center gap-3">
                  {profile?.linkedinUrl && (
                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center text-white hover:border-[#CDFF64] hover:text-[#CDFF64] transition-colors">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {profile?.githubUrl && (
                    <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center text-white hover:border-[#CDFF64] hover:text-[#CDFF64] transition-colors">
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {profile?.twitterUrl && (
                    <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center text-white hover:border-[#CDFF64] hover:text-[#CDFF64] transition-colors">
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                  {profile?.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" aria-label="Website" className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center text-white hover:border-[#CDFF64] hover:text-[#CDFF64] transition-colors">
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* 4 — Skills pills (static, wrapped) */}
          {skills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-4 md:order-3 rounded-2xl p-8 md:p-10 flex flex-col gap-4 min-h-[320px]"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <span className="text-xs tracking-widest uppercase" style={{ fontFamily: mono, color: '#888' }}>Skills</span>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {skills.slice(0, 10).map((s, i) => (
                  <span
                    key={s + i}
                    className="text-xs md:text-sm tracking-wider px-3 py-1.5 rounded-full border inline-block max-w-full break-words"
                    style={{ fontFamily: mono, borderColor: '#CDFF64', color: '#111111', backgroundColor: '#F7FFE0' }}
                  >
                    {s}
                  </span>
                ))}
                {skills.length > 10 && (
                  <a
                    href="#skills"
                    className="text-xs md:text-sm tracking-wider px-3 py-1.5 rounded-full inline-block font-semibold hover:opacity-80 transition-opacity"
                    style={{ fontFamily: mono, backgroundColor: '#111111', color: '#CDFF64' }}
                  >
                    +{skills.length - 10} more
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>


      {/* Skills Marquee */}
      {skills.length > 0 && <SkillMarquee items={skills} />}

      {/* Selected Work */}
      {projects.length > 0 && (
        <section id="work" className="px-6 md:px-14 py-14 md:py-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-10 tracking-tight" style={{ fontFamily: heading }}>
            Selected Work
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p, i) => {
              const href = getProjectHref(p);
              return (
                <motion.div
                  key={p.title + i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -8 }}
                  onClick={href ? () => window.open(href, '_blank', 'noopener,noreferrer') : undefined}
                  className={`rounded-2xl overflow-hidden ${href ? 'cursor-pointer' : ''} transition-shadow duration-300 hover:shadow-2xl`}
                  style={{ backgroundColor: p.bg }}
                >
                  {p.image && <img src={p.image} alt={p.title} className="w-full aspect-[3/2] object-cover" />}
                  <div className={`p-5 ${!p.image ? 'h-full min-h-[180px] flex flex-col justify-center' : ''}`}>
                    <h3 className="text-lg font-semibold mb-1 break-words" style={{ fontFamily: heading, color: p.text }}>{p.title}</h3>
                    {p.category && <span className="text-xs tracking-widest uppercase block mb-2" style={{ fontFamily: mono, color: p.text, opacity: 0.7 }}>{p.category}</span>}
                    {p.description && <p className="text-sm mt-1 line-clamp-3" style={{ color: p.text, opacity: 0.85 }}>{p.description}</p>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* About */}
      {bio && (
        <section className="px-6 md:px-14 py-14 md:py-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-center max-w-4xl mx-auto leading-tight tracking-tight break-words"
            style={{ fontFamily: heading }}
          >
            &ldquo;{bio}&rdquo;
          </motion.p>

          {profile?.projects && profile.projects.filter(p => p.imageUrl).length > 0 && (
            <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-14">
              {profile.projects.filter(p => p.imageUrl).slice(0, 4).map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, rotate: 0 }}
                  whileInView={{ opacity: 1, rotate: parseFloat(DEFAULT_ROTATIONS[i % DEFAULT_ROTATIONS.length]) }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-2.5 pb-10 shadow-lg"
                  style={{ transform: `rotate(${DEFAULT_ROTATIONS[i % DEFAULT_ROTATIONS.length]})` }}
                >
                  <img src={p.imageUrl} alt={p.title} className="w-40 md:w-52 aspect-[6/7] object-cover" />
                </motion.div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section id="experience" className="px-6 md:px-14 py-14 md:py-20" style={{ backgroundColor: '#FFFFFF' }}>
          <h2 className="text-3xl md:text-5xl font-bold mb-10 tracking-tight" style={{ fontFamily: heading }}>
            Experience
          </h2>
          <div className="space-y-6 max-w-4xl">
            {experience.map((w, i) => {
              const dates = [w.startDate, w.endDate].filter(Boolean).join(' — ');
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-6 md:p-8 rounded-2xl border-l-4"
                  style={{ backgroundColor: '#F0F0F0', borderLeftColor: '#CDFF64' }}
                >
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-3">
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight break-words" style={{ fontFamily: heading }}>
                      {w.jobTitle}
                      {w.company && <span style={{ color: '#666', fontWeight: 500 }}> · {w.company}</span>}
                    </h3>
                    {dates && (
                      <span className="text-xs tracking-widest uppercase shrink-0" style={{ fontFamily: mono, color: '#888' }}>{dates}</span>
                    )}
                  </div>
                  {w.description && (
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-line" style={{ color: '#444' }}>{w.description}</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section id="skills" className="px-6 md:px-14 py-14 md:py-20">
          <h2 className="text-2xl md:text-4xl font-bold mb-10 tracking-tight text-center" style={{ fontFamily: heading }}>
            Skills &amp; Expertise
          </h2>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-5xl mx-auto">
            {skills.map((b, i) => (
              <div
                key={b + i}
                className="px-5 md:px-8 py-3 md:py-4 rounded-xl text-sm font-medium tracking-wider uppercase transition-all duration-300 break-words"
                style={{ fontFamily: mono, backgroundColor: '#E5E5E5', color: '#888' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = '#CDFF64';
                  (e.currentTarget as HTMLDivElement).style.color = '#111111';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = '#E5E5E5';
                  (e.currentTarget as HTMLDivElement).style.color = '#888';
                }}
              >
                {b}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact — mailto */}
      <section id="contact" className="px-6 md:px-14 py-16 md:py-24" style={{ backgroundColor: '#111111', color: '#FFFFFF' }}>
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter break-words"
            style={{ fontFamily: heading }}
          >
            HIT ME UP.
          </motion.h2>
          <p className="text-base md:text-lg mb-10" style={{ fontFamily: mono, color: '#CCC' }}>
            {email ? 'Send me an email — I read every message.' : 'Reach out via my social links.'}
          </p>

          {email ? (
            <motion.a
              href={`mailto:${email}`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-4 text-sm font-bold tracking-widest uppercase min-h-[44px]"
              style={{ backgroundColor: '#CDFF64', color: '#111111', fontFamily: heading }}
            >
              <Mail className="h-4 w-4" /> Get in Touch →
            </motion.a>
          ) : (
            <p className="text-sm tracking-widest" style={{ fontFamily: mono, color: '#999' }}>
              Contact info coming soon.
            </p>
          )}

          {email && (
            <p className="mt-6 text-xs tracking-widest break-all" style={{ fontFamily: mono, color: '#666' }}>
              {email}
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <div className="py-6 text-center text-xs px-4 break-words" style={{ fontFamily: mono, color: '#999', backgroundColor: '#F0F0F0' }}>
        © {year} {name}. All rights reserved.
      </div>
    </div>
  );
}
