import { supabase } from "@/integrations/supabase/client";
import { triggerCelebration } from "./confetti";
import { toast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentUser {
  id: string;
  email?: string;
  name?: string;
}

export const RAZORPAY_KEY = "rzp_test_SE6pBwbZL7Xo7T";

const PLAN_LABELS: Record<number, string> = {
  19900: "Basic (₹199/mo)",
  99900: "Pro (₹999/year)",
};

export async function handlePayment(
  user: PaymentUser,
  onSuccess: () => void,
  amount: number = 99900
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      toast({
        title: "Payment Error",
        description: "Payment system not loaded. Please refresh the page.",
        variant: "destructive",
      });
      reject(new Error("Razorpay not loaded"));
      return;
    }

    const planLabel = PLAN_LABELS[amount] || `₹${amount / 100}`;

    const options = {
      key: RAZORPAY_KEY,
      amount,
      currency: "INR",
      name: "Foliogen",
      description: `Foliogen ${planLabel}`,
      image: "/og-image.png",
      prefill: {
        email: user.email || "",
        name: user.name || "",
      },
      theme: {
        color: "#8B5CF6",
      },
      handler: async function (response: any) {
        try {
          const { data, error } = await supabase.functions.invoke('activate-pro', {
            body: { paymentId: response.razorpay_payment_id },
          });

          if (error) {
            console.error("Error activating pro:", error);
            toast({
              title: "Payment Error",
              description: "Payment received but failed to activate. Contact support.",
              variant: "destructive",
            });
            reject(error);
            return;
          }

          triggerCelebration();
          toast({
            title: `Welcome to Foliogen ${data?.planType === 'pro' ? 'Pro' : 'Basic'}! 🚀`,
            description: "You now have access to all your plan features!",
          });

          onSuccess();
          resolve();
        } catch (err) {
          console.error("Error in payment handler:", err);
          reject(err);
        }
      },
      modal: {
        ondismiss: function () {
          resolve();
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  });
}
