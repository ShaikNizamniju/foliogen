import { ProfileData } from '@/contexts/ProfileContext';
import { motion } from 'framer-motion';
import { Mail, Globe, Linkedin, Github, Twitter, MapPin, ArrowUpRight, MessageSquare, Sparkles, Download, ChevronDown, Briefcase, FolderKanban } from 'lucide-react';
import { getProjectImageUrl } from '@/lib/portfolio-utils';
import { getEmbedUrl } from '@/lib/video-utils';

interface AiPmTemplateProps {
  profile: ProfileData;
  onContactClick?: () => void;
}

// Smooth easing curve
type Easing = [number, number, number, number];
const easeOut: Easing = [0.16, 1, 0.3, 1];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: easeOut }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: easeOut }
};

// Animated counter for stats
function AnimatedStat({ value, label }: { value: string; label: string }) {
  return (
    <motion.div 
      variants={scaleIn}
      className="text-center"
    >
      <motion.span 
        className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
      >
        {value}
      </motion.span>
      <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">{label}</p>
    </motion.div>
  );
}

// Floating badge component
function FloatingBadge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5, ease: easeOut }}
      className={`absolute px-3 py-1.5 rounded-full bg-neutral-800/80 backdrop-blur-sm border border-neutral-700/50 text-xs font-medium text-neutral-200 shadow-lg ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function AiPmTemplate({ profile, onContactClick }: AiPmTemplateProps) {
  // Calculate dynamic stats
  const projectCount = profile.projects?.length || 0;
  const experienceYears = profile.workExperience?.length > 0 
    ? Math.max(1, new Date().getFullYear() - parseInt(profile.workExperience[profile.workExperience.length - 1]?.startDate || new Date().getFullYear().toString()))
    : 0;
  const skillCount = profile.skills?.length || 0;

  return (
    <div className="min-h-[800px] bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white font-sans antialiased overflow-x-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-neutral-950/70 border-b border-neutral-800/50"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            {profile.photoUrl ? (
              <img 
                src={profile.photoUrl} 
                alt={profile.fullName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-cyan-500/30"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {profile.fullName?.charAt(0) || 'P'}
                </span>
              </div>
            )}
            <span className="font-semibold text-sm tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
              {profile.fullName?.split(' ')[0] || 'Portfolio'}
            </span>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-8 text-sm text-neutral-400">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#skills" className="hover:text-white transition-colors">Skills</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-4">
            {profile.email && (
              onContactClick ? (
                <motion.button 
                  onClick={onContactClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Hire Me
                </motion.button>
              ) : (
                <motion.a 
                  href={`mailto:${profile.email}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Hire Me
                </motion.a>
              )
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        variants={stagger}
        initial="initial"
        animate="animate"
        className="relative min-h-screen flex items-center"
      >
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              {/* Status badge */}
              <motion.div variants={fadeInUp} className="mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Open to opportunities
                </span>
              </motion.div>

              {profile.location && (
                <motion.div variants={fadeInUp} className="mb-4">
                  <span className="inline-flex items-center gap-1.5 text-sm text-neutral-400">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.location}
                  </span>
                </motion.div>
              )}
              
              <motion.div variants={fadeInUp} className="mb-6">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  <span className="text-neutral-400">Hi, I'm </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                    {profile.fullName?.split(' ')[0] || 'Your Name'}
                  </span>
                </h1>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="mb-6">
                <p className="text-xl md:text-2xl text-neutral-300 font-light">
                  {profile.headline || 'Product Manager'}
                </p>
              </motion.div>

              <motion.p 
                variants={fadeInUp}
                className="text-neutral-400 text-lg leading-relaxed mb-8 max-w-lg"
              >
                {profile.bio || 'Passionate about building products that make a difference.'}
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <motion.a 
                  href="#projects"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  View My Work
                </motion.a>
                {onContactClick ? (
                  <motion.button 
                    onClick={onContactClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-neutral-700 text-neutral-300 font-medium hover:bg-neutral-800 transition-all"
                  >
                    Let's Connect
                    <ArrowUpRight className="h-4 w-4" />
                  </motion.button>
                ) : profile.email && (
                  <motion.a 
                    href={`mailto:${profile.email}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-neutral-700 text-neutral-300 font-medium hover:bg-neutral-800 transition-all"
                  >
                    Let's Connect
                    <ArrowUpRight className="h-4 w-4" />
                  </motion.a>
                )}
              </motion.div>

              {/* Stats */}
              <motion.div 
                variants={stagger}
                initial="initial"
                animate="animate"
                className="flex gap-8 mt-12 pt-8 border-t border-neutral-800"
              >
                {projectCount > 0 && (
                  <AnimatedStat value={`${projectCount}+`} label="Projects" />
                )}
                {experienceYears > 0 && (
                  <AnimatedStat value={`${experienceYears}+`} label="Years Exp." />
                )}
                {skillCount > 0 && (
                  <AnimatedStat value={`${skillCount}+`} label="Skills" />
                )}
              </motion.div>
            </div>

            {/* Right - Photo with floating badges */}
            <motion.div 
              variants={fadeInUp}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Gradient glow behind image */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl scale-75" />
                
                {profile.photoUrl ? (
                  <motion.img 
                    src={profile.photoUrl}
                    alt={profile.fullName}
                    className="relative w-80 h-80 rounded-full object-cover mx-auto ring-4 ring-neutral-800 shadow-2xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                  />
                ) : (
                  <div className="relative w-80 h-80 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 mx-auto ring-4 ring-neutral-800 flex items-center justify-center">
                    <span className="text-6xl font-bold text-neutral-600">
                      {profile.fullName?.charAt(0) || '?'}
                    </span>
                  </div>
                )}

                {/* Floating badges - dynamic based on profile */}
                {profile.skills && profile.skills.length > 0 && (
                  <FloatingBadge className="-top-2 right-8">
                    ✨ {profile.skills[0]}
                  </FloatingBadge>
                )}
                {profile.headline && (
                  <FloatingBadge className="bottom-8 -left-4">
                    🎯 Available for work
                  </FloatingBadge>
                )}
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="h-6 w-6 text-neutral-500" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* About Section with Key Highlights */}
      {profile.keyHighlights && profile.keyHighlights.length > 0 && (
        <motion.section 
          id="about"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-24 border-t border-neutral-800/50"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">Get to know me</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">About Me</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {profile.keyHighlights.slice(0, 4).map((highlight, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.03)' }}
                  className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/50"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="text-neutral-300 leading-relaxed">{highlight}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Skills Section */}
      {profile.skills.length > 0 && (
        <motion.section 
          id="skills"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-24"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">What I bring to the table</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">Skills & Expertise</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {profile.skills.map((skill, index) => (
                <motion.span 
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-4 py-2 rounded-full bg-neutral-800/80 border border-neutral-700/50 text-sm text-neutral-200 hover:border-cyan-500/50 hover:bg-neutral-800 transition-all cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Experience Section */}
      {profile.workExperience.length > 0 && (
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-24 bg-neutral-900/30"
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-12">
              <Briefcase className="h-5 w-5 text-cyan-400" />
              <span className="text-sm font-medium uppercase tracking-wider text-neutral-400">Experience</span>
            </div>
            <div className="space-y-8">
              {profile.workExperience.map((exp, index) => (
                <motion.div 
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-8 border-l-2 border-neutral-800 hover:border-cyan-500/50 transition-colors"
                >
                  <div className="absolute left-0 top-0 w-3 h-3 -translate-x-[7px] rounded-full bg-neutral-800 border-2 border-neutral-700" />
                  <div className="text-xs text-neutral-500 mb-2 font-mono">
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-1">{exp.jobTitle}</h3>
                  <p className="text-cyan-400 text-sm mb-3">{exp.company}</p>
                  <p className="text-neutral-400 leading-relaxed">{exp.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Projects Section */}
      {profile.projects.length > 0 && (
        <motion.section 
          id="projects"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-24"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-12">
              <FolderKanban className="h-5 w-5 text-cyan-400" />
              <span className="text-sm font-medium uppercase tracking-wider text-neutral-400">Selected Projects</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.projects.map((project, index) => (
                <motion.a
                  key={project.id}
                  href={project.link || '#'}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group block rounded-2xl border border-neutral-800 bg-neutral-900/50 overflow-hidden hover:border-neutral-700 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300"
                >
                  <div className="aspect-video overflow-hidden bg-neutral-800">
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
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors mb-2">
                          {project.title}
                        </h3>
                        <p className="text-sm text-neutral-400 line-clamp-2">{project.description}</p>
                      </div>
                      <motion.div
                        whileHover={{ rotate: 45 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowUpRight className="h-5 w-5 text-neutral-500 group-hover:text-cyan-400 transition-colors shrink-0" />
                      </motion.div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Contact CTA Section */}
      <motion.section 
        id="contact"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 border-t border-neutral-800/50"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Let's Build Something{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Amazing
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-neutral-400 text-lg mb-8 max-w-2xl mx-auto"
          >
            {profile.bio ? `${profile.bio.substring(0, 100)}...` : "I'm always excited to work on innovative projects and collaborate with amazing teams."}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {onContactClick ? (
              <motion.button 
                onClick={onContactClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
              >
                <MessageSquare className="h-5 w-5" />
                Get in Touch
              </motion.button>
            ) : profile.email && (
              <motion.a 
                href={`mailto:${profile.email}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
              >
                <Mail className="h-5 w-5" />
                Get in Touch
              </motion.a>
            )}
          </motion.div>
          
          {/* Social links */}
          <div className="flex justify-center gap-4 mt-10">
            {[
              { url: profile.linkedinUrl, Icon: Linkedin, color: 'hover:text-[#0A66C2]' },
              { url: profile.githubUrl, Icon: Github, color: 'hover:text-white' },
              { url: profile.twitterUrl, Icon: Twitter, color: 'hover:text-[#1DA1F2]' },
              { url: profile.website, Icon: Globe, color: 'hover:text-cyan-400' }
            ].filter(item => item.url).map(({ url, Icon, color }, i) => (
              <motion.a 
                key={i}
                href={url!}
                whileHover={{ y: -3 }}
                className={`p-3 rounded-full bg-neutral-800/50 text-neutral-400 ${color} transition-colors`}
              >
                <Icon className="h-5 w-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-8 border-t border-neutral-800/50"
      >
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
          <span>© {new Date().getFullYear()} {profile.fullName || 'Portfolio'}. All rights reserved.</span>
          <span className="text-xs">Built with ❤️ using FolioGen</span>
        </div>
      </motion.footer>
    </div>
  );
}
