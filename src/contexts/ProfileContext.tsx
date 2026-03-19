import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { supabase } from '@/lib/supabase_v2';
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { Json } from "@/integrations/supabase/types";

export type Persona = "general" | "startup" | "bigtech" | "fintech";

export interface NarrativeVariant {
  bio: string;
  headline: string;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface ProjectReference {
  id: string;
  type: 'url' | 'testimonial';
  title: string;
  url?: string;
  content?: string;
  author?: string;
}

export interface Project {
  id: string;
  title: string;
  link: string;
  imageUrl: string;
  description: string;
  visualPrompt?: string;
  techStack?: string[];
  targetKeywords?: string[];
  visible?: boolean;
  docsUrl?: string;
  isProtected?: boolean;
  password?: string;
  references?: ProjectReference[];
  proofOfImpact?: string;
  verifiedImpact?: boolean; // legacy
  isVerified?: boolean;
  proofValidationScore?: number;
  metricDensityScore?: number;
  frameworkAlignmentScore?: number;
}

export type FontChoice = "default" | "transcity" | "agraham" | "vertensie" | "runiga" | "gafiya" | "king" | "banera" | "sirelia" | "daeling" | "koya" | "oreon" | "remap" | "marietta" | "avinga" | "hanoble" | "wistle";

export const FONT_OPTIONS: { id: FontChoice; label: string; googleFont: string; preview: string; category?: string }[] = [
  { id: "default", label: "Default (Inter)", googleFont: "", preview: "Inter", category: "Classic" },
  { id: "transcity", label: "Transcity", googleFont: "Playfair+Display:wght@400;500;600;700", preview: "Playfair Display", category: "Classic" },
  { id: "agraham", label: "Agraham", googleFont: "Cormorant+Garamond:wght@400;500;600;700", preview: "Cormorant Garamond", category: "Classic" },
  { id: "vertensie", label: "Vertensie", googleFont: "Raleway:wght@300;400;500;600;700", preview: "Raleway", category: "Classic" },
  { id: "runiga", label: "Runiga", googleFont: "Josefin+Sans:wght@300;400;500;600;700", preview: "Josefin Sans", category: "Classic" },
  { id: "gafiya", label: "Gafiya", googleFont: "Libre+Baskerville:wght@400;700", preview: "Libre Baskerville", category: "Classic" },
  { id: "king", label: "King", googleFont: "DM+Serif+Display:wght@400", preview: "DM Serif Display", category: "Modern" },
  { id: "banera", label: "Banera", googleFont: "Space+Grotesk:wght@300;400;500;600;700", preview: "Space Grotesk", category: "Modern" },
  { id: "sirelia", label: "Sirelia", googleFont: "Outfit:wght@300;400;500;600;700", preview: "Outfit", category: "Modern" },
  { id: "daeling", label: "Daeling", googleFont: "Sora:wght@300;400;500;600;700", preview: "Sora", category: "Modern" },
  { id: "koya", label: "Koya", googleFont: "Plus+Jakarta+Sans:wght@300;400;500;600;700", preview: "Plus Jakarta Sans", category: "Modern" },
  { id: "oreon", label: "Oreon", googleFont: "Unbounded:wght@300;400;500;600;700", preview: "Unbounded", category: "Modern" },
  { id: "remap", label: "Remap", googleFont: "JetBrains+Mono:wght@300;400;500;600;700", preview: "JetBrains Mono", category: "Modern" },
  { id: "marietta", label: "Marietta", googleFont: "Fraunces:wght@300;400;500;600;700", preview: "Fraunces", category: "Modern" },
  { id: "avinga", label: "Avinga", googleFont: "Manrope:wght@300;400;500;600;700", preview: "Manrope", category: "Modern" },
  { id: "hanoble", label: "Hanoble", googleFont: "Instrument+Serif:wght@400", preview: "Instrument Serif", category: "Modern" },
  { id: "wistle", label: "Wistle", googleFont: "Bricolage+Grotesque:wght@300;400;500;600;700", preview: "Bricolage Grotesque", category: "Modern" },
];

export interface FontConfig {
  size: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  alignment: 'left' | 'center' | 'right' | 'justify';
}

export interface ProfileData {
  id?: string;
  fullName: string;
  photoUrl: string;
  bio: string;
  headline: string;
  location: string;
  email: string;
  website: string;
  linkedinUrl: string;
  githubUrl: string;
  twitterUrl: string;
  workExperience: WorkExperience[];
  projects: Project[];
  skills: string[];
  keyHighlights: string[];
  views: number;
  resumeUrl: string;
  calendlyUrl: string;
  selectedFont: FontChoice;
  fontConfig?: FontConfig;
  username?: string;
  isPro?: boolean;
  plan_type?: string;
  subscription_id?: string;
  predictedDomain?: string;
  hidePhoto?: boolean;
  selectedTemplate:
  | "minimalist"
  | "creative"
  | "saas"
  | "dev"
  | "brutalist"
  | "academic"
  | "studio"
  | "executive"
  | "influencer"
  | "swiss"
  | "noir"
  | "modern-dark"
  | "gaspar"
  | "destello"
  | "frqncy"
  | "arpeggio"
  | "nakula"
  | "niju-bold"
  | "minimal-saas";
  full_profile?: any;
  resume_data?: any;
  profileStrength?: number;
  activePersona: Persona;
  narrativeVariants: Record<Persona, NarrativeVariant>;
}

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (updates: Partial<ProfileData>) => void;
  saveProfile: (overrides?: Partial<ProfileData>) => Promise<{ error: Error | null }>;
  loading: boolean;
  saving: boolean;
}

