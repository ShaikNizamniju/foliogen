import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ProfileData, WorkExperience, Project } from '@/contexts/ProfileContext';
import { MinimalistTemplate } from '@/components/dashboard/templates/MinimalistTemplate';
import { CreativeTemplate } from '@/components/dashboard/templates/CreativeTemplate';
import { SaasTemplate } from '@/components/dashboard/templates/SaasTemplate';
import { DevTemplate } from '@/components/dashboard/templates/DevTemplate';
import { BrutalistTemplate } from '@/components/dashboard/templates/BrutalistTemplate';
import { AcademicTemplate } from '@/components/dashboard/templates/AcademicTemplate';
import { StudioTemplate } from '@/components/dashboard/templates/StudioTemplate';
import { ExecutiveTemplate } from '@/components/dashboard/templates/ExecutiveTemplate';

export default function PublicPortfolio() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProfile(id);
    }
  }, [id]);

  const fetchProfile = async (userId: string) => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError) {
      setError('Failed to load portfolio');
      setLoading(false);
      return;
    }

    if (!data) {
      setError('Portfolio not found');
      setLoading(false);
      return;
    }

    const workExp = Array.isArray(data.work_experience)
      ? (data.work_experience as unknown as WorkExperience[])
      : [];
    const proj = Array.isArray(data.projects)
      ? (data.projects as unknown as Project[])
      : [];
    const keyHighlights = Array.isArray((data as any).key_highlights)
      ? ((data as any).key_highlights as string[])
      : [];

    setProfile({
      id: data.id,
      fullName: data.full_name || '',
      photoUrl: data.photo_url || '',
      bio: data.bio || '',
      headline: data.headline || '',
      location: data.location || '',
      email: data.email || '',
      website: data.website || '',
      linkedinUrl: data.linkedin_url || '',
      githubUrl: data.github_url || '',
      twitterUrl: data.twitter_url || '',
      workExperience: workExp,
      projects: proj,
      skills: data.skills || [],
      keyHighlights: keyHighlights,
      selectedTemplate: (data.selected_template as ProfileData['selectedTemplate']) || 'minimalist',
    });
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-muted-foreground">{error || 'Portfolio not found'}</p>
        </div>
      </div>
    );
  }

  // Render the selected template directly - no editing controls
  const renderTemplate = () => {
    switch (profile.selectedTemplate) {
      case 'minimalist':
        return <MinimalistTemplate profile={profile} />;
      case 'creative':
        return <CreativeTemplate profile={profile} />;
      case 'saas':
        return <SaasTemplate profile={profile} />;
      case 'dev':
        return <DevTemplate profile={profile} />;
      case 'brutalist':
        return <BrutalistTemplate profile={profile} />;
      case 'academic':
        return <AcademicTemplate profile={profile} />;
      case 'studio':
        return <StudioTemplate profile={profile} />;
      case 'executive':
        return <ExecutiveTemplate profile={profile} />;
      default:
        return <MinimalistTemplate profile={profile} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderTemplate()}
    </div>
  );
}
