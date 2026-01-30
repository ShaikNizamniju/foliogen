import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { resumeText } = await req.json()
    const apiKey = Deno.env.get('LOVABLE_API_KEY')

    if (!apiKey) {
      console.error("Missing LOVABLE_API_KEY")
      return new Response(JSON.stringify({ error: "Server configuration error: Missing API Key" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
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
- projects (array: title, description)
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
          status: 200
        })
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        })
      }
      const errorText = await response.text()
      console.error("AI Gateway Error:", response.status, errorText)
      return new Response(JSON.stringify({ error: "AI service error" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
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
        status: 200
      })
    }

  } catch (error) {
    console.error("Unexpected Error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })
  }
})
