import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  corsHeaders,
  checkTieredRateLimit,
  rateLimitedResponse,
  getClientIP,
  validateText,
  validationError,
  errorResponse,
  resolveTier,
} from "../_shared/security.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return errorResponse("Authorization required", 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return errorResponse("Invalid token", 401);

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_pro, plan_type")
      .eq("user_id", user.id)
      .single();

    const tier = resolveTier(profile?.is_pro, (profile as any)?.plan_type);
    const ip = getClientIP(req);
    const { allowed, retryAfterSeconds } = checkTieredRateLimit(`audit:${user.id || ip}`, tier);
    if (!allowed) return rateLimitedResponse(retryAfterSeconds, tier);

    const { action, jobDescription, profileData, truthIndex, truth } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
    if (!LOVABLE_API_KEY) return errorResponse("AI service not configured", 500);

    if (action === "audit") {
      // ── Audit: find 3 hard truths ──
      const jdCheck = validateText(jobDescription, "Job description", 8000, 20);
      if (!jdCheck.valid) return validationError(jdCheck.error!);

      const systemPrompt = `You are a brutally honest senior recruiter who reviews portfolios against job descriptions.

Given the candidate's portfolio data and a target job description, identify EXACTLY 3 "Hard Truths" — real, specific gaps that would cause a hiring manager to pass on this candidate.

For each truth, specify:
- "section": which portfolio field to fix (one of: "bio", "headline", "skills", "keyHighlights", "workExperience", "projects")
- "title": a short, punchy gap title (max 8 words)
- "explanation": 2-3 sentences explaining the gap and why it matters
- "severity": "critical" | "major" | "minor"

Return ONLY valid JSON array of 3 objects. No markdown, no filler.`;

      const userContent = `PORTFOLIO:\n${JSON.stringify(profileData, null, 2)}\n\nJOB DESCRIPTION:\n${jobDescription}`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent },
          ],
          tools: [{
            type: "function",
            function: {
              name: "report_hard_truths",
              description: "Return exactly 3 hard truths about the portfolio.",
              parameters: {
                type: "object",
                properties: {
                  truths: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        section: { type: "string", enum: ["bio", "headline", "skills", "keyHighlights", "workExperience", "projects"] },
                        title: { type: "string" },
                        explanation: { type: "string" },
                        severity: { type: "string", enum: ["critical", "major", "minor"] },
                      },
                      required: ["section", "title", "explanation", "severity"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["truths"],
                additionalProperties: false,
              },
            },
          }],
          tool_choice: { type: "function", function: { name: "report_hard_truths" } },
        }),
      });

      if (!response.ok) {
        if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (response.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        return errorResponse("AI service failed", 500);
      }

      const aiData = await response.json();
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      let truths = [];
      try {
        truths = JSON.parse(toolCall.function.arguments).truths;
      } catch {
        return errorResponse("Failed to parse AI response", 500);
      }

      return new Response(JSON.stringify({ truths }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "fix") {
      // ── Fix: rewrite the specified section ──
      if (!truth || !profileData) return errorResponse("Missing truth or profile data", 400);

      const section = truth.section;
      const currentValue = profileData[section];

      const systemPrompt = `You are a Career Infrastructure AI specializing in portfolio optimization for Product Managers.

The recruiter identified this gap: "${truth.title}" — ${truth.explanation}

Your task: Rewrite the "${section}" section of the portfolio to directly address this gap.

RULES:
1. Use STAR/HEART/RICE frameworks where applicable.
2. Never invent metrics. If the original has no numbers, write "Impact: High-complexity feature orchestration" instead.
3. Never use words like 'passionate', 'collaborative', 'synergy'.
4. Return ONLY the rewritten content — no commentary, no labels.
5. For array fields (skills, keyHighlights), return a JSON array of strings.
6. For workExperience/projects, return the full JSON array with the improved descriptions.
7. For string fields (bio, headline), return plain text.`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Current "${section}" value:\n${JSON.stringify(currentValue, null, 2)}` },
          ],
        }),
      });

      if (!response.ok) {
        if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        return errorResponse("AI fix failed", 500);
      }

      const aiData = await response.json();
      const result = aiData.choices?.[0]?.message?.content?.trim() || "";

      return new Response(JSON.stringify({ section, result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return errorResponse("Invalid action", 400);
  } catch (error: any) {
    console.error("Recruiter audit error:", error);
    return errorResponse("An unexpected error occurred", 500);
  }
});
