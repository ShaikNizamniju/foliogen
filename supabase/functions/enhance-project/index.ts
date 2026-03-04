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

    const { description, title } = await req.json();

    // ── Allow-list validation ────────────────────────────────────────────
    const descCheck = validateText(description, "Project description", 5000, 10);
    if (!descCheck.valid) return validationError(descCheck.error!);

    if (title) {
      const titleCheck = validateText(title, "Project title", 300);
      if (!titleCheck.valid) return validationError(titleCheck.error!);
    }

    console.log('Enhancing project description:', title || 'Untitled');

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')!;

    const systemPrompt = `You are a professional copywriter who specializes in writing impactful project case studies for portfolios and resumes.

Your task is to rewrite project descriptions using the STAR method:
- Situation: Set the context
- Task: Describe the challenge or goal
- Action: Explain what was done
- Result: Highlight the outcomes and impact

Guidelines:
- Write in first person
- Sound like a Senior Product Manager or Lead Engineer wrote it
- Keep it under 200 words
- Be specific and quantify results when possible (use realistic estimates if none provided)
- Focus on impact and outcomes
- Use strong action verbs
- Make it compelling for recruiters and hiring managers

Do NOT include any preamble or explanation. Just output the rewritten description.`;

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
