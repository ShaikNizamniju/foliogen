import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    console.log(`Sending contact email from ${sanitizedName} to portfolio owner`);

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
      const errorText = await emailJsResponse.text();
      console.error("EmailJS API error:", emailJsResponse.status);
      throw new Error(`EmailJS API error: ${emailJsResponse.status}`);
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
