import { ProfileData } from '@/contexts/ProfileContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, Globe, Linkedin, Github, Twitter, ArrowUpRight, Instagram, MessageSquare } from 'lucide-react';
import { getProjectImageUrl } from '@/lib/portfolio-utils';
import { useRef } from 'react';

interface StudioTemplateProps {
  profile: ProfileData;
  onContactClick?: () => void;
}

// Parallax Image Component
function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.img 
        src={src} 
        alt={alt}
        style={{ y }}
        className="w-full h-[120%] object-cover"
      />
    </div>
  );
}

export function StudioTemplate({ profile, onContactClick }: StudioTemplateProps) {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white font-sans">
      {/* Minimal Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a]/90 backdrop-blur-sm border-b border-white/5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <motion.span 
            className="text-lg font-light tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {profile.fullName?.toUpperCase() || 'STUDIO'}
          </motion.span>
          
          <div className="flex items-center gap-6">
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="text-white/50 hover:text-white transition-colors text-sm tracking-wide">
                Contact
              </a>
            )}
            <div className="flex gap-3">
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} className="text-white/30 hover:text-white transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {profile.githubUrl && (
                <a href={profile.githubUrl} className="text-white/30 hover:text-white transition-colors">
                  <Github className="h-4 w-4" />
                </a>
              )}
              {profile.twitterUrl && (
                <a href={profile.twitterUrl} className="text-white/30 hover:text-white transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        className="min-h-[70vh] flex items-end pb-24 pt-32 px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto w-full">
          <motion.p 
            className="text-white/40 text-sm tracking-[0.3em] uppercase mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {profile.headline || 'Creative Studio'}
          </motion.p>
          
          <motion.h1 
            className="text-6xl md:text-8xl font-extralight tracking-tight leading-[0.9] mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            {profile.bio || 'Crafting visual experiences that leave lasting impressions.'}
          </motion.h1>

          {/* Key Highlights as subtle tags */}
          {profile.keyHighlights && profile.keyHighlights.length > 0 && (
            <motion.div 
              className="flex flex-wrap gap-4 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {profile.keyHighlights.slice(0, 4).map((highlight, index) => (
                <span 
                  key={index}
                  className="text-xs tracking-widest uppercase text-white/30 border-b border-white/10 pb-1"
                >
                  {highlight}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Projects - Masonry Gallery */}
      {profile.projects.length > 0 && (
        <section className="px-8 pb-24">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-xs tracking-[0.3em] uppercase text-white/30 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              Selected Work
            </motion.h2>
            
            {/* Masonry Grid */}
            <div className="columns-1 md:columns-2 gap-6 space-y-6">
              {profile.projects.map((project, index) => (
                <motion.a
                  key={project.id}
                  href={project.link || '#'}
                  className="block group break-inside-avoid relative overflow-hidden"
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.2, duration: 0.8 }}
                >
                  <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[4/5]' : index % 3 === 1 ? 'aspect-[3/4]' : 'aspect-[16/10]'}`}>
                    <img 
                      src={getProjectImageUrl(project, 'creative')} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 flex items-end p-8">
                      <div className="translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-light">{project.title}</h3>
                          <ArrowUpRight className="h-5 w-5" />
                        </div>
                        <p className="text-sm text-white/70 max-w-md">{project.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience - Minimal List */}
      {profile.workExperience.length > 0 && (
        <section className="px-8 py-24 bg-[#141414]">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-xs tracking-[0.3em] uppercase text-white/30 mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Experience
            </motion.h2>
            
            <div className="space-y-12">
              {profile.workExperience.map((exp, index) => (
                <motion.div 
                  key={exp.id}
                  className="flex flex-col md:flex-row md:items-start gap-4 md:gap-16 group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <span className="text-white/30 text-sm shrink-0 w-32">
                    {exp.startDate} — {exp.current ? 'Now' : exp.endDate}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-xl font-light mb-1 group-hover:text-white/70 transition-colors">
                      {exp.jobTitle}
                    </h3>
                    <p className="text-white/40 text-sm">{exp.company}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills - Horizontal Scroll Text */}
      {profile.skills.length > 0 && (
        <section className="py-16 overflow-hidden border-y border-white/5">
          <motion.div 
            className="flex gap-16 animate-marquee-slow whitespace-nowrap"
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {[...profile.skills, ...profile.skills].map((skill, index) => (
              <span key={index} className="text-4xl md:text-6xl font-extralight text-white/10">
                {skill}
              </span>
            ))}
          </motion.div>
        </section>
      )}

      {/* Footer */}
      <footer className="px-8 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="flex flex-col md:flex-row md:items-end justify-between gap-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div>
              <p className="text-white/30 text-sm mb-4">Get in touch</p>
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="text-3xl md:text-5xl font-extralight hover:text-white/70 transition-colors">
                  {profile.email}
                </a>
              )}
            </div>
            
            <div className="flex gap-6">
              {profile.website && (
                <a href={profile.website} className="text-white/30 hover:text-white transition-colors">
                  <Globe className="h-5 w-5" />
                </a>
              )}
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} className="text-white/30 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {profile.githubUrl && (
                <a href={profile.githubUrl} className="text-white/30 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              )}
              {profile.twitterUrl && (
                <a href={profile.twitterUrl} className="text-white/30 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
            </div>
          </motion.div>
          
          <div className="mt-24 pt-8 border-t border-white/5 flex justify-between items-center text-sm text-white/20">
            <span>© {new Date().getFullYear()}</span>
            <span>{profile.fullName}</span>
          </div>
        </div>
      </footer>

      {/* Marquee Animation Style */}
      <style>{`
        @keyframes marquee-slow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-slow {
          animation: marquee-slow 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
