import { useState, useEffect } from 'react';
import { usePro } from '@/contexts/ProContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Crown, Check, Sparkles, Target, Wand2, Users,
  Calendar, Loader2, ShieldCheck, CreditCard, RefreshCw, ArrowRight,
  PartyPopper
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import { supabase } from '@/lib/supabase_v2';
import { triggerCelebration } from '@/lib/confetti';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useNavigate, useSearchParams } from 'react-router-dom';

const SPRINT_PASS_FEATURES = [
  { icon: Crown, label: "Persona Switcher (All Modes)", description: "Startup, Big Tech, and Fintech variants" },
  { icon: Users, label: "Recognized Company Resolution", description: "Identify visitors from Google, Stripe, etc." },
  { icon: Wand2, label: "LinkedIn Auto-Sync engine", description: "Append accomplishments without overwriting" },
  { icon: ShieldCheck, label: "Custom Domain Support", description: "Professional vanity URLs (.com, .me)" },
  { icon: Sparkles, label: "Recruiter Pulse (Real-time)", description: "Live tracking of every visitor and company" },
];

const STARTER_FEATURES = [
  { icon: Check, label: "1 Contextual Persona", description: "General professional summary" },
  { icon: Check, label: "All 19+ Design Systems", description: "Full access to premium templates" },
  { icon: Check, label: "Custom Domain Support", description: "foliogen.in/u/yourname" },
  { icon: Check, label: "Standard AI Parsing", description: "Resume-to-portfolio synth" },
];

const FREE_FEATURES = [
  { icon: Check, label: "1 Contextual Persona", description: "General professional summary" },
  { icon: Check, label: "Standard Templates", description: "Basic, clean designs" },
  { icon: Check, label: "Foliogen Subdomain", description: "foliogen.in/u/yourname" },
];

