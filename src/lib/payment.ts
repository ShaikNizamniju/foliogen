import { supabase } from "@/integrations/supabase/client";
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

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_LIVE_KEY_ID;

if (!RAZORPAY_KEY) {
  throw new Error('[Foliogen] VITE_RAZORPAY_LIVE_KEY_ID is not set. Add your Razorpay LIVE Key ID to .env');
}

if (RAZORPAY_KEY.startsWith('rzp_test_')) {
  throw new Error('[Foliogen] Test key detected. This application requires a LIVE Razorpay key (rzp_live_...)');
}

async function loadRazorpayScript(): Promise<void> {
  if (window.Razorpay) return;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.head.appendChild(script);
  });
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export async function handlePayment(
  user: PaymentUser,
  planKey: PlanKey,
  onSuccess: (planId: string) => void
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      await loadRazorpayScript();

      if (!window.Razorpay) {
        toast({ title: "Payment Error", description: "Payment system not loaded. Please refresh the page.", variant: "destructive" });
        reject(new Error("Razorpay not loaded"));
        return;
      }

      const plan = PLANS[planKey];

      // Create Order on Server First
      const { data: orderData, error: orderError } = await supabase.functions
        .invoke('create-razorpay-order', {
          body: {
            planId: plan.id,
            amount: plan.amount,
            userId: user.id
          }
        });

      if (orderError || !orderData?.orderId) {
        console.error("Order creation failed:", orderError);
        toast({ title: "Payment Error", description: "Failed to initialize payment order. Please try again in 2 minutes.", variant: "destructive" });
        reject(new Error("Failed to create order"));
        return;
      }

      const options = {
        key: RAZORPAY_KEY,           // rzp_live_...
        amount: plan.amount,
        currency: "INR",
        order_id: orderData.orderId, // REQUIRED for signature verification
        name: "Foliogen",
        description: plan.description,
        image: "https://www.foliogen.in/og-image.png",
        prefill: {
          email: user.email || "",
          name: user.name || "",
          contact: "",
        },
        notes: {
          userId: user.id,
          planId: plan.id,
        },
        theme: { color: "#1A44C8" },
        retry: { enabled: true, max_count: 3 },
        remember_customer: false,
        handler: async function (response: RazorpayResponse) {
          // Send ALL THREE values to server for signature verification
          await verifyAndActivate(response, plan, user, (planId) => {
            onSuccess(planId);
            resolve();
          });
        },
        modal: {
          ondismiss: () => resolve(),
          escape: true,
          backdropclose: false,
          animation: true,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error("Payment failed", response.error);
        toast({ title: "Payment Failed", description: response.error.description || "Your payment was declined.", variant: "destructive" });
      });
      rzp.open();
    } catch (err) {
      toast({ title: "Payment Error", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
      reject(err);
    }
  });
}

async function verifyAndActivate(
  response: RazorpayResponse,
  plan: typeof PLANS[PlanKey],
  user: PaymentUser,
  onSuccess: (planId: string) => void
): Promise<void> {
  // Show loading state
  toast({ title: "Verifying payment...", description: "Please wait." });

  const { data, error } = await supabase.functions.invoke('verify-payment', {
    body: {
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
      userId: user.id,
      planId: plan.id,
    }
  });

  if (error || !data?.success) {
    console.error("Verification failed:", error || data);
    toast({
      title: "Verification Failed",
      description: "Your payment was received but could not be verified. Please contact support@foliogen.in with your payment ID: " + response.razorpay_payment_id,
      variant: "destructive",
    });
    return;
  }

  triggerCelebration();
  toast({
    title: `🎉 Welcome to Foliogen ${plan.label}!`,
    description: `Your ${plan.duration} access is now active.`,
  });
  onSuccess(plan.id);
}
