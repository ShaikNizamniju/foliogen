import { ProfileData } from '@/contexts/ProfileContext';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Mail, Globe, Linkedin, Github, Twitter, ArrowUpRight, Instagram, FileText } from 'lucide-react';
import { getProjectImageUrl } from '@/lib/portfolio-utils';
import { useRef } from 'react';

interface StudioTemplateProps {
  profile: ProfileData;
  onContactClick?: () => void;
}

// Animated text that reveals word by word
function RevealText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    },
  };

  return (
    <motion.p
      ref={ref}
      className={className}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {words.map((word, index) => (
        <motion.span key={index} variants={child} className="inline-block mr-[0.25em]">
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
}

// Fade in section component
function FadeInSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Project card with hover effects
function ProjectCard({ project, index }: { project: any; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.a
      ref={ref}
      href={project.link || '#'}
      className="block group relative overflow-hidden rounded-2xl"
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <motion.div
        className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[4/5]' : index % 3 === 1 ? 'aspect-[3/4]' : 'aspect-[16/10]'}`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.4 }}
      >
        <motion.img
          src={getProjectImageUrl(project, 'creative')}
          alt={project.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08, filter: "brightness(1.1)" }}
          transition={{ duration: 0.6 }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          <motion.div
            className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
          >
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl md:text-2xl font-light text-white">{project.title}</h3>
              <ArrowUpRight className="h-5 w-5 text-white/80" />
            </div>
            <p className="text-sm text-white/70 line-clamp-2 max-w-md">{project.description}</p>
            {project.docsUrl && (
              <a 
                href={project.docsUrl} 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-xs tracking-wide text-white/50 hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <FileText className="h-3.5 w-3.5" />
                View Case Study
              </a>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.a>
  );
}

// Magnetic button component
function MagneticButton({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate(0, 0)';
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-300 ease-out ${className}`}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}

export function StudioTemplate({ profile, onContactClick }: StudioTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Minimal Fixed Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5"
        style={{ opacity: headerOpacity }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <motion.span
            className="text-sm md:text-base font-light tracking-[0.2em] uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {profile.fullName || 'Studio'}
          </motion.span>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:flex gap-3">
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} className="text-white/40 hover:text-white transition-colors duration-300">
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {profile.githubUrl && (
                <a href={profile.githubUrl} className="text-white/40 hover:text-white transition-colors duration-300">
                  <Github className="h-4 w-4" />
                </a>
              )}
              {profile.twitterUrl && (
                <a href={profile.twitterUrl} className="text-white/40 hover:text-white transition-colors duration-300">
                  <Twitter className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section - Split Layout on Desktop */}
      <section className="min-h-screen pt-20 md:pt-0 px-4 md:px-8">
        <div className="max-w-7xl mx-auto h-full">
          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-16 min-h-screen">
            {/* Left: Text Content */}
            <div className="flex flex-col justify-center py-12 lg:py-24 lg:sticky lg:top-0 lg:h-screen">
              {/* Headline tag */}
              <motion.p
                className="text-white/40 text-xs md:text-sm tracking-[0.3em] uppercase mb-4 md:mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {profile.headline || 'Creative Studio'}
              </motion.p>

              {/* Bio with word reveal - RESPONSIVE SIZING */}
              <div className="mb-6 md:mb-8">
                <RevealText
                  text={profile.bio || 'Crafting visual experiences that leave lasting impressions.'}
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extralight leading-[1.3] tracking-tight"
                  delay={0.5}
                />
              </div>

              {/* Key Highlights */}
              {profile.keyHighlights && profile.keyHighlights.length > 0 && (
                <motion.div
                  className="flex flex-wrap gap-3 md:gap-4 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                >
                  {profile.keyHighlights.slice(0, 4).map((highlight, index) => (
                    <motion.span
                      key={index}
                      className="text-[10px] md:text-xs tracking-[0.15em] uppercase text-white/30 border border-white/10 px-3 py-1.5 rounded-full"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.3 + index * 0.1 }}
                    >
                      {highlight}
                    </motion.span>
                  ))}
                </motion.div>
              )}

              {/* Magnetic Hire Me Button - Full width on mobile */}
              {profile.email && (
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                >
                  <MagneticButton
                    onClick={onContactClick}
                    className="w-full md:w-auto group relative overflow-hidden bg-white text-black px-8 py-4 rounded-full font-medium text-sm tracking-wide"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>Let's Work Together</span>
                      <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white via-gray-100 to-white"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                  </MagneticButton>
                </motion.div>
              )}

              {/* Social Links - Mobile */}
              <motion.div
                className="flex gap-4 mt-8 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
              >
                {profile.linkedinUrl && (
                  <a href={profile.linkedinUrl} className="text-white/40 hover:text-white transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {profile.githubUrl && (
                  <a href={profile.githubUrl} className="text-white/40 hover:text-white transition-colors">
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {profile.twitterUrl && (
                  <a href={profile.twitterUrl} className="text-white/40 hover:text-white transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
              </motion.div>
            </div>

            {/* Right: Featured Image / Intro Visual (Desktop) */}
            <div className="hidden lg:flex items-center justify-center py-24">
              {profile.photoUrl ? (
                <motion.div
                  className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                >
                  <img
                    src={profile.photoUrl}
                    alt={profile.fullName || 'Profile'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/50 to-transparent" />
                </motion.div>
              ) : (
                <motion.div
                  className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                >
                  <span className="text-8xl font-extralight text-white/10">
                    {profile.fullName?.charAt(0) || 'S'}
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Projects - Masonry Gallery */}
      {profile.projects.length > 0 && (
        <section className="px-4 md:px-8 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <FadeInSection>
              <h2 className="text-xs tracking-[0.3em] uppercase text-white/30 mb-8 md:mb-12">
                Selected Work
              </h2>
            </FadeInSection>

            {/* Masonry Grid */}
            <div className="columns-1 md:columns-2 gap-4 md:gap-6 space-y-4 md:space-y-6">
              {profile.projects.map((project, index) => (
                <div key={project.id} className="break-inside-avoid">
                  <ProjectCard project={project} index={index} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience - Minimal Timeline */}
      {profile.workExperience.length > 0 && (
        <section className="px-4 md:px-8 py-16 md:py-24 bg-[#0d0d0d]">
          <div className="max-w-7xl mx-auto">
            <FadeInSection>
              <h2 className="text-xs tracking-[0.3em] uppercase text-white/30 mb-12 md:mb-16">
                Experience
              </h2>
            </FadeInSection>

            <div className="space-y-8 md:space-y-12">
              {profile.workExperience.map((exp, index) => (
                <FadeInSection key={exp.id} delay={index * 0.1}>
                  <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-16 group border-b border-white/5 pb-8 md:pb-12">
                    <span className="text-white/30 text-xs md:text-sm shrink-0 md:w-32 tracking-wide">
                      {exp.startDate} — {exp.current ? 'Now' : exp.endDate}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-light mb-1 group-hover:text-white/80 transition-colors duration-300">
                        {exp.jobTitle}
                      </h3>
                      <p className="text-white/40 text-sm">{exp.company}</p>
                    </div>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills - Animated Marquee */}
      {profile.skills.length > 0 && (
        <section className="py-12 md:py-16 overflow-hidden border-y border-white/5">
          <motion.div
            className="flex gap-8 md:gap-16 whitespace-nowrap"
            animate={{ x: [0, '-50%'] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          >
            {[...profile.skills, ...profile.skills].map((skill, index) => (
              <span key={index} className="text-3xl md:text-5xl lg:text-6xl font-extralight text-white/[0.08]">
                {skill}
              </span>
            ))}
          </motion.div>
        </section>
      )}

      {/* Footer */}
      <footer className="px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12">
              <div>
                <p className="text-white/30 text-xs md:text-sm mb-3 md:mb-4 tracking-wide">Get in touch</p>
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-extralight hover:text-white/70 transition-colors duration-300 break-all"
                  >
                    {profile.email}
                  </a>
                )}
              </div>

              <div className="flex gap-4 md:gap-6">
                {profile.website && (
                  <a href={profile.website} className="text-white/30 hover:text-white transition-colors duration-300">
                    <Globe className="h-5 w-5" />
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a href={profile.linkedinUrl} className="text-white/30 hover:text-white transition-colors duration-300">
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {profile.githubUrl && (
                  <a href={profile.githubUrl} className="text-white/30 hover:text-white transition-colors duration-300">
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {profile.twitterUrl && (
                  <a href={profile.twitterUrl} className="text-white/30 hover:text-white transition-colors duration-300">
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </FadeInSection>

          <div className="mt-16 md:mt-24 pt-6 md:pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-white/20">
            <span>© {new Date().getFullYear()}</span>
            <span className="font-light tracking-wide">{profile.fullName}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
