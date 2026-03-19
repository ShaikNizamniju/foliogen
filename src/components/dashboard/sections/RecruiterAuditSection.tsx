import { useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { usePro } from "@/contexts/ProContext";
import { supabase } from "@/lib/supabase_v2";
import { useAuth } from "@/contexts/AuthContext";
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
  X,
  Lock,
  Crown,
  ArrowRight,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuditHistoryTimeline } from "./AuditHistoryTimeline";

interface HardTruth {
  section: string;
  title: string;
  explanation: string;
  severity: "critical" | "major" | "minor";
  recommended_fix: string;
}

interface DiffPreview {
  index: number;
  section: string;
  oldValue: string;
  newValue: string;
  parsedValue: unknown;
}

const severityConfig = {
  critical: { color: "bg-destructive/10 text-destructive border-destructive/20", icon: ShieldAlert, label: "Critical" },
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

function formatValueForDisplay(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    if (value.length === 0) return "(empty)";
    if (typeof value[0] === "string") return value.join(", ");
    return JSON.stringify(value, null, 2);
  }
  return JSON.stringify(value, null, 2);
}

function ProGateOverlay() {
  const navigate = useNavigate();
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-md bg-background/60 rounded-xl">
      <div className="text-center space-y-4 max-w-sm px-6">
        <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          <Lock className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-xl font-bold tracking-tight text-foreground">
          Unlock Recruiter Audit
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Get brutally honest gap analysis against any job description with AI-powered auto-fix.
        </p>
        <Button
          onClick={() => navigate("/dashboard?section=billing")}
          className="gap-2 min-h-[44px]"
        >
          <Crown className="h-4 w-4" />
          Upgrade to Sprint Pass
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function DiffView({ diff, onAccept, onDecline, accepting }: {
  diff: DiffPreview;
  onAccept: () => void;
  onDecline: () => void;
  accepting: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <Card className="border-primary/20 bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            Impact Preview — {sectionLabels[diff.section] || diff.section}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Badge variant="outline" className="text-xs bg-destructive/5 text-destructive border-destructive/20">
                Before
              </Badge>
              <pre className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 whitespace-pre-wrap break-words max-h-48 overflow-y-auto leading-relaxed font-sans">
                {diff.oldValue || "(empty)"}
              </pre>
            </div>
            <div className="space-y-1.5">
              <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                After (AI Rewrite)
              </Badge>
              <pre className="text-xs text-foreground bg-emerald-500/5 rounded-lg p-3 whitespace-pre-wrap break-words max-h-48 overflow-y-auto leading-relaxed font-sans border border-emerald-500/10">
                {diff.newValue}
              </pre>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDecline}
              disabled={accepting}
              className="gap-1.5 min-h-[44px] sm:min-h-[36px]"
            >
              <X className="h-3.5 w-3.5" />
              Decline
            </Button>
            <Button
              size="sm"
              onClick={onAccept}
              disabled={accepting}
              className="gap-1.5 min-h-[44px] sm:min-h-[36px]"
            >
              {accepting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              {accepting ? "Saving…" : "Accept Mission"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function RecruiterAuditSection() {
  const { profile, updateProfile, saveProfile } = useProfile();
  const { isPro } = usePro();
  const { user } = useAuth();
  const [jobDescription, setJobDescription] = useState("");
  const [truths, setTruths] = useState<HardTruth[]>([]);
  const [auditing, setAuditing] = useState(false);
  const [fixingIndex, setFixingIndex] = useState<number | null>(null);
  const [fixedIndices, setFixedIndices] = useState<Set<number>>(new Set());
  const [declinedIndices, setDeclinedIndices] = useState<Set<number>>(new Set());
  const [activeDiff, setActiveDiff] = useState<DiffPreview | null>(null);
  const [acceptingDiff, setAcceptingDiff] = useState(false);

  const runAudit = async () => {
    if (jobDescription.trim().length < 20) {
      toast.error("Please paste a complete job description (at least 20 characters).");
      return;
    }

    setAuditing(true);
    setTruths([]);
    setFixedIndices(new Set());
    setDeclinedIndices(new Set());
    setActiveDiff(null);

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
        toast.success(`Found ${data.truths.length} missions to address.`);
      }
    } catch {
      toast.error("Something went wrong running the audit.");
    } finally {
      setAuditing(false);
    }
  };

  const generateFix = async (index: number) => {
    const truth = truths[index];
    setFixingIndex(index);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const profilePayload: Record<string, unknown> = {
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
        toast.error("Failed to generate fix. Please try again.");
        return;
      }

      const data = await response.json();
      const { section, result } = data;

      let parsedValue: unknown = result;
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
          toast.error("Could not parse the AI response. Try manually.");
          return;
        }
      }

      const currentValue = profilePayload[section];
      setActiveDiff({
        index,
        section,
        oldValue: formatValueForDisplay(currentValue),
        newValue: formatValueForDisplay(parsedValue),
        parsedValue,
      });
    } catch {
      toast.error("Something went wrong generating the fix.");
    } finally {
      setFixingIndex(null);
    }
  };

  const acceptDiff = async () => {
    if (!activeDiff) return;
    setAcceptingDiff(true);

    try {
      const { section, parsedValue, index } = activeDiff;
      updateProfile({ [section]: parsedValue });
      await saveProfile({ [section]: parsedValue });

      // Log to chat_queries for audit history
      if (user) {
        await supabase.from("chat_queries").insert({
          profile_user_id: user.id,
          visitor_question: `[Recruiter Audit] Accepted fix for "${sectionLabels[section] || section}": ${truths[index]?.title}`,
          ai_response: typeof parsedValue === "string" ? parsedValue : JSON.stringify(parsedValue),
        } as Record<string, unknown>);
      }

      setFixedIndices(prev => new Set(prev).add(index));
      setActiveDiff(null);
      toast.success(`"${sectionLabels[section] || section}" updated successfully!`);
    } catch {
      toast.error("Something went wrong applying the fix.");
    } finally {
      setAcceptingDiff(false);
    }
  };

  const declineDiff = () => {
    if (activeDiff) {
      setDeclinedIndices(prev => new Set(prev).add(activeDiff.index));
      setActiveDiff(null);
      toast.info("Mission declined.");
    }
  };

  const completedCount = fixedIndices.size;
  const totalCount = truths.length;

  return (
    <div className="space-y-6 relative">
      {/* Pro Gate Overlay */}
      {!isPro && (
        <ProGateOverlay />
      )}

      <div className={!isPro ? "blur-sm pointer-events-none select-none" : ""}>
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
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Mission Board
                </h2>
                {totalCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {completedCount}/{totalCount} Completed
                  </Badge>
                )}
              </div>

              {truths.map((truth, i) => {
                const config = severityConfig[truth.severity];
                const Icon = config.icon;
                const isFixed = fixedIndices.has(i);
                const isDeclined = declinedIndices.has(i);
                const isFixing = fixingIndex === i;
                const isDiffActive = activeDiff?.index === i;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="space-y-2"
                  >
                    <Card className={`border ${isFixed ? "border-emerald-500/30 bg-emerald-500/5" : isDeclined ? "border-muted/50 opacity-60" : "border-border/50"}`}>
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
                              {truth.recommended_fix && (
                                <p className="text-xs text-primary/80 mt-1.5 leading-relaxed">
                                  💡 {truth.recommended_fix}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          {isFixed ? (
                            <Button variant="ghost" size="sm" disabled className="gap-1.5 text-emerald-600">
                              <CheckCircle2 className="h-4 w-4" />
                              Completed
                            </Button>
                          ) : isDeclined ? (
                            <Button variant="ghost" size="sm" disabled className="gap-1.5 text-muted-foreground">
                              <X className="h-4 w-4" />
                              Declined
                            </Button>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setDeclinedIndices(prev => new Set(prev).add(i));
                                  toast.info("Mission declined.");
                                }}
                                disabled={isFixing || fixingIndex !== null}
                                className="gap-1.5 min-h-[44px] sm:min-h-[36px] text-muted-foreground"
                              >
                                <X className="h-3.5 w-3.5" />
                                Decline
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => generateFix(i)}
                                disabled={isFixing || fixingIndex !== null}
                                className="gap-1.5 min-h-[44px] sm:min-h-[36px]"
                              >
                                {isFixing ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Sparkles className="h-3.5 w-3.5" />
                                )}
                                {isFixing ? "Generating…" : "Accept Mission"}
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <AnimatePresence>
                      {isDiffActive && activeDiff && (
                        <DiffView
                          diff={activeDiff}
                          onAccept={acceptDiff}
                          onDecline={declineDiff}
                          accepting={acceptingDiff}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Audit History Memory Layer */}
      <AuditHistoryTimeline />
    </div>
  );
}
