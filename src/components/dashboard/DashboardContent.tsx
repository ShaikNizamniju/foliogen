import { useLocation } from 'react-router-dom';
import { OverviewSection } from './sections/OverviewSection';
import { ProfileSection } from './sections/ProfileSection';
import { TemplatesSection } from './sections/TemplatesSection';
import { SettingsSection } from './sections/SettingsSection';

export function DashboardContent() {
  const location = useLocation();
  const section = new URLSearchParams(location.search).get('section') || 'overview';

  const renderSection = () => {
    switch (section) {
      case 'overview':
        return <OverviewSection />;
      case 'profile':
        return <ProfileSection />;
      case 'templates':
        return <TemplatesSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="flex-1 overflow-auto p-6 lg:p-8 max-w-3xl">
      {renderSection()}
    </div>
  );
}
