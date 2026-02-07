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

export interface Project {
  id: string;
  title: string;
  link: string;
  imageUrl: string;
  description: string;
  visualPrompt?: string;
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
    | "modern-dark";
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
  selectedTemplate: "minimalist",
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
        selectedTemplate: (data.selected_template as ProfileData["selectedTemplate"]) || "minimalist",
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
selectedTemplate: "minimalist" |
  "creative" |
  "saas" |
  "dev" |
  "brutalist" |
  "academic" |
  "studio" |
  "executive" |
  "influencer" |
  "swiss" |
  "noir" |
  "modern-dark";
