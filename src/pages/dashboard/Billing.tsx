import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

const Billing = () => {
  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Billing</h1>
          <p className="text-muted-foreground mt-2">Foliogen is 100% free — no plans, no checkout, no credit card.</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Free Forever</h3>
              <p className="text-xs text-muted-foreground">All features unlocked for every user.</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-foreground/90">
            <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> All 19+ premium templates</li>
            <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Recruiter Audit & Identity Switching</li>
            <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Unlimited portfolios, custom domain, analytics</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Billing;
