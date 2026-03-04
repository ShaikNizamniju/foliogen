import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  corsHeaders,
  checkRateLimit,
  rateLimitedResponse,
  getClientIP,
  validateText,
  validationError,
  errorResponse,
} from "../_shared/security.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Token-bucket rate limit: 100 req / 15 min per IP
    const ip = getClientIP(req);
    const { allowed, retryAfterSeconds } = checkRateLimit(`verify-pw:${ip}`, 20, 15 * 60 * 1000);
    if (!allowed) return rateLimitedResponse(retryAfterSeconds);

    const { profileUserId, projectId, password } = await req.json();

    // ── Allow-list validation ────────────────────────────────────────────
    const userIdCheck = validateText(profileUserId, "Profile User ID", 100);
    if (!userIdCheck.valid) return validationError(userIdCheck.error!);

    const projIdCheck = validateText(projectId, "Project ID", 100);
    if (!projIdCheck.valid) return validationError(projIdCheck.error!);

    if (typeof password !== "string" || password.length === 0) {
      return validationError("Password is required.");
    }
    if (password.length > 200) {
      return validationError("Password must be 200 characters or fewer.");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("projects")
      .eq("user_id", profileUserId)
      .single();

    if (error || !profile) {
      return errorResponse("Profile not found", 404);
    }

    const projects = profile.projects as any[];
    if (!Array.isArray(projects)) {
      return errorResponse("Project not found", 404);
    }

    const project = projects.find((p: any) => p.id === projectId);
    if (!project || !project.isProtected) {
      return errorResponse("Project not found or not protected", 404);
    }

    // Constant-time comparison
    const encoder = new TextEncoder();
    const expectedBytes = encoder.encode(project.password.padEnd(256, '\0'));
    const providedBytes = encoder.encode(password.padEnd(256, '\0'));
    const lengthMatch = project.password.length === password.length;
    const bytesMatch = crypto.subtle.timingSafeEqual(expectedBytes, providedBytes);
    const isValid = lengthMatch && bytesMatch;

    if (!isValid) {
      return new Response(
        JSON.stringify({ success: false, error: "Incorrect password" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch {
    return errorResponse("Internal error", 500);
  }
});
