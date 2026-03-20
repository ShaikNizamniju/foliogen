import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

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

    // This route is disabled as part of the pivot to a free model.
    // We return a 200 OK with a redirect URL to the success page to handle legacy calls gracefully,
    // though the frontend should be updated to bypass this.
    return new Response(JSON.stringify({ 
        url: `${req.headers.get('origin') || 'https://www.foliogen.in'}/dashboard?status=success&mode=free_testing`,
        message: "Stripe gateway is disabled. Enjoy Pro features for free!"
    }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
});
