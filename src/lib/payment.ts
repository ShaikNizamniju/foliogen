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

export const RAZORPAY_KEY = "YOUR_RAZORPAY_TEST_KEY"; // Replace with your Razorpay test/live key

export async function handlePayment(
  user: PaymentUser,
  onSuccess: () => void
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

    const options = {
      key: RAZORPAY_KEY,
      amount: 19900, // Amount in paise (₹199)
      currency: "INR",
      name: "Foliogen Pro",
      description: "Unlock Analytics, AI Coach & Chameleon Mode",
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
          // Update user's pro status in database
          const { error } = await supabase
            .from("profiles")
            .update({
              is_pro: true,
              subscription_id: response.razorpay_payment_id,
              pro_since: new Date().toISOString(),
            } as any)
            .eq("user_id", user.id);

          if (error) {
            console.error("Error updating pro status:", error);
            toast({
              title: "Payment Error",
              description: "Payment received but failed to activate Pro. Contact support.",
              variant: "destructive",
            });
            reject(error);
            return;
          }

          // Celebrate!
          triggerCelebration();
          toast({
            title: "Welcome to Pro! 🚀",
            description: "You now have access to all premium features!",
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
