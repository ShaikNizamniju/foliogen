import { motion } from 'framer-motion';
import { ProfileData } from '@/contexts/ProfileContext';
import { UserCircle } from 'lucide-react';

interface GasparTemplateProps {
  profile?: ProfileData;
}
const cities = ['MUMBAI', 'DELHI', 'BANGALORE', 'TOKYO', 'MILAN'];

const projects = [
  { id: 1, title: 'Maison Lumière', category: 'Brand Identity', year: '2024', image: 'https://picsum.photos/seed/gaspar1/600/400' },
  { id: 2, title: 'Atelier Noir', category: 'Editorial Design', year: '2023', image: 'https://picsum.photos/seed/gaspar2/600/400' },
  { id: 3, title: 'Verso Studio', category: 'Web Design', year: '2024', image: 'https://picsum.photos/seed/gaspar3/600/400' },
  { id: 4, title: 'Callisto', category: 'Product Design', year: '2023', image: 'https://picsum.photos/seed/gaspar4/600/400' },
];

const marqueeClients = ['GOOGLE', 'APPLE', 'NIKE', 'FERRARI', 'VOGUE', 'NETFLIX', 'TESLA', 'AMAZON'];

const offices = [
  { city: 'Mumbai', address: '12 Marine Drive, Colaba', phone: '+91 22 4000 1234' },
  { city: 'Tokyo', address: '3-1-1 Roppongi, Minato', phone: '+81 3 6400 5678' },
  { city: 'Milan', address: 'Via Monte Napoleone 8', phone: '+39 02 7601 9012' },
];

const socials = ['Instagram', 'Twitter', 'LinkedIn'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const } },
};

