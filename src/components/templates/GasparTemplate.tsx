import { motion } from 'framer-motion';
import { ProfileData } from '@/contexts/ProfileContext';
import { UserCircle } from 'lucide-react';
import { getProjectHref } from '@/lib/urlUtils';

interface GasparTemplateProps {
  profile?: ProfileData;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const } },
};

function formatDate(d?: string) {
  if (!d) return '';
  const parsed = new Date(d);
  if (isNaN(parsed.getTime())) return d;
  return parsed.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function GasparTemplate({ profile }: GasparTemplateProps) {
  const name = profile?.fullName || 'Your Name';
  const firstName = name.split(' ')[0] || name;
  const tagline = profile?.headline || '';
  const email = profile?.email || '';
  const bio = profile?.bio || '';
  const location = profile?.location || '';
  const linkedin = profile?.linkedinUrl || '';
  const website = profile?.website || '';
  const projects = profile?.projects || [];
  const skills = profile?.skills || [];
  const experience = profile?.workExperience || [];
  const currentYear = new Date().getFullYear();

  const socials: { label: string; href: string }[] = [];
  if (linkedin) socials.push({ label: 'LinkedIn', href: linkedin });
  if (website) socials.push({ label: 'Website', href: website });
  if (email) socials.push({ label: 'Email', href: `mailto:${email}` });

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#F5F0E8', color: '#1A1A1A', fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-16 py-5 backdrop-blur-md gap-4"
        style={{ backgroundColor: 'rgba(245,240,232,0.85)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          {(!profile?.hidePhoto) && (
            profile?.photoUrl ? (
              <img src={profile.photoUrl} alt={name} className="w-10 h-10 rounded-full object-cover shrink-0" />
            ) : (
              <UserCircle className="w-10 h-10 shrink-0" style={{ color: '#8B7355' }} />
            )
          )}
          <span className="text-lg md:text-2xl tracking-[0.15em] font-semibold truncate" style={{ fontFamily: "'Playfair Display', serif" }}>
            {firstName.toUpperCase()}
          </span>
        </div>
        <div className="hidden md:flex gap-8 text-xs tracking-[0.2em] uppercase shrink-0" style={{ color: '#8B7355' }}>
          {[
            projects.length > 0 && { l: 'Work', href: '#work' },
            experience.length > 0 && { l: 'Experience', href: '#experience' },
            email && { l: 'Contact', href: '#contact' },
          ].filter(Boolean).map((item: any) => (
            <a key={item.l} href={item.href} className="cursor-pointer transition-colors hover:text-[#1A1A1A]">{item.l}</a>
          ))}
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="px-6 md:px-16 pt-14 md:pt-24 pb-16 md:pb-24">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-5xl">
          <motion.span variants={itemVariants} className="text-xs tracking-[0.3em] uppercase block mb-6" style={{ color: '#8B7355' }}>
            Portfolio · {currentYear}
          </motion.span>
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-7xl font-light leading-tight break-words"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {name}
          </motion.h1>
          {tagline && (
            <motion.p
              variants={itemVariants}
              className="mt-6 text-2xl sm:text-3xl md:text-5xl italic font-light break-words"
              style={{ fontFamily: "'Playfair Display', serif", color: '#1A1A1A' }}
            >
              {tagline}
            </motion.p>
          )}
          {(location || email) && (
            <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-xs tracking-[0.25em] uppercase" style={{ color: '#8B7355' }}>
              {location && <span>{location}</span>}
              {email && <a href={`mailto:${email}`} className="hover:text-[#1A1A1A] transition-colors break-all">{email}</a>}
            </motion.div>
          )}
          {bio && (
            <motion.p variants={itemVariants} className="mt-10 md:mt-14 max-w-3xl text-base md:text-lg leading-relaxed">
              {bio}
            </motion.p>
          )}
        </motion.div>
      </section>

      {/* Selected Work */}
      {projects.length > 0 && (
        <section id="work" className="px-6 md:px-16 py-16 md:py-24 border-t" style={{ borderColor: '#D4C9B8' }}>
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
            <motion.div variants={itemVariants} className="mb-12 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-xs tracking-[0.3em] uppercase block mb-3" style={{ color: '#8B7355' }}>Portfolio</span>
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-light" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Selected <span className="italic">Work</span>
                </h2>
              </div>
              <span className="text-xs tracking-[0.2em] uppercase" style={{ color: '#8B7355' }}>{projects.length} {projects.length === 1 ? 'Project' : 'Projects'}</span>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {projects.map((p, i) => {
                const href = getProjectHref(p);
                const category = p.techStack?.[0] || '';
                return (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    onClick={href ? () => window.open(href, '_blank', 'noopener,noreferrer') : undefined}
                    className={`group flex flex-col ${href ? 'cursor-pointer' : ''}`}
                  >
                    {p.imageUrl && (
                      <div className="relative overflow-hidden mb-5">
                        <motion.img
                          src={p.imageUrl}
                          alt={p.title}
                          className="w-full aspect-[3/2] object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
                        />
                        {href && (
                          <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/30 transition-colors duration-500 flex items-center justify-center">
                            <span className="text-white text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              View Project →
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className={`${!p.imageUrl ? 'p-6 md:p-8 border border-[#D4C9B8]/50 bg-[#1A1A1A]/[0.03] hover:bg-[#1A1A1A]/[0.06] transition-colors' : ''}`}>
                      {category && (
                        <span className="text-[10px] tracking-[0.25em] uppercase mb-2 block" style={{ color: '#8B7355' }}>
                          {category}
                        </span>
                      )}
                      <h3
                        className="text-xl md:text-2xl font-light group-hover:text-[#8B7355] transition-colors duration-300 break-words"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {p.title}
                      </h3>
                      {p.description && (
                        <p className="mt-3 text-sm md:text-base leading-relaxed" style={{ color: '#4A4A4A' }}>
                          {p.description}
                        </p>
                      )}
                      {href && (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="mt-4 inline-block text-xs tracking-[0.25em] uppercase border-b pb-0.5 transition-colors"
                          style={{ color: '#8B7355', borderColor: '#8B7355' }}
                        >
                          View Project →
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section id="experience" className="px-6 md:px-16 py-16 md:py-24 border-t" style={{ borderColor: '#D4C9B8' }}>
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
            <motion.div variants={itemVariants} className="mb-12">
              <span className="text-xs tracking-[0.3em] uppercase block mb-3" style={{ color: '#8B7355' }}>Career</span>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-light" style={{ fontFamily: "'Playfair Display', serif" }}>
                <span className="italic">Experience</span>
              </h2>
            </motion.div>
            <div className="space-y-10 md:space-y-14 max-w-4xl">
              {experience.map((w) => (
                <motion.div
                  key={w.id}
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 md:gap-10 pb-10 border-b"
                  style={{ borderColor: '#D4C9B8' }}
                >
                  <div className="text-xs tracking-[0.2em] uppercase" style={{ color: '#8B7355' }}>
                    {formatDate(w.startDate)} — {w.current ? 'Present' : formatDate(w.endDate)}
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-light break-words" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {w.jobTitle}
                    </h3>
                    {w.company && (
                      <p className="mt-1 text-sm tracking-[0.15em] uppercase" style={{ color: '#8B7355' }}>
                        {w.company}
                      </p>
                    )}
                    {w.description && (
                      <p className="mt-4 text-sm md:text-base leading-relaxed" style={{ color: '#4A4A4A' }}>
                        {w.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="px-6 md:px-16 py-16 md:py-20 border-t" style={{ borderColor: '#D4C9B8' }}>
          <span className="text-xs tracking-[0.3em] uppercase block mb-8" style={{ color: '#8B7355' }}>Capabilities</span>
          <div className="flex flex-wrap gap-x-6 gap-y-4 md:gap-x-10">
            {skills.map((s, i) => (
              <span
                key={i}
                className="text-xl md:text-3xl font-light tracking-[0.1em]"
                style={{ fontFamily: "'Playfair Display', serif", color: '#1A1A1A' }}
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Contact Footer */}
      <motion.footer
        id="contact"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="px-6 md:px-16 py-16 md:py-24 border-t"
        style={{ borderColor: '#D4C9B8' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {location && (
            <div>
              <span className="text-xs tracking-[0.3em] uppercase block mb-4" style={{ color: '#8B7355' }}>Based In</span>
              <p className="text-sm leading-relaxed">{location}</p>
            </div>
          )}
          {email && (
            <div>
              <span className="text-xs tracking-[0.3em] uppercase block mb-4" style={{ color: '#8B7355' }}>Email</span>
              <a href={`mailto:${email}`} className="text-sm leading-relaxed break-all hover:text-[#8B7355] transition-colors">{email}</a>
            </div>
          )}
          {(linkedin || website) && (
            <div>
              <span className="text-xs tracking-[0.3em] uppercase block mb-4" style={{ color: '#8B7355' }}>Elsewhere</span>
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="block text-sm leading-relaxed hover:text-[#8B7355] transition-colors">LinkedIn</a>
              )}
              {website && (
                <a href={website} target="_blank" rel="noopener noreferrer" className="block text-sm leading-relaxed hover:text-[#8B7355] transition-colors break-all">{website}</a>
              )}
            </div>
          )}
        </div>

        <div className="mt-12 md:mt-16 pt-8 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ borderColor: '#D4C9B8' }}>
          <span className="text-base md:text-lg tracking-[0.15em] font-semibold break-words" style={{ fontFamily: "'Playfair Display', serif" }}>
            {name.toUpperCase()}
          </span>
          {socials.length > 0 && (
            <div className="flex flex-wrap gap-4 md:gap-6">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target={s.href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer" className="text-xs tracking-widest uppercase cursor-pointer transition-colors hover:text-[#8B7355]">
                  {s.label}
                </a>
              ))}
            </div>
          )}
          <span className="text-xs" style={{ color: '#8B7355' }}>© {currentYear} {name} · All rights reserved</span>
        </div>
      </motion.footer>
    </div>
  );
}
