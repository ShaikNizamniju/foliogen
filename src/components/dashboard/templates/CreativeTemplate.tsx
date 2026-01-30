import { ProfileData } from '@/contexts/ProfileContext';
import { MapPin, Mail, Globe, Linkedin, Github, Twitter, ExternalLink, Sparkles } from 'lucide-react';

interface CreativeTemplateProps {
  profile: ProfileData;
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

export function CreativeTemplate({ profile }: CreativeTemplateProps) {
  return (
    <div className="min-h-[800px] bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 font-sans">
      {/* Glassmorphism Header */}
      <header className="sticky top-0 z-10 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {profile.photoUrl ? (
              <img 
                src={profile.photoUrl} 
                alt={profile.fullName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white/30"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold text-white">
                {profile.fullName?.charAt(0) || '?'}
              </div>
            )}
            <div>
              <h1 className="text-lg font-bold text-white">{profile.fullName || 'Your Name'}</h1>
              <p className="text-sm text-white/70">{profile.headline || 'Professional'}</p>
            </div>
          </div>
          
          {/* Social Links in Header */}
          <div className="flex gap-2">
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <Linkedin className="h-4 w-4 text-white" />
              </a>
            )}
            {profile.githubUrl && (
              <a href={profile.githubUrl} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <Github className="h-4 w-4 text-white" />
              </a>
            )}
            {profile.twitterUrl && (
              <a href={profile.twitterUrl} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <Twitter className="h-4 w-4 text-white" />
              </a>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <Mail className="h-4 w-4 text-white" />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Bento Grid Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-4 auto-rows-min">
          
          {/* Hero Card - Large */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl p-8 shadow-2xl shadow-black/10">
            <div className="flex flex-col h-full justify-between">
              <div>
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-4">
                  About Me
                </span>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {profile.fullName || 'Your Name'}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {profile.bio || 'Tell your story here...'}
                </p>
                
                {/* Key Highlights */}
                {profile.keyHighlights && profile.keyHighlights.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">Core Strengths</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.keyHighlights.map((highlight, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-800 text-sm font-medium px-3 py-1.5 rounded-full"
                        >
                          <span className="text-amber-500">✓</span>
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {profile.location && (
                <div className="flex items-center gap-2 mt-6 text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Card */}
          <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl p-6 shadow-2xl shadow-black/10">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-4">
              Contact
            </span>
            <div className="space-y-4">
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-gray-600 hover:text-indigo-600 transition-colors group">
                  <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-indigo-100 transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="text-sm truncate">{profile.email}</span>
                </a>
              )}
              {profile.website && (
                <a href={profile.website} className="flex items-center gap-3 text-gray-600 hover:text-indigo-600 transition-colors group">
                  <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-indigo-100 transition-colors">
                    <Globe className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Portfolio Website</span>
                </a>
              )}
            </div>
          </div>

          {/* Skills Card */}
          {profile.skills.length > 0 && (
            <div className="col-span-12 lg:col-span-5 bg-white rounded-3xl p-6 shadow-2xl shadow-black/10">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-violet-600 bg-violet-50 px-3 py-1 rounded-full mb-4">
                Skills & Expertise
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className={`${skillColors[index % skillColors.length]} text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience Card */}
          {profile.workExperience.length > 0 && (
            <div className="col-span-12 lg:col-span-7 bg-white rounded-3xl p-6 shadow-2xl shadow-black/10">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full mb-4">
                Experience
              </span>
              <div className="space-y-4">
                {profile.workExperience.slice(0, 3).map((exp) => (
                  <div key={exp.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {exp.company?.charAt(0) || 'C'}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{exp.jobTitle}</h3>
                      <p className="text-sm text-gray-500">{exp.company}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Masonry Grid */}
          {profile.projects.length > 0 && (
            <div className="col-span-12">
              <div className="bg-white rounded-3xl p-6 shadow-2xl shadow-black/10">
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full mb-6">
                  Projects
                </span>
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                  {profile.projects.map((project, index) => (
                    <div 
                      key={project.id} 
                      className="break-inside-avoid group relative overflow-hidden rounded-2xl bg-gray-100"
                    >
                      {project.imageUrl ? (
                        <img 
                          src={project.imageUrl} 
                          alt={project.title}
                          className={`w-full object-cover ${index % 3 === 0 ? 'h-64' : index % 3 === 1 ? 'h-48' : 'h-56'}`}
                        />
                      ) : (
                        <div className={`w-full bg-gradient-to-br from-indigo-400 to-purple-500 ${index % 3 === 0 ? 'h-64' : index % 3 === 1 ? 'h-48' : 'h-56'} flex items-center justify-center`}>
                          <span className="text-4xl font-bold text-white/40">{project.title?.charAt(0)}</span>
                        </div>
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-white">{project.title}</h3>
                          {project.link && (
                            <a href={project.link} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                              <ExternalLink className="h-4 w-4 text-white" />
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-white/80 mt-1 line-clamp-2">{project.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}