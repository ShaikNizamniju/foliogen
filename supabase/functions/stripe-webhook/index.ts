import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    // CORS Preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    // Stripe Webhook is disabled as part of the pivot to a free model.
    // We return 200 OK to acknowledge receipt and prevent Stripe retries,
    // but no processing is performed to neutralize security risks.
    return new Response(JSON.stringify({ 
        received: true,
        message: "Stripe webhook processed successfully (dry run - free model active)"
    }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
});
