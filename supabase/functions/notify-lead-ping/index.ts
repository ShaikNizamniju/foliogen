import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/security.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

/**
 * notify-lead-ping
 * ─────────────────────────────────────────────────────────────────────
 * Real-Time Webhook Notification Bridge.
 *
 * Trigger: Called by authenticated users or database webhook with signature.
 * Payload: Dispatches a formatted Noir notification to WEBHOOK_URL.
 *
 * Env: WEBHOOK_URL (set via `supabase secrets set WEBHOOK_URL=...`)
 */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ── Authenticate the caller ──────────────────────────────────────
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const webhookUrl = Deno.env.get("WEBHOOK_URL");
    if (!webhookUrl) {
      return new Response(
        JSON.stringify({ error: "WEBHOOK_URL not configured" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload = await req.json();

    // ── Guard: Only fire for actual pings ──────────────────────────────
    const record = payload.record || payload;
    if (!record || record.is_ping !== true) {
      return new Response(
        JSON.stringify({ skipped: true, reason: "Not a ping event" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Extract & sanitize fields ─────────────────────────────────────
    const companyName = String(record.company || "Confidential/Stealth Entity").trim().slice(0, 200);
    const contactMethod = String(record.contact_method || "Not Provided").trim().slice(0, 200);
    const industryRaw = String(record.industry_context || "General").trim().slice(0, 100);
    const industryContext =
      industryRaw === "none" ? "General Fit" :
      industryRaw.charAt(0).toUpperCase() + industryRaw.slice(1);
    const timestamp = record.created_at || new Date().toISOString();
    const deviceType = String(record.device_type || "Unknown").slice(0, 50);

    // ── Build Noir notification body ──────────────────────────────────
    const webhookPayload = {
      content: null,
      embeds: [
        {
          title: "🌑 TARGET ACQUIRED: New Recruiter Ping",
          color: 0x3B82F6,
          fields: [
            { name: "▸ Source", value: `\`${companyName}\``, inline: true },
            { name: "▸ Context", value: `\`${industryContext} Persona\``, inline: true },
            { name: "▸ Channel", value: `\`${contactMethod}\``, inline: false },
            { name: "▸ Device", value: `\`${deviceType}\``, inline: true },
            { name: "▸ Timestamp", value: `\`${timestamp}\``, inline: true },
          ],
          footer: { text: "Return to the Dashboard to engage: foliogen.in/dashboard" },
          timestamp: timestamp,
        },
      ],
    };

    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(webhookPayload),
    });

    if (!webhookResponse.ok) {
      console.error(`Webhook dispatch failed: ${webhookResponse.status}`);
    }

    return new Response(
      JSON.stringify({ dispatched: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("notify-lead-ping error:", error?.message || error);
    return new Response(
      JSON.stringify({ error: "Internal" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
