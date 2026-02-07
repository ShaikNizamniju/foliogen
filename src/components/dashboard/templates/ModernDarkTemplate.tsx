import { useState } from 'react';
import { ProfileData } from '@/contexts/ProfileContext';
import { 
  Mail, Globe, Linkedin, Github, Twitter, MapPin, ExternalLink, 
  Phone, Send, Briefcase, GraduationCap, Target, TrendingUp,
  Code, Palette, Users, Rocket, X, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProjectImageUrl } from '@/lib/portfolio-utils';
import { getEmbedUrl } from '@/lib/video-utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useJobMatch } from '@/hooks/useJobMatch';

interface ModernDarkTemplateProps {
  profile: ProfileData;
  onContactClick?: () => void;
  isLoading?: boolean;
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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// Skeleton components for loading states
function HeroSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-12">
      <div className="flex-1 space-y-4">
        <Skeleton className="h-6 w-32 bg-white/10" />
        <Skeleton className="h-16 w-80 bg-white/10" />
        <Skeleton className="h-8 w-48 bg-white/10" />
        <Skeleton className="h-20 w-full max-w-md bg-white/10" />
        <div className="flex gap-4 pt-4">
          <Skeleton className="h-12 w-36 bg-white/10" />
          <Skeleton className="h-12 w-36 bg-white/10" />
        </div>
      </div>
      <Skeleton className="w-64 h-64 rounded-full bg-white/10" />
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <Skeleton className="h-10 w-10 rounded-lg bg-white/10 mb-4" />
      <Skeleton className="h-6 w-32 bg-white/10 mb-2" />
      <Skeleton className="h-16 w-full bg-white/10" />
    </div>
  );
}

function ProjectSkeleton() {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        <Skeleton className="w-full lg:w-80 h-48 bg-white/10" />
        <div className="flex-1 p-6 space-y-3">
          <Skeleton className="h-8 w-48 bg-white/10" />
          <Skeleton className="h-16 w-full bg-white/10" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 bg-white/10" />
            <Skeleton className="h-6 w-20 bg-white/10" />
            <Skeleton className="h-6 w-14 bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Metric card component
function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <motion.div 
      variants={scaleVariants}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all hover:border-cyan-500/30"
    >
      <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-sm text-white/60 mt-1">{label}</div>
    </motion.div>
  );
}

