import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FOLIOGEN_LOGO = 'https://www.foliogen.in/assets/logo-DY04JMdn.png';
const DASHBOARD_URL = 'https://www.foliogen.in/dashboard?section=overview';

function buildWelcomeEmail(name: string, isGoogle: boolean): string {
    const greeting = name ? `Hi ${name},` : 'Welcome to Foliogen!';
    const subheading = isGoogle
        ? "You've successfully signed in via Google."
        : "Your account is ready. Let's build something remarkable.";

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Foliogen</title>
</head>
<body style="margin:0;padding:0;background:#0d0f14;font-family:'Inter',system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0f14;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:#111318;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.07);">

          <!-- Header bar -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#4f46e5);padding:32px 40px;text-align:center;">
              <img src="${FOLIOGEN_LOGO}" alt="Foliogen" width="48" height="48"
                   style="display:inline-block;border-radius:12px;margin-bottom:12px;" />
              <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                Foliogen
              </h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:13px;">
                AI-Powered Professional Portfolios
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#fff;font-size:22px;font-weight:700;">
                ${greeting}
              </h2>
              <p style="margin:0 0 24px;color:#8b9ab5;font-size:15px;line-height:1.6;">
                ${subheading}
              </p>

              <p style="margin:0 0 32px;color:#8b9ab5;font-size:15px;line-height:1.6;">
                Your AI-powered professional identity is ready. Head to your dashboard to:
              </p>

              <ul style="margin:0 0 32px;padding:0 0 0 20px;color:#8b9ab5;font-size:15px;line-height:2;">
                <li>🎨 Pick a portfolio template</li>
                <li>✨ Let AI enhance your bio and project descriptions</li>
                <li>🎯 Match your profile to job descriptions</li>
                <li>📤 Publish and share your link in seconds</li>
              </ul>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${DASHBOARD_URL}"
                       style="display:inline-block;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;
                              font-size:15px;font-weight:600;padding:14px 32px;border-radius:12px;
                              text-decoration:none;letter-spacing:0.2px;box-shadow:0 8px 24px rgba(99,102,241,0.4);">
                      Go to Dashboard →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:rgba(255,255,255,0.07);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0;color:#4a5568;font-size:12px;line-height:1.6;">
                You received this because you created an account on
                <a href="https://www.foliogen.in" style="color:#6366f1;text-decoration:none;">foliogen.in</a>.
                <br/>If this wasn't you, please
                <a href="https://forms.gle/placeholder" style="color:#6366f1;text-decoration:none;">report it here</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
        if (!RESEND_API_KEY) {
            return new Response(JSON.stringify({ error: 'Email service not configured' }), {
                status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        // Authenticate the caller
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: authHeader } },
        });

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const { name, provider } = await req.json();
        // Use the authenticated user's email — never trust the request body
        const email = user.email;
        if (!email) {
            return new Response(JSON.stringify({ error: 'No email on authenticated user' }), {
                status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const isGoogle = provider === 'google';
        const displayName = name || email.split('@')[0];
        const subject = isGoogle
            ? `🔐 You're signed in to Foliogen — ${displayName}`
            : `🎉 Welcome to Foliogen, ${displayName}!`;

        const html = buildWelcomeEmail(displayName, isGoogle);

        const resendRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Foliogen <hello@foliogen.in>',
                to: [email],
                subject,
                html,
            }),
        });

        if (!resendRes.ok) {
            const err = await resendRes.text();
            console.error('[on-auth-success] Resend API error:', err);
            return new Response(JSON.stringify({ error: 'Failed to send email' }), {
                status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const data = await resendRes.json();

        return new Response(JSON.stringify({ success: true, id: data.id }), {
            status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('on-auth-success error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
