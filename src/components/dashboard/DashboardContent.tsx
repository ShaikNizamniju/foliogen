import { useLocation } from 'react-router-dom';
import { OverviewSection } from './sections/OverviewSection';
import { ProfileSection } from './sections/ProfileSection';
import { TemplatesSection } from './sections/TemplatesSection';
import { SettingsSection } from './sections/SettingsSection';
import { JobMatchSection } from './sections/JobMatchSection';
import { JobsSection } from './sections/JobsSection';
import { BillingSection } from './sections/BillingSection';
import { motion, AnimatePresence } from 'framer-motion';

const pageTransition = {
  initial: { opacity: 0, y: 24, filter: 'blur(6px)' },
  animate: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { type: 'spring' as const, stiffness: 100, damping: 20, mass: 0.8 },
  },
  exit: { 
    opacity: 0, 
    y: -12, 
    filter: 'blur(4px)',
    transition: { duration: 0.15, ease: 'easeIn' as const },
  },
};

export function DashboardContent() {
  const location = useLocation();
  const section = new URLSearchParams(location.search).get('section') || 'overview';

  const renderSection = () => {
    switch (section) {
      case 'overview':
        return <OverviewSection />;
      case 'profile':
        return <ProfileSection />;
      case 'job-match':
        return <JobMatchSection />;
      case 'jobs':
        return <JobsSection />;
      case 'templates':
        return <TemplatesSection />;
      case 'billing':
        return <BillingSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="flex-1 overflow-auto p-6 lg:p-8 max-w-5xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={section}
          {...pageTransition}
        >
          {renderSection()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
