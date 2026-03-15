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
import { useState, useEffect } from 'react';

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
  const section = new URLSearchParams(location.search).get('section') || 'overview';

  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [recalibratingText, setRecalibratingText] = useState("");

  useEffect(() => {
    const handleRecalibrate = (e: any) => {
      setRecalibratingText(e.detail === 'none' ? 'GENERAL FIT' : e.detail.replace('_', ' ').toUpperCase());
      setIsRecalibrating(true);
      setTimeout(() => {
        setIsRecalibrating(false);
      }, 1200);
    };
    window.addEventListener("persona-recalibrating", handleRecalibrate);
    return () => window.removeEventListener("persona-recalibrating", handleRecalibrate);
  }, []);

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
    <div className="relative flex-1 overflow-auto p-4 sm:px-6 lg:px-8 pb-8 w-full max-w-7xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div key={section} {...pageTransition}>
          {renderSection()}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {isRecalibrating && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(6px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 xl:rounded-xl ml-4 mr-4 mt-4"
          >
            <div className="flex flex-col items-center gap-5 bg-[#0a0a0a]/90 border border-white/10 p-8 rounded-2xl shadow-2xl">
              <div className="h-1.5 w-64 bg-white/5 rounded-full overflow-hidden shrink-0 relative">
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="absolute inset-y-0 w-1/2 bg-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.8)] rounded-full"
                />
              </div>
              <p className="text-sm text-blue-400 font-mono tracking-[0.2em] uppercase origin-center">
                Neural Sync: {recalibratingText}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
