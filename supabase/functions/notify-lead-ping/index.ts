import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, checkRateLimit, rateLimitedResponse, getClientIP } from "../_shared/security.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

/**
 * notify-lead-ping
 * ─────────────────────────────────────────────────────────────────────
 * Real-Time Webhook Notification Bridge.
 *
 * SECURITY MODEL:
 *   This endpoint is invoked ONLY by the database (via pg_net / webhook trigger)
 *   using the service-role key. Requests from end users — even authenticated
 *   ones — are rejected. The payload's `record.id` is additionally verified
 *   against the real `visit_logs` row to prevent forged notifications.
 *
 * Env:
 *   WEBHOOK_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ── Defense-in-depth: per-IP rate limit ─────────────────────────
    const ip = getClientIP(req);
    const rl = checkRateLimit(`notify-lead-ping:${ip}`, 30, 60_000);
    if (!rl.allowed) return rateLimitedResponse(rl.retryAfterSeconds);

    // ── Require the service-role key (only the DB trigger has it) ──
    const authHeader = req.headers.get("Authorization") || "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!serviceRoleKey || bearer !== serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Forbidden" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
    const record = payload.record || payload;

    // ── Guard: Only fire for actual pings ──────────────────────────
    if (!record || record.is_ping !== true) {
      return new Response(
        JSON.stringify({ skipped: true, reason: "Not a ping event" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Verify the record actually exists in visit_logs ────────────
    if (!record.id) {
      return new Response(
        JSON.stringify({ error: "Missing record id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const admin = createClient(supabaseUrl, serviceRoleKey);
    const { data: real, error: lookupError } = await admin
      .from("visit_logs")
      .select("id, company_name, role_target, created_at, is_ping, contact_method, industry_context, device_type")
      .eq("id", record.id)
      .maybeSingle();

    if (lookupError || !real || real.is_ping !== true) {
      return new Response(
        JSON.stringify({ error: "Record not found or not a ping" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Use verified DB values, never the request body ─────────────
    const companyName = String((real as any).company_name || (real as any).company || "Confidential/Stealth Entity").trim().slice(0, 200);
    const contactMethod = String((real as any).contact_method || "Not Provided").trim().slice(0, 200);
    const industryRaw = String((real as any).industry_context || "General").trim().slice(0, 100);
    const industryContext =
      industryRaw === "none" ? "General Fit" :
      industryRaw.charAt(0).toUpperCase() + industryRaw.slice(1);
    const timestamp = (real as any).created_at || new Date().toISOString();
    const deviceType = String((real as any).device_type || "Unknown").slice(0, 50);

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
