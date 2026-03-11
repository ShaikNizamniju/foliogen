import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/security.ts";

/**
 * notify-lead-ping
 * ─────────────────────────────────────────────────────────────────────
 * Real-Time Webhook Notification Bridge.
 *
 * Trigger: Called when a new recruiter ping is recorded in visit_logs.
 * Payload: Dispatches a formatted Noir notification to WEBHOOK_URL.
 *
 * Env: WEBHOOK_URL (set via `supabase secrets set WEBHOOK_URL=...`)
 */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
    const companyName = record.company?.trim() || "Confidential/Stealth Entity";
    const contactMethod = record.contact_method?.trim() || "Not Provided";
    const industryRaw = record.industry_context?.trim() || "General";
    const industryContext =
      industryRaw === "none" ? "General Fit" :
      industryRaw.charAt(0).toUpperCase() + industryRaw.slice(1);
    const timestamp = record.created_at || new Date().toISOString();
    const deviceType = record.device_type || "Unknown";

    // ── Build Noir notification body ──────────────────────────────────
    const webhookPayload = {
      // Discord-compatible embed structure
      content: null,
      embeds: [
        {
          title: "🌑 TARGET ACQUIRED: New Recruiter Ping",
          color: 0x3B82F6, // Neon Blue
          fields: [
            {
              name: "▸ Source",
              value: `\`${companyName}\``,
              inline: true,
            },
            {
              name: "▸ Context",
              value: `\`${industryContext} Persona\``,
              inline: true,
            },
            {
              name: "▸ Channel",
              value: `\`${contactMethod}\``,
              inline: false,
            },
            {
              name: "▸ Device",
              value: `\`${deviceType}\``,
              inline: true,
            },
            {
              name: "▸ Timestamp",
              value: `\`${timestamp}\``,
              inline: true,
            },
          ],
          footer: {
            text: "Return to the Dashboard to engage: foliogen.in/dashboard",
          },
          timestamp: timestamp,
        },
      ],
    };

    // ── Dispatch to webhook (non-blocking safety) ─────────────────────
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(webhookPayload),
    });

    if (!webhookResponse.ok) {
      const errText = await webhookResponse.text().catch(() => "");
      console.error(`Webhook dispatch failed: ${webhookResponse.status} ${errText}`);
    }

    return new Response(
      JSON.stringify({ dispatched: true, company: companyName }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    // Silent failure — never block the upstream DB operation
    console.error("notify-lead-ping error:", error?.message || error);
    return new Response(
      JSON.stringify({ error: "Internal" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
