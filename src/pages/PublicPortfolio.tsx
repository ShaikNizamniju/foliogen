import { useEffect, useState } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { ProfileData, WorkExperience, Project, FontChoice, FONT_OPTIONS } from '@/contexts/ProfileContext';
import { ContactDialog } from '@/components/ContactDialog';
import { ProfileChatBot } from '@/components/public/ProfileChatBot';
import { ProRecruiterBanner } from '@/components/public/ProRecruiterBanner';
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
import { ModernDarkTemplate } from '@/components/dashboard/templates/ModernDarkTemplate';
import { GasparTemplate } from '@/components/templates/GasparTemplate';
import { DestelloTemplate } from '@/components/templates/DestelloTemplate';
import { FrqncyTemplate } from '@/components/templates/FrqncyTemplate';
import { ArpeggioTemplate } from '@/components/templates/ArpeggioTemplate';
import { NakulaTemplate } from '@/components/templates/NakulaTemplate';
import { HeroBoldTemplate } from '@/components/templates/HeroBoldTemplate';
import { MinimalSaasTemplate } from '@/components/templates/MinimalSaasTemplate';
import { PrintableResume } from '@/components/dashboard/templates/PrintableResume';
import { useViewTracker } from '@/hooks/useViewTracker';

export default function PublicPortfolio() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

  // Track portfolio views (handles owner detection, session/localStorage spam prevention)
  useViewTracker(id);

  useEffect(() => {
    if (id) {
      fetchProfile(id);
    }
  }, [id]);

  const fetchProfile = async (identifier: string) => {
    setLoading(true);
    setError(null);

    // Try to fetch by username first, then by user_id (supports both custom and legacy URLs)
    let data = null;
    let fetchError = null;

    // Check if identifier looks like a UUID (legacy format)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

    if (isUUID) {
      // Legacy URL: fetch by user_id
      const result = await supabase
        .from('profiles_public')
        .select('*')
        .eq('user_id', identifier)
        .maybeSingle();
      data = result.data;
      fetchError = result.error;
    } else {
      // Custom username URL: fetch by username
      const result = await supabase
        .from('profiles_public')
        .select('*')
        .eq('username', identifier.toLowerCase())
        .maybeSingle();
      data = result.data;
      fetchError = result.error;
    }

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

    const payload = data.published_data || data;

    const workExp = Array.isArray(payload.work_experience)
      ? (payload.work_experience as unknown as WorkExperience[])
      : [];
    const proj = Array.isArray(payload.projects)
      ? (payload.projects as unknown as Project[])
      : [];
    const keyHighlights = Array.isArray((payload as any).key_highlights)
      ? ((payload as any).key_highlights as string[])
      : [];

    setProfile({
      id: data.id || '',
      fullName: payload.full_name || '',
      photoUrl: payload.photo_url || '',
      bio: payload.bio || '',
      headline: payload.headline || '',
      location: payload.location || '',
      email: '', // Not exposed in public view for privacy
      website: payload.website || '',
      linkedinUrl: payload.linkedin_url || '',
      githubUrl: payload.github_url || '',
      twitterUrl: payload.twitter_url || '',
      workExperience: workExp,
      projects: proj,
      skills: payload.skills || [],
      keyHighlights: keyHighlights,
      views: data.views || 0,
      resumeUrl: (payload as any).resume_url || '',
      calendlyUrl: (payload as any).calendly_url || '',
      selectedFont: ((payload as any).selected_font as FontChoice) || 'default',
      selectedTemplate: (payload.selected_template as ProfileData['selectedTemplate']) || 'minimalist',
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
    ? `${profile.fullName} | AI Portfolio`
    : 'AI Portfolio';
  const pageDescription = profile.bio || profile.headline || `Professional portfolio of ${profile.fullName || 'a talented professional'}`;
  const pageImage = profile.photoUrl || 'https://foliogen.lovable.app/og-image.png';
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Vanilla JS fallback to mutate meta tags for crawlers that struggle with Helmet
  useEffect(() => {
    if (!profile) return;

    document.title = pageTitle;

    const updateMetaTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.querySelector(`meta[name="${property}"]`);
      }
      if (tag) {
        tag.setAttribute('content', content);
      } else {
        const newTag = document.createElement('meta');
        newTag.setAttribute(property.startsWith('og:') ? 'property' : 'name', property);
        newTag.setAttribute('content', content);
        document.head.appendChild(newTag);
      }
    };

    updateMetaTag('og:title', pageTitle);
    updateMetaTag('og:description', pageDescription);
    updateMetaTag('og:image', pageImage);
    updateMetaTag('og:url', pageUrl);

    updateMetaTag('twitter:title', pageTitle);
    updateMetaTag('twitter:description', pageDescription);
    updateMetaTag('twitter:image', pageImage);
    updateMetaTag('twitter:url', pageUrl);

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag) {
      canonicalTag.setAttribute('href', pageUrl);
    } else {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      canonicalTag.setAttribute('href', pageUrl);
      document.head.appendChild(canonicalTag);
    }
  }, [profile, pageTitle, pageDescription, pageImage, pageUrl]);

  // Render the selected template directly - no editing controls
  const renderTemplate = () => {
    const templateProps = { profile, onContactClick: () => setContactOpen(true) };

    switch (profile.selectedTemplate) {
      case 'minimalist':
        return <MinimalistTemplate {...templateProps} />;
      case 'creative':
        return <CreativeTemplate {...templateProps} />;
      case 'saas':
        return <SaasTemplate {...templateProps} />;
      case 'dev':
        return <DevTemplate {...templateProps} />;
      case 'brutalist':
        return <BrutalistTemplate {...templateProps} />;
      case 'academic':
        return <AcademicTemplate {...templateProps} />;
      case 'studio':
        return <StudioTemplate {...templateProps} />;
      case 'executive':
        return <ExecutiveTemplate {...templateProps} />;
      case 'influencer':
        return <InfluencerTemplate {...templateProps} />;
      case 'swiss':
        return <SwissTemplate {...templateProps} />;
      case 'noir':
        return <NoirTemplate {...templateProps} />;
      case 'modern-dark':
        return <ModernDarkTemplate {...templateProps} />;
      case 'gaspar':
        return <GasparTemplate {...templateProps} />;
      case 'destello':
        return <DestelloTemplate {...templateProps} />;
      case 'frqncy':
        return <FrqncyTemplate {...templateProps} />;
      case 'arpeggio':
        return <ArpeggioTemplate {...templateProps} />;
      case 'nakula':
        return <NakulaTemplate {...templateProps} />;
      case 'niju-bold':
        return <HeroBoldTemplate {...templateProps} />;
      case 'minimal-saas':
        return <MinimalSaasTemplate {...templateProps} />;
      default:
        return <MinimalistTemplate {...templateProps} />;
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
      {/* Chameleon Mode: Recruiter-specific welcome banner (Pro feature) */}
      {id && <ProRecruiterBanner profileUserId={id} />}

      {/* Load selected Google Font */}
      {profile.selectedFont && profile.selectedFont !== 'default' && (() => {
        const fontOption = FONT_OPTIONS.find(f => f.id === profile.selectedFont);
        if (!fontOption) return null;
        return (
          <Helmet>
            <link
              rel="stylesheet"
              href={`https://fonts.googleapis.com/css2?family=${fontOption.googleFont}&display=swap`}
            />
          </Helmet>
        );
      })()}

      <div
        className="min-h-screen"
        style={{
          fontFamily: (() => {
            const fontOption = FONT_OPTIONS.find(f => f.id === profile.selectedFont);
            return fontOption && profile.selectedFont !== 'default'
              ? `'${fontOption.preview}', sans-serif`
              : undefined;
          })(),
        }}
      >
        <div id="portfolio-export-container" className="print:w-full">
          <ErrorBoundary fallbackMessage="Portfolio template encountered an error">
            {renderTemplate()}
          </ErrorBoundary>
        </div>
      </div>

      {/* Off-screen ATS-friendly resume for PDF export */}
      <div
        id="printable-resume-container"
        className="fixed -left-[9999px] top-0 bg-white"
        style={{ width: '210mm' }}
      >
        <PrintableResume profile={profile} />
      </div>
      <ContactDialog
        open={contactOpen}
        onOpenChange={setContactOpen}
        recipientEmail={profile.email}
        recipientName={profile.fullName}
      />
      {id && (
        <ProfileChatBot
          profileId={id}
          profileName={profile.fullName}
        />
      )}
    </>
  );
}