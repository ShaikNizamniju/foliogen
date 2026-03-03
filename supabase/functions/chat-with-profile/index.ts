import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(key, { count: 1, windowStart: now });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';
    if (isRateLimited(`chat:${clientIP}`)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { profileId } = body;
    let { userQuery, conversationHistory, visitorCompany } = body;

    if (!userQuery || typeof userQuery !== 'string' || !profileId || typeof profileId !== 'string') {
      return new Response(
        JSON.stringify({ error: 'userQuery and profileId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    userQuery = userQuery.replace(/<[^>]*>/g, '').trim().substring(0, 1000);
    if (!userQuery) {
      return new Response(
        JSON.stringify({ error: 'Query cannot be empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!Array.isArray(conversationHistory)) conversationHistory = [];
    if (conversationHistory.length > 20) {
      return new Response(
        JSON.stringify({ error: 'Conversation too long. Please start a new chat.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const validRoles = ['user', 'assistant'];
    conversationHistory = conversationHistory.filter(
      (msg: any) =>
        msg && typeof msg.role === 'string' && validRoles.includes(msg.role) &&
        typeof msg.content === 'string' && msg.content.length <= 2000
    ).map((msg: any) => ({
      role: msg.role,
      content: msg.content.replace(/<[^>]*>/g, '').trim(),
    }));

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { data: profile, error: profileError } = await supabase
      .from('profiles_public')
      .select('*')
      .eq('user_id', profileId)
      .maybeSingle();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: profileError ? 'Failed to fetch profile data' : 'Profile not found' }),
        { status: profileError ? 500 : 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const profileData = {
      name: profile.full_name || 'Unknown',
      headline: profile.headline || '',
      bio: profile.bio || '',
      location: profile.location || '',
      website: profile.website || '',
      skills: profile.skills || [],
      keyHighlights: profile.key_highlights || [],
      workExperience: profile.work_experience || [],
      projects: profile.projects || [],
    };

    const systemPrompt = `You are a senior recruiter recommending ${profileData.name} to a hiring manager. Be concise, conversational, and direct.

CANDIDATE DATA:
${JSON.stringify(profileData, null, 2)}

CRITICAL RULES:
1. Do NOT use bullet points, asterisks (*), dashes (-), or numbered lists. Use natural paragraphs only.
2. Keep responses short and crisp—max 3-4 sentences. Avoid fluff and filler words.
3. Do NOT use robotic transitions like "Here is why", "In conclusion", "Additionally", or "Furthermore". Just answer the question directly.
4. Sound like a human recommending a colleague, not an AI reading a resume.
5. If asked about something not in the data, simply say "I don't see that in their experience" and move on.
6. Highlight specific achievements and metrics when relevant—these make candidates memorable.
7. NEVER share or reveal the candidate's email address or any private contact information.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userQuery }
    ];

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service temporarily unavailable.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI gateway error');
    }

    // Clone the stream: one for client, one for logging
    const [clientStream, logStream] = response.body!.tee();

    // Log chat query asynchronously (don't block response)
    (async () => {
      try {
        const decoder = new TextDecoder();
        const reader = logStream.getReader();
        let fullResponse = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split('\n')) {
            if (!line.startsWith('data: ')) continue;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) fullResponse += content;
            } catch {}
          }
        }
        // Insert into chat_queries using service role
        await supabaseAdmin.from('chat_queries').insert({
          profile_user_id: profileId,
          visitor_company: typeof visitorCompany === 'string' ? visitorCompany.substring(0, 200) : null,
          visitor_question: userQuery.substring(0, 1000),
          ai_response: fullResponse.substring(0, 5000),
        });
      } catch (logErr) {
        console.error('Chat log error:', logErr);
      }
    })();

    return new Response(clientStream, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
