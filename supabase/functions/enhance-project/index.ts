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
  sanitize,
} from "../_shared/security.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify Pro secrets are configured before any processing
    const secretGate = requireProSecrets();
    if (secretGate) return secretGate;

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return errorResponse('Authorization required', 401);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return errorResponse('Invalid token', 401);
    }

    const userId = claimsData.claims.sub;

    // Fetch profile and resolve tier
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_pro, plan_type')
      .eq('user_id', userId)
      .single();

    const tier = resolveTier(profile?.is_pro, (profile as any)?.plan_type);

    // Block Free-tier users from this Pro-only endpoint
    const tierGate = requireMinimumTier(tier, 'PRO');
    if (tierGate) return tierGate;

    // Tier-based rate limiting
    const ip = getClientIP(req);
    const { allowed, retryAfterSeconds } = checkTieredRateLimit(`enhance:${userId || ip}`, tier);
    if (!allowed) return rateLimitedResponse(retryAfterSeconds, tier);

    const { description, title, industry_context } = await req.json();

    // ── Allow-list validation ────────────────────────────────────────────
    const descCheck = validateText(description, "Project description", 5000, 10);
    if (!descCheck.valid) return validationError(descCheck.error!);

    if (title) {
      const titleCheck = validateText(title, "Project title", 300);
      if (!titleCheck.valid) return validationError(titleCheck.error!);
    }

    // Removed debug console.log

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')!;

    let industryLogic = '';
    const targetIndustry = (industry_context || '').toLowerCase();

    if (targetIndustry.includes('big tech')) {
      industryLogic = `\nINDUSTRY WEIGHTING (Big Tech): Heavily weight HEART metrics around 'Scale,' 'Retention,' and 'Cross-functional Orchestration.' Re-order bullet points so these metrics appear first. Adapt vocabulary to sophisticated operational scale.`;
    } else if (targetIndustry.includes('startup') || targetIndustry.includes('early-stage')) {
      industryLogic = `\nINDUSTRY WEIGHTING (Early-Stage Startup): Heavily weight 'Zero-to-One,' 'Speed-to-Market,' and 'Multi-disciplinary Agility.' Re-order bullet points so these metrics appear first. Adapt vocabulary to rapid execution and high ownership.`;
    } else if (targetIndustry.includes('fintech') || targetIndustry.includes('healthtech')) {
      industryLogic = `\nINDUSTRY WEIGHTING (Fintech/Healthtech): Emphasize 'Security,' 'Compliance,' and 'Data Integrity' within the RICE framework. Re-order bullet points so these metrics appear first. Adapt vocabulary to reflect strict regulatory environments and high-stakes data.`;
    }

    const systemPrompt = `You are The Elite PM Narrative Engine, specializing in high-impact, cinematic professional narratives. Your base tone is 'Noir-Professional'—sophisticated, authoritative, data-driven, and slightly dramatic. Avoid generic corporate jargon.
    ${industryLogic}

Your task is to rewrite project descriptions into a Deep-Dive using the HEART and RICE frameworks, adapted to the target industry if provided.

Structural Requirements:
1. Deep-Dive Bullet Points: 3-4 bullet points that highlight technical complexity and business impact using HEART/RICE frameworks.
2. The 'Killer' Insight: A short unique 'Contextual Summary' (1-2 sentences max) appended at the end that explains why the user's execution in this project makes them a perfect fit for the target sector.

NEGATIVE PROMPTING (Strictly Prohibited):
- NO fluff words: avoid 'passionate,' 'hard-working,' 'team player,' or 'motivated.'
- NO passive voice: every sentence must start with a strong action verb.
- NO tone-deafness: Do not use startup "hacker" language for corporate banking roles or vice versa. Adjust tone to match the industry vibe while keeping the Noir base.
- NO loss of original identity: Do not hallucinate skills or metrics. If the user did not provide a specific number, describe the impact qualitatively (e.g. 'significantly reduced' rather than inventing '37%'). NEVER fabricate percentages, user counts, revenue figures, or team sizes that are not present in the source text.
- NO repetitive structures: Every industry-adapted version must feel like a fresh, manual rewrite.
- NO banned words: NEVER use 'passionate,' 'synergy,' 'motivated,' 'hard-working,' 'team player,' 'leverage,' or 'utilize.'
- NO breaking the UI: Keep bullet lengths reasonable. Do not exceed 3 lines per bullet to maintain readability.

Do NOT include any preamble or explanation. Output EXACTLY the 3-4 bullet points, followed by a blank line, followed by the Contextual Summary.`;

    const userPrompt = title
      ? `Project Title: ${title}\n\nOriginal Description: ${description}`
      : `Original Description: ${description}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' } }
        );
      }
      if (response.status === 402) {
        return errorResponse('AI service temporarily unavailable.', 402);
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI gateway error');
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('Enhance project error:', error);
    return errorResponse('An unexpected error occurred', 500);
  }
});
