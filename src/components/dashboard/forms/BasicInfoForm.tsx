import { useState, useRef } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Upload, Loader2, User } from 'lucide-react';

export function BasicInfoForm() {
  const { profile, updateProfile } = useProfile();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPG or PNG image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Create a unique file path: userId/timestamp-filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile_photos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        // Check if bucket doesn't exist
        if (uploadError.message.includes('bucket') || uploadError.message.includes('not found')) {
          toast({
            title: "Storage bucket missing",
            description: "Storage bucket missing. Please run the SQL script in Supabase to create the 'profile_photos' bucket.",
            variant: "destructive",
          });
        } else {
          throw uploadError;
        }
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile_photos')
        .getPublicUrl(fileName);

      // Update profile with new photo URL
      updateProfile({ photoUrl: publicUrl });

      toast({
        title: "Photo uploaded!",
        description: "Your profile photo has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            value={profile.fullName}
            onChange={(e) => updateProfile({ fullName: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="headline">Professional Headline</Label>
          <Input
            id="headline"
            placeholder="Senior Software Engineer"
            value={profile.headline}
            onChange={(e) => updateProfile({ headline: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Profile Photo</Label>
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-border">
            <AvatarImage src={profile.photoUrl} alt={profile.fullName || 'Profile'} />
            <AvatarFallback className="bg-muted">
              <User className="h-8 w-8 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              id="photo-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or WebP. Max 5MB.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself..."
          rows={4}
          value={profile.bio}
          onChange={(e) => updateProfile({ bio: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="San Francisco, CA"
            value={profile.location}
            onChange={(e) => updateProfile({ location: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={profile.email}
            onChange={(e) => updateProfile({ email: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          placeholder="https://johndoe.com"
          value={profile.website}
          onChange={(e) => updateProfile({ website: e.target.value })}
        />
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="font-medium text-foreground mb-4">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              placeholder="linkedin.com/in/johndoe"
              value={profile.linkedinUrl}
              onChange={(e) => updateProfile({ linkedinUrl: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              placeholder="github.com/johndoe"
              value={profile.githubUrl}
              onChange={(e) => updateProfile({ githubUrl: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              placeholder="twitter.com/johndoe"
              value={profile.twitterUrl}
              onChange={(e) => updateProfile({ twitterUrl: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
