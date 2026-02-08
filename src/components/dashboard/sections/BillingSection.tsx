import { useState } from 'react';
import { usePro } from '@/contexts/ProContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, Check, Sparkles, Target, Wand2, Users, 
  Calendar, Loader2, ShieldCheck
} from 'lucide-react';
import { handlePayment } from '@/lib/payment';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const PRO_FEATURES = [
  { icon: Target, label: "Spy Glass Analytics", description: "See who's viewing your portfolio" },
  { icon: Users, label: "Recruiter Personalization", description: "Chameleon Mode for custom links" },
  { icon: Wand2, label: "AI Interview Coach", description: "AI-powered interview prep" },
  { icon: Calendar, label: "Priority Support", description: "Fast responses when you need help" },
];

export function BillingSection() {
  const { isPro, loading, proSince, refreshProStatus } = usePro();
  const { user } = useAuth();
  const [paying, setPaying] = useState(false);

  const handleUpgrade = async () => {
    if (!user) return;
    
    setPaying(true);
    try {
      await handlePayment(
        { id: user.id, email: user.email, name: user.user_metadata?.full_name },
        () => {
          refreshProStatus();
        }
      );
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing details.
        </p>
      </div>

      {/* Current Plan Status */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Current Plan</h2>
          <Badge 
            variant={isPro ? "default" : "secondary"}
            className={isPro ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" : ""}
          >
            {isPro ? (
              <>
                <Crown className="h-3 w-3 mr-1" />
                Pro Plan
              </>
            ) : (
              "Free Plan"
            )}
          </Badge>
        </div>

        {isPro ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <ShieldCheck className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="font-medium text-foreground">Pro Member</p>
                <p className="text-sm text-muted-foreground">
                  Member since {proSince ? format(proSince, 'MMMM d, yyyy') : 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PRO_FEATURES.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-foreground">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            You're on the free plan. Upgrade to Pro to unlock premium features.
          </p>
        )}
      </div>

      {/* Upgrade Card (only show if not Pro) */}
      {!isPro && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-red-500/5 p-8 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Pro Pass</h3>
                <p className="text-muted-foreground">One-time payment, lifetime access</p>
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-foreground">₹199</span>
              <span className="text-muted-foreground line-through">₹499</span>
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                60% OFF
              </Badge>
            </div>

            <div className="space-y-4 mb-8">
              {PRO_FEATURES.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="p-1.5 rounded-lg bg-amber-500/10 shrink-0 mt-0.5">
                    <feature.icon className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{feature.label}</p>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button
              onClick={handleUpgrade}
              disabled={paying}
              size="lg"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 h-12 text-lg"
            >
              {paying ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Upgrade Now
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Secure payment via Razorpay • Instant activation
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
