import { ProfileData } from '@/contexts/ProfileContext';
import { motion } from 'framer-motion';
import { Mail, Globe, Linkedin, Github, ArrowUpRight, MapPin } from 'lucide-react';
import { getProjectImageUrl } from '@/lib/portfolio-utils';

interface SwissTemplateProps {
  profile: ProfileData;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const slideIn = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function SwissTemplate({ profile }: SwissTemplateProps) {
  return (
    <div 
      className="min-h-screen bg-white text-black"
      style={{ fontFamily: "'Helvetica Neue', 'Inter', 'Arial', sans-serif" }}
    >
      {/* Grid Lines - Decorative */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, black 1px, transparent 1px),
            linear-gradient(to bottom, black 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }} />
      </div>

      {/* Header - Strict grid alignment */}
      <motion.header 
        className="border-b-4 border-black"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-[#FF0000]" />
            <span className="text-sm font-bold uppercase tracking-[0.2em]">
              {profile.fullName?.split(' ')[0]?.toUpperCase() || 'PORTFOLIO'}
            </span>
          </div>
          
          <div className="flex items-center gap-8">
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} className="text-black hover:text-[#FF0000] transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {profile.githubUrl && (
              <a href={profile.githubUrl} className="text-black hover:text-[#FF0000] transition-colors">
                <Github className="h-5 w-5" />
              </a>
            )}
            {profile.email && (
              <a 
                href={`mailto:${profile.email}`}
                className="text-sm font-bold uppercase tracking-wider bg-black text-white px-6 py-3 hover:bg-[#FF0000] transition-colors"
              >
                Contact
              </a>
            )}
          </div>
        </div>
      </motion.header>

      {/* Hero - Massive Typography */}
      <motion.section 
        className="max-w-7xl mx-auto px-8 py-24"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Name */}
          <motion.div variants={slideIn} className="col-span-12 lg:col-span-8">
            <h1 
              className="text-[8vw] lg:text-[120px] font-black uppercase leading-[0.85] tracking-tight"
              style={{ fontWeight: 900 }}
            >
              {profile.fullName || 'Your Name'}
            </h1>
          </motion.div>
          
          {/* Right Column - Meta */}
          <motion.div variants={fadeUp} className="col-span-12 lg:col-span-4 flex flex-col justify-end">
            <div className="space-y-4">
              <p className="text-xl font-medium">
                {profile.headline || 'Professional'}
              </p>
              {profile.location && (
                <p className="text-sm text-black/60 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <motion.div variants={fadeUp} className="mt-16 grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-2">
              <div className="w-12 h-1 bg-[#FF0000]" />
            </div>
            <div className="col-span-12 lg:col-span-8">
              <p className="text-2xl leading-relaxed font-light">
                {profile.bio}
              </p>
            </div>
          </motion.div>
        )}
      </motion.section>

      {/* Key Highlights - Numbered List */}
      {profile.keyHighlights && profile.keyHighlights.length > 0 && (
        <motion.section 
          className="border-t-4 border-black"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto px-8 py-16">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-2">
                <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-black/40">
                  Key Points
                </h2>
              </div>
              <div className="col-span-12 lg:col-span-10 grid grid-cols-2 md:grid-cols-4 gap-8">
                {profile.keyHighlights.slice(0, 4).map((highlight, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-6xl font-black text-[#FF0000]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="mt-2 text-sm font-medium">{highlight}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Skills - Horizontal List */}
      {profile.skills.length > 0 && (
        <motion.section 
          className="border-t-4 border-black bg-black text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">
                Expertise →
              </span>
              {profile.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="text-lg font-medium hover:text-[#FF0000] transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Projects - Asymmetrical Grid */}
      {profile.projects.length > 0 && (
        <motion.section 
          className="border-t-4 border-black"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto px-8 py-24">
            <div className="grid grid-cols-12 gap-8 mb-16">
              <div className="col-span-12 lg:col-span-2">
                <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-black/40">
                  Selected Work
                </h2>
              </div>
              <div className="col-span-12 lg:col-span-10">
                <div className="w-24 h-1 bg-[#FF0000]" />
              </div>
            </div>

            {/* Asymmetrical Project Grid */}
            <div className="grid grid-cols-12 gap-8">
              {profile.projects.map((project, index) => {
                // Alternate between different grid spans for asymmetry
                const isLarge = index % 3 === 0;
                const colSpan = isLarge ? 'col-span-12 lg:col-span-8' : 'col-span-12 lg:col-span-4';
                const offset = index % 3 === 1 ? 'lg:col-start-1' : index % 3 === 2 ? 'lg:col-start-5' : '';
                
                return (
                  <motion.a
                    key={project.id}
                    href={project.link || '#'}
                    className={`${colSpan} ${offset} group block`}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="relative overflow-hidden border-4 border-black group-hover:border-[#FF0000] transition-colors">
                      <div className={`${isLarge ? 'aspect-[16/9]' : 'aspect-square'} overflow-hidden`}>
                        <img 
                          src={getProjectImageUrl(project, 'minimal')} 
                          alt={project.title}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                        />
                      </div>
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/90 transition-colors duration-300 flex items-end p-6 opacity-0 group-hover:opacity-100">
                        <div>
                          <h3 className="text-2xl font-black uppercase mb-2">{project.title}</h3>
                          <p className="text-sm text-black/70">{project.description}</p>
                        </div>
                        <ArrowUpRight className="absolute top-6 right-6 h-6 w-6" />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <h3 className="text-lg font-bold uppercase">{project.title}</h3>
                      <span className="text-xs font-bold uppercase tracking-wider text-black/40">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.section>
      )}

      {/* Experience */}
      {profile.workExperience.length > 0 && (
        <motion.section 
          className="border-t-4 border-black"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto px-8 py-24">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-2">
                <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-black/40">
                  Experience
                </h2>
              </div>
              <div className="col-span-12 lg:col-span-10 space-y-12">
                {profile.workExperience.map((exp, index) => (
                  <motion.div 
                    key={exp.id}
                    className="grid grid-cols-12 gap-4 group"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="col-span-3">
                      <span className="text-sm text-black/40">
                        {exp.startDate}—{exp.current ? 'Now' : exp.endDate}
                      </span>
                    </div>
                    <div className="col-span-9">
                      <h3 className="text-2xl font-black uppercase group-hover:text-[#FF0000] transition-colors">
                        {exp.jobTitle}
                      </h3>
                      <p className="text-lg text-black/60 mb-2">{exp.company}</p>
                      <p className="text-sm text-black/70">{exp.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Footer */}
      <footer className="border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-[#FF0000]" />
            <span className="text-sm font-bold uppercase tracking-[0.2em]">
              © {new Date().getFullYear()}
            </span>
          </div>
          
          <div className="flex items-center gap-8">
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="text-sm font-bold uppercase tracking-wider hover:text-[#FF0000] transition-colors">
                {profile.email}
              </a>
            )}
            {profile.website && (
              <a href={profile.website} className="hover:text-[#FF0000] transition-colors">
                <Globe className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
