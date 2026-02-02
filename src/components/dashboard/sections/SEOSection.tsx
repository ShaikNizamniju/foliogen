import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, Image, X, Save, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SEOData {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
}

export function SEOSection() {
  const { user } = useAuth();
  const [seoData, setSeoData] = useState<SEOData>({
    metaTitle: '',
    metaDescription: '',
    metaKeywords: []
  });
  const [keywordInput, setKeywordInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSEOData();
    }
  }, [user]);

  const fetchSEOData = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('meta_title, meta_description, meta_keywords, full_name, headline')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!error && data) {
      setSeoData({
        metaTitle: (data as any).meta_title || data.full_name || '',
        metaDescription: (data as any).meta_description || data.headline || '',
        metaKeywords: (data as any).meta_keywords || []
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        meta_title: seoData.metaTitle,
        meta_description: seoData.metaDescription,
        meta_keywords: seoData.metaKeywords
      } as any)
      .eq('user_id', user.id);

    if (error) {
      toast.error('Failed to save SEO settings');
    } else {
      toast.success('SEO settings saved!');
    }
    setSaving(false);
  };

  const addKeyword = () => {
    const keyword = keywordInput.trim().toLowerCase();
    if (keyword && !seoData.metaKeywords.includes(keyword)) {
      setSeoData(prev => ({
        ...prev,
        metaKeywords: [...prev.metaKeywords, keyword]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setSeoData(prev => ({
      ...prev,
      metaKeywords: prev.metaKeywords.filter(k => k !== keyword)
    }));
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  // SEO score calculation
  const calculateSEOScore = () => {
    let score = 0;
    const checks = [];

    // Title check (50-60 chars ideal)
    if (seoData.metaTitle.length > 0) {
      score += 20;
      if (seoData.metaTitle.length >= 50 && seoData.metaTitle.length <= 60) {
        score += 10;
        checks.push({ label: 'Title length is optimal (50-60 chars)', passed: true });
      } else if (seoData.metaTitle.length < 50) {
        checks.push({ label: 'Title could be longer (aim for 50-60 chars)', passed: false });
      } else {
        checks.push({ label: 'Title is too long (keep under 60 chars)', passed: false });
      }
    } else {
      checks.push({ label: 'Add a meta title', passed: false });
    }

    // Description check (150-160 chars ideal)
    if (seoData.metaDescription.length > 0) {
      score += 20;
      if (seoData.metaDescription.length >= 150 && seoData.metaDescription.length <= 160) {
        score += 10;
        checks.push({ label: 'Description length is optimal (150-160 chars)', passed: true });
      } else if (seoData.metaDescription.length < 150) {
        checks.push({ label: 'Description could be longer (aim for 150-160 chars)', passed: false });
      } else {
        checks.push({ label: 'Description is too long (keep under 160 chars)', passed: false });
      }
    } else {
      checks.push({ label: 'Add a meta description', passed: false });
    }

    // Keywords check
    if (seoData.metaKeywords.length >= 3) {
      score += 20;
      checks.push({ label: 'Good number of keywords', passed: true });
    } else if (seoData.metaKeywords.length > 0) {
      score += 10;
      checks.push({ label: 'Add more keywords (aim for 3-5)', passed: false });
    } else {
      checks.push({ label: 'Add some keywords', passed: false });
    }

    return { score, checks };
  };

  const { score, checks } = calculateSEOScore();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">SEO Settings</h1>
        <p className="text-muted-foreground">
          Optimize your portfolio for search engines and social sharing.
        </p>
      </div>

      {/* SEO Score */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Search className="h-4 w-4" />
            SEO Score
          </h3>
          <div className={`text-2xl font-bold ${score >= 70 ? 'text-green-500' : score >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
            {score}/100
          </div>
        </div>
        <div className="space-y-2">
          {checks.map((check, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              {check.passed ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              )}
              <span className={check.passed ? 'text-foreground' : 'text-muted-foreground'}>
                {check.label}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Meta Title */}
      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="metaTitle" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Meta Title
          </Label>
          <Input
            id="metaTitle"
            value={seoData.metaTitle}
            onChange={(e) => setSeoData(prev => ({ ...prev, metaTitle: e.target.value }))}
            placeholder="Your portfolio title for search engines"
            maxLength={70}
          />
          <p className="text-xs text-muted-foreground">
            {seoData.metaTitle.length}/60 characters (recommended)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDescription" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Meta Description
          </Label>
          <Textarea
            id="metaDescription"
            value={seoData.metaDescription}
            onChange={(e) => setSeoData(prev => ({ ...prev, metaDescription: e.target.value }))}
            placeholder="A compelling description of your portfolio for search results"
            rows={3}
            maxLength={200}
          />
          <p className="text-xs text-muted-foreground">
            {seoData.metaDescription.length}/160 characters (recommended)
          </p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            Keywords
          </Label>
          <div className="flex gap-2">
            <Input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleKeywordKeyDown}
              placeholder="Add a keyword and press Enter"
            />
            <Button type="button" variant="outline" onClick={addKeyword}>
              Add
            </Button>
          </div>
          {seoData.metaKeywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {seoData.metaKeywords.map(keyword => (
                <Badge key={keyword} variant="secondary" className="gap-1">
                  {keyword}
                  <button onClick={() => removeKeyword(keyword)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Preview */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Search Preview
        </h3>
        <div className="bg-muted/50 rounded-lg p-4 space-y-1">
          <p className="text-blue-600 text-lg hover:underline cursor-pointer truncate">
            {seoData.metaTitle || 'Your Portfolio Title'}
          </p>
          <p className="text-green-700 text-sm">
            foliogen.lovable.app/p/your-id
          </p>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {seoData.metaDescription || 'Add a description to see how your portfolio will appear in search results.'}
          </p>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save SEO Settings'}
        </Button>
      </div>
    </div>
  );
}
