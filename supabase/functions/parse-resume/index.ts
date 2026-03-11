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

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return errorResponse("Server configuration error", 500);
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are The Elite PM Narrative Engine, an elite Career Strategist specializing in high-impact, cinematic professional narratives. Your objective is to transform raw resume data into a narrative that positions the user as a top 1% candidate, using a 'Noir-Professional' tone—sophisticated, authoritative, data-driven, and slightly dramatic. Avoid generic corporate jargon.

CRITICAL INSTRUCTIONS & LOGIC:
- Quantify all achievements using the HEART (Happiness, Engagement, Adoption, Retention, Task Success) and STAR (Situation, Task, Action, Result) frameworks. For example, instead of 'Managed a team,' use 'Orchestrated a cross-functional squad of 15 to deliver [X] outcome, resulting in a [Y]% increase in [Metric].'

NEGATIVE PROMPTING (Strictly Prohibited):
- NO 'fluff' words: avoid 'passionate,' 'hard-working,' 'team player,' or 'motivated.'
- NO passive voice: every sentence must start with a strong action verb.
- NO blocks of text longer than 3 lines; use strategic white space to maintain readability.
- NO generic templates; the output must feel bespoke to the specific user's data.
- NO hallucination: If the resume does not provide a specific number, describe impact qualitatively. NEVER fabricate percentages, user counts, revenue figures, or team sizes not present in the source text.
- NO banned words: NEVER use 'passionate,' 'synergy,' 'motivated,' 'hard-working,' 'team player,' 'leverage,' or 'utilize.'

CRITICAL: Return ONLY raw JSON. No markdown, no backticks, no code fences.
CRITICAL: All keys MUST be camelCase to match the TypeScript interface.`
          },
          {
            role: "user",
            content: `Extract these fields into pure JSON (camelCase keys only):
- fullName (string), location (string), email (string), linkedinUrl (string)
- headline (string): The Hook. A 1-sentence 'Executive Headline' that defines their unique value prop (e.g., 'An AI Product Strategist specializing in zero-to-one platform scaling.').
- bio (string): A short professional summary matching the Noir-Professional tone.
- skills (array of strings): The Tech Stack. Provide a categorized list of tools and frameworks, styled with a minimalist Noir aesthetic (e.g., 'Frontend | React, Next.js').
- workExperience (array of objects with keys: jobTitle, company, startDate, endDate, current, description): Use the HEART and STAR frameworks to rewrite their experience.
- projects (array of objects with keys: title, description, visualPrompt). The Deep-Dive: 3-4 bullet points per project that highlight technical complexity and business impact. For visualPrompt: generate a 2-4 word visual description for AI image generation.
- keyHighlights (array of 3-5 short, punchy strings, max 10 words each. Candidate's strongest selling points or impressive metrics.)
- predictedDomain: Predict the professional domain. Must be exactly one of: "tech", "creative", "corporate", "luxury".

Return ONLY raw JSON. No markdown, no backticks, no explanation.

Resume Text:
${resumeText.substring(0, 30000)}`
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
    } catch {
      return errorResponse("AI response was not valid JSON. Please try again.", 502);
    }

    const skillsCount = Array.isArray(parsedProfile.skills) ? parsedProfile.skills.length : 0;
    const projectsCount = Array.isArray(parsedProfile.projects) ? parsedProfile.projects.length : 0;
    const workCount = Array.isArray(parsedProfile.workExperience) ? parsedProfile.workExperience.length : 0;

    if (!parsedProfile.fullName && skillsCount === 0 && workCount === 0) {
      return errorResponse("Could not extract meaningful data from this PDF.", 422);
    }

    return new Response(JSON.stringify(parsedProfile), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    return errorResponse("An unexpected error occurred", 500);
  }
});
