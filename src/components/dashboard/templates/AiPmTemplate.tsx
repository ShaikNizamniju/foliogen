import { ProfileData } from '@/contexts/ProfileContext';
import { motion } from 'framer-motion';
import { Mail, Globe, Linkedin, Github, Twitter, MapPin, ArrowUpRight, MessageSquare, Sparkles } from 'lucide-react';
import { getProjectImageUrl } from '@/lib/portfolio-utils';
import { getEmbedUrl } from '@/lib/video-utils';

interface AiPmTemplateProps {
  profile: ProfileData;
  onContactClick?: () => void;
}

// Minimalist fade with subtle spring
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
};

const slideUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const letterAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

// Word-by-word animation component
function AnimatedText({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <motion.span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={letterAnimation}
          className="inline-block mr-[0.25em]"
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

export function AiPmTemplate({ profile, onContactClick }: AiPmTemplateProps) {
  return (
    <div className="min-h-[800px] bg-white text-neutral-900 font-sans antialiased">
      {/* Minimal Navigation */}
      <motion.nav 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 border-b border-neutral-100"
      >
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-700 flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {profile.fullName?.charAt(0) || 'P'}
              </span>
            </div>
            <span className="font-medium text-sm tracking-tight">{profile.fullName?.split(' ')[0] || 'Portfolio'}</span>
          </motion.div>
          
          <div className="flex items-center gap-5">
            {[
              { url: profile.linkedinUrl, Icon: Linkedin },
              { url: profile.githubUrl, Icon: Github },
              { url: profile.twitterUrl, Icon: Twitter }
            ].filter(item => item.url).map(({ url, Icon }, i) => (
              <motion.a 
                key={i}
                href={url!}
                whileHover={{ y: -2 }}
                className="text-neutral-400 hover:text-neutral-900 transition-colors duration-300"
              >
                <Icon className="h-4 w-4" />
              </motion.a>
            ))}
            {profile.email && (
              onContactClick ? (
                <motion.button 
                  onClick={onContactClick}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-xs font-medium bg-neutral-900 text-white px-4 py-2 rounded-full hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="h-3 w-3" />
                  Connect
                </motion.button>
              ) : (
                <motion.a 
                  href={`mailto:${profile.email}`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-xs font-medium bg-neutral-900 text-white px-4 py-2 rounded-full hover:bg-neutral-800 transition-colors"
                >
                  Say Hello
                </motion.a>
              )
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Minimalist with creative typography */}
      <motion.section 
        variants={stagger}
        initial="initial"
        animate="animate"
        className="max-w-4xl mx-auto px-6 pt-32 pb-20"
      >
        {profile.location && (
          <motion.div variants={fadeIn} className="mb-6">
            <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400 uppercase tracking-widest">
              <MapPin className="h-3 w-3" />
              {profile.location}
            </span>
          </motion.div>
        )}
        
        <motion.div variants={stagger} className="overflow-hidden mb-8">
          <motion.h1 
            className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1]"
            variants={stagger}
          >
            <AnimatedText text={profile.fullName || 'Your Name'} />
          </motion.h1>
        </motion.div>
        
        <motion.div 
          variants={slideUp}
          className="flex items-center gap-3 mb-8"
        >
          <div className="h-px flex-1 max-w-[60px] bg-neutral-200" />
          <span className="text-sm text-neutral-500 font-medium">
            {profile.headline || 'Product Manager'}
          </span>
        </motion.div>

        <motion.p 
          variants={slideUp}
          className="text-lg text-neutral-600 max-w-2xl leading-relaxed"
        >
          {profile.bio || 'Tell your story here...'}
        </motion.p>
      </motion.section>

      {/* Key Highlights - Minimal numbered list */}
      {profile.keyHighlights && profile.keyHighlights.length > 0 && (
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="border-y border-neutral-100"
        >
          <div className="max-w-4xl mx-auto px-6 py-16">
            <motion.div 
              variants={stagger}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {profile.keyHighlights.slice(0, 4).map((highlight, index) => (
                <motion.div 
                  key={index}
                  variants={slideUp}
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-4 group cursor-default"
                >
                  <span className="text-xs font-mono text-neutral-300 mt-1">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                    {highlight}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Skills - Minimal inline tags */}
      {profile.skills.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="max-w-4xl mx-auto px-6 py-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="h-4 w-4 text-neutral-300" />
            <span className="text-xs font-medium uppercase tracking-widest text-neutral-400">
              Skills & Expertise
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <motion.span 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.03 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgb(245 245 245)' }}
                className="px-3 py-1.5 border border-neutral-200 rounded-full text-xs font-medium text-neutral-600 cursor-default transition-all"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.section>
      )}

      {/* Experience - Clean timeline */}
      {profile.workExperience.length > 0 && (
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="max-w-4xl mx-auto px-6 py-16"
        >
          <span className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-10 block">
            Experience
          </span>
          <div className="space-y-10">
            {profile.workExperience.map((exp, index) => (
              <motion.div 
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="group"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                  <div className="md:w-32 shrink-0">
                    <span className="text-xs font-mono text-neutral-400">
                      {exp.startDate} — {exp.current ? 'Now' : exp.endDate}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-neutral-900">{exp.jobTitle}</h3>
                      <span className="text-neutral-300">·</span>
                      <span className="text-sm text-neutral-500">{exp.company}</span>
                    </div>
                    <p className="text-sm text-neutral-500 leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Projects - Card grid with hover effects */}
      {profile.projects.length > 0 && (
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="max-w-4xl mx-auto px-6 py-16"
        >
          <span className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-10 block">
            Selected Projects
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.projects.map((project, index) => (
              <motion.a
                key={project.id}
                href={project.link || '#'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.08 }}
                whileHover={{ y: -4 }}
                className="group block p-5 rounded-xl border border-neutral-100 hover:border-neutral-200 hover:shadow-sm transition-all duration-300 bg-white"
              >
                <div className="aspect-[16/10] rounded-lg overflow-hidden mb-4 bg-neutral-50">
                  {getEmbedUrl(project.link) ? (
                    <iframe
                      src={getEmbedUrl(project.link)!}
                      title={project.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <motion.img 
                      src={getProjectImageUrl(project, 'minimal')} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.4 }}
                    />
                  )}
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-sm mb-1 group-hover:text-neutral-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2">{project.description}</p>
                  </div>
                  <motion.div
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 45 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowUpRight className="h-4 w-4 text-neutral-300 group-hover:text-neutral-900 transition-colors shrink-0" />
                  </motion.div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.section>
      )}

      {/* Footer - Ultra minimal */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="max-w-4xl mx-auto px-6 py-10 border-t border-neutral-100"
      >
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>© {new Date().getFullYear()}</span>
          <div className="flex items-center gap-4">
            {profile.website && (
              <a href={profile.website} className="hover:text-neutral-900 transition-colors flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Web
              </a>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="hover:text-neutral-900 transition-colors flex items-center gap-1">
                <Mail className="h-3 w-3" />
                Email
              </a>
            )}
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