// About card component
function AboutCard({ icon: Icon, title, items }: { icon: React.ElementType; title: string; items: string[] }) {
  return (
    <motion.div 
      variants={itemVariants}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:border-cyan-500/30 group"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all">
          <Icon className="w-5 h-5 text-cyan-400" />
        </div>
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="text-sm text-white/60 flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 mt-1.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// Skill tag component
function SkillTag({ skill, variant = 'default' }: { skill: string; variant?: 'default' | 'gradient' }) {
  if (variant === 'gradient') {
    return (
      <span className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all cursor-default">
        {skill}
      </span>
    );
  }
  return (
    <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 border border-white/20 text-white/80 hover:bg-white/20 transition-all cursor-default">
      {skill}
    </span>
  );
}

export function ModernDarkTemplate({ profile, onContactClick, isLoading = false }: ModernDarkTemplateProps) {
  const [bannerDismissed, setBannerDismissed] = useState(false);
  
  // Use Job Match hook for smart project sorting
  const { 
    sortedProjects, 
    matchMode, 
    matchTarget, 
    matchType, 
    resetView,
    highlightedProjectIds 
  } = useJobMatch(profile.projects);

  // Calculate stats from profile
  const yearsExp = profile.workExperience.length > 0 
    ? Math.max(1, Math.floor((new Date().getFullYear() - parseInt(profile.workExperience[profile.workExperience.length - 1]?.startDate?.split(' ')[1] || new Date().getFullYear().toString()))))
    : 0;
  const projectCount = profile.projects.length;
  const skillCount = profile.skills.length;

  // Split skills into categories (first half technical, second half frameworks)
  const midpoint = Math.ceil(profile.skills.length / 2);
  const technicalSkills = profile.skills.slice(0, midpoint);
  const frameworkSkills = profile.skills.slice(midpoint);

  // Generate about me cards from work experience
  const aboutCards = [
    {
      icon: Briefcase,
      title: 'Experience',
      items: profile.workExperience.slice(0, 3).map(exp => `${exp.jobTitle} at ${exp.company}`)
    },
    {
      icon: Target,
      title: 'Focus Areas',
      items: profile.keyHighlights?.slice(0, 3) || ['Strategic Planning', 'Product Development', 'Team Leadership']
    },
    {
      icon: Code,
      title: 'Core Competencies',
      items: profile.skills.slice(0, 4)
    },
    {
      icon: TrendingUp,
      title: 'Achievements',
      items: profile.keyHighlights?.slice(3, 6) || ['Driving Innovation', 'Cross-functional Leadership', 'Market Analysis']
    }
  ];

  // Handler to dismiss banner and reset view
  const handleDismissBanner = () => {
    setBannerDismissed(true);
    resetView();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans relative overflow-hidden">
      {/* Cosmic Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-left purple/blue mesh gradient */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl" />
        {/* Top-right cyan gradient */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl" />
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-blue-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <motion.nav 
        className="relative z-20 flex items-center justify-between px-8 py-6 border-b border-white/5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-black font-bold text-sm">
            {profile.fullName?.charAt(0) || 'P'}
          </div>
          <span className="font-semibold text-white/90">{profile.fullName?.split(' ')[0] || 'Portfolio'}</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#skills" className="hover:text-white transition-colors">Skills</a>
          <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-3">
          {profile.linkedinUrl && (
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-white/60 hover:text-white transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {profile.githubUrl && (
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-white/60 hover:text-white transition-colors">
              <Github className="w-4 h-4" />
            </a>
          )}
          {profile.twitterUrl && (
            <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-white/60 hover:text-white transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
          )}
          <button 
            onClick={onContactClick}
            className="ml-2 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 transition-all"
          >
            Hire Me
          </button>
        </div>
      </motion.nav>

      {/* Job Match Welcome Banner */}
      <AnimatePresence>
        {matchMode && !bannerDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative z-30 mx-8 mt-6"
          >
            <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-cyan-500/30 rounded-2xl px-6 py-4 flex items-center justify-between shadow-lg shadow-cyan-500/5">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                </div>
                <p className="text-white/90 text-sm md:text-base">
                  👋 Specially curated for the{' '}
                  <span className="font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {matchTarget}
                  </span>
                  {matchType === 'company' ? ' team' : ' role'}
                </p>
              </div>
              <button
                onClick={handleDismissBanner}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-white/10 border border-white/20 hover:bg-white/20 transition-all text-white/80"
              >
                Reset View
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative z-10 px-8 py-20 max-w-7xl mx-auto">
        {isLoading ? (
          <HeroSkeleton />
        ) : (
          <motion.div 
            className="flex flex-col lg:flex-row items-center gap-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left Content */}
            <motion.div variants={itemVariants} className="flex-1 text-center lg:text-left">
              <p className="text-cyan-400 text-sm font-medium mb-2">👋 Welcome to my portfolio</p>
              <h1 className="text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Hi, I'm{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {profile.fullName || 'Your Name'}
                </span>
              </h1>
              <p className="text-xl text-white/60 mb-6">
                {profile.headline || 'Your Professional Title'}
              </p>
              <p className="text-white/50 max-w-lg mb-8 leading-relaxed">
                {profile.bio?.slice(0, 200) || 'A passionate professional ready to make an impact. Upload your resume to populate this section with your story.'}
                {profile.bio && profile.bio.length > 200 && '...'}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
                <a 
                  href={profile.website || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full font-medium bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 transition-all flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Resume
                </a>
                <button 
                  onClick={onContactClick}
                  className="px-6 py-3 rounded-full font-medium border border-white/20 hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Let's Connect
                </button>
              </div>

              {/* Stats Row */}
              <div className="flex gap-8 justify-center lg:justify-start text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{yearsExp}+</div>
                  <div className="text-xs text-white/50">Years Exp</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{projectCount || '0'}+</div>
                  <div className="text-xs text-white/50">Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{skillCount}+</div>
                  <div className="text-xs text-white/50">Skills</div>
                </div>
              </div>
            </motion.div>

            {/* Right - Profile Photo */}
            <motion.div variants={scaleVariants} className="relative">
              <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full p-1 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500">
                <div className="w-full h-full rounded-full bg-[#0a0a0f] p-1">
                  {profile.photoUrl ? (
                    <img 
                      src={profile.photoUrl} 
                      alt={profile.fullName || 'Profile'} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <span className="text-6xl font-bold text-white/30">
                        {profile.fullName?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-pulse" style={{ transform: 'scale(1.1)' }} />
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* About Me Section */}
      <section id="about" className="relative z-10 px-8 py-20 max-w-7xl mx-auto">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              About <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Me</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              {profile.bio || 'Upload your resume to share your professional story, experience, and what drives you.'}
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aboutCards.map((card, idx) => (
                card.items.length > 0 && <AboutCard key={idx} {...card} />
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* Skills & Expertise Section */}
      <section id="skills" className="relative z-10 px-8 py-20 max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Skills & <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Expertise</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              A comprehensive skill set combining technical proficiency with strategic thinking.
            </p>
          </motion.div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <MetricCard value={`${yearsExp}+`} label="Years Experience" />
            <MetricCard value={`${projectCount}+`} label="Projects Completed" />
            <MetricCard value={`${skillCount}+`} label="Core Skills" />
            <MetricCard value={`${profile.workExperience.length}+`} label="Companies" />
          </div>

          {/* Skills Categories */}
          {profile.skills.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-8">
              {/* Technical Skills */}
              {technicalSkills.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-cyan-500/20">
                      <Code className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h3 className="font-semibold text-white">Technical Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {technicalSkills.map((skill, idx) => (
                      <SkillTag key={idx} skill={skill} />
                    ))}
                  </div>
                </div>
              )}

              {/* Methodologies & Frameworks */}
              {frameworkSkills.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Palette className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-white">Methodologies & Frameworks</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {frameworkSkills.map((skill, idx) => (
                      <SkillTag key={idx} skill={skill} variant="gradient" />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {profile.skills.length === 0 && !isLoading && (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
              <Rocket className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/40">Add your skills to showcase your expertise</p>
            </div>
          )}
        </motion.div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="relative z-10 px-8 py-20 max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <p className="text-cyan-400 text-sm font-medium mb-2">✨ My Work</p>
            <h2 className="text-4xl font-bold mb-4">
              Featured <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Projects</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              A showcase of my best work, demonstrating creativity and technical excellence.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => <ProjectSkeleton key={i} />)}
            </div>
          ) : sortedProjects.length > 0 ? (
            <div className="space-y-6">
              {sortedProjects.map((project, index) => {
                const isHighlighted = highlightedProjectIds.has(project.id);
                return (
                  <motion.div 
                    key={project.id}
                    variants={itemVariants}
                    className={`bg-white/5 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all group ${
                      isHighlighted 
                        ? 'border-cyan-500/50 ring-1 ring-cyan-500/20 shadow-lg shadow-cyan-500/10' 
                        : 'border-white/10 hover:border-cyan-500/30'
                    }`}
                  >
                    {/* Match indicator badge */}
                    {isHighlighted && matchMode && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg">
                          ✨ Best Match
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col lg:flex-row relative">
                      {/* Project Image */}
                      <div className="w-full lg:w-80 h-48 lg:h-auto overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
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
                            src={getProjectImageUrl(project, 'creative')} 
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>

                      {/* Project Details */}
                      <div className="flex-1 p-6 flex flex-col justify-center">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-white/60 text-sm mb-4 leading-relaxed">
                          {project.description || 'A showcase project demonstrating technical skills and creative problem-solving.'}
                        </p>
                        
                        {/* Tech Stack - use actual techStack if available */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(project.techStack?.length ? project.techStack : project.visualPrompt?.split(',') || ['React', 'TypeScript', 'Tailwind']).slice(0, 4).map((tech, idx) => (
                            <span 
                              key={idx} 
                              className={`px-2 py-1 rounded text-xs font-medium border ${
                                matchMode && matchTarget && tech.toLowerCase().includes(matchTarget.toLowerCase())
                                  ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400/50'
                                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                              }`}
                            >
                              {typeof tech === 'string' ? tech.trim() : tech}
                            </span>
                          ))}
                        </div>

                        {/* Target Keywords */}
                        {project.targetKeywords && project.targetKeywords.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.targetKeywords.slice(0, 3).map((keyword, idx) => (
                              <span 
                                key={idx} 
                                className={`px-2 py-1 rounded text-xs font-medium border ${
                                  matchMode && matchTarget && keyword.toLowerCase().includes(matchTarget.toLowerCase())
                                    ? 'bg-purple-500/30 text-purple-200 border-purple-400/50'
                                    : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                }`}
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}

                        {project.link && (
                          <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            View Project <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
              <Briefcase className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/40">Add your projects to showcase your work</p>
            </div>
          )}
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 px-8 py-20 max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <p className="text-cyan-400 text-sm font-medium mb-2">📬 Get In Touch</p>
            <h2 className="text-4xl font-bold mb-4">
              Let's Build Something{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Amazing</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Ready to bring your next project to life? Let's discuss how we can work together.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-6">Get in Touch</h3>
              <div className="space-y-6">
                {profile.email && (
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                      <Mail className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider">Email</p>
                      <a href={`mailto:${profile.email}`} className="text-white hover:text-cyan-400 transition-colors">
                        {profile.email}
                      </a>
                    </div>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                      <MapPin className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider">Location</p>
                      <p className="text-white">{profile.location}</p>
                    </div>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                      <Globe className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider">Website</p>
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-white hover:text-cyan-400 transition-colors">
                        {profile.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                )}

                {/* Social Links */}
                <div className="pt-6 border-t border-white/10">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-4">Connect With Me</p>
                  <div className="flex gap-3">
                    {profile.linkedinUrl && (
                      <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all">
                        <Linkedin className="w-5 h-5 text-white/60 hover:text-white" />
                      </a>
                    )}
                    {profile.githubUrl && (
                      <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all">
                        <Github className="w-5 h-5 text-white/60 hover:text-white" />
                      </a>
                    )}
                    {profile.twitterUrl && (
                      <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all">
                        <Twitter className="w-5 h-5 text-white/60 hover:text-white" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-6">Send a Message</h3>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onContactClick?.(); }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider">First Name</label>
                    <input 
                      type="text" 
                      placeholder="John"
                      className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider">Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Doe"
                      className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider">Email</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider">Message</label>
                  <textarea 
                    rows={4}
                    placeholder="Tell me about your project..."
                    className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 rounded-xl font-medium bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-black font-bold text-xs">
              {profile.fullName?.charAt(0) || 'P'}
            </div>
            <span className="text-sm text-white/60">
              {profile.fullName || 'Your Name'} © {new Date().getFullYear()}
            </span>
          </div>
          <p className="text-xs text-white/40">
            Built with FolioGen
          </p>
        </div>
      </footer>
    </div>
  );
}
