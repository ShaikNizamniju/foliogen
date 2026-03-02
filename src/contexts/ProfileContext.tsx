import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { Json } from "@/integrations/supabase/types";

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
}

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (updates: Partial<ProfileData>) => void;
  saveProfile: () => Promise<{ error: Error | null }>;
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

    if (data && !error) {
      const workExp = Array.isArray(data.work_experience) ? (data.work_experience as unknown as WorkExperience[]) : [];
      const proj = Array.isArray(data.projects) ? (data.projects as unknown as Project[]) : [];

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
      });
    }
    setLoading(false);
  };

  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const saveProfile = async () => {
    if (!user) return { error: new Error("Not authenticated") };

    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.fullName,
        photo_url: profile.photoUrl,
        bio: profile.bio,
        headline: profile.headline,
        location: profile.location,
        email: profile.email,
        website: profile.website,
        linkedin_url: profile.linkedinUrl,
        github_url: profile.githubUrl,
        twitter_url: profile.twitterUrl,
        work_experience: profile.workExperience as unknown as Json,
        projects: profile.projects as unknown as Json,
        skills: profile.skills,
        key_highlights: profile.keyHighlights,
        resume_url: profile.resumeUrl,
        calendly_url: profile.calendlyUrl,
        selected_font: profile.selectedFont,
        selected_template: profile.selectedTemplate,
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
