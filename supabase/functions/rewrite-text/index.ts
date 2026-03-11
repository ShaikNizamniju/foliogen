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
        const secretGate = requireProSecrets();
        if (secretGate) return secretGate;

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

        const { data: profile } = await supabase
            .from('profiles')
            .select('is_pro, plan_type')
            .eq('user_id', userId)
            .single();

        const tier = resolveTier(profile?.is_pro, (profile as any)?.plan_type);

        const ip = getClientIP(req);
        const { allowed, retryAfterSeconds } = checkTieredRateLimit(`rewrite:${userId || ip}`, tier);
        if (!allowed) return rateLimitedResponse(retryAfterSeconds, tier);

        const { text, action } = await req.json();

        const textCheck = validateText(text, "Text to rewrite", 5000, 5);
        if (!textCheck.valid) return validationError(textCheck.error!);

        const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')!;

        let instruction = "";
        if (action === "Fix Grammar") instruction = "Fix all grammatical errors, spelling mistakes, and awkward phrasing, keeping the original tone.";
        else if (action === "Make Professional") instruction = "Rewrite this text to be highly professional, impactful, and suitable for a senior-level resume or portfolio.";
        else if (action === "Shorten") instruction = "Condense this text to be concise and punchy without losing the core message.";
        else return errorResponse('Invalid action', 400);

        const systemPrompt = `You are a specialized Career Infrastructure AI for Product Managers.
Your task is to rewrite the user's text based on the following instruction: ${instruction}

STRICT ENFORCEMENT RULES (The Impact Ledger):
1. Framework Exclusivity: You MUST exclusively use HEART, STAR, and RICE (Reach, Impact, Confidence, Effort) frameworks to structure your response.
2. PM-Specific Metrics: Prioritize data points involving: Model Accuracy (%), Latency reduction (ms), Token cost optimization ($), and User Retention (%).
3. Negative Prompting (Soft Skills BAN): NEVER use words like 'passionate', 'collaborative', or 'synergy'.
4. Negative Prompting (NO Hallucinations): If a user doesn't provide a specific metric (% or $), you MUST write EXACTLY: "Impact: High-complexity feature orchestration". Never invent a %, $, or any metric.
5. Formatting: Return ONLY the rewritten text. Do not include any conversational filler (e.g., "Here is the rewritten text:"). Maintain formatting if applicable.`;

        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${LOVABLE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'google/gemini-2.5-flash',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: text }
                ],
            }),
        });

        if (!response.ok) {
            if (response.status === 429) {
                return new Response(JSON.stringify({ error: 'Rate limit exceeded.' }), { status: 429, headers: corsHeaders });
            }
            return errorResponse('AI service failed', 500);
        }

        const aiData = await response.json();
        const rewritten = aiData.choices?.[0]?.message?.content?.trim() || "Failed to generate text.";

        return new Response(JSON.stringify({ result: rewritten }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Rewrite text error:', error);
        return errorResponse('An unexpected error occurred', 500);
    }
});
