import { ProfileData } from '@/contexts/ProfileContext';
import { motion } from 'framer-motion';
import { Mail, Globe, Linkedin, Github, Twitter, Terminal, Folder, MessageSquare, FileText, ExternalLink } from 'lucide-react';
import { getProjectImageUrl } from '@/lib/portfolio-utils';
import { getEmbedUrl } from '@/lib/video-utils';
import { useEffect, useState } from 'react';
import { ensureProtocol } from '@/lib/urlUtils';

interface DevTemplateProps {
  profile: ProfileData;
  onContactClick?: () => void;
}

// Using shared getProjectImageUrl from portfolio-utils

// Typewriter effect component
function Typewriter({ text, delay = 0, speed = 50 }: { text: string; delay?: number; speed?: number }) {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setDisplayText('');
    const timeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setTimeout(() => setShowCursor(false), 1000);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay, speed]);

  return (
    <span>
      {displayText}
      {showCursor && <span className="animate-pulse text-green-400">▊</span>}
    </span>
  );
}

// Syntax highlighting for skills
const syntaxColors = [
  'text-pink-400',
  'text-cyan-400', 
  'text-yellow-400',
  'text-green-400',
  'text-purple-400',
  'text-orange-400',
];

export function DevTemplate({ profile, onContactClick }: DevTemplateProps) {
  return (
    <div className="min-h-[800px] bg-[#0D1117] text-[#C9D1D9] font-mono">
      {/* Terminal Header */}
      <div className="sticky top-0 z-50 bg-[#161B22] border-b border-[#30363D]">
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          </div>
          <div className="flex-1 text-center text-sm text-[#8B949E]">
            <Terminal className="inline h-3.5 w-3.5 mr-2" />
            {profile.fullName?.toLowerCase().replace(/\s+/g, '_') || 'developer'}.portfolio — zsh
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 space-y-8">
        {/* ASCII Art Header */}
        <motion.pre 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-green-400 text-xs leading-tight hidden md:block"
        >
{`
  ██████╗ ███████╗██╗   ██╗
  ██╔══██╗██╔════╝██║   ██║
  ██║  ██║█████╗  ██║   ██║
  ██║  ██║██╔══╝  ╚██╗ ██╔╝
  ██████╔╝███████╗ ╚████╔╝ 
  ╚═════╝ ╚══════╝  ╚═══╝  
`}
        </motion.pre>

        {/* Name with typewriter */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 text-[#8B949E]">
            <span className="text-green-400">➜</span>
            <span className="text-cyan-400">~</span>
            <span>whoami</span>
          </div>
          <h1 className="text-4xl font-bold text-white pl-6">
            <Typewriter text={profile.fullName || 'Developer'} delay={300} />
          </h1>
        </motion.div>

        {/* Headline */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 text-[#8B949E]">
            <span className="text-green-400">➜</span>
            <span className="text-cyan-400">~</span>
            <span>cat title.txt</span>
          </div>
          <p className="text-xl text-purple-400 pl-6">
            <Typewriter text={profile.headline || 'Software Developer'} delay={2000} speed={30} />
          </p>
        </motion.div>

        {/* Bio */}
        {profile.bio && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 text-[#8B949E]">
              <span className="text-green-400">➜</span>
              <span className="text-cyan-400">~</span>
              <span>cat about.md</span>
            </div>
            <p className="text-[#8B949E] pl-6 leading-relaxed max-w-2xl">
              {profile.bio}
            </p>
          </motion.div>
        )}

        {/* Key Highlights as Console Output */}
        {profile.keyHighlights && profile.keyHighlights.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 text-[#8B949E]">
              <span className="text-green-400">➜</span>
              <span className="text-cyan-400">~</span>
              <span>./achievements.sh</span>
            </div>
            <div className="pl-6 space-y-1">
              {profile.keyHighlights.map((highlight, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 4 + index * 0.2 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-green-400">[✓]</span>
                  <span className="text-yellow-400">{highlight}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Skills as Package.json */}
        {profile.skills.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.5 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 text-[#8B949E]">
              <span className="text-green-400">➜</span>
              <span className="text-cyan-400">~</span>
              <span>cat skills.json</span>
            </div>
            <div className="pl-6 bg-[#161B22] rounded-lg p-4 border border-[#30363D]">
              <code className="text-sm">
                <span className="text-[#8B949E]">{'{'}</span>
                <br />
                <span className="text-cyan-400 ml-4">"expertise"</span>
                <span className="text-[#8B949E]">: [</span>
                <br />
                {profile.skills.map((skill, index) => (
                  <span key={index}>
                    <span className={`ml-8 ${syntaxColors[index % syntaxColors.length]}`}>
                      "{skill}"
                    </span>
                    {index < profile.skills.length - 1 && <span className="text-[#8B949E]">,</span>}
                    <br />
                  </span>
                ))}
                <span className="text-[#8B949E] ml-4">]</span>
                <br />
                <span className="text-[#8B949E]">{'}'}</span>
              </code>
            </div>
          </motion.div>
        )}

        {/* Experience as Git Log */}
        {profile.workExperience.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 text-[#8B949E]">
              <span className="text-green-400">➜</span>
              <span className="text-cyan-400">~</span>
              <span>git log --oneline career.txt</span>
            </div>
            <div className="pl-6 space-y-4">
              {profile.workExperience.map((exp, index) => (
                <motion.div 
                  key={exp.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 5.2 + index * 0.2 }}
                  className="border-l-2 border-purple-500 pl-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-orange-400 font-bold">{exp.startDate}</span>
                    <span className="text-[#8B949E]">→</span>
                    <span className="text-orange-400 font-bold">{exp.current ? 'HEAD' : exp.endDate}</span>
                  </div>
                  <h3 className="text-lg text-white font-semibold">{exp.jobTitle}</h3>
                  <p className="text-cyan-400 text-sm mb-2">@ {exp.company}</p>
                  <p className="text-[#8B949E] text-sm leading-relaxed">{exp.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Projects as Directory Listing */}
        {profile.projects.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5.5 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 text-[#8B949E]">
              <span className="text-green-400">➜</span>
              <span className="text-cyan-400">~/projects</span>
              <span>ls -la</span>
            </div>
            <div className="pl-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.projects.map((project, index) => {
                // Smart button promotion: determine the main link
                const mainLink = project.link ? ensureProtocol(project.link) : project.docsUrl ? ensureProtocol(project.docsUrl) : '#';
                
                return (
                  <motion.a
                    key={project.id}
                    href={mainLink}
                    target={mainLink !== '#' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 5.7 + index * 0.15 }}
                    className="block bg-[#161B22] rounded-lg border border-[#30363D] hover:border-green-500/50 transition-colors group overflow-hidden"
                  >
                    <div className="aspect-video overflow-hidden">
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
                          src={getProjectImageUrl(project, 'terminal')} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Folder className="h-4 w-4 text-cyan-400" />
                        <span className="text-white font-semibold group-hover:text-green-400 transition-colors">
                          {project.title}
                        </span>
                        {/* Show both links if both exist */}
                        {project.link && project.docsUrl && (
                          <a 
                            href={ensureProtocol(project.docsUrl)} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto flex items-center gap-1 text-[#8B949E] hover:text-purple-400 transition-colors font-mono text-xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FileText className="h-3.5 w-3.5" />
                            docs
                          </a>
                        )}
                        {/* Show indicator for main action */}
                        {!project.link && project.docsUrl && (
                          <span className="ml-auto text-[#8B949E] font-mono text-xs flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5" />
                            case study
                          </span>
                        )}
                      </div>
                      <p className="text-[#8B949E] text-sm">{project.description}</p>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Social Links */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 6 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 text-[#8B949E]">
            <span className="text-green-400">➜</span>
            <span className="text-cyan-400">~</span>
            <span>cat .socials</span>
          </div>
          <div className="pl-6 flex flex-wrap gap-4">
            {profile.email && (
              onContactClick ? (
                <button onClick={onContactClick} className="flex items-center gap-2 text-[#8B949E] hover:text-green-400 transition-colors">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm">hire_me()</span>
                </button>
              ) : (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-[#8B949E] hover:text-green-400 transition-colors">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{profile.email}</span>
                </a>
              )
            )}
            {profile.website && (
              <a href={profile.website} className="flex items-center gap-2 text-[#8B949E] hover:text-cyan-400 transition-colors">
                <Globe className="h-4 w-4" />
                <span className="text-sm">Website</span>
              </a>
            )}
            {profile.githubUrl && (
              <a href={profile.githubUrl} className="flex items-center gap-2 text-[#8B949E] hover:text-purple-400 transition-colors">
                <Github className="h-4 w-4" />
                <span className="text-sm">GitHub</span>
              </a>
            )}
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} className="flex items-center gap-2 text-[#8B949E] hover:text-blue-400 transition-colors">
                <Linkedin className="h-4 w-4" />
                <span className="text-sm">LinkedIn</span>
              </a>
            )}
            {profile.twitterUrl && (
              <a href={profile.twitterUrl} className="flex items-center gap-2 text-[#8B949E] hover:text-sky-400 transition-colors">
                <Twitter className="h-4 w-4" />
                <span className="text-sm">Twitter</span>
              </a>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 6.5 }}
          className="pt-8 border-t border-[#30363D]"
        >
          <div className="flex items-center gap-2 text-[#8B949E]">
            <span className="text-green-400">➜</span>
            <span className="text-cyan-400">~</span>
            <span className="animate-pulse">█</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
