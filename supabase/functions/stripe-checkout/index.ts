import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.15.0?target=deno";

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
            console.error(`[Stripe Checkout] User mismatch! JWT: ${user.id}, Payload: ${userId}`);
            return new Response(JSON.stringify({ error: "Unauthorized - User mismatch" }), {
                status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        if (planId !== 'basic' && planId !== 'pro') {
            console.error(`[Stripe Checkout] Invalid plan ID provided: ${planId}`);
            return new Response(JSON.stringify({ error: "Invalid plan ID" }), {
                status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
        if (!stripeKey) {
            console.error('[Stripe Checkout] STRIPE_SECRET_KEY is missing from environment variables');
            throw new Error('STRIPE_SECRET_KEY is missing');
        }

        // Fetch Price IDs securely from the environment
        const priceBasic = Deno.env.get('STRIPE_PRICE_BASIC');
        const pricePro = Deno.env.get('STRIPE_PRICE_PRO');

        if (!priceBasic || !pricePro) {
            console.error(`[Stripe Checkout] Missing Price IDs. STRIPE_PRICE_BASIC: ${!!priceBasic}, STRIPE_PRICE_PRO: ${!!pricePro}`);
            throw new Error('STRIPE_PRICE_BASIC or STRIPE_PRICE_PRO is missing from environment variables. Please add them in Supabase Edge Function Secrets.');
        }

        const selectedPriceId = planId === 'pro' ? pricePro : priceBasic;
        

        
        const stripe = new Stripe(stripeKey, {
            apiVersion: '2023-10-16',
            httpClient: Stripe.createFetchHttpClient(),
        });

        const origin = req.headers.get('origin') || 'https://foliogen.in';
        const dashboardUrl = `${origin}/dashboard`;

        

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            customer_email: user.email,
            allow_promotion_codes: true,
            line_items: [
                {
                    price: selectedPriceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/?success=true&plan=${planId}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${dashboardUrl}?checkout_status=cancelled`,
            client_reference_id: userId,
            metadata: {
                userId: userId,
                planId: planId,
            },
        });

        

        // 5. Insert pending payment record via Database (Using Service Role for inserts)
        const serviceClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        console.log('[Stripe Checkout] Inserting pending payment into Supabase...');
        await serviceClient
            .from('payments')
            .insert({
                user_id: userId,
                razorpay_order_id: session.id, // we hijack the column for Stripe session ID
                plan_id: planId,
                status: 'pending',
            });

        console.log('[Stripe Checkout] Database insert complete. Returning URL.');

        return new Response(JSON.stringify({ url: session.url }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error("stripe-checkout error:", error?.message || error);
        return new Response(JSON.stringify({ error: "INTERNAL_ERROR", message: error?.message || "Internal Server Error" }), {
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
