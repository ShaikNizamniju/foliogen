import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { Json } from '@/integrations/supabase/types';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

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
  selectedTemplate: 'minimalist' | 'creative' | 'aipm' | 'dev' | 'brutalist' | 'academic' | 'studio' | 'executive' | 'influencer' | 'swiss' | 'noir';
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (updates: Partial<ProfileData>) => void;
  saveProfile: () => Promise<{ error: Error | null }>;
  loading: boolean;
  saving: boolean;
  saveStatus: SaveStatus;
  initializeProfile: () => Promise<void>;
  initializing: boolean;
}

const defaultProfile: ProfileData = {
  fullName: '',
  photoUrl: '',
  bio: '',
  headline: '',
  location: '',
  email: '',
  website: '',
  linkedinUrl: '',
  githubUrl: '',
  twitterUrl: '',
  workExperience: [],
  projects: [],
  skills: [],
  keyHighlights: [],
  views: 0,
  selectedTemplate: 'minimalist',
  metaTitle: '',
  metaDescription: '',
  metaKeywords: [],
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [initializing, setInitializing] = useState(false);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const saveStatusTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfileWithRetry();
    } else {
      setProfile(defaultProfile);
      setLoading(false);
      setHasLoadedInitial(false);
    }
  }, [user]);

  // Debounced auto-save effect
  useEffect(() => {
    // Don't auto-save if profile hasn't loaded yet or there's no profile ID
    if (!hasLoadedInitial || !profile.id || loading) return;

    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new timer for 1 second debounce
    debounceTimerRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      const { error } = await saveProfile();
      
      if (error) {
        setSaveStatus('error');
      } else {
        setSaveStatus('saved');
        // Reset to idle after 2 seconds
        if (saveStatusTimerRef.current) {
          clearTimeout(saveStatusTimerRef.current);
        }
        saveStatusTimerRef.current = setTimeout(() => {
          setSaveStatus('idle');
        }, 2000);
      }
    }, 1000);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [profile, hasLoadedInitial, loading]);

  const fetchProfileWithRetry = async (attempt = 1, maxAttempts = 3) => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
        return;
      }

      // If no profile exists, auto-create one (handles truncated DB case)
      if (!data) {
        if (attempt < maxAttempts) {
          // First few attempts: wait for trigger (in case of new signup)
          await new Promise(resolve => setTimeout(resolve, 1000));
          return fetchProfileWithRetry(attempt + 1, maxAttempts);
        }
        
        // After retries, create profile manually
        console.log('No profile found. Creating new one...');
        const authName = user?.user_metadata?.full_name || user?.user_metadata?.name || '';
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ 
            user_id: user.id, 
            email: user.email || '',
            full_name: authName 
          }])
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating profile:', createError);
          setLoading(false);
          return;
        }
        
        if (newProfile) {
          mapProfileData(newProfile, authName);
          setHasLoadedInitial(true);
        }
        setLoading(false);
        return;
      }

      // Get auth name from user metadata to auto-fill if profile name is empty
      const authName = user?.user_metadata?.full_name || user?.user_metadata?.name || '';
      mapProfileData(data, authName);
      setHasLoadedInitial(true);
    } catch (err) {
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const mapProfileData = (data: any, authName?: string) => {
    const workExp = Array.isArray(data.work_experience) 
      ? (data.work_experience as unknown as WorkExperience[]) 
      : [];
    const proj = Array.isArray(data.projects) 
      ? (data.projects as unknown as Project[]) 
      : [];
    
    const keyHighlights = Array.isArray(data.key_highlights) 
      ? data.key_highlights as string[]
      : [];
    
    // Auto-fill name from auth if profile name is empty
    const fullName = data.full_name || authName || '';
    
    setProfile({
      id: data.id,
      fullName,
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
      metaTitle: data.meta_title || '',
      metaDescription: data.meta_description || '',
      metaKeywords: data.meta_keywords || [],
    });
  };

  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const initializeProfile = async () => {
    if (!user) return;
    
    setInitializing(true);
    
    try {
      // Try to create a new profile for the user
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          email: user.email || '',
          full_name: '',
        })
        .select()
        .single();
      
      if (error) {
        // If profile already exists, try fetching it
        if (error.code === '23505') {
          await fetchProfileWithRetry();
        } else {
          console.error('Error creating profile:', error);
        }
      } else if (data) {
        mapProfileData(data);
      }
    } catch (err) {
      console.error('Profile initialization error:', err);
    } finally {
      setInitializing(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return { error: new Error('Not authenticated') };
    
    setSaving(true);
    
    const { error } = await supabase
      .from('profiles')
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
      .eq('user_id', user.id);

    setSaving(false);
    return { error: error as Error | null };
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, saveProfile, loading, saving, saveStatus, initializeProfile, initializing }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
