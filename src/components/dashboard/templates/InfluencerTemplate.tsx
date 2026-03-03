import { ProfileData } from '@/contexts/ProfileContext';
import { motion } from 'framer-motion';
import { Mail, Globe, Linkedin, Github, Twitter, MapPin, ExternalLink, Instagram, Youtube, Heart, MessageSquare, FileText } from 'lucide-react';
import { getProjectImageUrl } from '@/lib/portfolio-utils';
import { ensureProtocol, getDocsButtonLabel } from '@/lib/urlUtils';

interface InfluencerTemplateProps {
  profile: ProfileData;
  onContactClick?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function InfluencerTemplate({ profile, onContactClick }: InfluencerTemplateProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(at 0% 0%, hsla(280, 100%, 76%, 0.3) 0px, transparent 50%),
              radial-gradient(at 100% 0%, hsla(189, 100%, 76%, 0.3) 0px, transparent 50%),
              radial-gradient(at 100% 100%, hsla(340, 100%, 76%, 0.3) 0px, transparent 50%),
              radial-gradient(at 0% 100%, hsla(60, 100%, 76%, 0.3) 0px, transparent 50%),
              linear-gradient(180deg, hsl(0, 0%, 100%) 0%, hsl(280, 20%, 98%) 100%)
            `,
          }}
        />
        {/* Animated blobs */}
        <motion.div
          className="absolute top-20 -left-32 w-96 h-96 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full blur-3xl opacity-40"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 -right-32 w-96 h-96 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-full blur-3xl opacity-40"
          animate={{
            x: [0, -40, 0],
            y: [0, -30, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Mobile-First Container - Centered column */}
      <div className="relative z-10 max-w-md mx-auto px-6 py-12 pb-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Profile Card */}
          <motion.div 
            variants={itemVariants}
            className="text-center"
          >
            {/* Avatar */}
            <motion.div 
              className="relative inline-block mb-6"
              whileHover={{ scale: 1.05 }}
            >
              {profile.photoUrl ? (
                <img 
                  src={profile.photoUrl} 
                  alt={profile.fullName}
                  className="w-28 h-28 rounded-full object-cover ring-4 ring-white shadow-xl"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-cyan-400 flex items-center justify-center text-4xl font-bold text-white shadow-xl">
                  {profile.fullName?.charAt(0) || '?'}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
                <span className="text-xs">✓</span>
              </div>
            </motion.div>

            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {profile.fullName || 'Your Name'}
            </h1>
            <p className="text-gray-500 mb-3">
              {profile.headline || '@username'}
            </p>
            
            {profile.location && (
              <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {profile.location}
              </p>
            )}
          </motion.div>

          {/* Bio Card - Glassmorphism */}
          {profile.bio && (
            <motion.div 
              variants={itemVariants}
              className="backdrop-blur-xl bg-white/60 border border-white/80 rounded-3xl p-6 shadow-lg"
            >
              <p className="text-center text-gray-700 leading-relaxed">
                {profile.bio}
              </p>
            </motion.div>
          )}

          {/* Key Highlights Pills */}
          {profile.keyHighlights && profile.keyHighlights.length > 0 && (
            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2">
              {profile.keyHighlights.map((highlight, index) => (
                <motion.span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✨ {highlight}
                </motion.span>
              ))}
            </motion.div>
          )}

          {/* Social Links - Glassmorphism Cards */}
          <motion.div variants={itemVariants} className="space-y-3">
            {profile.linkedinUrl && (
              <motion.a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 backdrop-blur-xl bg-white/60 border border-white/80 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#0A66C2] flex items-center justify-center">
                  <Linkedin className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">LinkedIn</p>
                  <p className="text-sm text-gray-500">Connect with me</p>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400" />
              </motion.a>
            )}

            {profile.githubUrl && (
              <motion.a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 backdrop-blur-xl bg-white/60 border border-white/80 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center">
                  <Github className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">GitHub</p>
                  <p className="text-sm text-gray-500">View my code</p>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400" />
              </motion.a>
            )}

            {profile.twitterUrl && (
              <motion.a
                href={profile.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 backdrop-blur-xl bg-white/60 border border-white/80 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center">
                  <Twitter className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Twitter / X</p>
                  <p className="text-sm text-gray-500">Follow me</p>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400" />
              </motion.a>
            )}

            {profile.website && (
              <motion.a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 backdrop-blur-xl bg-white/60 border border-white/80 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Website</p>
                  <p className="text-sm text-gray-500">Visit my site</p>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400" />
              </motion.a>
            )}

            {profile.email && (
              <motion.a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-4 backdrop-blur-xl bg-white/60 border border-white/80 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-sm text-gray-500">Get in touch</p>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400" />
              </motion.a>
            )}
          </motion.div>

          {/* Projects - Vertical Stack */}
          {profile.projects.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-4 pt-4">
              <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-gray-500">
                Featured Work
              </h2>
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
                  className="block backdrop-blur-xl bg-white/60 border border-white/80 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={getProjectImageUrl(project, 'creative')} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
                    {/* Show case study link only when both exist */}
                    {project.link && project.docsUrl && (
                      <a 
                        href={ensureProtocol(project.docsUrl)} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-purple-500 hover:text-purple-600 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FileText className="h-3.5 w-3.5" />
                        {getDocsButtonLabel(project.docsUrl)}
                      </a>
                    )}
                    {/* Indicator when only docsUrl exists */}
                    {isDocsOnly && (
                      <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-purple-500">
                        <FileText className="h-3.5 w-3.5" />
                        {getDocsButtonLabel(project.docsUrl)}
                      </span>
                    )}
                  </div>
                </motion.a>
              );
            })}
            </motion.div>
          )}

          {/* Skills Pills */}
          {profile.skills.length > 0 && (
            <motion.div variants={itemVariants} className="pt-4">
              <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
                Skills
              </h2>
              <div className="flex flex-wrap justify-center gap-2">
                {profile.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1.5 rounded-full text-sm bg-white/80 border border-gray-200 text-gray-700 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Sticky Follow Button */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white/90 via-white/80 to-transparent backdrop-blur-sm z-50"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="max-w-md mx-auto">
          <motion.button
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-bold text-lg shadow-xl flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Heart className="h-5 w-5" />
            Follow Me
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
