import { ProfileData } from '@/contexts/ProfileContext';
import { motion } from 'framer-motion';
import { Mail, Globe, Linkedin, Github, Twitter, ArrowRight, Star, Zap, MessageSquare, FileText } from 'lucide-react';
import { getProjectImageUrl } from '@/lib/portfolio-utils';
import { ensureProtocol } from '@/lib/urlUtils';

interface BrutalistTemplateProps {
  profile: ProfileData;
  onContactClick?: () => void;
}

const bounceIn = {
  initial: { opacity: 0, scale: 0.3, rotate: -5 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    rotate: 0,
  }
};

const popIn = {
  initial: { opacity: 0, y: 50 },
  animate: { 
    opacity: 1, 
    y: 0,
  }
};

const pastelColors = [
  'bg-[#FFE5E5]', // Pink
  'bg-[#E5F9E7]', // Green
  'bg-[#FFF3CD]', // Yellow
  'bg-[#E5E5FF]', // Purple
  'bg-[#FFE5CC]', // Orange
  'bg-[#E5FFFF]', // Cyan
];

// Using shared getProjectImageUrl from portfolio-utils

export function BrutalistTemplate({ profile, onContactClick }: BrutalistTemplateProps) {
  return (
    <div className="min-h-[800px] bg-[#FFFEF0] text-black font-sans">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-[#FF5C00] border-b-4 border-black py-3 overflow-hidden"
      >
        <div className="flex animate-marquee whitespace-nowrap">
          {Array(10).fill(null).map((_, i) => (
            <span key={i} className="text-white font-bold text-sm mx-8 flex items-center gap-2">
              <Star className="h-4 w-4" fill="white" />
              AVAILABLE FOR WORK
              <Star className="h-4 w-4" fill="white" />
              LET'S COLLABORATE
            </span>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="p-8 max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.3, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-[#FFE962] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-8"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            {profile.fullName || 'Your Name'}
          </motion.h1>
          
          <motion.p 
            className="text-2xl font-bold mb-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          >
            {profile.headline || 'What you do'}
          </motion.p>

          {profile.location && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-block bg-black text-white px-4 py-2 font-bold text-sm"
            >
              📍 {profile.location}
            </motion.div>
          )}
        </motion.div>

        {/* Bio Section */}
        {profile.bio && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.5 }}
            className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-8"
          >
            <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
              <span className="bg-black text-white px-2 py-1">ABOUT</span>
              <ArrowRight className="h-5 w-5" />
            </h2>
            <p className="text-lg leading-relaxed">
              {profile.bio}
            </p>
          </motion.div>
        )}

        {/* Key Highlights */}
        {profile.keyHighlights && profile.keyHighlights.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
              <Zap className="h-6 w-6 text-[#FF5C00]" />
              SUPERPOWERS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.keyHighlights.map((highlight, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 0.7 + index * 0.1,
                    type: 'spring',
                    stiffness: 300,
                    damping: 20
                  }}
                  className={`${pastelColors[index % pastelColors.length]} border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4`}
                >
                  <span className="font-bold text-lg flex items-center gap-2">
                    <span className="text-2xl">✦</span>
                    {highlight}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Skills Section */}
        {profile.skills.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-8"
          >
            <h2 className="text-xl font-black uppercase mb-4">SKILLS</h2>
            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill, index) => (
                <motion.span 
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 0.9 + index * 0.05,
                    type: 'spring',
                    stiffness: 400,
                    damping: 15
                  }}
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  className={`${pastelColors[(index + 2) % pastelColors.length]} border-3 border-black px-4 py-2 font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-default`}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Experience Section */}
        {profile.workExperience.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mb-8"
          >
            <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
              <span className="bg-[#FF5C00] text-white px-2 py-1">EXPERIENCE</span>
            </h2>
            <div className="space-y-4">
              {profile.workExperience.map((exp, index) => (
                <motion.div 
                  key={exp.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 1.1 + index * 0.15,
                    type: 'spring',
                    stiffness: 200
                  }}
                  className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6"
                >
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-xl font-black">{exp.jobTitle}</h3>
                    <span className="bg-black text-white px-2 py-1 text-sm font-bold">
                      {exp.startDate} → {exp.current ? 'NOW' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-[#FF5C00] mb-3">{exp.company}</p>
                  <p className="leading-relaxed">{exp.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Projects Section */}
        {profile.projects.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="mb-8"
          >
            <h2 className="text-xl font-black uppercase mb-4">PROJECTS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.projects.map((project, index) => {
                // Smart button promotion: determine the main link
                const mainLink = project.link ? ensureProtocol(project.link) : project.docsUrl ? ensureProtocol(project.docsUrl) : '#';
                const isDocsOnly = !project.link && !!project.docsUrl;
                
                return (
                  <motion.a
                    key={project.id}
                    href={mainLink}
                    target={mainLink !== '#' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, rotate: index % 2 === 0 ? -3 : 3 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ 
                      delay: 1.4 + index * 0.1,
                      type: 'spring',
                      stiffness: 200
                    }}
                    whileHover={{ 
                      scale: 1.02, 
                      rotate: 1,
                      boxShadow: '12px 12px 0px 0px rgba(0,0,0,1)'
                    }}
                    whileTap={{ 
                      scale: 0.98,
                      boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)',
                      y: 4
                    }}
                    className={`${pastelColors[index % pastelColors.length]} border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 block transition-all cursor-pointer`}
                  >
                    <div className="aspect-video mb-4 border-2 border-black overflow-hidden">
                      <img 
                        src={getProjectImageUrl(project, 'bold')} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-black mb-2 flex items-center gap-2">
                      {project.title}
                      {isDocsOnly ? <FileText className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
                    </h3>
                    <p className="font-medium">{project.description}</p>
                    {/* Show docs button only when both links exist */}
                    {project.link && project.docsUrl && (
                      <a 
                        href={ensureProtocol(project.docsUrl)} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-3 font-bold text-sm bg-black text-white px-3 py-1.5 border-2 border-black hover:bg-[#FF5C00] transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FileText className="h-4 w-4" />
                        READ DOCS
                      </a>
                    )}
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Contact Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
          className="bg-black text-white p-8 shadow-[8px_8px_0px_0px_rgba(255,92,0,1)]"
        >
          <h2 className="text-3xl font-black uppercase mb-6">LET'S WORK TOGETHER!</h2>
          <div className="flex flex-wrap gap-4">
            {profile.email && (
              <motion.a 
                href={`mailto:${profile.email}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95, y: 2 }}
                className="bg-white text-black px-6 py-3 font-bold flex items-center gap-2 border-2 border-white hover:bg-[#FFE962] transition-colors"
              >
                <Mail className="h-5 w-5" />
                EMAIL ME
              </motion.a>
            )}
            {profile.linkedinUrl && (
              <motion.a 
                href={profile.linkedinUrl}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95, y: 2 }}
                className="bg-transparent text-white px-6 py-3 font-bold flex items-center gap-2 border-2 border-white hover:bg-white hover:text-black transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                LINKEDIN
              </motion.a>
            )}
            {profile.githubUrl && (
              <motion.a 
                href={profile.githubUrl}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95, y: 2 }}
                className="bg-transparent text-white px-6 py-3 font-bold flex items-center gap-2 border-2 border-white hover:bg-white hover:text-black transition-colors"
              >
                <Github className="h-5 w-5" />
                GITHUB
              </motion.a>
            )}
            {profile.website && (
              <motion.a 
                href={profile.website}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95, y: 2 }}
                className="bg-transparent text-white px-6 py-3 font-bold flex items-center gap-2 border-2 border-white hover:bg-white hover:text-black transition-colors"
              >
                <Globe className="h-5 w-5" />
                WEBSITE
              </motion.a>
            )}
          </div>
        </motion.div>
      </div>

      {/* Marquee Animation Style */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
