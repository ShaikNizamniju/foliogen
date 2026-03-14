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
    const { profileId, portfolioSlug = 'default' } = body;
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

    // Fetch specific contextual instance from portfolios
    const { data: portfolio, error: portfolioError } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', profileId)
      .eq('slug', portfolioSlug)
      .maybeSingle();

    let payload: any = null;

    if (portfolioError || !portfolio) {
      // Fallback for legacy URL compatibility
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
      payload = profile.published_data || profile;
    } else {
      payload = portfolio.data_json || {};
    }

    const profileData = {
      name: payload.full_name || 'Unknown',
      headline: payload.headline || '',
      bio: payload.bio || '',
      location: payload.location || '',
      website: payload.website || '',
      skills: payload.skills || [],
      keyHighlights: payload.key_highlights || [],
      workExperience: payload.work_experience || [],
      projects: payload.projects || [],
    };

    const profileContext = `Skills: ${JSON.stringify(profileData.skills)}
Experience: ${JSON.stringify(profileData.workExperience)}
Projects: ${JSON.stringify(profileData.projects)}`;

    const systemPrompt = `You are an AI representing ${profileData.name}. You answer questions from recruiters viewing this portfolio.

Here is the full profile context for ${profileData.name}:
Name: ${profileData.name}
Headline: ${profileData.headline}
Bio: ${profileData.bio}
Location: ${profileData.location}
${profileContext}

CRITICAL RULES:
1. Speak in the first person ("I", "my") as if you ARE ${profileData.name}.
2. NEVER say "I cannot provide information" or "I'm an AI". Answer confidently based on the profile context.
3. If the answer is not in the context, say "I don't have that information handy, but I'd be happy to discuss it further in an interview."
4. Keep answers concise, warm, and professional (2-3 sentences max).
5. Highlight specific metrics or accomplishments when relevant.
6. NEVER share or reveal email addresses or any private contact information.`;

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
            } catch (ignore: any) { }
          }
        }
        await supabaseAdmin.from('chat_queries').insert({
          profile_user_id: profileId,
          portfolio_slug: portfolioSlug, // Inject the context slug for message persistence
          visitor_company: typeof visitorCompany === 'string' ? sanitize(visitorCompany, 200) : null,
          visitor_question: userQuery.substring(0, 1000),
          ai_response: fullResponse.substring(0, 5000),
        });
      } catch (logErr: any) {
        console.error('Chat log error:', logErr);
      }
    })();

    return new Response(clientStream, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error: any) {
    console.error('Chat error:', error);
    return errorResponse('An unexpected error occurred', 500);
  }
});
