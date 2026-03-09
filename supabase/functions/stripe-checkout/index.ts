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
            return new Response(JSON.stringify({ error: "Unauthorized - User mismatch" }), {
                status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        if (planId !== 'basic' && planId !== 'pro') {
            return new Response(JSON.stringify({ error: "Invalid plan ID" }), {
                status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const amount = planId === 'basic' ? 19900 : 99900; // in paise

        const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
        if (!stripeKey) {
            throw new Error('STRIPE_SECRET_KEY is missing');
        }

        const stripe = new Stripe(stripeKey, {
            apiVersion: '2023-10-16',
            httpClient: Stripe.createFetchHttpClient(),
        });

        // 4. Create Stripe Checkout Session
        // Note: The frontend base URL must be dynamic. We can infer it from Origin or referer.
        const origin = req.headers.get('origin') || 'https://foliogen.in';
        const dashboardUrl = `${origin}/dashboard`;

        let productName = planId === 'pro' ? 'Foliogen Pro - 1 Year' : 'Foliogen Basic - 1 Month';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            customer_email: user.email,
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: productName,
                            description: planId === 'pro' ? 'Unlimited Portfolios, Features unlocked' : '4 Portfolio Templates, Features unlocked',
                            images: ['https://www.foliogen.in/og-image.png'],
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/success?checkout_status=success&plan=${planId}&session_id={CHECKOUT_SESSION_ID}`,
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

        await serviceClient
            .from('payments')
            .insert({
                user_id: userId,
                razorpay_order_id: session.id, // we hijack the column for Stripe session ID
                amount: amount,
                plan_id: planId,
                status: 'pending',
            });

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
