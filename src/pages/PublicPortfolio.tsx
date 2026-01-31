import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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
import { InfluencerTemplate } from '@/components/dashboard/templates/InfluencerTemplate';
import { SwissTemplate } from '@/components/dashboard/templates/SwissTemplate';
import { NoirTemplate } from '@/components/dashboard/templates/NoirTemplate';

export default function PublicPortfolio() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const viewCounted = useRef(false);

  useEffect(() => {
    if (id) {
      fetchProfile(id);
    }
  }, [id]);

  // Increment view count - strict dependency to prevent double counting
  useEffect(() => {
    if (id && !viewCounted.current) {
      viewCounted.current = true;
      supabase.rpc('increment_views', { p_user_id: id }).then(({ error }) => {
        if (error) {
          console.error('Failed to increment views:', error);
        }
      });
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
      views: data.views || 0,
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

  // Generate SEO metadata
  const pageTitle = profile.fullName 
    ? `${profile.fullName}${profile.headline ? ` - ${profile.headline}` : ''}`
    : 'Portfolio';
  const pageDescription = profile.bio || `Professional portfolio of ${profile.fullName || 'a talented professional'}`;
  const pageImage = profile.photoUrl || '';
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

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
      case 'influencer':
        return <InfluencerTemplate profile={profile} />;
      case 'swiss':
        return <SwissTemplate profile={profile} />;
      case 'noir':
        return <NoirTemplate profile={profile} />;
      default:
        return <MinimalistTemplate profile={profile} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        {pageImage && <meta property="og:image" content={pageImage} />}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {pageImage && <meta name="twitter:image" content={pageImage} />}
      </Helmet>
      <div className="min-h-screen">
        {renderTemplate()}
      </div>
    </>
  );
}
