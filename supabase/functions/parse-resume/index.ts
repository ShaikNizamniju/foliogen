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
      console.error("parse-resume: missing OPENAI_API_KEY secret");
      return errorResponse("Resume parsing is temporarily unavailable. Please contact support.", 503);
    }

    // Bounded timeout: OpenAI can take 40–90s on large resumes. Abort at 75s
    // so we return a clean 504 instead of hanging until the platform kills us
    // (which surfaces as an opaque "failed to fetch" on mobile).
    const aborter = new AbortController();
    const timeoutId = setTimeout(() => aborter.abort(), 75000);
    let response: Response;
    try {
      response = await fetch("https://api.openai.com/v1/chat/completions", {
      signal: aborter.signal,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 3500,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are an elite resume parsing engine. Extract STRUCTURED data from a resume and return ONLY pure JSON (no markdown).
Rules:
- Preserve facts. Never invent companies, dates, or metrics.
- Use camelCase keys. Use empty string "" or [] when a field is missing — never null.
- Dates as short strings (e.g. "Jan 2023", "2022", "Present").
- Keep arrays small and signal-rich.`
          },
          {
            role: "user",
            content: `Extract the following JSON schema from the resume below. Return ONLY the JSON object.

{
  "fullName": "string",
  "headline": "one-line professional title",
  "bio": "2-3 sentence summary",
  "location": "City, Country",
  "email": "string",
  "linkedinUrl": "string (full https URL or empty)",
  "website": "string (full https URL or empty)",
  "skills": ["string", ...up to 20 most relevant],
  "keyHighlights": ["3-5 punchy achievement pills, each <60 chars"],
  "workExperience": [
    {
      "jobTitle": "string",
      "company": "string",
      "startDate": "string",
      "endDate": "string",
      "current": false,
      "description": "1-3 sentence impact summary with metrics when present"
    }
  ],
  "projects": [
    { "title": "string", "description": "1-2 sentence outcome-driven summary", "link": "" }
  ],
  "narrativeVariants": {
    "general":  { "headline": "...", "bio": "..." },
    "startup":  { "headline": "...", "bio": "..." },
    "bigtech":  { "headline": "...", "bio": "..." },
    "fintech":  { "headline": "...", "bio": "..." }
  },
  "predictedDomain": "tech|creative|corporate|luxury"
}

Resume Text:
${resumeText.substring(0, 15000)}`
          }
        ]
      })

      });
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      if (fetchErr?.name === 'AbortError') {
        return errorResponse("AI parsing timed out. Please try again.", 504);
      }
      return errorResponse("Could not reach AI service. Please try again.", 502);
    }
    clearTimeout(timeoutId);

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