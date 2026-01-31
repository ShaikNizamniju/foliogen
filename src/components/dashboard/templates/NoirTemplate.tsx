import { ProfileData } from '@/contexts/ProfileContext';
import { motion } from 'framer-motion';
import { Mail, Globe, Linkedin, Github, ArrowRight, MapPin } from 'lucide-react';
import { getProjectImageUrl } from '@/lib/portfolio-utils';

interface NoirTemplateProps {
  profile: ProfileData;
}

// Custom getProjectImageUrl for Noir - append "black and white"
function getNoirProjectImageUrl(project: { imageUrl?: string; visualPrompt?: string; title?: string }): string {
  if (project.imageUrl) return project.imageUrl;
  
  const prompt = project.visualPrompt || project.title || 'abstract art';
  const noirPrompt = `${prompt} black and white high contrast cinematic noir`;
  
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(noirPrompt)}?width=800&height=600&nologo=true`;
}

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 1.2, ease: "easeOut" as const }
};

const slideUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: "easeOut" as const }
};

export function NoirTemplate({ profile }: NoirTemplateProps) {
  return (
    <div 
      className="min-h-screen bg-black text-white relative"
      style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
    >
      {/* Film Grain Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette Effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-40"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header 
          className="fixed top-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-sm border-b border-white/10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
            <span className="text-sm tracking-[0.4em] uppercase font-light">
              {profile.fullName?.split(' ')[0] || 'Portfolio'}
            </span>
            
            <div className="flex items-center gap-6">
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} className="text-white/50 hover:text-white transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {profile.githubUrl && (
                <a href={profile.githubUrl} className="text-white/50 hover:text-white transition-colors">
                  <Github className="h-4 w-4" />
                </a>
              )}
              {profile.email && (
                <a 
                  href={`mailto:${profile.email}`}
                  className="text-xs tracking-[0.3em] uppercase text-white/70 hover:text-white transition-colors"
                >
                  Contact
                </a>
              )}
            </div>
          </div>
        </motion.header>

        {/* Hero - Full Screen */}
        <section className="min-h-screen flex items-center justify-center px-8 pt-20">
          <motion.div 
            className="text-center max-w-4xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <motion.p 
              className="text-xs tracking-[0.5em] uppercase text-white/40 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              {profile.headline || 'Portfolio'}
            </motion.p>
            
            <motion.h1 
              className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight leading-[0.9] mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.2 }}
            >
              {profile.fullName || 'Your Name'}
            </motion.h1>

            {profile.location && (
              <motion.p 
                className="text-sm tracking-[0.3em] uppercase text-white/30 flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
              >
                <MapPin className="h-3.5 w-3.5" />
                {profile.location}
              </motion.p>
            )}

            {/* Scroll indicator */}
            <motion.div 
              className="mt-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
            >
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/30 to-transparent mx-auto" />
            </motion.div>
          </motion.div>
        </section>

        {/* Bio */}
        {profile.bio && (
          <motion.section 
            className="max-w-3xl mx-auto px-8 py-32"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <p className="text-2xl md:text-3xl font-light leading-relaxed text-center text-white/80 italic">
              "{profile.bio}"
            </p>
          </motion.section>
        )}

        {/* Key Highlights */}
        {profile.keyHighlights && profile.keyHighlights.length > 0 && (
          <section className="border-t border-white/10 py-24">
            <div className="max-w-6xl mx-auto px-8">
              <motion.h2 
                className="text-xs tracking-[0.5em] uppercase text-white/30 text-center mb-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Distinctions
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {profile.keyHighlights.slice(0, 4).map((highlight, index) => (
                  <motion.div 
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15, duration: 0.8 }}
                  >
                    <span className="text-4xl font-light text-white/20 block mb-3">
                      0{index + 1}
                    </span>
                    <p className="text-sm text-white/70 font-light italic">{highlight}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Projects - Cinematic Gallery */}
        {profile.projects.length > 0 && (
          <section className="py-24">
            <div className="max-w-6xl mx-auto px-8">
              <motion.h2 
                className="text-xs tracking-[0.5em] uppercase text-white/30 text-center mb-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Selected Works
              </motion.h2>
              
              <div className="space-y-24">
                {profile.projects.map((project, index) => (
                  <motion.a
                    key={project.id}
                    href={project.link || '#'}
                    className="block group"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="relative overflow-hidden">
                      <div className="aspect-[21/9] overflow-hidden">
                        <img 
                          src={getNoirProjectImageUrl(project)} 
                          alt={project.title}
                          className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-1000"
                        />
                      </div>
                      
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                      
                      {/* Project info */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-2">
                              Project {String(index + 1).padStart(2, '0')}
                            </p>
                            <h3 className="text-3xl md:text-4xl font-light">{project.title}</h3>
                          </div>
                          <ArrowRight className="h-6 w-6 text-white/50 group-hover:text-white group-hover:translate-x-2 transition-all duration-300" />
                        </div>
                      </div>
                    </div>
                    
                    <p className="mt-6 text-white/50 font-light italic max-w-2xl">
                      {project.description}
                    </p>
                  </motion.a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Experience */}
        {profile.workExperience.length > 0 && (
          <section className="border-t border-white/10 py-24">
            <div className="max-w-4xl mx-auto px-8">
              <motion.h2 
                className="text-xs tracking-[0.5em] uppercase text-white/30 text-center mb-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Career
              </motion.h2>
              
              <div className="space-y-16">
                {profile.workExperience.map((exp, index) => (
                  <motion.div 
                    key={exp.id}
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                  >
                    <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4">
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-light mb-2">{exp.jobTitle}</h3>
                    <p className="text-lg text-white/50 italic mb-4">{exp.company}</p>
                    <p className="text-sm text-white/40 max-w-xl mx-auto font-light">
                      {exp.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Skills */}
        {profile.skills.length > 0 && (
          <section className="border-t border-white/10 py-16">
            <div className="max-w-6xl mx-auto px-8">
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                {profile.skills.map((skill, index) => (
                  <motion.span 
                    key={index}
                    className="text-lg font-light text-white/30 hover:text-white/70 transition-colors cursor-default"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="border-t border-white/10 py-16">
          <div className="max-w-6xl mx-auto px-8 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {profile.email && (
                <a 
                  href={`mailto:${profile.email}`}
                  className="text-2xl md:text-3xl font-light hover:text-white/70 transition-colors"
                >
                  {profile.email}
                </a>
              )}
              
              <div className="flex justify-center gap-8 mt-8">
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
              </div>
              
              <p className="text-xs tracking-[0.3em] uppercase text-white/20 mt-12">
                © {new Date().getFullYear()} · All Rights Reserved
              </p>
            </motion.div>
          </div>
        </footer>
      </div>
    </div>
  );
}
