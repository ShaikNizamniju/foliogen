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
  username?: string;
  isPro?: boolean;
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
  narrativeVariants: {
    general: { bio: "", headline: "" },
    startup: { bio: "", headline: "" },
    bigtech: { bio: "", headline: "" },
    fintech: { bio: "", headline: "" },
  },
};

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
    const { data, error } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
    const { data: vaultData } = await supabase.from("identity_vault").select("*").eq("user_id", user.id);

    if (data && !error) {
      const vaultMap = new Map();
      if (vaultData) {
        vaultData.forEach((v: any) => vaultMap.set(v.project_id, v));
      }

      const workExp = Array.isArray(data.work_experience) ? (data.work_experience as unknown as WorkExperience[]) : [];
      let proj = Array.isArray(data.projects) ? (data.projects as unknown as Project[]) : [];

      proj = proj.map(p => {
        const v = vaultMap.get(p.id);
        if (v) {
          p.proofValidationScore = v.proof_validation_score;
          p.metricDensityScore = v.metric_density_score;
          p.frameworkAlignmentScore = v.framework_alignment_score;
          p.isVerified = p.proofValidationScore === 50;
        } else {
          p.isVerified = false;
        }
        return p;
      });

      const keyHighlights = Array.isArray((data as any).key_highlights)
        ? ((data as any).key_highlights as string[])
        : [];

      setProfile({
        id: data.id,
        fullName: data.full_name || "",
        photoUrl: data.photo_url || "",
        bio: data.bio || "",
        headline: data.headline || "",
        location: data.location || "",
        email: data.email || "",
        website: data.website || "",
        linkedinUrl: data.linkedin_url || "",
        githubUrl: data.github_url || "",
        twitterUrl: data.twitter_url || "",
        workExperience: workExp,
        projects: proj,
        skills: data.skills || [],
        keyHighlights: keyHighlights,
        views: data.views || 0,
        resumeUrl: (data as any).resume_url || "",
        calendlyUrl: (data as any).calendly_url || "",
        selectedFont: ((data as any).selected_font as FontChoice) || "default",
        selectedTemplate: (data.selected_template as ProfileData["selectedTemplate"]) || "modern-dark",
        username: (data as any).username || "",
        isPro: (data as any).is_pro || false,
        predictedDomain: (data as any).predicted_domain || "",
        hidePhoto: (data as any).hide_photo || false,
        full_profile: (data as any).full_profile || null,
        resume_data: (data as any).resume_data || null,
        profileStrength: (data as any).resume_data?.profileStrength || 0,
        activePersona: (data as any).active_persona || "general",
        narrativeVariants: (data as any).narrative_variants || {
          general: { bio: data.bio || "", headline: data.headline || "" },
          startup: { bio: "", headline: "" },
          bigtech: { bio: "", headline: "" },
          fintech: { bio: "", headline: "" },
        },
      });
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
