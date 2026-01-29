import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { resumeText } = await req.json()
    const apiKey = Deno.env.get('GEMINI_API_KEY')

    // 2. Validate API Key
    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY")
      return new Response(JSON.stringify({ error: "Server configuration error: Missing API Key" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    // 3. Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: `
              You are a Resume Parser. Extract these fields into pure JSON:
              - fullName, headline, bio, location, email, linkedinUrl
              - skills (array of strings)
              - workExperience (array: jobTitle, company, startDate, endDate, current, description)
              - projects (array: title, description)
              
              Resume Text:
              ${resumeText.substring(0, 30000)} 
            ` }] 
          }]
        })
      }
    )

    const data = await response.json()

    // 4. Handle Gemini API Errors
    if (data.error) {
      console.error("Gemini API Error:", data.error)
      return new Response(JSON.stringify({ error: "Gemini Error: " + data.error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    // 5. Parse Response safely
    try {
      let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}"
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
