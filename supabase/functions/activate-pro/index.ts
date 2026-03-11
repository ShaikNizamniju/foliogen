import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  corsHeaders,
  checkTieredRateLimit,
  rateLimitedResponse,
  getClientIP,
  validateText,
  validationError,
  errorResponse,
  resolveTier,
} from "../_shared/security.ts";
import { PLAN_AMOUNT_CONFIG } from "../_shared/constants.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Tier-based rate limit (conservative for payment endpoint)
    const ip = getClientIP(req);
    const { allowed, retryAfterSeconds } = checkTieredRateLimit(`activate:${ip}`, 'FREE');
    if (!allowed) return rateLimitedResponse(retryAfterSeconds);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return errorResponse('Authorization required', 401);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return errorResponse('Invalid token', 401);
    }

    const userId = user.id;
    const { paymentId } = await req.json();

    // ── Allow-list validation ────────────────────────────────────────────
    const payCheck = validateText(paymentId, "Payment ID", 100, 5);
    if (!payCheck.valid) return validationError(payCheck.error!);

    const RAZORPAY_KEY_ID = Deno.env.get('razorpay_key_id');
    const RAZORPAY_KEY_SECRET = Deno.env.get('razorpay_key_secret');

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      console.error('Razorpay credentials not configured');
      return errorResponse('Payment verification not configured', 500);
    }

    const verifyResponse = await fetch(
      `https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`,
      {
        headers: {
          'Authorization': `Basic ${btoa(RAZORPAY_KEY_ID + ':' + RAZORPAY_KEY_SECRET)}`,
        },
      }
    );

    if (!verifyResponse.ok) {
      console.error('Razorpay verification failed:', verifyResponse.status);
      return errorResponse('Invalid payment', 400);
    }

    const payment = await verifyResponse.json();

    const validAmounts = Object.keys(PLAN_AMOUNT_CONFIG).map(Number);
    if (payment.status !== 'captured' || !validAmounts.includes(payment.amount) || payment.currency !== 'INR') {
      console.error('Payment verification failed:', payment.status, payment.amount, payment.currency);
      return errorResponse('Payment verification failed', 400);
    }

    const config = PLAN_AMOUNT_CONFIG[payment.amount];
    const now = new Date();
    const renewalDate = new Date(now);
    renewalDate.setDate(renewalDate.getDate() + config.renewalDays);

    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Check if this payment ID was already used
    const { data: existingProfile } = await adminClient
      .from('profiles')
      .select('subscription_id')
      .eq('subscription_id', paymentId)
      .maybeSingle();

    if (existingProfile) {
      return errorResponse('Payment already used', 400);
    }

    const { error: updateError } = await adminClient
      .from('profiles')
      .update({
        is_pro: true,
        subscription_id: paymentId,
        pro_since: now.toISOString(),
        plan_type: config.planType,
        subscription_status: 'active',
        next_renewal_date: renewalDate.toISOString(),
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating pro status:', updateError);
      return errorResponse('Failed to activate Pro', 500);
    }

    // Send confirmation email via EmailJS (non-blocking)
    try {
      const EMAILJS_SERVICE_ID = Deno.env.get('EMAILJS_SERVICE_ID');
      const EMAILJS_TEMPLATE_ID = Deno.env.get('EMAILJS_TEMPLATE_ID');
      const EMAILJS_PUBLIC_KEY = Deno.env.get('EMAILJS_PUBLIC_KEY');

      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        const planLabel = config.planType === 'pro' ? 'Pro (₹999/year)' : 'Basic (₹199/mo)';
        await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: EMAILJS_SERVICE_ID,
            template_id: EMAILJS_TEMPLATE_ID,
            user_id: EMAILJS_PUBLIC_KEY,
            template_params: {
              from_name: "Foliogen",
              from_email: "noreply@foliogen.in",
              to_email: user.email,
              to_name: user.user_metadata?.full_name || "there",
              message: `🎉 Welcome to Foliogen ${config.planType === 'pro' ? 'Pro' : 'Basic'}!\n\nYour ${planLabel} plan is now active.\nPayment ID: ${paymentId}\nAmount: ₹${payment.amount / 100}\n\nYou now have access to ${config.planType === 'pro' ? 'all 19+ templates, Priority AI, SpyGlass Analytics, and more' : '4 premium templates and standard AI suggestions'}.\n\nThank you for choosing Foliogen!\n— Team Foliogen`,
            },
          }),
        });
        
      }
    } catch (emailErr) {
      console.error('Email send failed (non-blocking):', emailErr);
    }

    console.log(`${config.planType} activated for user ${userId} with payment ${paymentId}`);

    return new Response(
      JSON.stringify({ success: true, planType: config.planType }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Activate pro error:', error);
    return errorResponse('An unexpected error occurred', 500);
  }
});