const defaultProfile: ProfileData = {
  fullName: "",
  photoUrl: "",
  bio: "",
  headline: "",
  location: "",
  email: "",
  website: "",
  linkedinUrl: "",
  githubUrl: "",
  twitterUrl: "",
  workExperience: [],
  projects: [],
  skills: [],
  keyHighlights: [],
  views: 0,
  resumeUrl: "",
  calendlyUrl: "",
  selectedFont: "default",
  selectedTemplate: "modern-dark",
  full_profile: null,
  resume_data: null,
  hidePhoto: false,
  activePersona: "general",
  fontConfig: { size: 'base', isBold: false, isItalic: false, isUnderline: false, alignment: 'left' },
  narrativeVariants: {
    general: { bio: "", headline: "" },
    startup: { bio: "", headline: "" },
    bigtech: { bio: "", headline: "" },
    fintech: { bio: "", headline: "" },
  },
};

/**
 * ──────────────────────────────────────────────────────────────────────────────
 * Data Migration Layer
 * ──────────────────────────────────────────────────────────────────────────────
 * Safely parses a JSON column from Supabase into the expected type.
 * Returns `fallback` on null / undefined / malformed JSON / wrong type.
 */
function safeParseJsonArray<T>(raw: unknown, fallback: T[]): T[] {
  if (raw == null) return fallback;
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function safeParseJsonObject<T extends object>(
  raw: unknown,
  fallback: T,
): T {
  if (raw == null) return fallback;
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      // Deep-merge: inject any missing keys from the fallback schema
      return { ...fallback, ...(parsed as T) };
    }
    return fallback;
  } catch {
    return fallback;
  }
}

/**
 * Merges a raw DB row into a fully-typed ProfileData object.
 * Every field is guaranteed to exist with at least its default value.
 */
