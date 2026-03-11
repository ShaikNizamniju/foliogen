import { useLocation } from 'react-router-dom';
import { OverviewSection } from './sections/OverviewSection';
import { ProfileSection } from './sections/ProfileSection';
import { TemplatesSection } from './sections/TemplatesSection';
import { SettingsSection } from './sections/SettingsSection';
import { JobMatchSection } from './sections/JobMatchSection';
import { JobsSection } from './sections/JobsSection';
import { InterviewPrepSection } from './sections/InterviewPrepSection';
import { ChatLogSection } from './sections/ChatLogSection';
import { motion, AnimatePresence } from 'framer-motion';

import { IdentityVaultSection } from './sections/IdentityVaultSection';

const pageTransition = {
  initial: { opacity: 0, y: 16, filter: 'blur(6px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring' as const, stiffness: 120, damping: 22, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: 'blur(4px)',
    transition: { duration: 0.12, ease: 'easeIn' as const },
  },
};

export function DashboardContent() {
  const location = useLocation();
  const section = location.pathname === '/profile'
    ? 'profile'
    : (new URLSearchParams(location.search).get('section') || 'overview');

  const renderSection = () => {
    switch (section) {
      case 'overview': return <OverviewSection />;
      case 'profile': return <ProfileSection />;
      case 'job-match': return <JobMatchSection />;
      case 'jobs': return <JobsSection />;
      case 'interview-prep': return <InterviewPrepSection />;
      case 'templates': return <TemplatesSection />;
      case 'chat-log': return <ChatLogSection />;
      case 'identity-vault': return <IdentityVaultSection />;
      case 'settings': return <SettingsSection />;
      default: return <OverviewSection />;
    }
  };

  return (
    <div className="flex-1 overflow-auto p-4 sm:px-6 lg:px-8 pb-8 w-full max-w-7xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div key={section} {...pageTransition}>
          {renderSection()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
