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
    const apiKey = Deno.env.get('GEMINI_API_KEY')

    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY in Secrets")
    }

    const systemPrompt = `
  You are an API that converts Resume Text into JSON.
  Extract these specific fields:
  - fullName (string)
  - headline (string)
  - bio (string)
  - location (string)
  - email (string)
  - linkedinUrl (string)
  - skills (array of strings)
  - workExperience (array of objects: jobTitle, company, startDate, endDate, current, description)
  - projects (array of objects: title, description)

  IMPORTANT: Return ONLY raw JSON. No markdown, no "Here is the json", no backticks.
  
  Resume Text:
  ${resumeText}
`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }]
        })
      }
    )

    const data = await response.json()

    // Clean up Gemini response
    let rawText = data.candidates[0].content.parts[0].text
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim()

    const parsedProfile = JSON.parse(rawText)

    return new Response(JSON.stringify(parsedProfile), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error("Error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
