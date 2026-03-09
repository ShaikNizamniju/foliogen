import { useState } from 'react';
import { usePro } from '@/contexts/ProContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Crown, Check, Sparkles, Target, Wand2, Users,
  Calendar, Loader2, ShieldCheck, CreditCard, RefreshCw
} from 'lucide-react';
import { handlePayment } from '@/lib/payment';
import { motion } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';

const PRO_FEATURES = [
  { icon: Target, label: "SpyGlass Analytics", description: "See who's viewing your portfolio" },
  { icon: Users, label: "Recruiter Personalization", description: "Chameleon Mode for custom links" },
  { icon: Wand2, label: "AI Interview Coach", description: "AI-powered interview prep" },
  { icon: Calendar, label: "Priority Support", description: "Fast responses when you need help" },
];

const BASIC_FEATURES = [
  { icon: Target, label: "4 Portfolio Templates", description: "Minimalist, Creative, Modern Dark, Swiss" },
  { icon: Wand2, label: "AI Portfolio Scoring", description: "Standard AI suggestions" },
  { icon: Calendar, label: "Basic Analytics", description: "View count tracking" },
  { icon: Users, label: "Email Support", description: "Standard response times" },
];

export function BillingSection() {
  const { isPro, loading, proSince, planType, subscriptionStatus, nextRenewalDate, refreshProStatus } = usePro();
  const { user } = useAuth();
  const [paying, setPaying] = useState(false);

  const handleUpgrade = async (planKey: 'BASIC' | 'PRO') => {
    if (!user) return;

    setPaying(true);
    try {
      await handlePayment(
        { id: user.id, email: user.email, name: user.user_metadata?.full_name },
        planKey,
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

  const displayPlanName = planType === 'pro' ? 'Pro' : planType === 'basic' ? 'Basic' : 'Free';
  const isFree = planType === 'free' || (!planType || planType === '');
  const isActivePlan = subscriptionStatus === 'active';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing details.
        </p>
      </div>

      {/* Subscription Management Card */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold text-foreground">Subscription Management</h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={isActivePlan ? "default" : "secondary"}
              className={isActivePlan ? "bg-emerald-500 text-white" : ""}
            >
              {isActivePlan ? "Active" : subscriptionStatus === 'past_due' ? "Past Due" : "Inactive"}
            </Badge>
            <Badge
              variant={isPro ? "default" : "secondary"}
              className={planType === 'pro' ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" : planType === 'basic' ? "bg-primary text-primary-foreground" : ""}
            >
              {planType === 'pro' && <Crown className="h-3 w-3 mr-1" />}
              {displayPlanName} Plan
            </Badge>
          </div>
        </div>

        {isPro ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <ShieldCheck className="h-5 w-5 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{displayPlanName} Member</p>
                <p className="text-sm text-muted-foreground">
                  Member since {proSince ? format(proSince, 'MMMM d, yyyy') : 'N/A'}
                </p>
              </div>
            </div>

            {nextRenewalDate && (
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <RefreshCw className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Next Renewal</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(nextRenewalDate), 'MMMM d, yyyy')} • {planType === 'pro' ? '₹999/year' : '₹199/mo'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                    Pro expires in {differenceInDays(new Date(nextRenewalDate), new Date())} days
                  </Badge>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(planType === 'pro' ? PRO_FEATURES : BASIC_FEATURES).map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-foreground">{feature.label}</span>
                </div>
              ))}
            </div>

            {/* Upgrade from Basic to Pro */}
            {planType === 'basic' && (
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">
                  Upgrade to Pro to unlock all 19+ templates, Priority AI, and SpyGlass Analytics.
                </p>
                <Button
                  onClick={() => handleUpgrade('PRO')}
                  disabled={paying}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                >
                  {paying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Pro — ₹999/year
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border">
              <div className="p-2 rounded-lg bg-muted">
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Free Plan</p>
                <p className="text-sm text-muted-foreground">
                  1 template, basic resume parsing, community support
                </p>
              </div>
            </div>
            <Button
              onClick={() => handleUpgrade('BASIC')}
              disabled={paying}
              size="lg"
              className="w-full"
            >
              {paying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Upgrade to Basic — ₹199/mo"
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Upgrade Cards (only show if not Pro) */}
      {planType !== 'pro' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Plan */}
          {planType !== 'basic' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-8 relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-foreground">Basic</h3>
                  <p className="text-muted-foreground text-sm">Great for getting started</p>
                </div>

                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold text-foreground">₹199</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>

                <div className="space-y-3 mb-8">
                  {BASIC_FEATURES.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                        <feature.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{feature.label}</p>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleUpgrade('BASIC')}
                  disabled={paying}
                  size="lg"
                  variant="outline"
                  className="w-full h-12"
                >
                  {paying ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Start Basic"
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-red-500/5 p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Pro</h3>
                  <p className="text-muted-foreground text-sm">Best value — everything unlimited</p>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-foreground">₹999</span>
                <span className="text-muted-foreground">/year</span>
              </div>

              <div className="space-y-3 mb-8">
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
                      <p className="font-medium text-foreground text-sm">{feature.label}</p>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
                <div className="flex items-center gap-2 text-sm pt-1">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-foreground">All 19+ Design Systems</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-foreground">Full Scoring Engine</span>
                </div>
              </div>

              <Button
                onClick={() => handleUpgrade('PRO')}
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
                    Go Pro
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Secure payment via GoKwik • Instant activation
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
