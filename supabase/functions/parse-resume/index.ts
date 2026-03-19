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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return errorResponse('Authorization required', 401);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return errorResponse('Invalid token', 401);
    }

    const userId = user.id;

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_pro, plan_type')
      .eq('user_id', userId)
      .single();

    const tier = resolveTier(profile?.is_pro, (profile as any)?.plan_type);

    const ip = getClientIP(req);
    const { allowed, retryAfterSeconds } = checkTieredRateLimit(`resume:${userId || ip}`, tier);
    if (!allowed) return rateLimitedResponse(retryAfterSeconds, tier);

    const body = await req.json();
    const resumeText = body?.resumeText;

    const textCheck = validateText(resumeText, "Resume text", 30000, 50);
    if (!textCheck.valid) return validationError(textCheck.error!);

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      return errorResponse("Server configuration error: Missing OPENAI_API_KEY", 500);
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 1000,
        messages: [
          {
            role: "system",
            content: `You are The Elite PM Narrative Engine. Your goal is Industry-Specific Narrative Transmutation.
Provide FOUR distinct narrative variants for the user based on their data.

DIALECTS:
- general: Standard professional narrative.
- startup: Use "Scrappy", "0-to-1", "Full-cycle", "Velocity", "Ambiguity". Focus on building from scratch.
- bigtech: Use "Scale", "Stakeholders", "Systems-thinking", "Process", "Cross-functional". Focus on massive user impact.
- fintech: Use "Compliance", "Security", "Scalability", "Trust", "Accuracy". Focus on risk and reliability.

INSTRUCTIONS:
1. For EACH persona, provide a 'headline' (1-sentence hook) and a 'bio' (max 3 sentences).
2. Projects: Extract the last 3 most recent projects. Rewrite descriptions to highlight "Primary Impact" framed for a Big Tech persona (scale and users).
3. Preserve Facts: DO NOT invent roles, companies, or metrics.
4. Return ONLY JSON.`
          },
          {
            role: "user",
            content: `Extract and transmute these fields into pure JSON (camelCase):
- fullName (string)
- narrativeVariants (object with keys: general, startup, bigtech, fintech. Each key contains { headline: string, bio: string })
- projects (array of objects with keys: title, description, visualPrompt)
- predictedDomain: one of "tech", "creative", "corporate", "luxury"

Resume Text (Truncated):
${resumeText.substring(0, 15000)}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' } }
        );
      }
      if (response.status === 402) {
        return errorResponse("AI credits exhausted.", 502);
      }
      return errorResponse("AI service error", 502);
    }

    const data = await response.json();

    let rawText = data.choices?.[0]?.message?.content;
    if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
      return errorResponse("AI returned an empty response. Please try again.", 502);
    }

    rawText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    let parsedProfile;
    try {
      parsedProfile = JSON.parse(rawText);
    } catch (parseError: any) {
      return errorResponse("AI response was not valid JSON. Please try again.", 502);
    }

    const skillsCount = Array.isArray(parsedProfile.skills) ? parsedProfile.skills.length : 0;
    const workCount = Array.isArray(parsedProfile.workExperience) ? parsedProfile.workExperience.length : 0;

    const parsedProjects = Array.isArray(parsedProfile.projects) ? parsedProfile.projects : [];

    // Asynchronous Identity Vault logging for initial audit
    const vaultEntries: any[] = [];
    parsedProjects.forEach((p: any) => {
      p.id = crypto.randomUUID();
      let desc = p.description || '';
      if (Array.isArray(desc)) desc = desc.join(' ');
      if (typeof desc !== 'string') desc = String(desc);
      // Metric Density: Regex specific for Impact Units ($, %, 50k, 10M, 150ms)
      const metricRegex = /(?:\$)?\d+(?:,\d{3})*(?:\.\d+)?(?:k|K|m|M|b|B|ms|s|pps|%|\s*ROI|\s*latency|\s*conversion|\s*ARR)?\b/gi;
      const metricsCount = (desc.match(metricRegex) || []).length;
      const metricDensityScore = Math.min(30, metricsCount * 10);

      // Framework Alignment: RICE / HEART / STAR synonyms (case insensitive)
      const frameworkRegex = /\b(reach|impact|confidence|effort|happiness|engagement|adoption|retention|task success|situation|task|action|result|prioritization|metric|increased|decreased|orchestrated|star method|rice framework)\b/gi;
      const frameworkCount = (desc.match(frameworkRegex) || []).length;
      const frameworkAlignmentScore = Math.min(20, frameworkCount * 5);

      p.metricDensityScore = metricDensityScore;
      p.frameworkAlignmentScore = frameworkAlignmentScore;
      p.proofValidationScore = 0;
      p.isVerified = false;

      vaultEntries.push({
        user_id: userId,
        project_id: p.id,
        proof_validation_score: 0,
        metric_density_score: metricDensityScore,
        framework_alignment_score: frameworkAlignmentScore,
        composite_trust_score: metricDensityScore + frameworkAlignmentScore
      });
    });

    // Fire and forget (asynchronously) - DO NOT await to prevent performance degradation
    if (vaultEntries.length > 0) {
      supabase.from('identity_vault').insert(vaultEntries).then();
    }

    parsedProfile.projects = parsedProjects;

    if (!parsedProfile.fullName && skillsCount === 0 && workCount === 0) {
      return errorResponse("Could not extract meaningful data from this PDF.", 422);
    }

    return new Response(JSON.stringify(parsedProfile), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error: any) {
    console.error("FATAL SERVER CRASH:", error);
    return errorResponse('Resume parsing failed. Please try again.', 500);
  }
});