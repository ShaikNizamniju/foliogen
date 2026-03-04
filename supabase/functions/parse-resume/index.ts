import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  corsHeaders,
  checkRateLimit,
  rateLimitedResponse,
  getClientIP,
  validateText,
  validationError,
  errorResponse,
} from "../_shared/security.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Token-bucket rate limit: 100 req / 15 min per IP
    const ip = getClientIP(req);
    const { allowed, retryAfterSeconds } = checkRateLimit(`resume:${ip}`);
    if (!allowed) return rateLimitedResponse(retryAfterSeconds);

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

    const body = await req.json();
    const resumeText = body?.resumeText;

    // ── Allow-list validation ────────────────────────────────────────────
    const textCheck = validateText(resumeText, "Resume text", 30000, 50);
    if (!textCheck.valid) return validationError(textCheck.error!);

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      console.error("Missing LOVABLE_API_KEY");
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
            content: `You are an expert Career Strategist. Analyze the provided text which may be either a standard Resume PDF or a LinkedIn-generated PDF export. LinkedIn PDFs have a specific structure with sections like 'Experience', 'Education', 'Skills', 'Languages', 'Certifications'. Identify the format and extract structured data accordingly.

CRITICAL: Return ONLY raw JSON. No markdown, no backticks, no code fences.
CRITICAL: All keys MUST be camelCase to match the TypeScript interface (e.g., fullName, workExperience, linkedinUrl, keyHighlights, predictedDomain).`
          },
          {
            role: "user",
            content: `Extract these fields into pure JSON (camelCase keys only):
- fullName (string), headline (string), bio (string), location (string), email (string), linkedinUrl (string)
- skills (array of strings)
- workExperience (array of objects with keys: jobTitle, company, startDate, endDate, current, description)
- projects (array of objects with keys: title, description, visualPrompt). For visualPrompt: generate a 2-4 word visual description for AI image generation, e.g., "futuristic finance dashboard neon", "minimalist e-commerce mobile", "social media analytics dark".
- keyHighlights (array of 3-5 short, punchy strings, max 10 words each. These should be the candidate's strongest selling points, unique skills, or impressive metrics found in the text.)
- predictedDomain: Predict the professional domain of this person. Must be exactly one of: "tech", "creative", "corporate", "luxury". Base this on their job titles, skills, and industry keywords.

Return ONLY raw JSON. No markdown, no backticks, no explanation.

Resume Text:
${resumeText.substring(0, 30000)}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway Error:", response.status, errorText);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' } }
        );
      }
      if (response.status === 402) {
        return errorResponse("AI credits exhausted. Please add funds.", 502);
      }
      return errorResponse("AI service error", 502);
    }

    const data = await response.json();

    let rawText = data.choices?.[0]?.message?.content;
    if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
      console.error("AI returned empty content:", JSON.stringify(data));
      return errorResponse("AI returned an empty response. Please try again.", 502);
    }

    rawText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    let parsedProfile;
    try {
      parsedProfile = JSON.parse(rawText);
    } catch (parseError) {
      console.error("JSON Parse Error. Raw AI output:", rawText.substring(0, 500));
      return errorResponse("AI response was not valid JSON. Please try again.", 502);
    }

    const skillsCount = Array.isArray(parsedProfile.skills) ? parsedProfile.skills.length : 0;
    const projectsCount = Array.isArray(parsedProfile.projects) ? parsedProfile.projects.length : 0;
    const workCount = Array.isArray(parsedProfile.workExperience) ? parsedProfile.workExperience.length : 0;

    console.log(`✅ Parse complete — Name: "${parsedProfile.fullName || 'N/A'}", Skills: ${skillsCount}, Projects: ${projectsCount}, Work: ${workCount}, Domain: ${parsedProfile.predictedDomain || 'N/A'}`);

    if (!parsedProfile.fullName && skillsCount === 0 && workCount === 0) {
      return errorResponse("Could not extract meaningful data from this PDF. It may be image-based or in an unsupported format.", 422);
    }

    return new Response(JSON.stringify(parsedProfile), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error("Unexpected Error:", error);
    return errorResponse("An unexpected error occurred", 500);
  }
});
