import { ProfileData } from '@/contexts/ProfileContext';
import { MapPin, Mail, Globe, Linkedin, Github, Twitter, ExternalLink, Sparkles, MessageSquare, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { getProjectImageUrl } from '@/lib/portfolio-utils';
import { getEmbedUrl } from '@/lib/video-utils';

interface CreativeTemplateProps {
  profile: ProfileData;
  onContactClick?: () => void;
}

// Skill colors for colorful badges
const skillColors = [
  'bg-gradient-to-r from-pink-500 to-rose-500',
  'bg-gradient-to-r from-violet-500 to-purple-500',
  'bg-gradient-to-r from-blue-500 to-cyan-500',
  'bg-gradient-to-r from-emerald-500 to-teal-500',
  'bg-gradient-to-r from-orange-500 to-amber-500',
  'bg-gradient-to-r from-fuchsia-500 to-pink-500',
];

// Stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// Aurora background component
function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -inset-[10px] opacity-50">
        <motion.div
          className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-1/4 left-1/3 w-1/2 h-1/2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

// 3D Tilt Card Component
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

function TiltCard({ children, className = '' }: TiltCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const rotateXValue = (mouseY / (rect.height / 2)) * -10;
    const rotateYValue = (mouseX / (rect.width / 2)) * 10;
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`${className} transform-gpu`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

// Using shared getProjectImageUrl from portfolio-utils

export function CreativeTemplate({ profile, onContactClick }: CreativeTemplateProps) {
  return (
    <div className="min-h-screen bg-slate-950 font-sans relative overflow-hidden">
      {/* Aurora Background */}
      <AuroraBackground />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Glassmorphism Header */}
        <motion.header 
          className="sticky top-0 z-20 bg-white/5 backdrop-blur-xl border-b border-white/10"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {profile.photoUrl ? (
                <img 
                  src={profile.photoUrl} 
                  alt={profile.fullName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                  {profile.fullName?.charAt(0) || '?'}
                </div>
              )}
              <div>
                <h1 className="text-lg font-bold text-white">{profile.fullName || 'Your Name'}</h1>
                <p className="text-sm text-white/60">{profile.headline || 'Professional'}</p>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-2">
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-all hover:scale-110 border border-white/10">
                  <Linkedin className="h-4 w-4 text-white" />
                </a>
              )}
              {profile.githubUrl && (
                <a href={profile.githubUrl} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-all hover:scale-110 border border-white/10">
                  <Github className="h-4 w-4 text-white" />
                </a>
              )}
              {profile.twitterUrl && (
                <a href={profile.twitterUrl} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-all hover:scale-110 border border-white/10">
                  <Twitter className="h-4 w-4 text-white" />
                </a>
              )}
              {profile.email && (
                onContactClick ? (
                  <button onClick={onContactClick} className="p-2.5 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 rounded-full transition-all hover:scale-110 border border-white/10">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </button>
                ) : (
                  <a href={`mailto:${profile.email}`} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-all hover:scale-110 border border-white/10">
                    <Mail className="h-4 w-4 text-white" />
                  </a>
                )
              )}
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <motion.section 
          className="max-w-7xl mx-auto px-8 pt-24 pb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-4">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-violet-400 bg-violet-500/10 px-4 py-2 rounded-full border border-violet-500/20">
              Portfolio
            </span>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants}
            className="text-6xl md:text-8xl font-black text-white mb-6 leading-[0.9] tracking-tight"
          >
            {profile.fullName || 'Your Name'}
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-white/60 max-w-3xl leading-relaxed mb-8"
          >
            {profile.bio || 'Tell your story here...'}
          </motion.p>
          
          {/* Key Highlights */}
          {profile.keyHighlights && profile.keyHighlights.length > 0 && (
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-semibold uppercase tracking-widest text-amber-400">Core Strengths</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {profile.keyHighlights.map((highlight, index) => (
                  <motion.span 
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-200 text-sm font-medium px-4 py-2 rounded-full backdrop-blur-sm"
                  >
                    <span className="text-amber-400">✓</span>
                    {highlight}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
          
          {profile.location && (
            <motion.div variants={itemVariants} className="flex items-center gap-2 text-white/40">
              <MapPin className="h-4 w-4" />
              <span>{profile.location}</span>
            </motion.div>
          )}
        </motion.section>

        {/* Bento Grid Content */}
        <motion.div 
          className="max-w-7xl mx-auto px-8 pb-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-12 gap-6 auto-rows-min">
            
            {/* Skills Card */}
            {profile.skills.length > 0 && (
              <motion.div 
                variants={cardVariants}
                className="col-span-12 lg:col-span-5"
              >
                <TiltCard className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 h-full">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full mb-6">
                    Skills & Expertise
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {profile.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className={`${skillColors[index % skillColors.length]} text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg shadow-black/20`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </TiltCard>
              </motion.div>
            )}

            {/* Contact Card */}
            <motion.div 
              variants={cardVariants}
              className="col-span-12 lg:col-span-4"
            >
              <TiltCard className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 h-full">
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full mb-6">
                  Contact
                </span>
                <div className="space-y-4">
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group">
                      <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors border border-white/10">
                        <Mail className="h-4 w-4" />
                      </div>
                      <span className="text-sm truncate">{profile.email}</span>
                    </a>
                  )}
                  {profile.website && (
                    <a href={profile.website} className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group">
                      <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors border border-white/10">
                        <Globe className="h-4 w-4" />
                      </div>
                      <span className="text-sm">Portfolio Website</span>
                    </a>
                  )}
                </div>
              </TiltCard>
            </motion.div>

            {/* Experience Card */}
            {profile.workExperience.length > 0 && (
              <motion.div 
                variants={cardVariants}
                className="col-span-12 lg:col-span-3"
              >
                <TiltCard className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 h-full">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full mb-6">
                    Experience
                  </span>
                  <div className="space-y-4">
                    {profile.workExperience.slice(0, 3).map((exp) => (
                      <div key={exp.id} className="group">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-sm mb-2">
                          {exp.company?.charAt(0) || 'C'}
                        </div>
                        <h3 className="font-semibold text-white text-sm truncate">{exp.jobTitle}</h3>
                        <p className="text-xs text-white/40">{exp.company}</p>
                      </div>
                    ))}
                  </div>
                </TiltCard>
              </motion.div>
            )}

            {/* Projects Section - Bento/Masonry Style */}
            {profile.projects.length > 0 && (
              <motion.div 
                variants={cardVariants}
                className="col-span-12"
              >
                <div className="mb-8">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full">
                    Featured Projects
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profile.projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.15 }}
                    >
                      <TiltCard className={`group relative overflow-hidden rounded-3xl ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                        <div className="relative overflow-hidden rounded-3xl border border-white/10">
                          {getEmbedUrl(project.link) ? (
                            <iframe
                              src={getEmbedUrl(project.link)!}
                              title={project.title}
                              className={`w-full ${index === 0 ? 'h-80' : 'h-56'}`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <img 
                              src={getProjectImageUrl(project, 'creative')} 
                              alt={project.title}
                              className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${index === 0 ? 'h-80' : 'h-56'}`}
                            />
                          )}
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-bold text-white text-lg">{project.title}</h3>
                              <div className="flex items-center gap-2">
                                {project.docsUrl && (
                                  <a 
                                    href={project.docsUrl} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <FileText className="h-4 w-4 text-white" />
                                  </a>
                                )}
                                {project.link && (
                                  <a href={project.link} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
                                    <ExternalLink className="h-4 w-4 text-white" />
                                  </a>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-white/70 line-clamp-2">{project.description}</p>
                          </div>
                          
                          {/* Always visible title bar */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950/90 to-transparent">
                            <h3 className="font-semibold text-white truncate">{project.title}</h3>
                          </div>
                        </div>
                      </TiltCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