export function BillingSection() {
  const { isPro, loading, proSince, planType, subscriptionStatus, nextRenewalDate, refreshProStatus } = usePro();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payingPlan, setPayingPlan] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  useEffect(() => {
    if (searchParams.get('status') === 'success') {
      // 1. Trigger Celebration
      triggerCelebration();

      // 2. Update Local State immediately
      if (refreshProStatus) refreshProStatus();

      // 3. Show the Welcome Hype Modal
      setShowSuccessModal(true);

      // 4. Toast notification
      toast.success("Identity Engine Unlocked!", {
        description: "Your professional potential has been supercharged."
      });

      // 5. Cleanup URL - remove status param
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('status');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, refreshProStatus, setSearchParams]);
  
  const [countryCode, setCountryCode] = useState<'US' | 'IN'>('IN'); // Mocked to IN
  const currency = countryCode === 'IN' ? 'INR' : 'USD';
  const isRegionalOffer = countryCode === 'IN';

  const starterPrice = currency === 'INR' ? '₹199' : '$7';
  const sprintPassPrice = currency === 'INR' ? '₹999' : '$29';

  const handleCheckout = async (planKey: 'STARTER' | 'SPRINT_PASS') => {
    if (!user) return;
    setPayingPlan(planKey);

    let priceId = '';
    const selectedPrice = planKey === 'STARTER' ? starterPrice : sprintPassPrice;

    if (currency === 'INR') {
      switch (planKey) {
        case 'STARTER': priceId = 'price_1T97muSAaaABftfWXJqNbATMq'; break;
        case 'SPRINT_PASS': priceId = 'price_1T97ojSAaaABftfWXcc46P31m'; break;
      }
    } else {
      switch (planKey) {
        case 'STARTER': priceId = 'price_1TBSe5SAaaABftfWXPuq1tpOk'; break; // Using Global Pass as fallback
        case 'SPRINT_PASS': priceId = 'price_1TBSe5SAaaABftfWXPuq1tpOk'; break;
      }
    }
    
    console.log("Redirecting to Stripe with Price ID:", priceId);

    toast.info("Connecting to Secure Checkout...", {
      description: `Redirecting to Stripe for the ${planKey.replace('_', ' ')} (${selectedPrice} ${currency}).`
    });

    // Alert Fallback if redirect takes too long
    const alertTimeout = setTimeout(() => {
      window.alert("Proceeding to secure checkout for " + planKey + ". If you are not redirected automatically, please check your popup blocker.");
    }, 2000);

    try {
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: { 
          planId: planKey.toLowerCase(),
          userId: user.id,
          priceId: priceId,
          successUrl: window.location.origin + '/dashboard?section=billing&status=success'
        }
      });

      clearTimeout(alertTimeout);
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      clearTimeout(alertTimeout);
      console.error("Checkout error:", error);
      toast.error("Checkout failed", { 
        description: error.message || "Failed to initiate secure checkout. Please try again." 
      });
      setPayingPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isLevelActive = (level: 'free' | 'starter' | 'sprint_pass') => {
    if (level === 'sprint_pass') return isPro || planType === 'sprint_pass';
    if (level === 'starter') return isPro || planType === 'starter' || planType === 'sprint_pass';
    return true;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Access Tiers</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          No recurring payments. Pay for the duration of your job search.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 items-stretch">
        {/* Free Tier */}
        <div className="rounded-2xl border border-border bg-card/50 p-6 flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-foreground">Free</h3>
            <p className="text-muted-foreground text-xs mt-1">Foundational access for students</p>
          </div>

          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-3xl font-bold text-foreground">{currency === 'INR' ? '₹0' : '$0'}</span>
            <span className="text-muted-foreground text-sm">forever</span>
          </div>

          <div className="space-y-3 mb-8 flex-1">
            {FREE_FEATURES.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check className="h-4 w-4 text-muted-foreground/40 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-foreground text-xs">{feature.label}</p>
                  <p className="text-[10px] text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full h-10 rounded-xl text-sm" disabled>
            Active Plan
          </Button>
        </div>

        {/* Starter Tier */}
        <div className="rounded-2xl border border-border bg-card p-6 flex flex-col relative">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-foreground">Starter</h3>
            <p className="text-muted-foreground text-xs mt-1">Best for entry-level pros</p>
          </div>

          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-3xl font-bold text-foreground">{starterPrice}</span>
            <span className="text-muted-foreground text-sm">/ once</span>
          </div>

          <div className="space-y-3 mb-8 flex-1">
            {STARTER_FEATURES.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-foreground text-xs">{feature.label}</p>
                  <p className="text-[10px] text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Button 
            onClick={() => handleCheckout('STARTER')}
            disabled={!!payingPlan || isLevelActive('starter')}
            variant="outline"
            className="w-full h-10 rounded-xl text-sm shadow-sm"
          >
            {payingPlan === 'STARTER' ? <Loader2 className="h-4 w-4 animate-spin" /> : isLevelActive('starter') ? "Current Tier" : `Get Starter`}
          </Button>
        </div>

        {/* Sprint Pass Tier */}
        <div className="rounded-2xl border-2 border-primary bg-primary/5 p-6 relative flex flex-col shadow-[0_0_40px_-15px_rgba(79,70,229,0.3)] scale-105">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Recommended
          </div>
          
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-foreground">Sprint Pass</h3>
              {isRegionalOffer && (
                <Badge variant="outline" className="text-[8px] border-amber-500/50 text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-1 py-0">
                  Save 60%
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-xs mt-1">Precision career re-engineering</p>
          </div>

          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-3xl font-bold text-foreground">{sprintPassPrice}</span>
            <span className="text-muted-foreground text-sm">/ 90 days</span>
          </div>

          <div className="space-y-3 mb-8 flex-1">
            {SPRINT_PASS_FEATURES.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="p-0.5 rounded-full bg-primary/10 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-xs">{feature.label}</p>
                  <p className="text-[10px] text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Button 
            onClick={() => handleCheckout('SPRINT_PASS')}
            disabled={!!payingPlan || isLevelActive('sprint_pass')}
            size="lg"
            className="w-full h-12 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 group"
          >
            {payingPlan === 'SPRINT_PASS' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isLevelActive('sprint_pass') ? (
              "Pass Active"
            ) : (
              <>
                Unlock Sprint Pass
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>

          <p className="text-[8px] text-center text-muted-foreground mt-4">
            One-time payment • No auto-renew • Stripe Secure
          </p>
        </div>
      </div>

      {/* Trust Banner */}
      <div className="mt-12 p-6 rounded-2xl bg-muted/30 border border-border text-center">
        <p className="text-sm italic text-muted-foreground">
          "The Sprint Pass approach is refreshing. No need to worry about recurring fees. 
          I paid for the duration of my interview cycle and had exactly what I needed."
        </p>
        <p className="text-xs font-semibold mt-2">— Product Lead @ Stripe</p>
      </div>
      {/* Success Welcome Modal */}
      <Dialog 
        open={showSuccessModal} 
        onOpenChange={(open) => {
          // Prevent closing by clicking outside or pressing ESC
          if (!open) return;
          setShowSuccessModal(true);
        }}
      >
        <DialogContent className="sm:max-w-md border-primary/20 bg-background/95 backdrop-blur-xl [&>button]:hidden">
          <DialogHeader className="text-center pt-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <PartyPopper className="h-8 w-8 text-primary animate-bounce" />
            </div>
            <DialogTitle className="text-2xl font-bold">
              Identity Engine Unlocked 🚀
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Welcome to the Sprint Pass. You now have unlimited access to our industry-specific Narrative Engine and real-time Recruiter Tracking.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-emerald-500/10 mt-0.5">
                  <Check className="h-3 w-3 text-emerald-500" />
                </div>
                <p className="text-xs text-muted-foreground"><span className="text-foreground font-medium">Unlimited Persona Switches</span> active</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-emerald-500/10 mt-0.5">
                  <Check className="h-3 w-3 text-emerald-500" />
                </div>
                <p className="text-xs text-muted-foreground"><span className="text-foreground font-medium">Real-time Recruiter Pulse</span> enabled</p>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-center pb-6">
            <Button 
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/dashboard?section=templates');
              }}
              size="lg"
              className="w-full rounded-xl font-bold shadow-lg shadow-primary/20"
            >
              Switch My First Persona
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
