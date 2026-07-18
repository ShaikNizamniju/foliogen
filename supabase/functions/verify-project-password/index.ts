import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  corsHeaders,
  checkRateLimit,
  rateLimitedResponse,
  getClientIP,
  validateText,
  validationError,
  errorResponse,
  logSecurityEvent,
} from "../_shared/security.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ip = getClientIP(req);
    const { profileUserId, projectId, password } = await req.json();
    const { allowed, retryAfterSeconds } = checkRateLimit(`verify-pw:${ip}`, 20, 15 * 60 * 1000);

    if (!allowed) {
      await logSecurityEvent('rate_limit_hit', 'warning', 'verify-project-password', { ip, projectId }, profileUserId, req);
      return rateLimitedResponse(retryAfterSeconds);
    }

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

    // Delegate to bcrypt-backed DB function (constant-time crypt() comparison).
    const { data: isValid, error } = await supabase.rpc("verify_project_password", {
      p_user_id: profileUserId,
      p_project_id: projectId,
      p_password: password,
    });

    if (error) {
      return errorResponse("Verification failed", 500);
    }

    if (!isValid) {
      await logSecurityEvent('auth_attempt', 'warning', 'verify-project-password', { ip, projectId, success: false }, profileUserId, req);
      return new Response(
        JSON.stringify({ success: false, error: "Incorrect password" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (_error) {
    return errorResponse("Internal error", 500);
  }
});
