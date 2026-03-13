import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck } from 'lucide-react';
import PricingEngine from '@/components/pricing/PricingEngine';

const Billing = () => {
  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#181a2a] dark:text-white">Billing & Subscription</h1>
          <p className="text-muted-foreground mt-2">Manage your plan, billing history, and payment methods.</p>
        </div>

        {/* Plan Overview Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-[rgba(17,17,16,0.09)] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#3a5cf5]/10 rounded-lg">
                  <ShieldCheck className="h-5 w-5 text-[#3a5cf5]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#181a2a] dark:text-white">Current Plan</h3>
                  <p className="text-xs text-muted-foreground">You are currently on the Free plan</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Active
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plan Price</span>
                <span className="font-medium">₹0 / month</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Next Billing Date</span>
                <span className="font-medium">—</span>
              </div>
            </div>
          </div>

          <div className="bg-[#181a2a] rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between">
            <div>
              <CreditCard className="h-8 w-8 text-[#3a5cf5] mb-4" />
              <h3 className="text-lg font-bold mb-2">Upgrade to Pro</h3>
              <p className="text-sm text-zinc-400">Unlock unlimited portfolios, advanced analytics, and custom domain support.</p>
            </div>
            <button className="w-full mt-6 py-3 bg-[#3a5cf5] hover:bg-[#3353e0] text-white rounded-xl font-bold transition-all duration-200">
              Go Pro Now
            </button>
          </div>
        </div>

        {/* Pricing Selection */}
        <div className="bg-white dark:bg-zinc-900/40 rounded-[28px] border border-[rgba(17,17,16,0.09)] overflow-hidden shadow-inner">
          <PricingEngine showTitle={false} />
        </div>
      </div>
    </div>
  );
};

export default Billing;
