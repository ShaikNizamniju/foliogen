import { ProfileData } from '@/contexts/ProfileContext';
import { Mail, Globe, Linkedin, Github, Twitter, MapPin, ExternalLink } from 'lucide-react';

interface MinimalistTemplateProps {
  profile: ProfileData;
}

export function MinimalistTemplate({ profile }: MinimalistTemplateProps) {
  return (
    <div className="min-h-[800px] bg-white text-black font-sans flex">
      {/* Left Sidebar - Sticky */}
      <aside className="w-[280px] min-h-full bg-black text-white p-8 flex flex-col sticky top-0 self-start">
        {/* Name */}
        <div className="mb-12">
          <h1 className="text-3xl font-black tracking-tight leading-tight uppercase">
            {profile.fullName || 'Your Name'}
          </h1>
          <p className="text-sm text-white/60 mt-2 uppercase tracking-widest">
            {profile.headline || 'Professional'}
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 text-sm">
          {profile.location && (
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 text-white/40" />
              <span className="text-white/80">{profile.location}</span>
            </div>
          )}
          {profile.email && (
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 mt-0.5 text-white/40" />
              <a href={`mailto:${profile.email}`} className="text-white/80 hover:text-white transition-colors break-all">
                {profile.email}
              </a>
            </div>
          )}
          {profile.website && (
            <div className="flex items-start gap-3">
              <Globe className="h-4 w-4 mt-0.5 text-white/40" />
              <a href={profile.website} className="text-white/80 hover:text-white transition-colors">
                Website
              </a>
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="flex gap-3 mt-8">
          {profile.linkedinUrl && (
            <a href={profile.linkedinUrl} className="p-2 border border-white/20 hover:bg-white hover:text-black transition-all">
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {profile.githubUrl && (
            <a href={profile.githubUrl} className="p-2 border border-white/20 hover:bg-white hover:text-black transition-all">
              <Github className="h-4 w-4" />
            </a>
          )}
          {profile.twitterUrl && (
            <a href={profile.twitterUrl} className="p-2 border border-white/20 hover:bg-white hover:text-black transition-all">
              <Twitter className="h-4 w-4" />
            </a>
          )}
        </div>

        {/* Skills - Sidebar bottom */}
        {profile.skills.length > 0 && (
          <div className="mt-auto pt-12">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4">
              Expertise
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="text-[11px] px-2 py-1 border border-white/20 text-white/70 uppercase tracking-wider"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Right Content - Scrollable */}
      <main className="flex-1 p-12 overflow-auto">
        {/* Bio Section */}
        {profile.bio && (
          <section className="mb-16">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 mb-6">
              About
            </h2>
            <p className="text-xl leading-relaxed text-black/80 max-w-2xl font-light">
              {profile.bio}
            </p>
          </section>
        )}

        {/* Experience Timeline */}
        {profile.workExperience.length > 0 && (
          <section className="mb-16">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 mb-8">
              Experience
            </h2>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-black/10" />
              
              <div className="space-y-10 pl-8">
                {profile.workExperience.map((exp, index) => (
                  <div key={exp.id} className="relative">
                    {/* Timeline Dot */}
                    <div className="absolute -left-8 top-2 w-4 h-4 bg-black rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    
                    {/* Date Badge */}
                    <div className="inline-block mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 bg-black/5 px-3 py-1">
                        {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-bold tracking-tight mb-1">
                      {exp.jobTitle}
                    </h3>
                    <p className="text-sm uppercase tracking-widest text-black/50 mb-4">
                      {exp.company}
                    </p>
                    <p className="text-black/70 leading-relaxed max-w-xl">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Projects Grid */}
        {profile.projects.length > 0 && (
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 mb-8">
              Selected Work
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {profile.projects.map((project) => (
                <div key={project.id} className="group border border-black/10 hover:border-black transition-colors">
                  {project.imageUrl && (
                    <div className="aspect-video overflow-hidden bg-black/5">
                      <img 
                        src={project.imageUrl} 
                        alt={project.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold uppercase tracking-wide text-sm">{project.title}</h3>
                      {project.link && (
                        <a href={project.link} className="text-black/30 hover:text-black transition-colors">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-black/60 leading-relaxed">{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}