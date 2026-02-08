import { ProfileData } from '@/contexts/ProfileContext';
import { motion } from 'framer-motion';
import { Mail, Globe, Linkedin, Github, Twitter, MapPin, ExternalLink, TrendingUp, Target, Award, MessageSquare, FileText } from 'lucide-react';
import { getProjectImageUrl } from '@/lib/portfolio-utils';

interface ExecutiveTemplateProps {
  profile: ProfileData;
  onContactClick?: () => void;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function ExecutiveTemplate({ profile, onContactClick }: ExecutiveTemplateProps) {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">
      {/* Executive Header Bar */}
      <motion.header 
        className="bg-[#0f172a] border-b border-amber-400/20 sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {profile.photoUrl ? (
              <img 
                src={profile.photoUrl} 
                alt={profile.fullName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400/50"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[#0f172a] font-bold">
                {profile.fullName?.charAt(0) || 'E'}
              </div>
            )}
            <div>
              <p className="font-semibold text-sm">{profile.fullName || 'Executive'}</p>
              <p className="text-xs text-amber-400/70">{profile.headline || 'Executive Leader'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} className="text-white/50 hover:text-amber-400 transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {profile.email && (
              <a 
                href={`mailto:${profile.email}`}
                className="text-xs font-semibold uppercase tracking-wider text-[#0f172a] bg-amber-400 hover:bg-amber-300 px-4 py-2 transition-colors"
              >
                Contact
              </a>
            )}
          </div>
        </div>
      </motion.header>

      {/* Key Highlights - Executive Summary / Stock Ticker Style */}
      {profile.keyHighlights && profile.keyHighlights.length > 0 && (
        <motion.section 
          className="bg-gradient-to-r from-amber-400/10 via-amber-400/5 to-amber-400/10 border-b border-amber-400/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
                Executive Summary
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {profile.keyHighlights.slice(0, 4).map((highlight, index) => (
                <motion.div 
                  key={index}
                  className="text-center md:text-left"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                >
                  <div className="text-3xl font-bold text-amber-400 mb-1">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <p className="text-sm text-white/70 leading-snug">{highlight}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Main Content - Two Column Grid */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Left Column - Profile & Skills */}
          <motion.aside 
            className="lg:col-span-1 space-y-12"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Profile Card */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-6 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Profile
              </h2>
              <div className="bg-white/5 border border-white/10 p-6">
                {profile.location && (
                  <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </div>
                )}
                {profile.bio && (
                  <p className="text-white/80 leading-relaxed">
                    {profile.bio}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Core Competencies */}
            {profile.skills.length > 0 && (
              <motion.div variants={fadeInUp}>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-6">
                  Core Competencies
                </h2>
                <div className="space-y-2">
                  {profile.skills.map((skill, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white/5 border-l-2 border-amber-400 hover:bg-white/10 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.05, duration: 0.4 }}
                    >
                      <span className="w-2 h-2 bg-amber-400 rounded-full shrink-0" />
                      <span className="text-sm text-white/80">{skill}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Contact */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-6">
                Connect
              </h2>
              <div className="space-y-3">
                {profile.email && (
                  <a 
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-3 text-white/60 hover:text-amber-400 transition-colors text-sm"
                  >
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </a>
                )}
                {profile.website && (
                  <a 
                    href={profile.website}
                    className="flex items-center gap-3 text-white/60 hover:text-amber-400 transition-colors text-sm"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a 
                    href={profile.linkedinUrl}
                    className="flex items-center gap-3 text-white/60 hover:text-amber-400 transition-colors text-sm"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                )}
                {profile.githubUrl && (
                  <a 
                    href={profile.githubUrl}
                    className="flex items-center gap-3 text-white/60 hover:text-amber-400 transition-colors text-sm"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                )}
              </div>
            </motion.div>
          </motion.aside>

          {/* Right Column - Experience & Projects */}
          <motion.main 
            className="lg:col-span-2 space-y-16"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Hero Name */}
            <motion.div variants={fadeInUp}>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
                {profile.fullName || 'Executive Name'}
              </h1>
              <p className="text-xl text-amber-400 font-medium uppercase tracking-wide">
                {profile.headline || 'Executive Leader'}
              </p>
            </motion.div>

            {/* Career Timeline */}
            {profile.workExperience.length > 0 && (
              <motion.section variants={fadeInUp}>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-8 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Career Timeline
                </h2>
                <div className="space-y-8">
                  {profile.workExperience.map((exp, index) => (
                    <motion.div 
                      key={exp.id}
                      className="relative pl-8 border-l-2 border-amber-400/30 hover:border-amber-400 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.15, duration: 0.5 }}
                    >
                      {/* Timeline Dot */}
                      <div className="absolute -left-[9px] top-0 w-4 h-4 bg-[#0f172a] border-2 border-amber-400 rounded-full" />
                      
                      <div className="flex flex-wrap items-baseline gap-4 mb-2">
                        <h3 className="text-xl font-bold uppercase">{exp.jobTitle}</h3>
                        <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-3 py-1">
                          {exp.startDate} — {exp.current ? 'PRESENT' : exp.endDate}
                        </span>
                      </div>
                      <p className="text-amber-400/80 font-semibold mb-3">{exp.company}</p>
                      <p className="text-white/70 leading-relaxed">{exp.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Strategic Initiatives / Projects */}
            {profile.projects.length > 0 && (
              <motion.section variants={fadeInUp}>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-8">
                  Strategic Initiatives
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.projects.map((project, index) => (
                    <motion.a
                      key={project.id}
                      href={project.link || '#'}
                      className="group block bg-white/5 border border-white/10 hover:border-amber-400/50 transition-all overflow-hidden"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                    >
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={getProjectImageUrl(project, 'minimal')} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="font-bold uppercase text-sm group-hover:text-amber-400 transition-colors">
                            {project.title}
                          </h3>
                          <ExternalLink className="h-4 w-4 text-white/30 group-hover:text-amber-400 transition-colors shrink-0" />
                        </div>
                        <p className="text-sm text-white/60 line-clamp-2">{project.description}</p>
                        {project.docsUrl && (
                          <a 
                            href={project.docsUrl} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-3 text-xs text-amber-400/70 hover:text-amber-400 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FileText className="h-3.5 w-3.5" />
                            Read Case Study →
                          </a>
                        )}
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.section>
            )}
          </motion.main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0a0f1a] border-t border-amber-400/10 py-12">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} {profile.fullName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} className="text-white/30 hover:text-amber-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {profile.twitterUrl && (
              <a href={profile.twitterUrl} className="text-white/30 hover:text-amber-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            )}
            {profile.githubUrl && (
              <a href={profile.githubUrl} className="text-white/30 hover:text-amber-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
