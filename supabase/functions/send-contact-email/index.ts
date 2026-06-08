import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import {
  corsHeaders,
  checkRateLimit,
  rateLimitedResponse,
  getClientIP,
  validateText,
  validateEmail,
  validationError,
  sanitize,
} from "../_shared/security.ts";

interface ContactRequest {
  name: string;
  email: string;
  message: string;
  toEmail: string;
  toName: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Token-bucket rate limit: 100 req / 15 min per IP
    const ip = getClientIP(req);
    const { allowed, retryAfterSeconds } = checkRateLimit(`contact:${ip}`);
    if (!allowed) return rateLimitedResponse(retryAfterSeconds);

    const EMAILJS_SERVICE_ID = Deno.env.get("EMAILJS_SERVICE_ID");
    const EMAILJS_TEMPLATE_ID = Deno.env.get("EMAILJS_TEMPLATE_ID");
    const EMAILJS_PUBLIC_KEY = Deno.env.get("EMAILJS_PUBLIC_KEY");

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      throw new Error("EmailJS configuration is incomplete");
    }

    const body: ContactRequest = await req.json();

    // ── Allow-list validation ────────────────────────────────────────────
    const nameCheck = validateText(body.name, "Name", 200);
    if (!nameCheck.valid) return validationError(nameCheck.error!);

    const emailCheck = validateEmail(body.email, "Your email");
    if (!emailCheck.valid) return validationError(emailCheck.error!);

    const msgCheck = validateText(body.message, "Message", 5000, 10);
    if (!msgCheck.valid) return validationError(msgCheck.error!);

    const toEmailCheck = validateEmail(body.toEmail, "Recipient email");
    if (!toEmailCheck.valid) return validationError(toEmailCheck.error!);

    // ── Recipient allow-list ─────────────────────────────────────────────
    // Prevent arbitrary email relay: the recipient must be either the
    // Foliogen admin inbox or a registered portfolio owner's email.
    const requestedTo = body.toEmail.trim().toLowerCase();
    const ADMIN_EMAILS = new Set(["admin@foliogen.in", "support@foliogen.in", "hello@foliogen.in"]);
    let recipientAllowed = ADMIN_EMAILS.has(requestedTo);

    if (!recipientAllowed) {
      try {
        const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
        const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
        if (SUPABASE_URL && SERVICE_KEY) {
          const lookup = await fetch(
            `${SUPABASE_URL}/rest/v1/profiles?select=user_id&email=eq.${encodeURIComponent(requestedTo)}&limit=1`,
            {
              headers: {
                apikey: SERVICE_KEY,
                Authorization: `Bearer ${SERVICE_KEY}`,
              },
            }
          );
          if (lookup.ok) {
            const rows = await lookup.json();
            if (Array.isArray(rows) && rows.length > 0) recipientAllowed = true;
          }
        }
      } catch (e) {
        console.error("Recipient allow-list lookup failed:", e);
      }
    }

    if (!recipientAllowed) {
      return validationError("Recipient is not allowed.");
    }

    // Sanitize for downstream use
    const safeName = sanitize(body.name, 200);
    const safeMessage = sanitize(body.message, 5000);
    const safeToName = body.toName ? sanitize(body.toName, 200) : "Portfolio Owner";



    const emailJsResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          from_name: safeName,
          from_email: body.email.trim(),
          message: safeMessage,
          to_email: body.toEmail.trim(),
          to_name: safeToName,
        },
      }),
    });

    if (!emailJsResponse.ok) {
      const errorText = await emailJsResponse.text();
      console.error("EmailJS API error:", errorText);
      throw new Error("Email service error");
    }



    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error sending contact email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
