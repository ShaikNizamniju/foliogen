import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;

    // Check Pro status server-side
    const { data: proProfile } = await supabase
      .from('profiles')
      .select('is_pro')
      .eq('user_id', userId)
      .single();

    if (!proProfile?.is_pro) {
      return new Response(
        JSON.stringify({ error: 'Pro subscription required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { company, role } = await req.json();
    
    console.log(`[generate-interview-prep] Generating prep for ${role} at ${company}`);

    if (!company || !role) {
      return new Response(
        JSON.stringify({ error: "Company and role are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("[generate-interview-prep] LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("[generate-interview-prep] AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate interview prep" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      console.error("[generate-interview-prep] No content in AI response");
      return new Response(
        JSON.stringify({ error: "No response from AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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

    console.log("[generate-interview-prep] Successfully generated prep data");

    return new Response(
      JSON.stringify(prepData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[generate-interview-prep] Error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
