import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const MAX_QUERY_SIZE = 1000; // 1KB limit for user queries
const MAX_CONVERSATION_HISTORY = 20; // Maximum messages in history
const RATE_LIMIT_MAX_REQUESTS = 20; // 20 requests per hour per IP
const RATE_LIMIT_WINDOW_MINUTES = 60;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role for rate limiting
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('cf-connecting-ip') || 
                     'unknown';
    
    // Check rate limit using database function
    const { data: rateLimitAllowed, error: rateLimitError } = await supabase.rpc(
      'check_rate_limit',
      {
        p_key: clientIP,
        p_endpoint: 'chat-with-profile',
        p_max_requests: RATE_LIMIT_MAX_REQUESTS,
        p_window_minutes: RATE_LIMIT_WINDOW_MINUTES
      }
    );

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError.message);
      // Continue without rate limiting if there's an error
    } else if (!rateLimitAllowed) {
      console.log('Rate limit exceeded for IP:', clientIP);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { userQuery, profileId, conversationHistory = [] } = await req.json();

    // Input validation
    if (!userQuery || typeof userQuery !== 'string') {
      return new Response(
        JSON.stringify({ error: 'userQuery is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (userQuery.length > MAX_QUERY_SIZE) {
      return new Response(
        JSON.stringify({ error: `Query too long. Maximum ${MAX_QUERY_SIZE} characters allowed.` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!profileId || typeof profileId !== 'string') {
      return new Response(
        JSON.stringify({ error: 'profileId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(profileId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid profileId format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!Array.isArray(conversationHistory)) {
      return new Response(
        JSON.stringify({ error: 'conversationHistory must be an array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (conversationHistory.length > MAX_CONVERSATION_HISTORY) {
      return new Response(
        JSON.stringify({ error: `Conversation too long. Maximum ${MAX_CONVERSATION_HISTORY} messages allowed.` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Chat request for profile:', profileId, 'Query length:', userQuery.length, 'IP:', clientIP);

    // Fetch the full profile data (this is for public portfolio chatbot, no auth needed)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, headline, bio, location, website, skills, key_highlights, work_experience, projects')
      .eq('user_id', profileId)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch profile data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!profile) {
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Construct profile data for the AI (excluding email for privacy)
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

    // Build the system prompt with human, conversational tone
    const systemPrompt = `You are a senior recruiter recommending ${profileData.name} to a hiring manager. Be concise, conversational, and direct.

CANDIDATE DATA:
${JSON.stringify(profileData, null, 2)}

CRITICAL RULES:
1. Do NOT use bullet points, asterisks (*), dashes (-), or numbered lists. Use natural paragraphs only.
2. Keep responses short and crisp—max 3-4 sentences. Avoid fluff and filler words.
3. Do NOT use robotic transitions like "Here is why", "In conclusion", "Additionally", or "Furthermore". Just answer the question directly.
4. Sound like a human recommending a colleague, not an AI reading a resume.
5. If asked about something not in the data, simply say "I don't see that in their experience" and move on.
6. Highlight specific achievements and metrics when relevant—these make candidates memorable.`;

    // Sanitize and limit conversation history
    const sanitizedHistory = conversationHistory
      .slice(-MAX_CONVERSATION_HISTORY)
      .filter((msg: { role?: string; content?: string }) => 
        msg && typeof msg === 'object' && 
        (msg.role === 'user' || msg.role === 'assistant') && 
        typeof msg.content === 'string' &&
        msg.content.length <= MAX_QUERY_SIZE
      )
      .map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content.substring(0, MAX_QUERY_SIZE)
      }));

    // Build messages array
    const messages = [
      { role: 'system', content: systemPrompt },
      ...sanitizedHistory,
      { role: 'user', content: userQuery }
    ];

    // Call the AI gateway
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

    // Return streaming response
    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again later.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
