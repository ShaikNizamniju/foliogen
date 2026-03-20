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
    
    // ──────── PIVOT: FREE MODEL ────────
    // This part is modified to bypass the Stripe checkout and grant Pro access directly.
    toast({ 
      title: "Activating Your Free Pro Access! 🚀", 
      description: "Enjoy Foliogen! All Pro features are completely free during our early testing phase." 
    });

    const now = new Date();
    const renewalDate = new Date();
    renewalDate.setFullYear(now.getFullYear() + 10); // Grant 10 years for peace of mind

    const { error } = await supabase
      .from('profiles')
      .update({
        is_pro: true,
        plan_type: plan.id,
        subscription_status: 'active',
        pro_since: now.toISOString(),
        next_renewal_date: renewalDate.toISOString(),
        subscription_id: `free_testing_${user.id}_${Date.now()}`
      } as any) // Type cast to handle cases where types might be stale
      .eq('user_id', user.id);

    if (error) {
      console.error('[Payment Bypass] Failed to activate free pro:', error);
      toast({ 
        title: "Activation Error", 
        description: "Something went wrong activating your free account. Please refresh and try again.", 
        variant: "destructive" 
      });
      return;
    }

    // Success Ceremony
    triggerCelebration();
    toast({ 
      title: "Welcome to Pro! 🎉", 
      description: `You've been successfully upgraded to the ${plan.label} plan for free.` 
    });

    // Call success callback
    setTimeout(() => {
      onSuccess(plan.id);
      window.location.href = '/dashboard?section=billing&status=success&mode=free_testing';
    }, 1500);

  } catch (err: any) {
    console.error('[Payment] Unexpected error during free pivot:', err?.message, err);
    toast({ title: "Activation Error", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
  }
}


