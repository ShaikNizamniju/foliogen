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
    const ip = getClientIP(req);
    const { allowed, retryAfterSeconds } = checkRateLimit(`chat:${ip}`);
    if (!allowed) return rateLimitedResponse(retryAfterSeconds);

    const body = await req.json();
    const { profileId, portfolioSlug = 'default' } = body;
    let { userQuery, conversationHistory, visitorCompany } = body;

    const queryCheck = validateText(userQuery, "Question", 1000, 2);
    if (!queryCheck.valid) return validationError(queryCheck.error!);

    userQuery = sanitize(userQuery, 1000);
    
    // Filter conversation history — only allow user/assistant roles to prevent system-prompt injection
    const ALLOWED_ROLES = new Set(['user', 'assistant']);
    conversationHistory = Array.isArray(conversationHistory)
      ? conversationHistory
          .filter((m: any) => m && ALLOWED_ROLES.has(m.role) && typeof m.content === 'string')
          .map((m: any) => ({ role: m.role, content: String(m.content).substring(0, 2000) }))
          .slice(-10)
      : [];
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { data: portfolio } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', profileId)
      .eq('slug', portfolioSlug)
      .maybeSingle();

    let payload = portfolio?.data_json || {};

    if (!portfolio) {
      const { data: profile } = await supabase
        .from('profiles_public')
        .select('*')
        .eq('user_id', profileId)
        .maybeSingle();
      if (profile) payload = profile.published_data || profile;
    }

    const systemPrompt = `You are an AI representing ${payload.full_name || 'this professional'}. Keep answers concise and professional.`;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory.slice(-10),
          { role: 'user', content: userQuery }
        ],
        stream: false,
      }),
    });

    if (!response.ok) throw new Error('AI Gateway failure');

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "I'm not sure how to answer that.";

    // Log query
    await supabaseAdmin.from('chat_queries').insert({
      profile_user_id: profileId,
      portfolio_slug: portfolioSlug,
      visitor_company: typeof visitorCompany === 'string' ? sanitize(visitorCompany, 200) : null,
      visitor_question: userQuery.substring(0, 1000),
      ai_response: reply,
    }).then(({ error }) => { if (error) console.error(error); });

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Chat error:', error);
    return errorResponse(error.message || 'An unexpected error occurred', 500);
  }
});
