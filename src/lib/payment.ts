import { supabase } from '@/lib/supabase_v2';
import { triggerCelebration } from "./confetti";
import { toast } from "@/hooks/use-toast";

export interface PaymentUser {
  id: string;
  email?: string;
  name?: string;
}

export const PLANS = {
  BASIC: {
    id: 'basic',
    amount: 19900,
    label: 'Basic',
    description: '1 Month Access — Foliogen Basic',
    duration: '1 month',
    durationMonths: 1,
  },
  PRO: {
    id: 'pro',
    amount: 99900,
    label: 'Sprint Pass (90 days)',
    description: '90 Days Access — Foliogen Pro',
    duration: '3 months',
    durationMonths: 3,
  },
  GLOBAL: {
    id: 'global',
    amount: 1999, // USD centric or high tier fallback
    label: 'Global Pass',
    description: 'Lifetime Access — Foliogen Global',
    duration: 'unlimited',
    durationMonths: 1200,
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export async function handlePayment(
  user: PaymentUser,
  planKey: PlanKey,
  onSuccess: (planId: string) => void
): Promise<void> {
  try {
    const plan = PLANS[planKey];
    toast({ title: "Initializing secure checkout...", description: "Please wait." });

    const payload = {
      planId: plan.id,
      userId: user.id,
      successUrl: window.location.origin + '/dashboard?section=billing&status=success',
      cancelUrl: window.location.origin + '/dashboard?section=billing&checkout_status=cancelled'
    };

    console.log("Payload sent to Edge Function:", payload);

    const { data, error } = await supabase.functions.invoke('stripe-checkout', {
      body: payload,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (error || !data?.url) {
      const errorMessage = error?.message || '';
      console.error('[Payment] Checkout failed:', { error, data, errorMessage });
      if (errorMessage.includes('Failed to send a request to the Edge Function') || errorMessage.includes('offline')) {
        toast({ title: "Payment System Offline", description: "The checkout server is currently unreachable. Please try again later.", variant: "destructive" });
      } else {
        toast({ title: "Payment Error", description: "Failed to initialize secure checkout. Please try again.", variant: "destructive" });
      }
      return;
    }

    window.location.href = data.url;
  } catch (err: any) {
    console.error('[Payment] Unexpected error:', err?.message, err);
    toast({ title: "Payment Error", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
  }
}