function migrateProfileData(
  raw: Record<string, unknown>,
  vaultMap: Map<string, Record<string, unknown>>,
): ProfileData {
  const workExperience = safeParseJsonArray<WorkExperience>(
    raw.work_experience,
    defaultProfile.workExperience,
  );

  let projects = safeParseJsonArray<Project>(
    raw.projects,
    defaultProfile.projects,
  );

  // Enrich projects with Identity Vault scores
  projects = projects.map((p) => {
    const v = vaultMap.get(p.id);
    if (v) {
      return {
        ...p,
        proofValidationScore: (v.proof_validation_score as number) ?? 0,
        metricDensityScore: (v.metric_density_score as number) ?? 0,
        frameworkAlignmentScore: (v.framework_alignment_score as number) ?? 0,
        isVerified: (v.proof_validation_score as number) === 50,
      };
    }
    return { ...p, isVerified: false };
  });

  const fontConfig = safeParseJsonObject<FontConfig>(
    raw.font_config,
    defaultProfile.fontConfig!,
  );

  const defaultNarrativeVariants: Record<Persona, NarrativeVariant> = {
    general: { bio: (raw.bio as string) || "", headline: (raw.headline as string) || "" },
    startup: { bio: "", headline: "" },
    bigtech: { bio: "", headline: "" },
    fintech: { bio: "", headline: "" },
  };

  const narrativeVariants = safeParseJsonObject<Record<Persona, NarrativeVariant>>(
    raw.narrative_variants,
    defaultNarrativeVariants,
  );

  const keyHighlights = safeParseJsonArray<string>(
    raw.key_highlights,
    [],
  );

  const resumeData = raw.resume_data as Record<string, unknown> | null;

  return {
    id: (raw.id as string) ?? undefined,
    fullName: (raw.full_name as string) || "",
    photoUrl: (raw.photo_url as string) || "",
    bio: (raw.bio as string) || "",
    headline: (raw.headline as string) || "",
    location: (raw.location as string) || "",
    email: (raw.email as string) || "",
    website: (raw.website as string) || "",
    linkedinUrl: (raw.linkedin_url as string) || "",
    githubUrl: (raw.github_url as string) || "",
    twitterUrl: (raw.twitter_url as string) || "",
    workExperience,
    projects,
    skills: safeParseJsonArray<string>(raw.skills, []),
    keyHighlights,
    views: (raw.views as number) || 0,
    resumeUrl: (raw.resume_url as string) || "",
    calendlyUrl: (raw.calendly_url as string) || "",
    selectedFont: ((raw.selected_font as FontChoice) || "default"),
    selectedTemplate: ((raw.selected_template as ProfileData["selectedTemplate"]) || "modern-dark"),
    username: (raw.username as string) || "",
    isPro: (raw.is_pro as boolean) || false,
    predictedDomain: (raw.predicted_domain as string) || "",
    hidePhoto: (raw.hide_photo as boolean) || false,
    full_profile: raw.full_profile ?? null,
    resume_data: resumeData ?? null,
    profileStrength: (resumeData?.profileStrength as number) || 0,
    activePersona: ((raw.active_persona as Persona) || "general"),
    fontConfig,
    narrativeVariants,
  };
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(defaultProfile);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase.from("profiles").select("*, plan_type, subscription_id").eq("user_id", user.id).maybeSingle();
    const { data: vaultData, error: vaultError } = await supabase.from("identity_vault").select("*").eq("user_id", user.id);

    if (error) {
      console.error("Supabase Error Details [Profile Fetch]:", error.message, error.details, error.hint);
    }

    if (vaultError) {
      console.error("Supabase Error Details [Identity Vault Fetch]:", vaultError.message, vaultError.details, vaultError.hint);
    }

    if (data && !error) {
      const vaultMap = new Map<string, Record<string, unknown>>();
      if (vaultData) {
        vaultData.forEach((v: Record<string, unknown>) => vaultMap.set(v.project_id as string, v));
      }

      setProfile(migrateProfileData(data as Record<string, unknown>, vaultMap));
    }
    setLoading(false);
  };

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedAutoSave = useCallback((dataToSave: ProfileData) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Show saving indicator immediately
    toast.loading('Auto-saving...', { id: 'auto-save', duration: 10000 });

    saveTimeoutRef.current = setTimeout(async () => {
      const { error } = await saveProfile(dataToSave);
      if (error) {
        toast.error('Auto-save failed', { id: 'auto-save', description: error.message });
      } else {
        toast.success('Saved ✓', { id: 'auto-save', duration: 1500 });
      }
    }, 1500);
  }, [user]);

  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfile((prev) => {
      const newData = { ...prev, ...updates };
      debouncedAutoSave(newData);
      return newData;
    });
  };

  const saveProfile = async (overrides?: Partial<ProfileData>) => {
    if (!user) return { error: new Error("Not authenticated") };

    // Merge overrides with current profile so callers can save freshly-set data
    // without waiting for a React re-render
    const data = overrides ? { ...profile, ...overrides } : profile;

    setSaving(true);

    // Strip nulls from JSON array fields so Supabase never rejects the row
    const sanitizeWorkExp = (we: WorkExperience[]) => {
      if (!Array.isArray(we)) return [];
      const safeDate = (d: any): string => {
        if (!d || typeof d !== 'string') return '';
        const trimmed = d.trim();
        try {
          const date = new Date(trimmed);
          if (!isNaN(date.getTime()) && trimmed.length > 3) {
            return date.toISOString().split('T')[0];
          }
        } catch (e) { }
        return trimmed;
      };

      return we.map((w) => ({
        id: w.id || crypto.randomUUID(),
        jobTitle: w.jobTitle || '',
        company: w.company || '',
        startDate: safeDate(w.startDate),
        endDate: safeDate(w.endDate),
        current: typeof w.current === 'boolean' ? w.current : false,
        description: w.description || '',
      }));
    };

    const sanitizeProjects = (ps: Project[]) => {
      if (!Array.isArray(ps)) return [];
      return ps.map((p) => ({
        id: p.id || crypto.randomUUID(),
        title: p.title || '',
        description: p.description || '',
        link: p.link || '',
        imageUrl: p.imageUrl || '',
        visualPrompt: p.visualPrompt || '',
        techStack: Array.isArray(p.techStack) ? p.techStack : [],
        targetKeywords: Array.isArray(p.targetKeywords) ? p.targetKeywords : [],
        visible: typeof p.visible === 'boolean' ? p.visible : true,
        docsUrl: p.docsUrl || '',
        isProtected: p.isProtected || false,
        password: p.password || '',
        references: Array.isArray(p.references) ? p.references : [],
        proofOfImpact: p.proofOfImpact || '',
        verifiedImpact: typeof p.verifiedImpact === 'boolean' ? p.verifiedImpact : false,
        isVerified: typeof p.isVerified === 'boolean' ? p.isVerified : false,
        proofValidationScore: p.proofValidationScore || 0,
        metricDensityScore: p.metricDensityScore || 0,
        frameworkAlignmentScore: p.frameworkAlignmentScore || 0,
      }));
    };

    const sanitizedProjects = sanitizeProjects(data.projects);

    // Dynamic Centralized Scoring for Identity Vault
    const vaultPayload = sanitizedProjects.map((p) => {
      const desc = p.description || '';
      // Hardened Regex for Metric Density: supports commas, decimals, and impact units
      const metricRegex = /(?:\$)?\d+(?:,\d{3})*(?:\.\d+)?(?:k|K|m|M|b|B|ms|s|pps|%|\s*ROI|\s*latency|\s*conversion|\s*ARR)?\b/gi;
      const metricsCount = (typeof desc === 'string' ? (desc.match(metricRegex) || []).length : 0);
      const metricDensityScore = Math.min(30, metricsCount * 10);
      
      // Hardened Framework Check: synonyms for RICE, HEART, STAR
      const frameworkRegex = /\b(reach|impact|confidence|effort|happiness|engagement|adoption|retention|task success|situation|task|action|result|prioritization|metric|increased|decreased|orchestrated|star method|rice framework)\b/gi;
      const frameworkCount = (typeof desc === 'string' ? (desc.match(frameworkRegex) || []).length : 0);
      const frameworkAlignmentScore = Math.min(20, frameworkCount * 5);
      
      let proofValidationScore = 0;
      const proofUrl = p.proofOfImpact || '';
      if (proofUrl.length > 5 && (proofUrl.includes('github') || proofUrl.includes('linkedin') || proofUrl.includes('figma') || proofUrl.includes('loom') || proofUrl.includes('portfolio'))) {
        proofValidationScore = 50;
      }
      
      const compositeTrustScore = metricDensityScore + frameworkAlignmentScore + proofValidationScore;

      // Update the payload model in-memory for immediate UI reflection and saving to profiles JSONB
      p.metricDensityScore = metricDensityScore;
      p.frameworkAlignmentScore = frameworkAlignmentScore;
      p.proofValidationScore = proofValidationScore;
      p.isVerified = proofValidationScore === 50;
      
      return {
        user_id: user.id,
        project_id: p.id,
        proof_validation_score: proofValidationScore,
        metric_density_score: metricDensityScore,
        framework_alignment_score: frameworkAlignmentScore,
        composite_trust_score: compositeTrustScore
      };
    });

    try {
       // Fire and forget identity_vault upsert to prevent auth blocking
       if (vaultPayload.length > 0) {
           supabase.from('identity_vault').upsert(vaultPayload, { onConflict: 'project_id' }).then();
       }
    } catch(e) {}

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: data.fullName,
        photo_url: data.photoUrl,
        bio: data.bio,
        headline: data.headline,
        location: data.location,
        email: data.email,
        website: data.website,
        linkedin_url: data.linkedinUrl,
        github_url: data.githubUrl,
        twitter_url: data.twitterUrl,
        work_experience: sanitizeWorkExp(data.workExperience) as unknown as Json,
        projects: sanitizedProjects as unknown as Json,
        skills: Array.isArray(data.skills) ? data.skills : [],
        key_highlights: Array.isArray(data.keyHighlights) ? data.keyHighlights : [],
        resume_url: data.resumeUrl,
        calendly_url: data.calendlyUrl,
        hide_photo: data.hidePhoto,
        selected_font: data.selectedFont,
        selected_template: data.selectedTemplate,
        resume_data: { ...(data.resume_data || {}), profileStrength: data.profileStrength },
        active_persona: data.activePersona,
        font_config: data.fontConfig,
        narrative_variants: data.narrativeVariants,
      } as any)
      .eq("user_id", user.id);

    setSaving(false);
    return { error: error as Error | null };
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, saveProfile, loading, saving }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
