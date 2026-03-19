import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PartyPopper, Sparkles, Rocket, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export function BillingSection() {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 max-w-4xl mx-auto py-12 px-6">
      {/* Beta Announcement Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative overflow-hidden border-indigo-500/30 bg-slate-900 shadow-2xl">
          {/* Animated Background Shimmer */}
          <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_5s_infinite_linear] pointer-events-none" />
          
          <CardHeader className="text-center pt-12 pb-6">
            <div className="mx-auto w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <PartyPopper className="h-10 w-10 text-indigo-400 animate-bounce" />
            </div>
            <CardTitle className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Foliogen Open Beta <br />
              <span className="text-indigo-400">Everything is Unlocked</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-8 pb-12">
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-xl text-slate-300 font-medium leading-relaxed">
                Foliogen is officially in Open Beta. All Pro features—Recruiter Audits, 
                Identity Switching, and Premium Templates—are unlocked for early adopters. 
              </p>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 text-sm font-bold uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4" />
                Pro Status: Active
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mt-12">
              {[
                { label: "AI Recruiter Audit", desc: "Brutally honest JD gap analysis", icon: ShieldCheck },
                { label: "Identity Switcher", desc: "Unlimited industry persona variants", icon: Rocket },
                { label: "Vault Access", desc: "All 19+ premium design systems", icon: Sparkles },
                { label: "Recruiter Pulse", desc: "Real-time visitor company tracking", icon: Zap },
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="p-2 rounded-lg bg-indigo-500/20">
                    <feature.icon className="h-4 w-4 text-indigo-300" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{feature.label}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-6 pt-8">
              <div className="text-center space-y-1">
                <p className="text-slate-400 text-sm italic">
                  "Enjoy because it's free — for now."
                </p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">— Shaik, Founder of Foliogen</p>
              </div>

              <Button
                onClick={() => navigate('/dashboard?section=recruiter-audit')}
                size="lg"
                className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg shadow-[0_20px_40px_-15px_rgba(79,70,229,0.4)] group"
              >
                Back to Missions
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Trust Footer */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Found a bug? Help us polish the engine: <a href="mailto:admin@foliogen.in" className="text-indigo-400 hover:underline">admin@foliogen.in</a>
        </p>
      </div>
    </div>
  );
}
