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
    const secretGate = requireProSecrets();
    if (secretGate) return secretGate;

    const { question, answer, role, company } = await req.json();

    const jdCheck = validateText(answer, "Answer", 10000, 10);
    if (!jdCheck.valid) return validationError(jdCheck.error!);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return errorResponse("Authorization required", 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return errorResponse("User not authenticated", 401);

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!profile) return errorResponse("Profile not found", 404);

    const tier = resolveTier(profile.is_pro, (profile as any).plan_type);
    const tierGate = requireMinimumTier(tier, 'PRO');
    if (tierGate) return tierGate;

    const ip = getClientIP(req);
    const { allowed, retryAfterSeconds } = checkTieredRateLimit(`interview:${user.id || ip}`, tier);
    if (!allowed) return rateLimitedResponse(retryAfterSeconds, tier);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

    const systemPrompt = `You are an elite Interview Coach (Copilot mode). Evaluate the candidate's answer for the role of ${role} at ${company}.
    
QUESTION: ${question}

CANDIDATE ANSWER: 
${answer}

Your task is to comprehensively analyze the candidate's answer, acting as a highly experienced, critical hiring manager. Do not sugarcoat your feedback.
Provide:
1. A strict score from 0 to 100 on the quality, depth, and relevance of their answer.
2. What they did well (2 highly specific, actionable points citing their exact words).
3. How they MUST improve (2 highly specific, actionable critiques citing exact gaps in their answer compared to best practices).
4. An ideal, rewritten response framework leveraging the STAR method (Situation, Task, Action, Result) specifically tailored to the ${role} position at ${company}.

Format strictly as requested by the tool call.`;

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
          { role: "user", content: "Analyze my interview answer." },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "interview_answer_analysis",
              description: "Provide structured feedback for an interview answer",
              parameters: {
                type: "object",
                properties: {
                  score: { type: "number", description: "Score out of 100" },
                  strengths: { type: "array", items: { type: "string" }, description: "2 things done well" },
                  improvements: { type: "array", items: { type: "string" }, description: "2 areas to improve" },
                  idealFramework: { type: "string", description: "Paragraph structuring a better answer using STAR or similar framework" }
                },
                required: ["score", "strengths", "improvements", "idealFramework"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "interview_answer_analysis" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: corsHeaders });
      if (response.status === 402) return errorResponse("AI credits exhausted", 402);
      return errorResponse("AI analysis failed", 500);
    }

    const aiResponse = await response.json();
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) return errorResponse("AI returned unexpected format", 500);

    const feedback = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(feedback), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("error:", error);
    return errorResponse("An unexpected error occurred", 500);
  }
});
