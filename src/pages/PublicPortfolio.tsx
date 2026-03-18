import { useEffect, useState } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/supabase_v2';
import { ProfileData, WorkExperience, Project, FontChoice, FONT_OPTIONS } from '@/contexts/ProfileContext';
import { ContactDialog } from '@/components/ContactDialog';
import { ProfileChatBot } from '@/components/public/ProfileChatBot';
import { ProRecruiterBanner } from '@/components/public/ProRecruiterBanner';
import { RecruiterPing } from '@/components/public/RecruiterPing';
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
import { useRecruiterPulse } from '@/hooks/useRecruiterPulse';

export default function PublicPortfolio() {
  const { id, slug } = useParams<{ id: string, slug?: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [recruiterMode, setRecruiterMode] = useState(false);

  // Track portfolio views (handles owner detection, session/localStorage spam prevention)
  useViewTracker(profile?.id);
  
  // Detailed tracking for "Recruiter Pulse" (Anonymized IP + Region)
  // We use the slug (if present) to identify the persona, otherwise 'general'
  useRecruiterPulse(profile?.id, slug || 'general');

  useEffect(() => {
    if (id) {
      fetchProfile(id);
    }
  }, [id]);

  const fetchProfile = async (identifier: string) => {
    setLoading(true);
    setError(null);

    // Try to fetch by username first, then by user_id
    let data = null;
    let fetchError = null;

      if (slug) {
      // 1. Resolve identifier to user_id
      let userId = identifier;
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier || '');

      if (!isUUID) {
        // Find user_id from username
        const { data: prof } = await supabase
          .from('profiles_public')
          .select('user_id')
          .eq('username', (identifier || '').toLowerCase())
          .maybeSingle();
        if (prof) userId = prof.user_id;
      }

      // 2. Fetch specific instance from portfolios
      const result = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', userId)
        .eq('slug', slug.toLowerCase())
        .maybeSingle();

      if (result.data) {
        // Map to match the existing payload structure
        data = {
          id: result.data.user_id,
          views: result.data.views,
          published_data: {
            ...result.data.data_json,
            selected_template: result.data.template_name
          }
        };
      }
      fetchError = result.error;
    } else {
      // Legacy URL handling or new Chameleon Link
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
        // It's either a username or a Chameleon uniquely generated slug. Check chameleon_links first.
        const chameleonResult = await supabase
          .from('chameleon_links')
          .select('*')
          .eq('slug', identifier)
          .eq('is_active', true)
          .maybeSingle();

        if (chameleonResult.data) {
          data = {
            id: chameleonResult.data.user_id,
            views: chameleonResult.data.views,
            published_data: {
              ...chameleonResult.data.data_json,
              selected_template: chameleonResult.data.template_name
            }
          };

          // Background task to log this chameleon visit
          setTimeout(() => {
             supabase.from('visit_logs').insert({
               user_id: chameleonResult.data.user_id,
               link_type: 'chameleon',
               link_id: identifier,
               industry_context: chameleonResult.data.industry_context,
               device_type: window.innerWidth < 768 ? 'Mobile' : 'Desktop',
             }).then();
             
             // Also increment views quickly
             supabase.from('chameleon_links').update({ views: (chameleonResult.data.views || 0) + 1 }).eq('slug', identifier).then();
          }, 500);
        } else {
          // Check custom_slug next for sequential URLs Reqs
          const customSlugResult = await supabase
            .from('portfolios')
            .select('*')
            .eq('custom_slug', identifier.toLowerCase())
            .maybeSingle();
            
          if (customSlugResult.data) {
            data = {
              id: customSlugResult.data.user_id,
              views: customSlugResult.data.views,
              published_data: {
                ...customSlugResult.data.data_json,
                selected_template: customSlugResult.data.template_name
              }
            };
          } else {
            // Fallback to username URL lookup
            const result = await supabase
              .from('profiles_public')
              .select('*')
              .eq('username', identifier.toLowerCase())
              .maybeSingle();
            data = result.data;
            fetchError = result.error;
          }
        }
      }
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
      hidePhoto: payload.hide_photo || false,
      views: data.views || 0,
      resumeUrl: (payload as any).resume_url || '',
      calendlyUrl: (payload as any).calendly_url || '',
      selectedFont: ((payload as any).selected_font as FontChoice) || 'default',
      selectedTemplate: (payload.selected_template as ProfileData['selectedTemplate']) || 'minimalist',
      activePersona: (payload as any).active_persona || 'general',
      narrativeVariants: (payload as any).narrative_variants || {
        general: { bio: payload.bio || '', headline: payload.headline || '' },
        startup: { bio: '', headline: '' },
        bigtech: { bio: '', headline: '' },
        fintech: { bio: '', headline: '' },
      },
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
  const personaLabels: Record<string, string> = {
    general: 'Professional',
    startup: 'Startup',
    bigtech: 'Big Tech',
    fintech: 'Fintech'
  };
  const activePersonaLabel = personaLabels[profile.activePersona] || 'Professional';

  const pageTitle = `${profile.fullName} | Professional Identity via Foliogen`;
    
  const pageDescription = profile.headline 
    ? `${profile.headline}. ${profile.bio?.slice(0, 160)}`
    : profile.bio || `Professional portfolio of ${profile.fullName}`;

  const ogTitle = `${profile.fullName} | Professional Identity via Foliogen`;
  const ogDescription = `View my verified project narratives and career dialect.`;
  const pageImage = profile.photoUrl || 'https://www.foliogen.in/og-premium-placeholder.png';
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

    updateMetaTag('og:title', ogTitle);
    updateMetaTag('og:description', ogDescription);
    updateMetaTag('og:image', pageImage);
    updateMetaTag('og:url', pageUrl);

    updateMetaTag('twitter:title', ogTitle);
    updateMetaTag('twitter:description', ogDescription);
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
  }, [profile, pageTitle, pageDescription, ogTitle, ogDescription, pageImage, pageUrl]);

  // Render the selected template directly - no editing controls
  const renderTemplate = () => {
    const displayProfile = { ...profile, photoUrl: profile.hidePhoto ? "" : profile.photoUrl };
    const templateProps = { profile: displayProfile, onContactClick: () => setContactOpen(true) };

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

  const renderRecruiterGrid = () => {
    const projects = profile.projects?.filter((p) => p.visible !== false) || [];
    const biggestWin =
      projects.find((p) => p.description?.includes('%') || p.description?.includes('$')) ||
      projects[0];
    const allSkills = profile.skills || [];

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-4 px-6 md:p-8 md:p-16 selection:bg-blue-500/30 font-sans">
        <div className="max-w-6xl mx-auto flex flex-col gap-10 md:gap-16 animate-in fade-in duration-700">
          {/* 1. Executive Headline */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-white/10 pb-6 md:pb-8 gap-4 md:gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">
                {profile.fullName}
              </h1>
              <p className="text-lg md:text-xl text-blue-400 font-mono uppercase tracking-widest max-w-2xl">
                {profile.headline || profile.bio || "AI Product Manager"}
              </p>
            </div>
            {!profile.hidePhoto && profile.photoUrl && (
              <img
                src={profile.photoUrl}
                alt={profile.fullName}
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover grayscale opacity-80 border border-white/10 shadow-2xl"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 2. Biggest Win (Metric-First) */}
            {biggestWin && (
              <div className="col-span-1 lg:col-span-2 bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-8 rounded-3xl flex flex-col justify-between group hover:border-white/20 transition-all">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="text-xs font-bold text-white bg-blue-600 px-3 py-1 rounded-full uppercase tracking-widest">
                      Biggest Win
                    </div>
                    <div className="h-px bg-white/10 flex-1"></div>
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">
                    {biggestWin.title}
                  </h3>
                  <p className="text-neutral-300 leading-relaxed text-lg font-light">
                    {biggestWin.description || 'Impact: High-complexity feature orchestration'}
                  </p>
                </div>
              </div>
            )}

            {/* 3. Tech Stack (Categorized) */}
            <div className="col-span-1 bg-white/5 border border-white/10 p-8 rounded-3xl">
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">
                Technical Stack
              </div>
              <div className="flex flex-wrap gap-2">
                {allSkills.length > 0 ? (
                  allSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-black/50 border border-white/5 rounded-lg text-xs font-medium text-neutral-300"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-neutral-500 italic text-sm">No skills listed.</span>
                )}
              </div>
            </div>

            {/* 4. Verified Links */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white/5 border border-white/10 p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="text-xs font-bold text-green-400 uppercase tracking-widest">
                  Proof of Impact
                </div>
                <div className="h-px bg-white/10 flex-1"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...projects].sort((a, b) => (b.metricDensityScore || 0) - (a.metricDensityScore || 0)).map((project, i) => {
                  const isVerified = project.isVerified || project.verifiedImpact || project.proofValidationScore === 50;
                  return (
                  <a
                    key={i}
                    href={project.proofOfImpact || project.link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-5 bg-black/40 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-semibold text-neutral-200 line-clamp-1 group-hover:text-white">
                        {project.title}
                      </h4>
                      {isVerified ? (
                        <span className="px-2 py-1 bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 rounded-md text-[10px] font-bold tracking-widest flex items-center gap-1 shadow-[0_0_8px_rgba(0,229,255,0.3)]">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          VERIFIED IDENTITY
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-neutral-500/10 text-neutral-400 border-dashed border border-neutral-500/20 rounded-md text-[10px] font-bold tracking-widest flex items-center gap-1">
                          VERIFICATION PENDING
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 font-mono truncate group-hover:text-blue-400 transition-colors">
                      {project.proofOfImpact || 'No proof link provided'}
                    </p>
                  </a>
                )})}
                {projects.length === 0 && (
                  <div className="text-sm text-neutral-500 italic flex items-center h-20 col-span-full justify-center border text-center border-dashed border-white/10 rounded-2xl bg-black/20">
                    No projects available.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        {pageImage && <meta property="og:image" content={pageImage} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
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

        {/* Recruiter Mode Toggle */}
      <div className="fixed top-6 left-6 z-[60] flex items-center gap-3 bg-black/40 backdrop-blur-md p-2 pl-4 pr-2 rounded-full border border-white/10 shadow-2xl">
        <span className="text-xs font-bold text-white uppercase tracking-widest">
          Recruiter Mode
        </span>
        <label className="relative inline-flex items-center cursor-pointer group">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={recruiterMode}
            onChange={(e) => setRecruiterMode(e.target.checked)}
          />
          <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 border-none"></div>
        </label>
      </div>

      <div
        className="min-h-screen"
        style={{
          fontFamily: (() => {
            const fontOption = FONT_OPTIONS.find(f => f.id === profile.selectedFont);
            return fontOption && profile.selectedFont !== 'default' && !recruiterMode
              ? `'${fontOption.preview}', sans-serif`
              : undefined;
          })(),
          fontSize: profile.fontConfig?.size === 'sm' ? '0.875rem' : profile.fontConfig?.size === 'lg' ? '1.125rem' : profile.fontConfig?.size === 'xl' ? '1.25rem' : profile.fontConfig?.size === '2xl' ? '1.5rem' : '1rem',
          fontWeight: profile.fontConfig?.isBold ? 'bold' : 'normal',
          fontStyle: profile.fontConfig?.isItalic ? 'italic' : 'normal',
          textDecoration: profile.fontConfig?.isUnderline ? 'underline' : 'none',
          textAlign: profile.fontConfig?.alignment || 'left',
        }}
      >
        <style>
          {`
            #portfolio-export-container p,
            #portfolio-export-container h1,
            #portfolio-export-container h2,
            #portfolio-export-container h3,
            #portfolio-export-container h4,
            #portfolio-export-container span,
            #portfolio-export-container a {
              ${profile.fontConfig?.isBold ? 'font-weight: bold !important;' : ''}
              ${profile.fontConfig?.isItalic ? 'font-style: italic !important;' : ''}
              ${profile.fontConfig?.isUnderline ? 'text-decoration: underline !important;' : ''}
              ${profile.fontConfig?.alignment ? `text-align: ${profile.fontConfig.alignment} !important;` : ''}
            }
            ${profile.fontConfig?.size && profile.fontConfig.size !== 'base' ? `
              #portfolio-export-container {
                zoom: ${profile.fontConfig.size === 'sm' ? 0.875 : profile.fontConfig.size === 'lg' ? 1.125 : profile.fontConfig.size === 'xl' ? 1.25 : 1.5};
              }
            ` : ''}
          `}
        </style>
        <div id="portfolio-export-container" className="print:w-full">
          <ErrorBoundary fallbackMessage="Portfolio template encountered an error">
            {recruiterMode ? renderRecruiterGrid() : renderTemplate()}
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
          profileId={profile.id || id}
          profileName={profile.fullName}
          slug={slug}
        />
      )}
      {/* Recruiter Interest Portal — Zero Friction Ping */}
      {id && (
        <RecruiterPing
          portfolioUserId={id}
          linkId={slug || id}
          linkType={slug ? 'chameleon' : 'portfolio'}
          industryContext={undefined}
        />
      )}
    </>
  );
}