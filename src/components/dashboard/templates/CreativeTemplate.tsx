import { ProfileData } from '@/contexts/ProfileContext';
import { MapPin, Mail, Globe, Linkedin, Github, Twitter, ExternalLink } from 'lucide-react';

interface CreativeTemplateProps {
  profile: ProfileData;
}

export function CreativeTemplate({ profile }: CreativeTemplateProps) {
  return (
    <div className="min-h-[800px] bg-gradient-creative text-white font-sans">
      {/* Hero Section */}
      <header className="px-12 py-20 text-center">
        {profile.photoUrl ? (
          <img 
            src={profile.photoUrl} 
            alt={profile.fullName}
            className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-4 border-white/20 shadow-2xl"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-white/20 mx-auto mb-6 flex items-center justify-center text-4xl font-bold">
            {profile.fullName?.charAt(0) || '?'}
          </div>
        )}
        
        <h1 className="text-4xl font-bold mb-2">
          {profile.fullName || 'Your Name'}
        </h1>
        <p className="text-xl text-white/80 mb-6">
          {profile.headline || 'Your professional headline'}
        </p>
        
        <div className="flex justify-center gap-4 text-sm text-white/70">
          {profile.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {profile.location}
            </span>
          )}
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mt-8">
          {profile.linkedinUrl && (
            <a href={profile.linkedinUrl} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          )}
          {profile.githubUrl && (
            <a href={profile.githubUrl} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <Github className="h-5 w-5" />
            </a>
          )}
          {profile.twitterUrl && (
            <a href={profile.twitterUrl} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
          )}
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          )}
          {profile.website && (
            <a href={profile.website} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <Globe className="h-5 w-5" />
            </a>
          )}
        </div>
      </header>

      {/* Content Cards */}
      <div className="px-8 pb-12 space-y-8">
        {/* Bio Card */}
        {profile.bio && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-lg font-semibold mb-4">About Me</h2>
            <p className="text-white/90 leading-relaxed">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Experience Cards */}
        {profile.workExperience.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-lg font-semibold mb-6">Experience</h2>
            <div className="space-y-6">
              {profile.workExperience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-white/30 pl-6">
                  <h3 className="font-semibold">{exp.jobTitle}</h3>
                  <p className="text-white/70 text-sm mb-2">
                    {exp.company} • {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </p>
                  <p className="text-white/80 text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {profile.projects.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-lg font-semibold mb-6">Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.projects.map((project) => (
                <div key={project.id} className="bg-white/10 rounded-xl overflow-hidden group">
                  {project.imageUrl && (
                    <img 
                      src={project.imageUrl} 
                      alt={project.title}
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{project.title}</h3>
                      {project.link && (
                        <a href={project.link} className="text-white/60 hover:text-white">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-white/70 text-sm mt-1">{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {profile.skills.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-lg font-semibold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
