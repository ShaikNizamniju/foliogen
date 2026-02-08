import { useLocation } from 'react-router-dom';
import { OverviewSection } from './sections/OverviewSection';
import { ProfileSection } from './sections/ProfileSection';
import { TemplatesSection } from './sections/TemplatesSection';
import { SettingsSection } from './sections/SettingsSection';
import { JobMatchSection } from './sections/JobMatchSection';
import { JobsSection } from './sections/JobsSection';

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
      case 'settings':
        return <SettingsSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="flex-1 overflow-auto p-6 lg:p-8 max-w-5xl">
      {renderSection()}
    </div>
  );
}
