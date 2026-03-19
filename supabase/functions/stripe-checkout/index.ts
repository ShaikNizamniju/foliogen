import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.15.0?target=deno";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
    // CORS Preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
        
        // 1. Authenticate user from JWT
        const supabaseClient = createClient(
            supabaseUrl,
            supabaseAnonKey,
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        );

        const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
        if (authError || !user) {
            console.error("[Stripe Checkout] Authentication error:", authError);
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const { planId, userId, successUrl, cancelUrl } = await req.json();

        // Security check: Ensure the user is requesting a checkout for themselves
        if (user.id !== userId) {
            console.error(`[Stripe Checkout] User ID mismatch: JWT ${user.id} vs Payload ${userId}`);
            return new Response(JSON.stringify({ error: "Forbidden: User ID mismatch" }), {
                status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
        if (!stripeSecretKey) {
            console.error("[Stripe Checkout] STRIPE_SECRET_KEY missing from environment");
            return new Response(JSON.stringify({ error: "Configuration Error: Stripe Key missing" }), {
                status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // 2. Map Plan IDs to Environment Secret Price IDs
        let selectedPriceId: string | undefined;
        
        const priceBasic = Deno.env.get('STRIPE_PRICE_BASIC');
        const pricePro = Deno.env.get('STRIPE_PRICE_PRO');
        const priceGlobal = Deno.env.get('STRIPE_PRICE_GLOBAL');

        if (planId === 'basic') {
            selectedPriceId = priceBasic;
        } else if (planId === 'pro' || planId === 'sprint_pass') {
            selectedPriceId = pricePro;
        } else if (planId === 'global') {
            selectedPriceId = priceGlobal;
        }

        if (!selectedPriceId) {
            console.error(`[Stripe Checkout] No Price ID found for plan: ${planId}`);
            // Fallback to pro if something goes wrong but plan specifically exists
            selectedPriceId = pricePro; 
        }

        if (!selectedPriceId) {
             return new Response(JSON.stringify({ error: "Configuration Error: Invalid Price ID Mapping" }), {
                status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        console.log(`[Stripe Checkout] Initializing session for User ${userId}, Plan ${planId}, Price ${selectedPriceId}`);

        const stripe = new Stripe(stripeSecretKey, {
            apiVersion: '2023-10-16',
            httpClient: Stripe.createFetchHttpClient(),
        });

        // 3. Create Checkout Session
        const origin = 'https://www.foliogen.in';
        
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
            success_url: successUrl || `${origin}/dashboard?checkout_status=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl || `${origin}/dashboard?checkout_status=cancelled`,
            client_reference_id: userId,
            metadata: {
                userId: userId,
                planId: planId || 'custom',
                priceId: selectedPriceId
            },
        });

        // 4. Record pending payment (using Service Role for bypass)
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
        const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

        await serviceClient
            .from('payments')
            .insert({
                user_id: userId,
                razorpay_order_id: session.id, // Reusing column for Stripe session
                plan_id: planId,
                status: 'pending',
                amount: session.amount_total || 0,
                currency: session.currency || 'inr'
            });

        console.log(`[Stripe Checkout] Session created: ${session.id}`);

        return new Response(JSON.stringify({ url: session.url }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error("[Stripe Checkout] Fatal Error:", error);
        
        return new Response(JSON.stringify({ 
            error: "STRIPE_ERROR", 
            message: error.message || "Failed to create checkout session",
            details: error 
        }), {
            status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
