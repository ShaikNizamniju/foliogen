import { motion } from 'framer-motion';
import { ProfileData } from '@/contexts/ProfileContext';
import { ExternalLink, Github, Linkedin, Mail, MapPin } from 'lucide-react';

interface MinimalSaasTemplateProps {
  profile?: ProfileData;
  onContactClick?: () => void;
}

const demoProjects = [
  { id: '1', title: 'AI Query Engine', description: 'Natural-language search over structured databases. 10k+ MAU.', techStack: ['Python', 'LangChain', 'React', 'PostgreSQL'], link: '', imageUrl: '' },
  { id: '2', title: 'DevOps Dashboard', description: 'Unified CI/CD monitoring with anomaly detection.', techStack: ['Go', 'Grafana', 'Kubernetes'], link: '', imageUrl: '' },
  { id: '3', title: 'DesignTokens CLI', description: 'Open-source tool to sync Figma tokens to Tailwind configs.', techStack: ['TypeScript', 'Node.js', 'Figma API'], link: '', imageUrl: '' },
];

const demoExperience = [
  { company: 'NeuralPath', jobTitle: 'AI Product Manager', startDate: '2023', endDate: '', current: true, description: '' },
  { company: 'Streamline', jobTitle: 'Senior Software Engineer', startDate: '2020', endDate: '2023', current: false, description: '' },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function MinimalSaasTemplate({ profile, onContactClick }: MinimalSaasTemplateProps) {
  const name = profile?.fullName || 'Alex Rivera';
  const headline = profile?.headline || 'AI Product Manager & Full-Stack Developer';
  const bio = profile?.bio || 'I ship products at the intersection of AI and developer tooling. Passionate about turning complex systems into intuitive experiences.';
  const location = profile?.location || 'San Francisco, CA';
  const skills = profile?.skills?.length ? profile.skills : ['TypeScript', 'Python', 'React', 'PostgreSQL', 'LangChain', 'Kubernetes', 'Product Strategy'];
  const projects = profile?.projects?.length
    ? profile.projects.slice(0, 6).map((p) => ({ ...p, techStack: p.techStack || [] }))
    : demoProjects;
  const experience = profile?.workExperience?.length ? profile.workExperience : demoExperience;
  const email = profile?.email || 'alex@example.com';
  const github = profile?.githubUrl || '';
  const linkedin = profile?.linkedinUrl || '';
  const website = profile?.website || '';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFBFC', color: '#111827', fontFamily: "'Inter', sans-serif" }}>
      {/* Sticky Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-30 backdrop-blur-xl border-b px-6 md:px-16 py-3 flex items-center justify-between"
        style={{ backgroundColor: 'rgba(250,251,252,0.85)', borderColor: '#E5E7EB' }}
      >
        <span className="text-sm font-semibold tracking-tight" style={{ color: '#111827' }}>
          {name.split(' ')[0]?.toLowerCase() || 'portfolio'}
          <span style={{ color: '#6366F1' }}>.</span>
        </span>
        <div className="flex items-center gap-4">
          {github && (
            <a href={github} target="_blank" rel="noopener noreferrer" className="text-[#6B7280] hover:text-[#111827] transition-colors">
              <Github className="h-4 w-4" />
            </a>
          )}
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-[#6B7280] hover:text-[#111827] transition-colors">
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {onContactClick && (
            <button
              onClick={onContactClick}
              className="text-xs font-medium px-3.5 py-1.5 rounded-lg transition-colors"
              style={{ backgroundColor: '#6366F1', color: '#fff' }}
            >
              Contact
            </button>
          )}
        </div>
      </motion.nav>

      {/* Hero */}
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto px-6 md:px-0 pt-20 pb-16"
      >
        <motion.div variants={fadeUp} className="flex items-center gap-2 text-xs mb-4" style={{ color: '#6B7280' }}>
          <MapPin className="h-3 w-3" />
          {location}
        </motion.div>
        <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
          {name}
        </motion.h1>
        <motion.p variants={fadeUp} className="text-lg font-medium mb-4" style={{ color: '#6366F1' }}>
          {headline}
        </motion.p>
        <motion.p variants={fadeUp} className="text-base leading-relaxed max-w-2xl" style={{ color: '#4B5563' }}>
          {bio}
        </motion.p>
      </motion.section>

      {/* Tech Stack pills */}
      <section className="max-w-3xl mx-auto px-6 md:px-0 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2"
        >
          {skills.map((s) => (
            <span
              key={s}
              className="text-xs font-medium px-3 py-1.5 rounded-md"
              style={{ backgroundColor: '#EEF2FF', color: '#4338CA' }}
            >
              {s}
            </span>
          ))}
        </motion.div>
      </section>

      {/* Experience */}
      <section className="max-w-3xl mx-auto px-6 md:px-0 pb-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          <motion.h2 variants={fadeUp} className="text-xs tracking-[0.2em] uppercase font-semibold mb-8" style={{ color: '#9CA3AF' }}>
            Experience
          </motion.h2>
          <div className="space-y-6">
            {experience.map((exp, i) => (
              <motion.div key={i} variants={fadeUp} className="flex gap-4">
                <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: '#6366F1' }} />
                <div>
                  <h3 className="font-semibold text-sm">{exp.jobTitle}</h3>
                  <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                    {exp.company} · {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Projects */}
      <section className="max-w-3xl mx-auto px-6 md:px-0 pb-20">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          <motion.h2 variants={fadeUp} className="text-xs tracking-[0.2em] uppercase font-semibold mb-8" style={{ color: '#9CA3AF' }}>
            Projects
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((p) => (
              <motion.div
                key={p.id}
                variants={fadeUp}
                className="group p-5 rounded-xl border transition-all duration-200 hover:shadow-md hover:border-[#6366F1]/30"
                style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm group-hover:text-[#6366F1] transition-colors">{p.title}</h3>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" style={{ color: '#9CA3AF' }} />
                    </a>
                  )}
                </div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: '#6B7280' }}>
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {p.techStack?.map((t) => (
                    <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded" style={{ backgroundColor: '#F3F4F6', color: '#4B5563' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 text-center" style={{ borderColor: '#E5E7EB' }}>
        <div className="flex items-center justify-center gap-4 text-xs" style={{ color: '#9CA3AF' }}>
          {email && (
            <a href={`mailto:${email}`} className="flex items-center gap-1 hover:text-[#111827] transition-colors">
              <Mail className="h-3 w-3" /> {email}
            </a>
          )}
          {website && (
            <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#111827] transition-colors">
              <ExternalLink className="h-3 w-3" /> Website
            </a>
          )}
        </div>
        <p className="text-[10px] mt-4" style={{ color: '#D1D5DB' }}>
          Built with Foliogen
        </p>
      </footer>
    </div>
  );
}
