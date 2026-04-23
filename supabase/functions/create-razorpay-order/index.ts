import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    // CORS Preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // 1. Authenticate user from JWT
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        );

        const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
        if (authError || !user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const { planId, userId } = await req.json();

        if (user.id !== userId) {
            return new Response(JSON.stringify({ error: "Unauthorized - User mismatch" }), {
                status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // 2. Validate planId and derive amount
        if (planId !== 'basic' && planId !== 'pro') {
            return new Response(JSON.stringify({ error: "Invalid plan ID" }), {
                status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const amount = planId === 'basic' ? 19900 : 99900; // in paise

        // 3. Setup Razorpay credentials
        const rzpKeyId = Deno.env.get('RAZORPAY_LIVE_KEY_ID') || Deno.env.get('VITE_RAZORPAY_LIVE_KEY_ID');
        const rzpKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET') || Deno.env.get('RAZORPAY_SECRET_KEY');

        if (!rzpKeyId || !rzpKeySecret) {
            // Log exactly which var is missing to help diagnose in Supabase logs
            const missingVars = [
                !Deno.env.get('RAZORPAY_LIVE_KEY_ID') && !Deno.env.get('VITE_RAZORPAY_LIVE_KEY_ID') ? 'RAZORPAY_LIVE_KEY_ID' : null,
                !Deno.env.get('RAZORPAY_KEY_SECRET') && !Deno.env.get('RAZORPAY_SECRET_KEY') ? 'RAZORPAY_KEY_SECRET' : null,
            ].filter(Boolean);
            console.error('Missing Razorpay secrets:', missingVars.join(', '));
            return new Response(JSON.stringify({ error: "MISSING_CREDENTIALS", message: "Payment provider not configured. Please contact support." }), {
                status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const basicAuth = btoa(`${rzpKeyId}:${rzpKeySecret}`);

        // 4. Create Razorpay Order
        const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${basicAuth}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amount,
                currency: 'INR',
                receipt: `rcpt_${userId}_${Date.now()}`,
                notes: { userId, planId },
            }),
        });

        const orderData = await rzpResponse.json();

        if (!rzpResponse.ok) {
            console.error("Razorpay order creation failed:", orderData);
            return new Response(JSON.stringify({ error: "RAZORPAY_API_ERROR", message: "Failed connecting to Razorpay. Please try again in 2 minutes." }), {
                status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // 5. Insert pending payment record via Database (Using Service Role for inserts)
        const serviceClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const { error: dbError } = await serviceClient
            .from('payments')
            .insert({
                user_id: userId,
                razorpay_order_id: orderData.id,
                amount: amount,
                plan_id: planId,
                status: 'pending',
            });

        if (dbError) {
            console.error("Error logging pending payment:", dbError);
            throw new Error("Internal database error");
        }

        // 6. Return response safely
        return new Response(JSON.stringify({
            orderId: orderData.id,
            amount: amount,
            currency: "INR"
        }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error("create-razorpay-order error:", error?.message || error);
        return new Response(JSON.stringify({ error: "INTERNAL_ERROR", message: "An unexpected error occurred. Please try again." }), {
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
