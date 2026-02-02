import { useLocation } from 'react-router-dom';
import { TemplatesSection } from './sections/TemplatesSection';
import { SettingsSection } from './sections/SettingsSection';
import { JobMatchSection } from './sections/JobMatchSection';

export function DashboardContent() {
  const location = useLocation();
  const section = new URLSearchParams(location.search).get('section');

  // For job-match, templates, and settings, show the section view
  // For the main dashboard (no section), return null - the split view is shown in Dashboard.tsx
  const renderSection = () => {
    switch (section) {
      case 'job-match':
        return <JobMatchSection />;
      case 'templates':
        return <TemplatesSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return null;
    }
  };

  const content = renderSection();
  
  if (!content) return null;

  return (
    <div className="flex-1 overflow-auto p-6 lg:p-8 max-w-3xl mx-auto">
      {content}
    </div>
  );
}
