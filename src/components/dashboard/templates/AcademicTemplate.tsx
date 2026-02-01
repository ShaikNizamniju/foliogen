import { ProfileData } from '@/contexts/ProfileContext';
import { motion } from 'framer-motion';
import { Mail, Globe, Linkedin, Github, MapPin, ExternalLink, Award, Briefcase, MessageSquare } from 'lucide-react';
import { getProjectImageUrl } from '@/lib/portfolio-utils';

interface AcademicTemplateProps {
  profile: ProfileData;
  onContactClick?: () => void;
}

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8, ease: "easeOut" as const }
};

const slowFadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: "easeOut" as const }
};

export function AcademicTemplate({ profile, onContactClick }: AcademicTemplateProps) {
  // Calculate dynamic stats
  const projectCount = profile.projects?.length || 0;
  const experienceYears = profile.workExperience?.length > 0 
    ? Math.max(1, new Date().getFullYear() - parseInt(profile.workExperience[profile.workExperience.length - 1]?.startDate || new Date().getFullYear().toString()))
    : 0;

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#2d2d2d]" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      {/* Subtle Paper Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} 
      />

      {/* Sticky Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-[#fdfbf7]/90 backdrop-blur-sm border-b border-[#e5e2db]"
      >
        <div className="max-w-4xl mx-auto px-8 py-4 flex items-center justify-between">
          <span className="text-lg font-medium" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
            {profile.fullName?.split(' ')[0] || 'Portfolio'}
          </span>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#666]">
            <a href="#about" className="hover:text-[#2d2d2d] transition-colors">About</a>
            <a href="#work" className="hover:text-[#2d2d2d] transition-colors">Work</a>
            <a href="#projects" className="hover:text-[#2d2d2d] transition-colors">Projects</a>
          </div>
          <div className="flex items-center gap-3">
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} className="text-[#888] hover:text-[#2d2d2d] transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {profile.githubUrl && (
              <a href={profile.githubUrl} className="text-[#888] hover:text-[#2d2d2d] transition-colors">
                <Github className="h-4 w-4" />
              </a>
            )}
            {profile.email && (
              onContactClick ? (
                <button onClick={onContactClick} className="text-xs font-medium bg-[#2d2d2d] text-white px-4 py-2 hover:bg-[#444] transition-colors flex items-center gap-2">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Contact
                </button>
              ) : (
                <a href={`mailto:${profile.email}`} className="text-xs font-medium bg-[#2d2d2d] text-white px-4 py-2 hover:bg-[#444] transition-colors flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  Contact
                </a>
              )
            )}
          </div>
        </div>
      </motion.nav>

      <div className="relative max-w-4xl mx-auto px-8 py-16">
        {/* Hero Section */}
        <motion.header 
          id="about"
          className="py-16 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <div className="grid md:grid-cols-[1fr_auto] gap-12 items-center">
            <div>
              <motion.p 
                className="text-sm tracking-[0.3em] uppercase text-[#8b7355] mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {profile.headline || 'Professional'}
              </motion.p>
              
              <motion.h1 
                className="text-5xl md:text-6xl font-normal mb-6 tracking-wide"
                style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                {profile.fullName || 'Your Name'}
              </motion.h1>
              
              {profile.bio && (
                <motion.p 
                  className="text-lg leading-relaxed text-[#555] max-w-xl mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  {profile.bio}
                </motion.p>
              )}

              {/* Quick Stats */}
              <motion.div 
                className="flex gap-8 pt-6 border-t border-[#e5e2db]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                {projectCount > 0 && (
                  <div className="text-center">
                    <span className="text-2xl font-bold text-[#8b7355]">{projectCount}+</span>
                    <p className="text-xs text-[#888] uppercase tracking-wider">Projects</p>
                  </div>
                )}
                {experienceYears > 0 && (
                  <div className="text-center">
                    <span className="text-2xl font-bold text-[#8b7355]">{experienceYears}+</span>
                    <p className="text-xs text-[#888] uppercase tracking-wider">Years</p>
                  </div>
                )}
                {profile.skills?.length > 0 && (
                  <div className="text-center">
                    <span className="text-2xl font-bold text-[#8b7355]">{profile.skills.length}+</span>
                    <p className="text-xs text-[#888] uppercase tracking-wider">Skills</p>
                  </div>
                )}
              </motion.div>

              {/* Contact Info */}
              <motion.div 
                className="flex flex-wrap gap-4 mt-6 text-sm text-[#666]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                {profile.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.location}
                  </span>
                )}
                {profile.website && (
                  <a href={profile.website} className="flex items-center gap-1.5 hover:text-[#2d2d2d] transition-colors">
                    <Globe className="h-3.5 w-3.5" />
                    Website
                  </a>
                )}
              </motion.div>
            </div>

            {/* Profile Photo */}
            {profile.photoUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="hidden md:block"
              >
                <img 
                  src={profile.photoUrl}
                  alt={profile.fullName}
                  className="w-48 h-48 object-cover grayscale hover:grayscale-0 transition-all duration-500 border-4 border-[#e5e2db]"
                />
              </motion.div>
            )}
          </div>
        </motion.header>


        {/* Key Highlights - As Distinguished Honors */}
        {profile.keyHighlights && profile.keyHighlights.length > 0 && (
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 1 }}
          >
            <h2 className="text-xs tracking-[0.25em] uppercase text-[#888] mb-6 flex items-center gap-3">
              <Award className="h-4 w-4" />
              Distinguished Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.keyHighlights.map((highlight, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start gap-3 p-4 bg-[#f5f3ef] border border-[#e5e2db]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 + index * 0.15, duration: 0.8 }}
                >
                  <span className="text-[#8b7355] font-semibold">§{index + 1}</span>
                  <span className="text-[#444]">{highlight}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Areas of Expertise - Skills */}
        {profile.skills.length > 0 && (
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <h2 className="text-xs tracking-[0.25em] uppercase text-[#888] mb-6">
              Areas of Expertise
            </h2>
            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill, index) => (
                <motion.span 
                  key={index}
                  className="px-4 py-2 border border-[#ccc] text-sm text-[#555] hover:border-[#8b7355] hover:text-[#8b7355] transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 + index * 0.05, duration: 0.6 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.section>
        )}

        {/* Professional Experience */}
        {profile.workExperience.length > 0 && (
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 1 }}
          >
            <h2 className="text-xs tracking-[0.25em] uppercase text-[#888] mb-8 flex items-center gap-3">
              <Briefcase className="h-4 w-4" />
              Professional Experience
            </h2>
            <div className="space-y-10">
              {profile.workExperience.map((exp, index) => (
                <motion.div 
                  key={exp.id}
                  className="relative pl-8 border-l border-[#ddd]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.8 + index * 0.2, duration: 0.8 }}
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-[#8b7355]" />
                  
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2">
                    <h3 className="text-xl" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
                      {exp.jobTitle}
                    </h3>
                    <span className="text-[#888] text-sm">
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-[#8b7355] font-medium mb-3">{exp.company}</p>
                  <p className="text-[#555] leading-relaxed">{exp.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Selected Works / Publications */}
        {profile.projects.length > 0 && (
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <h2 className="text-xs tracking-[0.25em] uppercase text-[#888] mb-8">
              Selected Works
            </h2>
            <div className="space-y-8">
              {profile.projects.map((project, index) => (
                <motion.div 
                  key={project.id}
                  className="group"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.1 + index * 0.15, duration: 0.8 }}
                >
                  <div className="flex gap-6">
                    <div className="w-48 h-32 shrink-0 overflow-hidden border border-[#ddd]">
                      <img 
                        src={getProjectImageUrl(project, 'minimal')} 
                        alt={project.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-lg" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
                          {project.title}
                        </h3>
                        {project.link && (
                          <a 
                            href={project.link} 
                            className="text-[#888] hover:text-[#8b7355] transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-[#666] text-sm leading-relaxed">{project.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Footer */}
        <motion.footer 
          className="text-center pt-12 border-t border-[#ddd]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.3, duration: 0.8 }}
        >
          <p className="text-sm text-[#888] italic">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
