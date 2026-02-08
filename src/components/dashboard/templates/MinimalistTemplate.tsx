import { ProfileData } from '@/contexts/ProfileContext';
import { Mail, Globe, Linkedin, Github, Twitter, MapPin, ExternalLink, CheckCircle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProjectImageUrl } from '@/lib/portfolio-utils';
import { getEmbedUrl } from '@/lib/video-utils';
import { ensureProtocol } from '@/lib/urlUtils';

interface MinimalistTemplateProps {
  profile: ProfileData;
  onContactClick?: () => void;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const sidebarVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function MinimalistTemplate({ profile, onContactClick }: MinimalistTemplateProps) {
  return (
    <div className="min-h-screen bg-white text-black font-sans flex relative">
      {/* Dot Pattern Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Left Sidebar - Sticky */}
      <motion.aside 
        className="w-[280px] min-h-full bg-black text-white p-8 flex flex-col sticky top-0 self-start z-10"
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Name */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h1 className="text-3xl font-black tracking-tight leading-tight uppercase">
            {profile.fullName || 'Your Name'}
          </h1>
          <p className="text-sm text-white/60 mt-2 uppercase tracking-widest">
            {profile.headline || 'Professional'}
          </p>
        </motion.div>

        {/* Contact Info */}
        <motion.div 
          className="space-y-4 text-sm"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {profile.location && (
            <motion.div variants={itemVariants} className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 text-white/40" />
              <span className="text-white/80">{profile.location}</span>
            </motion.div>
          )}
          {profile.email && (
            <motion.div variants={itemVariants} className="flex items-start gap-3">
              <Mail className="h-4 w-4 mt-0.5 text-white/40" />
              {onContactClick ? (
                <button onClick={onContactClick} className="text-white/80 hover:text-white transition-colors text-left">
                  Send Message
                </button>
              ) : (
                <a href={`mailto:${profile.email}`} className="text-white/80 hover:text-white transition-colors break-all">
                  {profile.email}
                </a>
              )}
            </motion.div>
          )}
          {profile.website && (
            <motion.div variants={itemVariants} className="flex items-start gap-3">
              <Globe className="h-4 w-4 mt-0.5 text-white/40" />
              <a href={profile.website} className="text-white/80 hover:text-white transition-colors">
                Website
              </a>
            </motion.div>
          )}
        </motion.div>

        {/* Social Links */}
        <motion.div 
          className="flex gap-3 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {profile.linkedinUrl && (
            <a href={profile.linkedinUrl} className="p-2 border border-white/20 hover:bg-white hover:text-black transition-all">
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {profile.githubUrl && (
            <a href={profile.githubUrl} className="p-2 border border-white/20 hover:bg-white hover:text-black transition-all">
              <Github className="h-4 w-4" />
            </a>
          )}
          {profile.twitterUrl && (
            <a href={profile.twitterUrl} className="p-2 border border-white/20 hover:bg-white hover:text-black transition-all">
              <Twitter className="h-4 w-4" />
            </a>
          )}
        </motion.div>

        {/* Skills - Sidebar bottom */}
        {profile.skills.length > 0 && (
          <motion.div 
            className="mt-auto pt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4">
              Expertise
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((skill, index) => (
                <motion.span 
                  key={index} 
                  className="text-[11px] px-2 py-1 border border-white/20 text-white/70 uppercase tracking-wider hover:bg-white/10 transition-colors"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </motion.aside>

      {/* Right Content - Scrollable */}
      <motion.main 
        className="flex-1 p-12 overflow-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Bio Section */}
        {profile.bio && (
          <motion.section variants={itemVariants} className="mb-10">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 mb-6">
              About
            </h2>
            <p className="text-xl leading-relaxed text-black/80 max-w-2xl font-light">
              {profile.bio}
            </p>
          </motion.section>
        )}

        {/* Key Highlights Section */}
        {profile.keyHighlights && profile.keyHighlights.length > 0 && (
          <motion.section variants={itemVariants} className="mb-16">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 mb-6 flex items-center gap-2">
              <span>🚀</span> Top Achievements
            </h2>
            <div className="flex flex-wrap gap-3">
              {profile.keyHighlights.map((highlight, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center gap-2 bg-black/5 border border-black/10 px-4 py-2 rounded-full hover:bg-black/10 transition-colors"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-sm font-medium text-black/80">{highlight}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Experience Timeline */}
        {profile.workExperience.length > 0 && (
          <motion.section variants={itemVariants} className="mb-16">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 mb-8">
              Experience
            </h2>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-black/10" />
              
              <div className="space-y-10 pl-8">
                {profile.workExperience.map((exp, index) => (
                  <motion.div 
                    key={exp.id} 
                    className="relative"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.15 }}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute -left-8 top-2 w-4 h-4 bg-black rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    
                    {/* Date Badge */}
                    <div className="inline-block mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 bg-black/5 px-3 py-1">
                        {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-bold tracking-tight mb-1">
                      {exp.jobTitle}
                    </h3>
                    <p className="text-sm uppercase tracking-widest text-black/50 mb-4">
                      {exp.company}
                    </p>
                    <p className="text-black/70 leading-relaxed max-w-xl">
                      {exp.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Projects Grid */}
        {profile.projects.length > 0 && (
          <motion.section variants={itemVariants}>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 mb-8">
              Selected Work
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {profile.projects.map((project, index) => (
                <motion.div 
                  key={project.id} 
                  className="group border border-black/10 hover:border-black/30 transition-all hover:shadow-lg hover:-translate-y-1 duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="aspect-video overflow-hidden bg-black/5">
                    {getEmbedUrl(project.link) ? (
                      <iframe
                        src={getEmbedUrl(project.link)!}
                        title={project.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <img 
                        src={getProjectImageUrl(project, 'minimal')} 
                        alt={project.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold uppercase tracking-wide text-sm">{project.title}</h3>
                      <div className="flex items-center gap-2">
                        {/* Smart button promotion: show primary icon based on what's available */}
                        {project.link ? (
                          <>
                            {project.docsUrl && (
                              <a 
                                href={ensureProtocol(project.docsUrl)} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-black/30 hover:text-black transition-colors"
                                onClick={(e) => e.stopPropagation()}
                                title="View Case Study"
                              >
                                <FileText className="h-4 w-4" />
                              </a>
                            )}
                            <a 
                              href={ensureProtocol(project.link)} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-black/30 hover:text-black transition-colors"
                              title="View Project"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </>
                        ) : project.docsUrl ? (
                          <a 
                            href={ensureProtocol(project.docsUrl)} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black/30 hover:text-black transition-colors"
                            onClick={(e) => e.stopPropagation()}
                            title="View Case Study"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                    <p className="text-sm text-black/60 leading-relaxed">{project.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </motion.main>
    </div>
  );
}
