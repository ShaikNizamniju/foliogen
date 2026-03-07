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
        const { variantId, userId, email, planId } = await req.json();

        const LS_API_KEY = Deno.env.get('LEMONSQUEEZY_API_KEY');
        const LS_STORE_ID = Deno.env.get('LEMONSQUEEZY_STORE_ID');

        if (!LS_API_KEY || !LS_STORE_ID) {
            console.error("Missing LemonSqueezy configuration");
            return new Response(JSON.stringify({ error: "LemonSqueezy not configured on server" }), {
                status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // Create checkout session via LemonSqueezy API (v1)
        const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${LS_API_KEY}`,
                'Content-Type': 'application/vnd.api+json',
                'Accept': 'application/vnd.api+json',
            },
            body: JSON.stringify({
                data: {
                    type: 'checkouts',
                    attributes: {
                        checkout_data: {
                            email: email,
                            custom: {
                                user_id: userId,
                                plan_id: planId,
                            },
                        },
                        product_options: {
                            enabled_variants: [variantId],
                            redirect_url: `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.supabase.co')}/dashboard?section=billing&status=success`,
                        },
                    },
                    relationships: {
                        store: {
                            data: {
                                type: 'stores',
                                id: LS_STORE_ID,
                            },
                        },
                        variant: {
                            data: {
                                type: 'variants',
                                id: variantId,
                            },
                        },
                    },
                },
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("LemonSqueezy API Error:", result);
            return new Response(JSON.stringify({ error: "Failed to create checkout", details: result }), {
                status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const checkoutUrl = result?.data?.attributes?.url;

        return new Response(JSON.stringify({ checkoutUrl }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error("create-lemonsqueezy-checkout error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error", message: error.message }), {
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
