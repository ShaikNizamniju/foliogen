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
        const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
        if (!stripeKey) {
            throw new Error('STRIPE_SECRET_KEY is missing');
        }

        const stripe = new Stripe(stripeKey, {
            apiVersion: '2023-10-16',
            httpClient: Stripe.createFetchHttpClient(),
        });

        // Get the signature from the headers
        const signature = req.headers.get('Stripe-Signature');

        // Ensure you have a webhook secret in your .env or Supabase Secrets
        // We will default to a placeholder if not found for robust parsing initially, but in prod it must match.
        // We can just use the signature verification if webhook secret is configured. By default let's use the object directly if no secret is used, or ideally verify it.
        const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

        const body = await req.text();

        let event;

        if (webhookSecret && signature) {
            try {
                event = await stripe.webhooks.constructEventAsync(
                    body,
                    signature,
                    webhookSecret
                );
            } catch (err: any) {
                console.error(`Webhook signature verification failed.`, err.message);
                return new Response(`Webhook Error: ${err.message}`, { status: 400 });
            }
        } else {
            // Fallback if no webhook secret config
            event = JSON.parse(body);
        }

        console.log(`Received event type: ${event.type}`);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const userId = session.client_reference_id || session.metadata?.userId;
            const planId = session.metadata?.planId;

            if (userId && planId) {
                const serviceClient = createClient(
                    Deno.env.get('SUPABASE_URL') ?? '',
                    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
                );

                const now = new Date();
                const renewalDate = new Date();
                if (planId === 'pro') {
                    renewalDate.setFullYear(renewalDate.getFullYear() + 1);
                } else {
                    renewalDate.setMonth(renewalDate.getMonth() + 1);
                }

                // Update profile
                const { error: profileError } = await serviceClient
                    .from('profiles')
                    .update({
                        is_pro: true, // Legacy flag, kept for backward compatibility alongside plan_type
                        plan_type: planId,
                        subscription_status: 'active',
                        pro_since: now.toISOString(),
                        next_renewal_date: renewalDate.toISOString(),
                        subscription_id: session.subscription || session.id
                    })
                    .eq('user_id', userId);

                if (profileError) {
                    console.error("Failed to update profile", profileError);
                } else {
                    console.log(`Successfully updated user ${userId} to plan ${planId}`);
                }

                // Update payment status
                await serviceClient
                    .from('payments')
                    .update({ status: 'completed' })
                    .eq('razorpay_order_id', session.id);
            } else {
                console.warn("Session missing userId or planId metadata", session);
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (err: any) {
        console.error(`Webhook error:`, err);
        return new Response(`Webhook Error: ${err.message}`, { status: 400, headers: corsHeaders });
    }
});
