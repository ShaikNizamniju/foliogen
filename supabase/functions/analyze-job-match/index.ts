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
  requireProSecrets,
  requireMinimumTier,
  resolveTier,
} from "../_shared/security.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify Pro secrets are configured
    const secretGate = requireProSecrets();
    if (secretGate) return secretGate;

    const { jobDescription } = await req.json();

    // ── Allow-list validation ────────────────────────────────────────────
    const jdCheck = validateText(jobDescription, "Job description", 10000, 20);
    if (!jdCheck.valid) return validationError(jdCheck.error!);

    // Authenticate
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return errorResponse("Authorization required", 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return errorResponse("User not authenticated", 401);
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) {
      return errorResponse("Profile not found. Please complete your profile first.", 404);
    }

    // Resolve tier and enforce Pro minimum
    const tier = resolveTier(profile.is_pro, (profile as any).plan_type);
    const tierGate = requireMinimumTier(tier, 'PRO');
    if (tierGate) return tierGate;

    // Tier-based rate limiting
    const ip = getClientIP(req);
    const { allowed, retryAfterSeconds } = checkTieredRateLimit(`jobmatch:${user.id || ip}`, tier);
    if (!allowed) return rateLimitedResponse(retryAfterSeconds, tier);

    const profileData = {
      name: profile.full_name || "Candidate",
      headline: profile.headline || "",
      bio: profile.bio || "",
      skills: profile.skills || [],
      workExperience: profile.work_experience || [],
      projects: profile.projects || [],
      location: profile.location || "",
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

    const systemPrompt = `You are an elite Career Strategist Agent. Your goal is to maximize the user's chance of getting hired.

You will analyze a candidate's profile against a job description and provide strategic insights.

CANDIDATE PROFILE:
${JSON.stringify(profileData, null, 2)}

JOB DESCRIPTION OR URL:
${jobDescription}

Your task is to:
1. If the input is a URL, you should try to infer the requirements from it if you can fetch it, OR provide a generic functional framework.
2. Calculate a match score (0-100) based on how well the candidate's skills, experience, and background align with the job requirements.
2. Identify exactly 3 critical keywords or skills from the job description that are missing from the candidate's profile.
3. Write a compelling 1-paragraph "Why Me?" pitch (3-4 sentences) that bridges the candidate's specific experience to the job's biggest pain points.

Be strategic and specific. Reference actual details from both the profile and job description.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Analyze this job match and provide your strategic assessment." },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "job_match_analysis",
              description: "Provide structured job match analysis results",
              parameters: {
                type: "object",
                properties: {
                  matchScore: {
                    type: "number",
                    description: "Match score from 0-100",
                  },
                  missingKeywords: {
                    type: "array",
                    items: { type: "string" },
                    description: "Exactly 3 critical skills or keywords missing",
                  },
                  tailoredPitch: {
                    type: "string",
                    description: "A compelling 1-paragraph 'Why Me?' pitch",
                  },
                  scoreBreakdown: {
                    type: "object",
                    properties: {
                      skillsMatch: { type: "number" },
                      experienceMatch: { type: "number" },
                      overallFit: { type: "string" },
                    },
                    required: ["skillsMatch", "experienceMatch", "overallFit"],
                  },
                },
                required: ["matchScore", "missingKeywords", "tailoredPitch", "scoreBreakdown"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "job_match_analysis" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "60" } }
        );
      }
      if (response.status === 402) {
        return errorResponse("AI credits exhausted. Please add more credits.", 402);
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      return errorResponse("AI analysis failed", 500);
    }

    const aiResponse = await response.json();
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "job_match_analysis") {
      console.error("Unexpected AI response format:", aiResponse);
      return errorResponse("AI returned unexpected format", 500);
    }

    const analysisResult = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("analyze-job-match error:", error);
    return errorResponse("An unexpected error occurred", 500);
  }
});
