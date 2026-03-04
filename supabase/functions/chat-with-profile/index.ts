import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  corsHeaders,
  checkRateLimit,
  rateLimitedResponse,
  getClientIP,
  validateText,
  validationError,
  sanitize,
  errorResponse,
} from "../_shared/security.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Token-bucket rate limit: 100 req / 15 min per IP
    const ip = getClientIP(req);
    const { allowed, retryAfterSeconds } = checkRateLimit(`chat:${ip}`);
    if (!allowed) return rateLimitedResponse(retryAfterSeconds);

    const body = await req.json();
    const { profileId } = body;
    let { userQuery, conversationHistory, visitorCompany } = body;

    // ── Allow-list validation ────────────────────────────────────────────
    const queryCheck = validateText(userQuery, "Question", 1000, 2);
    if (!queryCheck.valid) return validationError(queryCheck.error!);

    const idCheck = validateText(profileId, "Profile ID", 100);
    if (!idCheck.valid) return validationError(idCheck.error!);

    userQuery = sanitize(userQuery, 1000);
    if (!userQuery) return validationError("Question cannot be empty after sanitization.");

    if (!Array.isArray(conversationHistory)) conversationHistory = [];
    if (conversationHistory.length > 20) {
      return validationError("Conversation too long. Please start a new chat.");
    }

    const validRoles = ['user', 'assistant'];
    conversationHistory = conversationHistory.filter(
      (msg: any) =>
        msg && typeof msg.role === 'string' && validRoles.includes(msg.role) &&
        typeof msg.content === 'string' && msg.content.length <= 2000
    ).map((msg: any) => ({
      role: msg.role,
      content: sanitize(msg.content, 2000),
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
      return errorResponse(
        profileError ? 'Failed to fetch profile data' : 'Profile not found',
        profileError ? 500 : 404,
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
          JSON.stringify({ error: 'AI rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' } }
        );
      }
      if (response.status === 402) {
        return errorResponse('AI service temporarily unavailable.', 402);
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI gateway error');
    }

    const [clientStream, logStream] = response.body!.tee();

    // Log chat query asynchronously
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
        await supabaseAdmin.from('chat_queries').insert({
          profile_user_id: profileId,
          visitor_company: typeof visitorCompany === 'string' ? sanitize(visitorCompany, 200) : null,
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
    return errorResponse('An unexpected error occurred', 500);
  }
});
