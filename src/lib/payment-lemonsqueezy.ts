/**
 * LemonSqueezy Payment Provider — Boilerplate
 *
 * Drop-in alternative to Razorpay for international payments.
 * To activate: replace the handlePayment import in your billing components
 * from '@/lib/payment' to '@/lib/payment-lemonsqueezy'.
 *
 * Setup:
 *  1. Create account at https://app.lemonsqueezy.com
 *  2. Add VITE_LEMONSQUEEZY_STORE_ID and VITE_LEMONSQUEEZY_VARIANT_BASIC / _PRO to .env
 *  3. Create a Supabase Edge Function `create-lemonsqueezy-checkout` (see below)
 *  4. Point your webhook at https://<project>.supabase.co/functions/v1/lemonsqueezy-webhook
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface LsPaymentUser {
    id: string;
    email?: string;
    name?: string;
}

export const LS_PLANS = {
    BASIC: {
        id: 'basic',
        variantId: import.meta.env.VITE_LEMONSQUEEZY_VARIANT_BASIC as string,
        label: 'Basic',
        description: '1 Month Access — Foliogen Basic',
    },
    PRO: {
        id: 'pro',
        variantId: import.meta.env.VITE_LEMONSQUEEZY_VARIANT_PRO as string,
        label: 'Pro',
        description: '1 Year Access — Foliogen Pro',
    },
} as const;

export type LsPlanKey = keyof typeof LS_PLANS;

/**
 * Opens a LemonSqueezy hosted checkout overlay.
 * The checkout URL is generated server-side to keep the API key secure.
 */
export async function handleLsPayment(
    user: LsPaymentUser,
    planKey: LsPlanKey,
    onSuccess?: (planId: string) => void,
): Promise<void> {
    const plan = LS_PLANS[planKey];

    if (!plan.variantId) {
        toast({
            title: 'Payment not configured',
            description: 'LemonSqueezy variant ID is missing. Check your .env file.',
            variant: 'destructive',
        });
        return;
    }

    // 1. Call our Supabase Edge Function to create a checkout session
    const { data, error } = await supabase.functions.invoke('create-lemonsqueezy-checkout', {
        body: {
            variantId: plan.variantId,
            userId: user.id,
            email: user.email || '',
            planId: plan.id,
        },
    });

    if (error || !data?.checkoutUrl) {
        console.error('LemonSqueezy checkout error:', error || data);
        toast({
            title: 'Checkout Error',
            description: 'Failed to open checkout. Please try again in 2 minutes.',
            variant: 'destructive',
        });
        return;
    }

    // 2. Open LemonSqueezy overlay
    // If you use their JS SDK: window.LemonSqueezy.Url.Open(data.checkoutUrl)
    // Fallback: redirect
    window.open(data.checkoutUrl, '_blank', 'noopener,noreferrer');

    // Note: onSuccess should be called from the webhook handler server-side,
    // then reflected via a Supabase realtime subscription on the `profiles` table.
    if (onSuccess) {
        toast({
            title: 'Checkout opened',
            description: 'Complete your purchase in the new tab. Your plan will activate automatically.',
        });
    }
}

/**
 * Edge Function stub — create at:
 *   supabase/functions/create-lemonsqueezy-checkout/index.ts
 *
 * import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
 *
 * serve(async (req) => {
 *   const { variantId, userId, email, planId } = await req.json();
 *   const LS_API_KEY = Deno.env.get('LEMONSQUEEZY_API_KEY');
 *
 *   const res = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
 *     method: 'POST',
 *     headers: {
 *       'Authorization': `Bearer ${LS_API_KEY}`,
 *       'Content-Type': 'application/vnd.api+json',
 *       'Accept': 'application/vnd.api+json',
 *     },
 *     body: JSON.stringify({
 *       data: {
 *         type: 'checkouts',
 *         attributes: {
 *           checkout_data: { email, custom: { user_id: userId, plan_id: planId } },
 *         },
 *         relationships: {
 *           store: { data: { type: 'stores', id: Deno.env.get('LS_STORE_ID') } },
 *           variant: { data: { type: 'variants', id: variantId } },
 *         },
 *       },
 *     }),
 *   });
 *
 *   const json = await res.json();
 *   const checkoutUrl = json?.data?.attributes?.url;
 *   return new Response(JSON.stringify({ checkoutUrl }), { status: 200 });
 * });
 */
