import { ProfileData } from '@/contexts/ProfileContext';
import { motion } from 'framer-motion';
import { Mail, Globe, Linkedin, Github, Twitter, MapPin, ExternalLink, ArrowUpRight } from 'lucide-react';
import { getProjectImageUrl } from '@/lib/portfolio-utils';

interface SaasTemplateProps {
  profile: ProfileData;
}

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
// Using shared getProjectImageUrl from portfolio-utils

export function SaasTemplate({ profile }: SaasTemplateProps) {
  return (
    <div className="min-h-[800px] bg-[#FAFAFA] text-[#0A0A0A] font-sans">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-black/5"
      >
        <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
          <span className="font-semibold text-lg">{profile.fullName?.split(' ')[0] || 'Portfolio'}</span>
          <div className="flex items-center gap-6">
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} className="text-black/50 hover:text-black transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {profile.githubUrl && (
              <a href={profile.githubUrl} className="text-black/50 hover:text-black transition-colors">
                <Github className="h-4 w-4" />
              </a>
            )}
            {profile.twitterUrl && (
              <a href={profile.twitterUrl} className="text-black/50 hover:text-black transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            )}
            {profile.email && (
              <a 
                href={`mailto:${profile.email}`}
                className="text-sm font-medium bg-black text-white px-4 py-2 rounded-full hover:bg-black/80 transition-colors"
              >
                Get in touch
              </a>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        variants={stagger}
        initial="initial"
        animate="animate"
        className="max-w-5xl mx-auto px-8 pt-24 pb-16"
      >
        <motion.div variants={fadeInUp} className="mb-4">
          {profile.location && (
            <span className="inline-flex items-center gap-1.5 text-sm text-black/50">
              <MapPin className="h-3.5 w-3.5" />
              {profile.location}
            </span>
          )}
        </motion.div>
        
        <motion.h1 
          variants={fadeInUp}
          className="text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-black via-black/90 to-black/70 bg-clip-text"
        >
          {profile.fullName || 'Your Name'}
        </motion.h1>
        
        <motion.p 
          variants={fadeInUp}
          className="text-xl text-black/60 max-w-2xl leading-relaxed mb-8"
        >
          {profile.headline || 'Your professional headline goes here'}
        </motion.p>

        <motion.p 
          variants={fadeInUp}
          className="text-lg text-black/70 max-w-3xl leading-relaxed"
        >
          {profile.bio || 'Tell your story here...'}
        </motion.p>
      </motion.section>

      {/* Metrics Section - Key Highlights */}
      {profile.keyHighlights && profile.keyHighlights.length > 0 && (
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="border-y border-black/10 bg-white"
        >
          <div className="max-w-5xl mx-auto px-8 py-16">
            <motion.div 
              variants={stagger}
              initial="initial"
              animate="animate"
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {profile.keyHighlights.slice(0, 4).map((highlight, index) => (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  className="text-center"
                >
                  <div className="text-5xl font-bold mb-2 bg-gradient-to-br from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <p className="text-sm text-black/60 font-medium">{highlight}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Skills Section */}
      {profile.skills.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="max-w-5xl mx-auto px-8 py-16"
        >
          <h2 className="text-xs font-semibold uppercase tracking-widest text-black/40 mb-6">
            Expertise
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <motion.span 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="px-4 py-2 bg-black/5 rounded-full text-sm font-medium hover:bg-black/10 transition-colors cursor-default"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.section>
      )}

      {/* Experience Section */}
      {profile.workExperience.length > 0 && (
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="max-w-5xl mx-auto px-8 py-16"
        >
          <h2 className="text-xs font-semibold uppercase tracking-widest text-black/40 mb-8">
            Experience
          </h2>
          <div className="space-y-12">
            {profile.workExperience.map((exp, index) => (
              <motion.div 
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="grid grid-cols-4 gap-8"
              >
                <div className="col-span-1">
                  <span className="text-sm text-black/40">
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="col-span-3">
                  <h3 className="text-xl font-semibold mb-1">{exp.jobTitle}</h3>
                  <p className="text-black/50 mb-3">{exp.company}</p>
                  <p className="text-black/70 leading-relaxed">{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Projects Section */}
      {profile.projects.length > 0 && (
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="max-w-5xl mx-auto px-8 py-16"
        >
          <h2 className="text-xs font-semibold uppercase tracking-widest text-black/40 mb-8">
            Selected Work
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {profile.projects.map((project, index) => (
              <motion.a
                key={project.id}
                href={project.link || '#'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="group block p-6 rounded-2xl bg-white border border-black/10 hover:border-black/20 hover:shadow-lg transition-all"
              >
                <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-black/5">
                  <img 
                    src={getProjectImageUrl(project, 'minimal')} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold mb-1 group-hover:text-violet-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-black/50">{project.description}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-black/30 group-hover:text-violet-600 transition-colors shrink-0" />
                </div>
              </motion.a>
            ))}
          </div>
        </motion.section>
      )}

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="max-w-5xl mx-auto px-8 py-12 border-t border-black/10"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-black/40">© {new Date().getFullYear()} {profile.fullName}</span>
          <div className="flex items-center gap-4">
            {profile.website && (
              <a href={profile.website} className="text-sm text-black/50 hover:text-black transition-colors flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" />
                Website
              </a>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="text-sm text-black/50 hover:text-black transition-colors flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                Email
              </a>
            )}
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
