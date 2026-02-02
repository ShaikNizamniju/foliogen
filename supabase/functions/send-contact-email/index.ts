import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ContactRequest {
  name: string;
  email: string;
  message: string;
  toEmail: string;
  toName: string;
}

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 emails per hour per IP
const RATE_LIMIT_WINDOW_MINUTES = 60;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client for rate limiting
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
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
        p_endpoint: 'send-contact-email',
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
        JSON.stringify({ success: false, error: "Too many requests. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const EMAILJS_SERVICE_ID = Deno.env.get("EMAILJS_SERVICE_ID");
    const EMAILJS_TEMPLATE_ID = Deno.env.get("EMAILJS_TEMPLATE_ID");
    const EMAILJS_PUBLIC_KEY = Deno.env.get("EMAILJS_PUBLIC_KEY");

    if (!EMAILJS_SERVICE_ID) {
      throw new Error("EMAILJS_SERVICE_ID is not configured");
    }
    if (!EMAILJS_TEMPLATE_ID) {
      throw new Error("EMAILJS_TEMPLATE_ID is not configured");
    }
    if (!EMAILJS_PUBLIC_KEY) {
      throw new Error("EMAILJS_PUBLIC_KEY is not configured");
    }

    const body = await req.json();
    const { name, email, message, toEmail, toName }: ContactRequest = body;

    // Validate required fields with strict type checking
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate lengths
    if (name.length > MAX_NAME_LENGTH) {
      return new Response(
        JSON.stringify({ success: false, error: `Name too long. Maximum ${MAX_NAME_LENGTH} characters.` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (email.length > MAX_EMAIL_LENGTH) {
      return new Response(
        JSON.stringify({ success: false, error: `Email too long. Maximum ${MAX_EMAIL_LENGTH} characters.` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return new Response(
        JSON.stringify({ success: false, error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters.` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email format with stricter regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid email format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate toEmail if provided
    if (toEmail && (typeof toEmail !== 'string' || !emailRegex.test(toEmail))) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid recipient email format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize inputs - remove potentially dangerous characters
    const sanitizedName = name.trim().replace(/[<>]/g, '');
    const sanitizedMessage = message.trim().replace(/[<>]/g, '');
    const sanitizedToName = (toName || "Portfolio Owner").trim().replace(/[<>]/g, '');

    console.log(`Sending contact email from ${sanitizedName}, IP: ${clientIP}`);

    // Send via EmailJS API
    const emailJsResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          from_name: sanitizedName,
          from_email: email,
          message: sanitizedMessage,
          to_email: toEmail,
          to_name: sanitizedToName,
        },
      }),
    });

    if (!emailJsResponse.ok) {
      console.error("Email delivery failed:", emailJsResponse.status);
      throw new Error("Email delivery failed");
    }

    console.log("Email sent successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending contact email:", error);
    // Don't expose internal error details
    return new Response(
      JSON.stringify({ success: false, error: "Failed to send email. Please try again later." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
