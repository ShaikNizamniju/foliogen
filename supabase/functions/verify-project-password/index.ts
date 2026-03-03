import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { profileUserId, projectId, password } = await req.json();

    if (!profileUserId || !projectId || !password) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate input lengths
    if (typeof password !== "string" || password.length > 200) {
      return new Response(
        JSON.stringify({ error: "Invalid password" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role to read the actual password from the profiles table (not the public view)
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
      return new Response(
        JSON.stringify({ error: "Profile not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const projects = profile.projects as any[];
    if (!Array.isArray(projects)) {
      return new Response(
        JSON.stringify({ error: "Project not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const project = projects.find((p: any) => p.id === projectId);
    if (!project || !project.isProtected) {
      return new Response(
        JSON.stringify({ error: "Project not found or not protected" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Constant-time comparison using Deno's crypto.subtle.timingSafeEqual
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
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
