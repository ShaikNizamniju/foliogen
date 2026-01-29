import { useProfile } from '@/contexts/ProfileContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function BasicInfoForm() {
  const { profile, updateProfile } = useProfile();

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

      <div className="space-y-2">
        <Label htmlFor="photoUrl">Photo URL</Label>
        <Input
          id="photoUrl"
          placeholder="https://example.com/photo.jpg"
          value={profile.photoUrl}
          onChange={(e) => updateProfile({ photoUrl: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Paste a URL to your profile photo
        </p>
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
