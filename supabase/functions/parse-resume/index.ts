import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const MAX_RESUME_SIZE = 51200 // 50KB = ~10 pages of text

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const token = authHeader.replace('Bearer ', '')
    const { data: claims, error: authError } = await supabaseClient.auth.getClaims(token)
    if (authError || !claims?.claims?.sub) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Authenticated user:', claims.claims.sub)

    // Input validation
    const { resumeText } = await req.json()

    if (!resumeText || typeof resumeText !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Resume text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (resumeText.length > MAX_RESUME_SIZE) {
      return new Response(
        JSON.stringify({ error: `Resume too large. Maximum ${MAX_RESUME_SIZE} characters allowed.` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const apiKey = Deno.env.get('LOVABLE_API_KEY')

    if (!apiKey) {
      console.error("Missing LOVABLE_API_KEY")
      return new Response(JSON.stringify({ error: "Server configuration error: Missing API Key" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      })
    }

    // Use Lovable AI Gateway with a stable model
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
            content: "You are an expert Career Strategist. Analyze the provided text (Resume or LinkedIn PDF). Extract structured data and return ONLY raw JSON with no markdown formatting."
          },
          {
            role: "user",
            content: `Extract these fields into pure JSON:
- fullName, headline, bio, location, email, linkedinUrl
- skills (array of strings)
- workExperience (array: jobTitle, company, startDate, endDate, current, description)
- projects (array: title, description, visualPrompt). For visualPrompt: generate a 2-4 word visual description for AI image generation, e.g., "futuristic finance dashboard neon", "minimalist e-commerce mobile", "social media analytics dark".
- keyHighlights (array of 3-5 short, punchy strings, max 10 words each. These should be the candidate's strongest selling points, unique skills, or impressive metrics found in the text.)

Return ONLY raw JSON. No markdown, no backticks.

Resume Text:
${resumeText.substring(0, 30000)}`
          }
        ]
      })
    })

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429
        })
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 402
        })
      }
      const errorText = await response.text()
      console.error("AI Gateway Error:", response.status, errorText)
      return new Response(JSON.stringify({ error: "AI service error" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      })
    }

    const data = await response.json()

    try {
      let rawText = data.choices?.[0]?.message?.content || "{}"
      rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim()
      const parsedProfile = JSON.parse(rawText)
      
      return new Response(JSON.stringify(parsedProfile), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    } catch (parseError) {
      console.error("Parsing Error:", parseError)
      return new Response(JSON.stringify({ error: "AI response was not valid JSON" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      })
    }

  } catch (error) {
    console.error("Unexpected Error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
