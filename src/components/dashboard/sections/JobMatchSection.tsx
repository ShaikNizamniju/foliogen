import { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Sparkles, Copy, Check, AlertTriangle, Target, FileText, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface JobMatchResult {
  matchScore: number;
  missingKeywords: string[];
  tailoredPitch: string;
  scoreBreakdown: {
    skillsMatch: number;
    experienceMatch: number;
    overallFit: string;
  };
}

function RadialGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 75) return { stroke: 'stroke-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-500/10' };
    if (score >= 50) return { stroke: 'stroke-amber-500', text: 'text-amber-500', bg: 'bg-amber-500/10' };
    return { stroke: 'stroke-red-500', text: 'text-red-500', bg: 'bg-red-500/10' };
  };

  const colors = getScoreColor(score);

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted/20"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          className={cn(colors.stroke, 'transition-all duration-1000 ease-out')}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('text-3xl font-bold', colors.text)}>{score}%</span>
        <span className="text-xs text-muted-foreground">Match</span>
      </div>
    </div>
  );
}

export function JobMatchSection() {
  const { profile } = useProfile();
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<JobMatchResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    const trimmed = jobDescription.trim();
    if (!trimmed) {
      toast.error('Please paste a job description first');
      return;
    }

    // Allow URLs to be passed to the AI engine for scraping
    // (Removed the block that prevented URLs)

    if (!profile.isPro) {
      toast.error('Job Match Agent is a Pro feature. Upgrade to Pro for ₹199 to unlock.');
      return;
    }

    if (!profile.fullName && !profile.headline && profile.skills.length === 0) {
      toast.error('Please complete your profile first');
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-job-match', {
        body: { jobDescription: jobDescription.trim() },
      });

      if (error) {
        throw new Error(error.message || 'Analysis failed');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to analyze job match');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyPitch = async () => {
    if (!result?.tailoredPitch) return;
    await navigator.clipboard.writeText(result.tailoredPitch);
    setCopied(true);
    toast.success('Pitch copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreLabel = (score: number) => {
    if (score >= 75) return 'Strong Match';
    if (score >= 50) return 'Partial Match';
    return 'Low Match';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Job Match Agent</h1>
        <p className="text-muted-foreground">
          Paste a job description and let AI analyze your fit.
        </p>
      </div>

      {/* Input Section */}
      <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>Paste the job description below</span>
          </div>
          <Textarea
            placeholder="Paste the full job description here... Include requirements, responsibilities, and qualifications for the best analysis."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[200px] resize-none bg-background/50"
          />
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !jobDescription.trim()}
            className="w-full shadow-glow relative overflow-hidden group"
          >
            {isAnalyzing ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                Run Agent Analysis
              </>
            )}
            {/* Sparkle animation overlay */}
            {!isAnalyzing && (
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            )}
          </Button>
        </div>
      </Card>

      {/* Results Section - Command Center */}
      {result && (
        <div className="grid gap-4 md:grid-cols-3">
          {/* Match Score Card */}
          <Card className="p-6 border-border/50 bg-gradient-to-br from-card via-card to-primary/5 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Match Score</h3>
              </div>
              <RadialGauge score={result.matchScore} />
              <p className="text-center mt-3 text-sm font-medium">
                {getScoreLabel(result.matchScore)}
              </p>
              <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Skills Match</span>
                  <span className="font-medium text-foreground">{result.scoreBreakdown.skillsMatch}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Experience Match</span>
                  <span className="font-medium text-foreground">{result.scoreBreakdown.experienceMatch}%</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Missing Keywords Card */}
          <Card className="p-6 border-border/50 bg-gradient-to-br from-card via-card to-amber-500/5 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold">Missing Keywords</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Add these to your profile to improve your match
              </p>
              <div className="space-y-2">
                {result.missingKeywords.map((keyword, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20"
                  >
                    <Zap className="h-3 w-3 text-amber-500 flex-shrink-0" />
                    <span className="text-sm font-medium">{keyword}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Tailored Pitch Card */}
          <Card className="p-6 border-border/50 bg-gradient-to-br from-card via-card to-emerald-500/5 backdrop-blur-sm relative overflow-hidden md:col-span-1">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50" />
            <div className="relative h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-500" />
                  <h3 className="font-semibold">Your Pitch</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyPitch}
                  className="h-8 px-2"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Copy this "Why Me?" snippet for your application
              </p>
              <div className="flex-1 p-4 rounded-lg bg-background/50 border border-border/50">
                <p className="text-sm leading-relaxed">{result.tailoredPitch}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Overall Fit Summary */}
      {result && (
        <Card className="p-4 border-border/50 bg-muted/30 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Strategic Assessment</p>
              <p className="text-sm text-muted-foreground mt-1">
                {result.scoreBreakdown.overallFit}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
