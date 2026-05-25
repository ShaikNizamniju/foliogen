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
  _user: PaymentUser,
  _planKey: PlanKey,
  onSuccess: (planId: string) => void
): Promise<void> {
  // Foliogen is free forever — no checkout, no Stripe redirect.
  toast({
    title: "You're all set — it's free!",
    description: "Every feature is unlocked for every user. No payment needed.",
  });
  try { triggerCelebration(); } catch {}
  onSuccess('free');
}



