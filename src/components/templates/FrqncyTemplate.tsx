import { motion } from 'framer-motion';
import { ProfileData } from '@/contexts/ProfileContext';
import { UserCircle } from 'lucide-react';

interface FrqncyTemplateProps {
  profile?: ProfileData;
}

const tags = ['#design', '#motion', '#visual', '#creative', '#branding'];

const marqueeText = 'BRANDING → MOTION → UI DESIGN → VISUAL → CAMPAIGNS → ';

const projectCards = [
  { title: 'Neon Drift', category: 'Brand Identity', bg: '#CDFF64', text: '#111111', image: 'https://picsum.photos/seed/frq1/600/400' },
  { title: 'Coral Pulse', category: 'Motion Design', bg: '#FF6B6B', text: '#FFFFFF', image: 'https://picsum.photos/seed/frq2/600/400' },
  { title: 'Cyan Wave', category: 'UI Design', bg: '#64BFFF', text: '#111111', image: 'https://picsum.photos/seed/frq3/600/400' },
  { title: 'Dark Matter', category: 'Campaign', bg: '#111111', text: '#FFFFFF', image: 'https://picsum.photos/seed/frq4/600/400' },
  { title: 'Haze Studio', category: 'Visual Design', bg: '#E8E0FF', text: '#111111', image: 'https://picsum.photos/seed/frq5/600/400' },
  { title: 'Golden Hour', category: 'Branding', bg: '#FFE4B5', text: '#111111', image: 'https://picsum.photos/seed/frq6/600/400' },
];

const polaroids = [
  { src: 'https://picsum.photos/seed/pol1/300/350', rot: '-3deg' },
  { src: 'https://picsum.photos/seed/pol2/300/350', rot: '2deg' },
  { src: 'https://picsum.photos/seed/pol3/300/350', rot: '-1deg' },
  { src: 'https://picsum.photos/seed/pol4/300/350', rot: '3deg' },
];

const brands = ['Google', 'Spotify', 'Nike', 'Discord', 'Figma', 'Notion'];

const mono = "'IBM Plex Mono', monospace";
const heading = "'Space Grotesk', sans-serif";

