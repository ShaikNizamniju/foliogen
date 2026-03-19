import { useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { supabase } from "@/lib/supabase_v2";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Loader2,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Zap,
  Search,
} from "lucide-react";

interface HardTruth {
  section: string;
  title: string;
  explanation: string;
  severity: "critical" | "major" | "minor";
}

const severityConfig = {
  critical: { color: "bg-red-500/10 text-red-600 border-red-500/20", icon: ShieldAlert, label: "Critical" },
  major: { color: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: AlertTriangle, label: "Major" },
  minor: { color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Zap, label: "Minor" },
};

const sectionLabels: Record<string, string> = {
  bio: "Bio",
  headline: "Headline",
  skills: "Skills",
  keyHighlights: "Key Highlights",
  workExperience: "Work Experience",
  projects: "Projects",
};

export function RecruiterAuditSection() {
  const { profile, updateProfile, saveProfile } = useProfile();
  const [jobDescription, setJobDescription] = useState("");
  const [truths, setTruths] = useState<HardTruth[]>([]);
  const [auditing, setAuditing] = useState(false);
  const [fixingIndex, setFixingIndex] = useState<number | null>(null);
  const [fixedIndices, setFixedIndices] = useState<Set<number>>(new Set());

  const runAudit = async () => {
    if (jobDescription.trim().length < 20) {
      toast.error("Please paste a complete job description (at least 20 characters).");
      return;
    }

    setAuditing(true);
    setTruths([]);
    setFixedIndices(new Set());

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const profilePayload = {
        bio: profile.bio,
        headline: profile.headline,
        skills: profile.skills,
        keyHighlights: profile.keyHighlights,
        workExperience: profile.workExperience,
        projects: profile.projects.map(p => ({
          title: p.title,
          description: p.description,
          techStack: p.techStack,
        })),
      };

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/recruiter-audit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "audit",
            jobDescription,
            profileData: profilePayload,
          }),
        }
      );

      if (!response.ok) {
        const errBody = await response.text();
        console.error("Audit error:", response.status, errBody);
        if (response.status === 429) {
          toast.error("Rate limited. Please wait a moment and try again.");
        } else if (response.status === 402) {
          toast.error("AI credits exhausted. Please top up your workspace.");
        } else {
          toast.error("Audit failed. Please try again.");
        }
        return;
      }

      const data = await response.json();
      setTruths(data.truths || []);
      if (data.truths?.length) {
        toast.success(`Found ${data.truths.length} gaps to address.`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong running the audit.");
    } finally {
      setAuditing(false);
    }
  };

  const fixTruth = async (index: number) => {
    const truth = truths[index];
    setFixingIndex(index);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const profilePayload: Record<string, any> = {
        bio: profile.bio,
        headline: profile.headline,
        skills: profile.skills,
        keyHighlights: profile.keyHighlights,
        workExperience: profile.workExperience,
        projects: profile.projects,
      };

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/recruiter-audit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "fix",
            truth,
            profileData: profilePayload,
          }),
        }
      );

      if (!response.ok) {
        const errBody = await response.text();
        console.error("Fix error:", response.status, errBody);
        toast.error("Failed to auto-fix. Please try again.");
        return;
      }

      const data = await response.json();
      const { section, result } = data;

      // Parse and apply the fix
      let parsedValue: any = result;
      if (["skills", "keyHighlights"].includes(section)) {
        try {
          parsedValue = JSON.parse(result);
        } catch {
          parsedValue = result.split("\n").map((s: string) => s.replace(/^[-•*]\s*/, "").trim()).filter(Boolean);
        }
      } else if (["workExperience", "projects"].includes(section)) {
        try {
          parsedValue = JSON.parse(result);
        } catch {
          // If parsing fails for complex types, just update descriptions
          toast.error("Could not parse the AI response. Try manually.");
          return;
        }
      }

      updateProfile({ [section]: parsedValue });
      await saveProfile({ [section]: parsedValue });

      setFixedIndices(prev => new Set(prev).add(index));
      toast.success(`"${sectionLabels[section] || section}" updated successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong applying the fix.");
    } finally {
      setFixingIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Recruiter Audit</h1>
        <p className="text-muted-foreground mt-1">
          Paste a job description and get brutally honest feedback on your portfolio gaps.
        </p>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Job Description
          </CardTitle>
          <CardDescription>
            Paste the full JD for the role you're targeting.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste the job description here…"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[160px] text-sm leading-relaxed resize-y"
          />
          <Button
            onClick={runAudit}
            disabled={auditing || jobDescription.trim().length < 20}
            className="w-full sm:w-auto min-h-[44px] gap-2"
          >
            {auditing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldAlert className="h-4 w-4" />
            )}
            {auditing ? "Analyzing…" : "Run Recruiter Audit"}
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {truths.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Missing Hard Truths
            </h2>

            {truths.map((truth, i) => {
              const config = severityConfig[truth.severity];
              const Icon = config.icon;
              const isFixed = fixedIndices.has(i);
              const isFixing = fixingIndex === i;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={`border ${isFixed ? "border-emerald-500/30 bg-emerald-500/5" : "border-border/50"}`}>
                    <CardContent className="pt-5 pb-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`p-2 rounded-lg shrink-0 ${config.color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-semibold text-sm">{truth.title}</h3>
                              <Badge variant="outline" className={`text-xs ${config.color}`}>
                                {config.label}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {sectionLabels[truth.section] || truth.section}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {truth.explanation}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        {isFixed ? (
                          <Button variant="ghost" size="sm" disabled className="gap-1.5 text-emerald-600">
                            <CheckCircle2 className="h-4 w-4" />
                            Applied
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => fixTruth(i)}
                            disabled={isFixing || fixingIndex !== null}
                            className="gap-1.5 min-h-[44px] sm:min-h-[36px]"
                          >
                            {isFixing ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Sparkles className="h-3.5 w-3.5" />
                            )}
                            {isFixing ? "Rewriting…" : "Auto-Fix with AI"}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
