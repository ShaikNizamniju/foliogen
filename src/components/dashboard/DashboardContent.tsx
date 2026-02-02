import { useLocation } from 'react-router-dom';
import { TemplatesSection } from './sections/TemplatesSection';
import { SettingsSection } from './sections/SettingsSection';
import { JobMatchSection } from './sections/JobMatchSection';
import { AnalyticsSection } from './sections/AnalyticsSection';
import { SEOSection } from './sections/SEOSection';
import { BlogSection } from './sections/BlogSection';

export function DashboardContent() {
  const location = useLocation();
  const section = new URLSearchParams(location.search).get('section');

  // For job-match, templates, and settings, show the section view
  // For the main dashboard (no section), return null - the split view is shown in Dashboard.tsx
  const renderSection = () => {
    switch (section) {
      case 'analytics':
        return <AnalyticsSection />;
      case 'blog':
        return <BlogSection />;
      case 'seo':
        return <SEOSection />;
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
    <div className="flex-1 overflow-auto p-6 lg:p-8 max-w-4xl mx-auto">
      {content}
    </div>
  );
}
