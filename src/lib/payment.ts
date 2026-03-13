import { supabase } from '@/lib/supabase_v2';
import { triggerCelebration } from "./confetti";
import { toast } from "@/hooks/use-toast";

declare global {
  interface Window { Razorpay: any; }
}

export interface PaymentUser {
  id: string;
  email?: string;
  name?: string;
}

export const PLANS = {
  BASIC: {
    id: 'basic',
    amount: 19900,           // ₹199 in paise
    label: 'Basic',
    description: '1 Month Access — Foliogen Basic',
    duration: '1 month',
    durationMonths: 1,
  },
  PRO: {
    id: 'pro',
    amount: 99900,           // ₹999 in paise
    label: 'Pro',
    description: '1 Year Access — Foliogen Pro',
    duration: '1 year',
    durationMonths: 12,
  },
} as const;

export type PlanKey = keyof typeof PLANS;

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

export async function handlePayment(
  user: PaymentUser,
  planKey: PlanKey,
  onSuccess: (planId: string) => void
): Promise<void> {
  try {
    if (!STRIPE_PUBLISHABLE_KEY) {
      throw new Error("STRIPE_NOT_CONFIGURED");
    }

    const plan = PLANS[planKey];
    toast({ title: "Initializing secure checkout...", description: "Please wait." });

    // Create Checkout Session via Edge Function
    const { data, error } = await supabase.functions.invoke('stripe-checkout', {
      body: {
        planId: plan.id,
        userId: user.id
      }
    });

    if (error || !data?.url) {
      
      toast({ title: "Payment Error", description: "Failed to initialize secure checkout. Please try again.", variant: "destructive" });
      return;
    }

    // Redirect to Stripe Checkout
    window.location.href = data.url;
  } catch (err) {
    
    toast({ title: "Payment Error", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
  }
}


