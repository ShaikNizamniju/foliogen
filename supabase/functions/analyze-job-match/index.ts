import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobDescription } = await req.json();

    if (!jobDescription || jobDescription.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Job description is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the user from the authorization header
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

    // Get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "User not authenticated" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch the user's profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: "Profile not found. Please complete your profile first." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build the profile data for analysis
    const profileData = {
      name: profile.full_name || "Candidate",
      headline: profile.headline || "",
      bio: profile.bio || "",
      skills: profile.skills || [],
      workExperience: profile.work_experience || [],
      projects: profile.projects || [],
      location: profile.location || "",
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build the system prompt for the Career Strategist Agent
    const systemPrompt = `You are an elite Career Strategist Agent. Your goal is to maximize the user's chance of getting hired.

You will analyze a candidate's profile against a job description and provide strategic insights.

CANDIDATE PROFILE:
${JSON.stringify(profileData, null, 2)}

JOB DESCRIPTION:
${jobDescription}

Your task is to:
1. Calculate a match score (0-100) based on how well the candidate's skills, experience, and background align with the job requirements.
2. Identify exactly 3 critical keywords or skills from the job description that are missing from the candidate's profile.
3. Write a compelling 1-paragraph "Why Me?" pitch (3-4 sentences) that bridges the candidate's specific experience to the job's biggest pain points.

Be strategic and specific. Reference actual details from both the profile and job description.`;

    // Call Lovable AI Gateway with tool calling for structured output
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
                    description: "Match score from 0-100 representing how well the candidate fits the job",
                  },
                  missingKeywords: {
                    type: "array",
                    items: { type: "string" },
                    description: "Exactly 3 critical skills or keywords missing from the candidate's profile",
                  },
                  tailoredPitch: {
                    type: "string",
                    description: "A compelling 1-paragraph 'Why Me?' pitch connecting candidate experience to job requirements",
                  },
                  scoreBreakdown: {
                    type: "object",
                    properties: {
                      skillsMatch: { type: "number", description: "Skills match percentage 0-100" },
                      experienceMatch: { type: "number", description: "Experience match percentage 0-100" },
                      overallFit: { type: "string", description: "Brief overall fit assessment" },
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
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    console.log("AI Response:", JSON.stringify(aiResponse, null, 2));

    // Extract the tool call result
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "job_match_analysis") {
      console.error("Unexpected AI response format:", aiResponse);
      return new Response(
        JSON.stringify({ error: "AI returned unexpected format" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const analysisResult = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("analyze-job-match error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
