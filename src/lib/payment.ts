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
    label: 'Pro',
    description: '1 Year Access — Foliogen Pro',
    duration: '1 year',
    durationMonths: 12,
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

    const { data, error } = await supabase.functions.invoke('stripe-checkout', {
      body: {
        planId: plan.id,
        userId: user.id
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