function ClientMarquee() {
  return (
    <div className="overflow-hidden py-16 border-t" style={{ borderColor: '#D4C9B8' }}>
      <motion.div
        className="flex whitespace-nowrap gap-16"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        {[...marqueeClients, ...marqueeClients].map((c, i) => (
          <span key={i} className="text-2xl md:text-3xl font-light tracking-[0.2em] select-none" style={{ fontFamily: "'Playfair Display', serif", color: '#8B7355' }}>
            {c}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function GasparTemplate({ profile }: GasparTemplateProps) {
  const name = profile?.fullName || 'ALEX RIVERA';
  const tagline = profile?.headline || 'Crafting stories through design';
  const email = profile?.email || 'hello@alexrivera.design';
  const bio = profile?.bio || 'I craft visual identities that feel both timeless and alive.';
  const profileProjects = profile?.projects?.length
    ? profile.projects.slice(0, 4).map((p, i) => ({
      id: i + 1,
      title: p.title || 'Project',
      category: p.techStack?.[0] || 'Design',
      year: new Date().getFullYear().toString(),
      image: p.imageUrl || `https://picsum.photos/seed/gaspar${i + 1}/600/400`,
    }))
    : projects;
  const profileSkills = profile?.skills?.length ? profile.skills.slice(0, 8) : marqueeClients;
  const profileOffices = profile?.location ? [{ city: 'HQ', address: profile.location, phone: email }] : offices;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F0E8', color: '#1A1A1A', fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-30 flex items-center justify-between px-8 md:px-16 py-6 backdrop-blur-md"
        style={{ backgroundColor: 'rgba(245,240,232,0.85)' }}
      >
        <div className="flex items-center gap-4">
          {(!profile?.hidePhoto) && (
             profile?.photoUrl ? (
                <img src={profile.photoUrl} alt={name} className="w-10 h-10 rounded-full object-cover" />
             ) : (
                <UserCircle className="w-10 h-10 text-[#8B7355]" />
             )
          )}
          <span className="text-2xl tracking-[0.15em] font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>{name.split(' ')[0]?.toUpperCase() || 'ALEX'}</span>
        </div>
        <div className="flex gap-8 text-xs tracking-[0.2em] uppercase" style={{ color: '#8B7355' }}>
          {['Work', 'About', 'Contact'].map((l) => (
            <span key={l} className="cursor-pointer transition-colors hover:text-[#1A1A1A]">{l}</span>
          ))}
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <motion.div initial={{ scale: 1.08, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] as const }} className="w-full h-[60vh] md:h-[75vh] relative">
          <img src="https://picsum.photos/seed/gaspar-hero/1200/500" alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#1A1A1A]/25" />
          {cities.map((city, i) => {
            const positions = [
              { top: '15%', left: '10%' },
              { top: '30%', right: '14%' },
              { bottom: '25%', left: '18%' },
              { top: '20%', left: '50%' },
              { bottom: '18%', right: '10%' },
            ];
            return (
              <motion.span key={city} initial={{ opacity: 0 }} animate={{ opacity: 0.75 }} transition={{ delay: 0.5 + i * 0.18, duration: 0.8 }} className="absolute text-white text-[10px] md:text-xs tracking-[0.3em] font-light select-none" style={positions[i]}>
                {city}
              </motion.span>
            );
          })}
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="px-8 md:px-16 pt-10 pb-6 text-5xl md:text-7xl italic font-light" style={{ fontFamily: "'Playfair Display', serif", color: '#1A1A1A' }}>
          {tagline}
        </motion.h1>
      </section>

      {/* Selected Work */}
      <section className="px-8 md:px-16 py-16 md:py-28">
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <motion.div variants={itemVariants} className="mb-14 flex items-end justify-between">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase block mb-3" style={{ color: '#8B7355' }}>Portfolio</span>
              <h2 className="text-4xl md:text-6xl font-light" style={{ fontFamily: "'Playfair Display', serif" }}>Selected <span className="italic">Work</span></h2>
            </div>
            <span className="text-xs tracking-[0.2em] uppercase hidden md:block" style={{ color: '#8B7355' }}>{profileProjects.length} Projects</span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {profileProjects.map((p) => (
              <motion.div key={p.id} variants={itemVariants} className="group cursor-pointer">
                <div className="relative overflow-hidden mb-5">
                  <motion.img src={p.image} alt={p.title} className="w-full aspect-[3/2] object-cover" whileHover={{ scale: 1.05 }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }} />
                  <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/30 transition-colors duration-500 flex items-center justify-center">
                    <span className="text-white text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">See Project →</span>
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] tracking-[0.25em] uppercase mb-1 block" style={{ color: '#8B7355' }}>{p.year} · {p.category}</span>
                    <h3 className="text-xl md:text-2xl font-light group-hover:text-[#8B7355] transition-colors duration-300" style={{ fontFamily: "'Playfair Display', serif" }}>{p.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <div className="overflow-hidden py-16 border-t" style={{ borderColor: '#D4C9B8' }}>
        <motion.div
          className="flex whitespace-nowrap gap-16"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        >
          {[...profileSkills, ...profileSkills].map((c, i) => (
            <span key={i} className="text-2xl md:text-3xl font-light tracking-[0.2em] select-none" style={{ fontFamily: "'Playfair Display', serif", color: '#8B7355' }}>
              {c}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Contact Footer */}
      <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="px-8 md:px-16 py-20 md:py-28 border-t" style={{ borderColor: '#D4C9B8' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {profileOffices.map((o) => (
            <div key={o.city}>
              <span className="text-xs tracking-[0.3em] uppercase block mb-4" style={{ color: '#8B7355' }}>{o.city}</span>
              <p className="text-sm leading-relaxed">{o.address}</p>
              <p className="text-sm mt-1" style={{ color: '#8B7355' }}>{o.phone}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: '#D4C9B8' }}>
          <span className="text-lg tracking-[0.15em] font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>GASPAR</span>
          <div className="flex gap-6">
            {socials.map((s) => (
              <span key={s} className="text-xs tracking-widest uppercase cursor-pointer transition-colors hover:text-[#8B7355]">{s}</span>
            ))}
          </div>
          <span className="text-xs" style={{ color: '#8B7355' }}>© 2024 All rights reserved</span>
        </div>
      </motion.footer>
    </div>
  );
}
