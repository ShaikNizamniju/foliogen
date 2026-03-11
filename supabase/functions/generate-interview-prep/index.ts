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
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify Pro secrets are configured
    const secretGate = requireProSecrets();
    if (secretGate) return secretGate;

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return errorResponse("Authorization required", 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return errorResponse("Invalid token", 401);
    }

    const userId = claimsData.claims.sub;

    // Fetch profile and resolve tier
    const { data: proProfile } = await supabase
      .from('profiles')
      .select('is_pro, plan_type')
      .eq('user_id', userId)
      .single();

    const tier = resolveTier(proProfile?.is_pro, (proProfile as any)?.plan_type);

    // Block Free-tier users
    const tierGate = requireMinimumTier(tier, 'PRO');
    if (tierGate) return tierGate;

    // Tier-based rate limiting
    const ip = getClientIP(req);
    const { allowed, retryAfterSeconds } = checkTieredRateLimit(`interview:${userId || ip}`, tier);
    if (!allowed) return rateLimitedResponse(retryAfterSeconds, tier);

    const { company, role } = await req.json();

    // ── Allow-list validation ────────────────────────────────────────────
    const companyCheck = validateText(company, "Company name", 200, 2);
    if (!companyCheck.valid) return validationError(companyCheck.error!);

    const roleCheck = validateText(role, "Role", 200, 2);
    if (!roleCheck.valid) return validationError(roleCheck.error!);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

    const systemPrompt = `You are an expert career coach and interview preparation specialist. Your job is to help candidates prepare for job interviews by providing insightful company research, likely interview questions, and smart questions for the candidate to ask.

Be specific, actionable, and encouraging. Tailor your advice to the specific company and role.`;

    const userPrompt = `I have an interview coming up for the position of "${role}" at "${company}".

Please provide:
1. A brief company summary (2-3 sentences about what they do, their culture, and what they value in employees)
2. 5 likely interview questions I might be asked for this role
3. 4 smart questions I should ask the interviewer

Format your response as JSON with this exact structure:
{
  "company_summary": "string",
  "likely_questions": ["question1", "question2", ...],
  "questions_to_ask": ["question1", "question2", ...]
}`;

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
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
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
        return errorResponse("AI credits exhausted. Please add credits to continue.", 402);
      }
      const errorText = await response.text();
      console.error("[generate-interview-prep] AI gateway error:", response.status, errorText);
      return errorResponse("Failed to generate interview prep", 500);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      console.error("[generate-interview-prep] No content in AI response");
      return errorResponse("No response from AI", 500);
    }

    let prepData;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      prepData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("[generate-interview-prep] Failed to parse AI response:", parseError);
      prepData = {
        company_summary: `${company} is a dynamic organization looking for talented ${role} professionals.`,
        likely_questions: [
          `Tell me about your experience relevant to the ${role} position.`,
          `Why are you interested in joining ${company}?`,
          "Describe a challenging project you've worked on.",
          "How do you stay current with industry trends?",
          "Where do you see yourself in 5 years?",
        ],
        questions_to_ask: [
          "What does success look like in the first 90 days?",
          "How does the team handle work-life balance?",
          "What are the biggest challenges the team is currently facing?",
          "What growth opportunities are available?",
        ],
      };
    }

    return new Response(
      JSON.stringify(prepData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[generate-interview-prep] Error:", error);
    return errorResponse("An unexpected error occurred", 500);
  }
});
