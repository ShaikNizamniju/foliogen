import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import * as crypto from "https://deno.land/std@0.177.0/crypto/mod.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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
                status: 401, headers: { ...corsHeaders }
            });
        }

        const body = await req.json();
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, userId, planId } = body;

        if (user.id !== userId) {
            return new Response(JSON.stringify({ error: "User ID mismatch" }), {
                status: 403, headers: { ...corsHeaders }
            });
        }

        // 2. Validate HMAC Signature
        const secret = Deno.env.get('RAZORPAY_KEY_SECRET');
        if (!secret) {
            throw new Error("Server configuration missing");
        }

        const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
        const key = await crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(secret),
            { name: "HMAC", hash: "SHA-256" },
            false, ["sign"]
        );

        const signatureBuffer = await crypto.subtle.sign(
            "HMAC", key, new TextEncoder().encode(payload)
        );
        const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
            .map(b => b.toString(16).padStart(2, '0')).join('');

        if (expectedSignature !== razorpay_signature) {
            console.error("Signature mismatch detected:", { order: razorpay_order_id });
            return new Response(JSON.stringify({ success: false, error: 'Invalid signature' }), {
                status: 400, headers: { ...corsHeaders }
            });
        }

        // 3. Verify Order Details & Upsert Database (Using Service Role)
        const serviceClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // Verify existing pending order matches constraints
        const { data: pendingPayment, error: fetchError } = await serviceClient
            .from('payments')
            .select('*')
            .eq('razorpay_order_id', razorpay_order_id)
            .eq('user_id', userId)
            .single();

        if (fetchError || !pendingPayment) {
            console.error("Payment log not found:", fetchError);
            return new Response(JSON.stringify({ success: false, error: 'Payment not identified' }), {
                status: 404, headers: { ...corsHeaders }
            });
        }

        if (pendingPayment.status === 'completed') {
            // Idempotency check: already verified
            return new Response(JSON.stringify({ success: true, planId: pendingPayment.plan_id }), {
                status: 200, headers: { ...corsHeaders }
            });
        }

        if (pendingPayment.plan_id !== planId) {
            console.error("Plan ID verification failure client vs server");
            return new Response(JSON.stringify({ success: false, error: 'Plan mismatch' }), {
                status: 400, headers: { ...corsHeaders }
            });
        }

        // 4. Calculate Subscriptions
        const startedAt = new Date();
        const expiresAt = new Date();
        if (planId === 'basic') {
            expiresAt.setMonth(expiresAt.getMonth() + 1);
        } else {
            expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        }

        // 5. Transaction: Update payment record + upsert subscription
        // Since Supabase RPC requires a custom postgres function for multi-table transactions natively,
        // we sequentially execute them relying on async checks.
        const { error: updateError } = await serviceClient
            .from('payments')
            .update({
                status: 'completed',
                razorpay_payment_id: razorpay_payment_id,
                completed_at: new Date().toISOString(),
            })
            .eq('razorpay_order_id', razorpay_order_id);

        if (updateError) throw updateError;

        const { error: upsertError } = await serviceClient
            .from('user_subscriptions')
            .upsert({
                user_id: userId,
                plan_id: planId,
                started_at: startedAt.toISOString(),
                expires_at: expiresAt.toISOString(),
                payment_id: razorpay_payment_id,
                is_active: true,
            }, { onConflict: 'user_id' });

        if (upsertError) throw upsertError;

        return new Response(JSON.stringify({
            success: true,
            planId,
            expiresAt: expiresAt.toISOString()
        }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (err) {
        console.error("Verification error:", err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500, headers: { ...corsHeaders }
        });
    }
});
