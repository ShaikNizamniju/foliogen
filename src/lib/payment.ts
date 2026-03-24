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
    
    // Initiate server-side checkout via Stripe edge function
    toast({ 
      title: "Redirecting to checkout…", 
      description: `Setting up your ${plan.label} plan.` 
    });

    const { data, error } = await supabase.functions.invoke('stripe-checkout', {
      body: {
        planId: plan.id,
        userId: user.id,
        email: user.email,
      },
    });

    if (error || !data?.url) {
      console.error('[Payment] Checkout error:', error, data);
      toast({ 
        title: "Checkout Error", 
        description: "Could not start checkout. Please try again.", 
        variant: "destructive" 
      });
      return;
    }

    // Redirect to Stripe-hosted checkout
    window.location.href = data.url;

  } catch (err: any) {
    console.error('[Payment] Unexpected error during free pivot:', err?.message, err);
    toast({ title: "Activation Error", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
  }
}


