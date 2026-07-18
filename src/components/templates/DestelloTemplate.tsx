import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, ChevronRight, UserCircle, Mail, Linkedin, Github, Twitter, Globe } from 'lucide-react';
import { ProfileData } from '@/contexts/ProfileContext';
import { getProjectHref } from '@/lib/urlUtils';

interface DestelloTemplateProps {
  profile?: ProfileData;
}

/* ── Process/Experience Accordion ── */
function ExperienceAccordion({ step, index, defaultOpen }: { step: { title: string; company: string; dates?: string; desc?: string }; index: number; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="border-b" style={{ borderColor: '#E5E5E5' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-4 py-6 text-left">
        <span className="text-sm font-bold" style={{ color: '#FF4444', fontFamily: "'Syne', sans-serif" }}>{String(index + 1).padStart(2, '0')}</span>
        <div className="flex-1 min-w-0">
          <div className="text-lg md:text-xl font-semibold break-words" style={{ fontFamily: "'Syne', sans-serif" }}>{step.title}</div>
          {(step.company || step.dates) && (
            <div className="text-xs md:text-sm mt-1" style={{ color: '#666' }}>
              {step.company}{step.company && step.dates ? ' · ' : ''}{step.dates}
            </div>
          )}
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="h-5 w-5" style={{ color: '#FF4444' }} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && step.desc && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const }} className="overflow-hidden">
            <div className="pb-6 pl-10 text-sm leading-relaxed whitespace-pre-line" style={{ color: '#555' }}>{step.desc}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DestelloTemplate({ profile }: DestelloTemplateProps) {
  const [activeWork, setActiveWork] = useState<number | null>(null);

  const name = profile?.fullName || 'Your Name';
  const firstName = name.split(' ')[0] || name;
  const tagline = profile?.headline || '';
  const bio = profile?.bio || '';
  const email = profile?.email || '';
  const year = new Date().getFullYear();

  const socials: { label: string; href: string; icon: typeof Mail }[] = [];
  if (profile?.linkedinUrl) socials.push({ label: 'LinkedIn', href: profile.linkedinUrl, icon: Linkedin });
  if (profile?.githubUrl) socials.push({ label: 'GitHub', href: profile.githubUrl, icon: Github });
  if (profile?.twitterUrl) socials.push({ label: 'Twitter', href: profile.twitterUrl, icon: Twitter });
  if (profile?.website) socials.push({ label: 'Website', href: profile.website, icon: Globe });

  const works = (profile?.projects || []).map((p, i) => ({
    num: String(i + 1).padStart(2, '0'),
    title: p.title || 'Project',
    category: p.techStack?.[0] || '',
    image: p.imageUrl || '',
    link: p.link || '',
    description: p.description || '',
    proofOfImpact: p.proofOfImpact || '',
  }));

  const skills = profile?.skills || [];
  const experience = (profile?.workExperience || []).map((w) => ({
    title: w.jobTitle || 'Role',
    company: w.company || '',
    dates: [w.startDate, w.endDate].filter(Boolean).join(' — '),
    desc: w.description || '',
  }));

  const hasContact = !!(email || socials.length);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCta = () => {
    if (email) window.location.href = `mailto:${email}`;
    else scrollTo('contact');
  };

  const navItems: { label: string; id: string; show: boolean }[] = [
    { label: 'Work', id: 'work', show: works.length > 0 },
    { label: 'Experience', id: 'experience', show: experience.length > 0 },
    { label: 'Skills', id: 'skills', show: skills.length > 0 },
    { label: 'Contact', id: 'contact', show: hasContact },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#FFFFFF', color: '#0A0A0A', fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar */}
      <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-14 py-5 backdrop-blur-md bg-white/90 border-b gap-4" style={{ borderColor: '#F0F0F0' }}>
        <div className="min-w-0">
          <span className="text-xl font-bold tracking-tight block truncate" style={{ fontFamily: "'Syne', sans-serif" }}>{firstName}</span>
          {tagline && <span className="text-[10px] tracking-widest uppercase block -mt-0.5 truncate" style={{ color: '#999' }}>{tagline}</span>}
        </div>
        <div className="hidden md:flex gap-7 text-xs tracking-widest uppercase" style={{ color: '#666' }}>
          {navItems.filter(n => n.show).map((l) => (
            <button key={l.id} onClick={() => scrollTo(l.id)} className="cursor-pointer hover:text-[#FF4444] transition-colors">{l.label}</button>
          ))}
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="px-6 md:px-14 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="flex-1 min-w-0">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tighter break-words" style={{ fontFamily: "'Syne', sans-serif" }}>
              {name}
            </h1>
            {tagline && <p className="mt-4 text-lg md:text-xl font-medium" style={{ color: '#FF4444', fontFamily: "'Syne', sans-serif" }}>{tagline}</p>}
            {bio && <p className="mt-6 text-base md:text-lg max-w-xl" style={{ color: '#555' }}>{bio}</p>}
            {hasContact && (
              <motion.button onClick={handleCta} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="mt-8 px-8 py-3.5 text-sm font-semibold tracking-wider uppercase text-white rounded-full min-h-[44px]" style={{ backgroundColor: '#FF4444' }}>
                Get in Touch
              </motion.button>
            )}
          </motion.div>
          {(!profile || !profile.hidePhoto) && (
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="flex-1 max-w-md w-full">
              <div className="relative rounded-2xl overflow-hidden">
                {profile?.photoUrl ? (
                  <img src={profile.photoUrl} alt={name} className="w-full aspect-[5/7] object-cover" />
                ) : (
                  <div className="w-full aspect-[5/7] bg-[#F5F5F5] flex items-center justify-center">
                    <UserCircle className="w-32 h-32 text-[#CCCCCC]" />
                  </div>
                )}
                <div className="absolute inset-0 bg-[#FF4444]/15 mix-blend-multiply" />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Selected Works */}
      {works.length > 0 && (
        <section id="work" className="px-6 md:px-14 py-16 md:py-24 border-t" style={{ borderColor: '#F0F0F0' }}>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-bold mb-12" style={{ fontFamily: "'Syne', sans-serif" }}>
            Selected Work
          </motion.h2>

          <div className="border-t" style={{ borderColor: '#E5E5E5' }}>
            {works.map((w, i) => {
              const href = getProjectHref(w);
              return (
                <motion.button
                  key={w.num + w.title}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => href ? window.open(href, '_blank', 'noopener,noreferrer') : setActiveWork(activeWork === i ? null : i)}
                  className="w-full flex items-center gap-3 md:gap-8 py-5 border-b text-left group hover:bg-[#FAFAFA] transition-colors px-2 min-h-[44px]"
                  style={{ borderColor: '#E5E5E5' }}
                >
                  <span className="text-sm font-bold" style={{ color: '#FF4444', fontFamily: "'Syne', sans-serif" }}>{w.num}</span>
                  <span className="text-base md:text-2xl font-semibold flex-1 min-w-0 break-words group-hover:text-[#FF4444] transition-colors" style={{ fontFamily: "'Syne', sans-serif" }}>{w.title}</span>
                  {w.category && <span className="text-xs tracking-widest uppercase hidden sm:block" style={{ color: '#999' }}>{w.category}</span>}
                  <ChevronRight className="h-4 w-4 shrink-0" style={{ color: '#CCC' }} />
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {activeWork !== null && works[activeWork] && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }} className="overflow-hidden mt-8">
                <div className={`rounded-2xl overflow-hidden relative ${!works[activeWork].image ? 'bg-[#0A0A0A] p-6 md:p-10' : ''}`}>
                  {works[activeWork].image && (
                    <>
                      <img src={works[activeWork].image} alt={works[activeWork].title} className="w-full aspect-[2/1] object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/70 to-transparent" />
                    </>
                  )}
                  <div className={works[activeWork].image ? 'absolute bottom-0 left-0 right-0 p-6 md:p-10' : ''}>
                    {works[activeWork].category && <span className="text-xs tracking-widest uppercase text-white/70">{works[activeWork].category}</span>}
                    <h3 className="text-2xl md:text-4xl font-bold text-white mt-1 break-words" style={{ fontFamily: "'Syne', sans-serif" }}>{works[activeWork].title}</h3>
                    {works[activeWork].description && <p className="text-sm md:text-base text-white/80 mt-3 max-w-2xl">{works[activeWork].description}</p>}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section id="skills" className="px-6 md:px-14 py-16 md:py-24" style={{ backgroundColor: '#FAFAFA' }}>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-bold mb-12" style={{ fontFamily: "'Syne', sans-serif" }}>
            Skills & Expertise
          </motion.h2>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {skills.map((s, i) => (
              <motion.span
                key={s + i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.02, 0.4) }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border text-sm font-medium break-words"
                style={{ borderColor: '#E5E5E5', fontFamily: "'Inter', sans-serif" }}
              >
                <span className="text-xs font-bold" style={{ color: '#FF4444' }}>{String(i + 1).padStart(2, '0')}</span>
                <span>{s}</span>
              </motion.span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section id="experience" className="px-6 md:px-14 py-16 md:py-24">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-bold mb-12" style={{ fontFamily: "'Syne', sans-serif" }}>
            Experience
          </motion.h2>
          <div>
            {experience.map((s, i) => (
              <ExperienceAccordion key={i} step={s} index={i} defaultOpen={i === 0} />
            ))}
          </div>
        </section>
      )}

      {/* Footer / Contact */}
      <footer id="contact" className="px-6 md:px-14 py-16 md:py-20 border-t" style={{ borderColor: '#E5E5E5' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-1">
            <span className="text-xl font-bold tracking-tight block mb-2 break-words" style={{ fontFamily: "'Syne', sans-serif" }}>{name}</span>
            {tagline && <p className="text-sm mb-3" style={{ color: '#666' }}>{tagline}</p>}
            {email && (
              <a href={`mailto:${email}`} className="text-sm inline-flex items-center gap-2 hover:text-[#FF4444] transition-colors break-all" style={{ color: '#666' }}>
                <Mail className="h-4 w-4 shrink-0" />{email}
              </a>
            )}
          </div>

          {navItems.some(n => n.show) && (
            <div>
              <span className="text-xs tracking-widest uppercase font-semibold block mb-4" style={{ color: '#999' }}>Explore</span>
              {navItems.filter(n => n.show).map((l) => (
                <button key={l.id} onClick={() => scrollTo(l.id)} className="block text-sm mb-2 cursor-pointer hover:text-[#FF4444] transition-colors text-left">{l.label}</button>
              ))}
            </div>
          )}

          {socials.length > 0 && (
            <div>
              <span className="text-xs tracking-widest uppercase font-semibold block mb-4" style={{ color: '#999' }}>Connect</span>
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm mb-2 hover:text-[#FF4444] transition-colors">
                    <Icon className="h-4 w-4" />{s.label}
                    <ArrowRight className="h-3 w-3" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-14 pt-8 border-t text-xs text-center" style={{ borderColor: '#E5E5E5', color: '#999' }}>
          © {year} {name}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