/* ── Vertical Tag Scroll ── */
function ScrollingTags() {
  const doubled = [...tags, ...tags, ...tags];
  return (
    <div className="h-full overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[#F0F0F0] to-transparent z-10" />
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#F0F0F0] to-transparent z-10" />
      <motion.div
        className="flex flex-col gap-4"
        animate={{ y: ['0%', '-33.33%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((t, i) => (
          <span key={i} className="text-sm tracking-wider px-3 py-1.5 rounded-full border inline-block w-fit" style={{ fontFamily: mono, borderColor: '#CDFF64', color: '#111111' }}>
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ── Project Marquee ── */
function ProjectMarquee() {
  return (
    <div className="overflow-hidden py-5" style={{ backgroundColor: '#111111' }}>
      <motion.div
        className="flex whitespace-nowrap gap-0"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      >
        {[0, 1].map((k) => (
          <span key={k} className="text-sm md:text-base tracking-[0.25em] uppercase text-white select-none" style={{ fontFamily: mono }}>
            {marqueeText.repeat(4)}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

const bg_palettes = ['#CDFF64', '#FF6B6B', '#64BFFF', '#111111', '#E8E0FF', '#FFE4B5'];
const text_palettes = ['#111111', '#FFFFFF', '#111111', '#FFFFFF', '#111111', '#111111'];

/* ── Main Template ── */
export function FrqncyTemplate({ profile }: FrqncyTemplateProps) {
  const name = profile?.fullName || 'Alex Rivera';
  const role = profile?.headline || 'Creative Director';
  const bio = profile?.bio || "I don't just design. I create experiences people actually feel.";
  const photoUrl = profile?.photoUrl || 'https://picsum.photos/seed/frq-profile/400/400';
  const email = profile?.email || '';
  const profileSkills = profile?.skills?.length ? profile.skills : tags;

  const dynamicProjectCards = profile?.projects?.length
    ? profile.projects.slice(0, 6).map((p, i) => ({
      title: p.title || 'Project',
      category: p.techStack?.[0] || 'Design',
      bg: bg_palettes[i % bg_palettes.length],
      text: text_palettes[i % text_palettes.length],
      image: p.imageUrl || `https://picsum.photos/seed/frq${i + 1}/600/400`,
    }))
    : projectCards;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0F0F0', color: '#111111', fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-14 py-4"
        style={{ backgroundColor: '#FFFFFF', borderBottom: '3px solid #111111' }}
      >
        <span className="text-base tracking-wider" style={{ fontFamily: mono }}>{name.split(' ')[0]?.toLowerCase() || 'frqncy'}.studio</span>
        <div className="hidden md:flex gap-6 text-sm" style={{ fontFamily: mono }}>
          {['wOrk', 'abOut', 'cOntact'].map((l) => (
            <span key={l} className="cursor-pointer hover:text-[#CDFF64] transition-colors">{l}</span>
          ))}
        </div>
      </motion.nav>

      {/* Hero — 2×2 Bento Grid */}
      <section className="px-6 md:px-14 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5" style={{ minHeight: '420px' }}>
          {/* Top-left: Name */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center p-8 md:p-10 rounded-2xl"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-[80px] font-bold leading-[0.95] tracking-tighter" style={{ fontFamily: heading }}>
              {name.split(' ')[0] || 'Alex'}<br />{name.split(' ')[1] || 'Rivera'}
            </h1>
            <span className="mt-4 text-xs tracking-widest uppercase px-3 py-1.5 rounded-full border w-fit" style={{ fontFamily: mono, borderColor: '#CDFF64', backgroundColor: '#CDFF64' }}>
              {role}
            </span>
          </motion.div>

          {/* Top-right: Profile image with lime overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl overflow-hidden relative"
          >
            {(!profile?.hidePhoto) && (
              profile?.photoUrl ? (
                 <img src={profile.photoUrl} alt={name} className="w-full h-full object-cover min-h-[280px]" />
              ) : (
                 <div className="w-full h-full min-h-[280px] bg-[#E5E5E5] flex items-center justify-center">
                   <UserCircle className="w-24 h-24 text-[#CCCCCC]" />
                 </div>
              )
            )}
            <div className="absolute inset-0" style={{ backgroundColor: '#CDFF64', mixBlendMode: 'multiply', opacity: 0.45 }} />
          </motion.div>

          {/* Bottom-left: Scrolling tags */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl p-8 overflow-hidden h-48 md:h-auto"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <ScrollingTags />
          </motion.div>

          {/* Bottom-right: CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-2xl p-8 md:p-10 flex flex-col justify-center items-start"
            style={{ backgroundColor: '#111111' }}
          >
            <span className="text-sm tracking-wider mb-3" style={{ fontFamily: mono, color: '#CDFF64' }}>Available ✓</span>
            <p className="text-white text-lg mb-6" style={{ fontFamily: heading }}>Ready for your next big project.</p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3 rounded-full text-sm font-semibold tracking-wider"
              style={{ backgroundColor: '#CDFF64', color: '#111111', fontFamily: heading }}
            >
              Let's Talk →
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Project Marquee */}
      <ProjectMarquee />

      {/* Project Grid */}
      <section className="px-6 md:px-14 py-14 md:py-20">
        <h2 className="text-3xl md:text-5xl font-bold mb-10 tracking-tight" style={{ fontFamily: heading }}>
          Selected Work
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {dynamicProjectCards.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="rounded-2xl overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-2xl"
              style={{ backgroundColor: p.bg }}
            >
              <img src={p.image} alt={p.title} className="w-full aspect-[3/2] object-cover" />
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: heading, color: p.text }}>{p.title}</h3>
                <span className="text-xs tracking-widest uppercase" style={{ fontFamily: mono, color: p.text, opacity: 0.7 }}>{p.category}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="px-6 md:px-14 py-14 md:py-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-center max-w-4xl mx-auto leading-tight tracking-tight"
          style={{ fontFamily: heading }}
        >
          &ldquo;{bio}&rdquo;
        </motion.p>

        {/* Polaroids */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-14">
          {polaroids.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, rotate: 0 }}
              whileInView={{ opacity: 1, rotate: parseFloat(p.rot) }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-2.5 pb-10 shadow-lg"
              style={{ transform: `rotate(${p.rot})` }}
            >
              <img src={p.src} alt="Polaroid" className="w-40 md:w-52 aspect-[6/7] object-cover" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Collaborations / Skills */}
      <section className="px-6 md:px-14 py-14 md:py-20">
        <h2 className="text-2xl md:text-4xl font-bold mb-10 tracking-tight text-center" style={{ fontFamily: heading }}>
          Skills &amp; Expertise
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {profileSkills.slice(0, 12).map((b) => (
            <div
              key={b}
              className="px-8 py-4 rounded-xl text-sm font-medium tracking-wider uppercase cursor-pointer transition-all duration-300 grayscale hover:grayscale-0"
              style={{
                fontFamily: mono,
                backgroundColor: '#E5E5E5',
                color: '#888',
              }}
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

      {/* Contact */}
      <section className="px-6 md:px-14 py-16 md:py-24" style={{ backgroundColor: '#111111', color: '#FFFFFF' }}>
        <div className="max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-bold mb-10 tracking-tighter"
            style={{ fontFamily: heading }}
          >
            HIT ME UP.
          </motion.h2>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Your name"
              className="w-full px-5 py-3.5 text-sm bg-white text-[#111111] rounded-none outline-none"
              style={{ fontFamily: mono, border: '3px solid #111111' }}
            />
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-5 py-3.5 text-sm bg-white text-[#111111] rounded-none outline-none"
              style={{ fontFamily: mono, border: '3px solid #111111' }}
            />
            <textarea
              rows={4}
              placeholder="Tell me about your project..."
              className="w-full px-5 py-3.5 text-sm bg-white text-[#111111] rounded-none outline-none resize-none"
              style={{ fontFamily: mono, border: '3px solid #111111' }}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 text-sm font-bold tracking-widest uppercase"
              style={{ backgroundColor: '#CDFF64', color: '#111111', fontFamily: heading }}
            >
              Send It →
            </motion.button>
          </form>

          <p className="mt-8 text-center text-xs tracking-widest" style={{ fontFamily: mono, color: '#666' }}>
            {email || `@${name.toLowerCase().replace(' ', '')}`}
          </p>
        </div>
      </section>

      {/* Footer */}
      <div className="py-6 text-center text-xs" style={{ fontFamily: mono, color: '#999', backgroundColor: '#F0F0F0' }}>
        © 2024 frqncy.studio. All rights reserved.
      </div>
    </div>
  );
}
