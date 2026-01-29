import { ProfileData } from '@/contexts/ProfileContext';
import { MapPin, Mail, Globe, Linkedin, Github, Twitter, ExternalLink } from 'lucide-react';

interface MinimalistTemplateProps {
  profile: ProfileData;
}

export function MinimalistTemplate({ profile }: MinimalistTemplateProps) {
  return (
    <div className="min-h-[800px] bg-white text-gray-900 font-sans">
      {/* Header */}
      <header className="border-b border-gray-200 px-12 py-16">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight mb-2">
            {profile.fullName || 'Your Name'}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {profile.headline || 'Your professional headline'}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {profile.location}
              </span>
            )}
            {profile.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {profile.email}
              </span>
            )}
            {profile.website && (
              <a href={profile.website} className="flex items-center gap-1 hover:text-gray-900">
                <Globe className="h-4 w-4" />
                Website
              </a>
            )}
          </div>

          {/* Social Links */}
          <div className="flex gap-3 mt-6">
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} className="text-gray-400 hover:text-gray-900 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {profile.githubUrl && (
              <a href={profile.githubUrl} className="text-gray-400 hover:text-gray-900 transition-colors">
                <Github className="h-5 w-5" />
              </a>
            )}
            {profile.twitterUrl && (
              <a href={profile.twitterUrl} className="text-gray-400 hover:text-gray-900 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Bio */}
      {profile.bio && (
        <section className="border-b border-gray-200 px-12 py-12">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">About</h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
            {profile.bio}
          </p>
        </section>
      )}

      {/* Experience */}
      {profile.workExperience.length > 0 && (
        <section className="border-b border-gray-200 px-12 py-12">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-8">Experience</h2>
          <div className="space-y-8">
            {profile.workExperience.map((exp) => (
              <div key={exp.id} className="max-w-3xl">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-400">
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {profile.projects.length > 0 && (
        <section className="border-b border-gray-200 px-12 py-12">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-8">Projects</h2>
          <div className="grid gap-6">
            {profile.projects.map((project) => (
              <div key={project.id} className="group">
                <div className="flex items-start gap-4">
                  {project.imageUrl && (
                    <img 
                      src={project.imageUrl} 
                      alt={project.title}
                      className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{project.title}</h3>
                      {project.link && (
                        <a href={project.link} className="text-gray-400 hover:text-gray-900">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{project.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {profile.skills.length > 0 && (
        <section className="px-12 py-12">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-6">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <span 
                key={index} 
                className="px-3 py-1 text-sm border border-gray-200 rounded-full text-gray-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
