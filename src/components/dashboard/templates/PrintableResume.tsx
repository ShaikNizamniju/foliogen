import { ProfileData } from '@/contexts/ProfileContext';
import { Mail, Globe, Linkedin, Github, MapPin, Phone } from 'lucide-react';

interface PrintableResumeProps {
  profile: ProfileData;
}

export function PrintableResume({ profile }: PrintableResumeProps) {
  return (
    <div 
      className="w-[210mm] min-h-[297mm] bg-white text-black p-[15mm] font-sans"
      style={{ fontFamily: "'Arial', 'Helvetica', sans-serif" }}
    >
      {/* Header */}
      <header className="border-b-2 border-black pb-3 mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-black mb-1">
          {profile.fullName || 'Your Name'}
        </h1>
        {profile.headline && (
          <p className="text-sm font-medium text-gray-700 mb-2">
            {profile.headline}
          </p>
        )}
        
        {/* Contact Info Row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-gray-600">
          {profile.email && (
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {profile.email}
            </span>
          )}
          {profile.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {profile.location}
            </span>
          )}
          {profile.linkedinUrl && (
            <span className="flex items-center gap-1">
              <Linkedin className="h-3 w-3" />
              {profile.linkedinUrl.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//i, '').replace(/\/$/, '')}
            </span>
          )}
          {profile.githubUrl && (
            <span className="flex items-center gap-1">
              <Github className="h-3 w-3" />
              {profile.githubUrl.replace(/https?:\/\/(www\.)?github\.com\//i, '').replace(/\/$/, '')}
            </span>
          )}
          {profile.website && (
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {profile.website.replace(/https?:\/\/(www\.)?/i, '').replace(/\/$/, '')}
            </span>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {profile.bio && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wide text-black border-b border-gray-300 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-[10px] leading-tight text-gray-800">
            {profile.bio}
          </p>
        </section>
      )}

      {/* Skills */}
      {profile.skills && profile.skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wide text-black border-b border-gray-300 pb-1 mb-2">
            Skills
          </h2>
          <p className="text-[10px] leading-tight text-gray-800">
            {profile.skills.join(' • ')}
          </p>
        </section>
      )}

      {/* Experience */}
      {profile.workExperience && profile.workExperience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wide text-black border-b border-gray-300 pb-1 mb-2">
            Experience
          </h2>
          <div className="space-y-3">
            {profile.workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[11px] font-bold text-black">
                      {exp.jobTitle}
                    </h3>
                    <p className="text-[10px] text-gray-600">
                      {exp.company}
                    </p>
                  </div>
                  <span className="text-[9px] text-gray-500 whitespace-nowrap">
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.description && (
                  <ul className="mt-1 text-[10px] leading-tight text-gray-800 pl-3">
                    {exp.description.split('\n').filter(Boolean).map((line, i) => (
                      <li key={i} className="list-disc ml-1">
                        {line.replace(/^[-•]\s*/, '')}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {profile.projects && profile.projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wide text-black border-b border-gray-300 pb-1 mb-2">
            Projects
          </h2>
          <div className="space-y-2">
            {profile.projects.map((project) => (
              <div key={project.id}>
                <div className="flex items-start justify-between">
                  <h3 className="text-[11px] font-bold text-black">
                    {project.title}
                  </h3>
                  {project.link && (
                    <span className="text-[9px] text-gray-500 truncate max-w-[100px]">
                      {project.link.replace(/https?:\/\/(www\.)?/i, '').replace(/\/$/, '')}
                    </span>
                  )}
                </div>
                {project.description && (
                  <p className="text-[10px] leading-tight text-gray-800 mt-0.5">
                    {project.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Highlights */}
      {profile.keyHighlights && profile.keyHighlights.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wide text-black border-b border-gray-300 pb-1 mb-2">
            Key Achievements
          </h2>
          <ul className="text-[10px] leading-tight text-gray-800 pl-3">
            {profile.keyHighlights.map((highlight, i) => (
              <li key={i} className="list-disc ml-1">
                {highlight}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
