import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase_v2';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Briefcase, Link as LinkIcon, Mail, Building2, Eye, Sparkles } from 'lucide-react';

interface RecruiterPingProps {
  portfolioUserId: string;
  linkId: string;
  linkType: 'portfolio' | 'chameleon';
  industryContext?: string;
}

export function RecruiterPing({ portfolioUserId, linkId, linkType, industryContext }: RecruiterPingProps) {
  const [open, setOpen] = useState(false);
  const [company, setCompany] = useState('');
  const [contactMethod, setContactMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !contactMethod.trim()) return;

    setIsSubmitting(true);
    try {
      // Log the ping
      const { error } = await supabase.from('visit_logs').insert({
        user_id: portfolioUserId,
        link_type: linkType,
        link_id: linkId,
        industry_context: industryContext || 'none',
        device_type: window.innerWidth < 768 ? 'Mobile' : 'Desktop',
        is_ping: true,
        company: company.trim(),
        contact_method: contactMethod.trim(),
      });

      if (error) throw error;

      // Trigger Neural Sync Success Animation
      setIsSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setIsSuccess(false);
        setCompany('');
        setContactMethod('');
        toast.success("Interest Sent", {
          description: "Encrypted connection established.",
          style: { 
            background: '#0a0a0a', 
            border: '1px solid rgba(59, 130, 246, 0.5)', 
            color: 'white',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.15)'
          },
          icon: <Sparkles className="h-4 w-4 text-blue-400" />
        });
      }, 1500);

    } catch (err) {
      console.error("Failed to send ping", err);
      toast.error("Failed to establish connection", {
        style: { background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button 
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-full bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 text-neutral-300 hover:text-white transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:border-blue-500/50 group"
        >
          <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <Eye className="w-4 h-4 text-blue-400" />
          <span className="relative z-10">I’m Interested</span>
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden p-0 relative">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6"
            >
              <DialogHeader className="mb-6">
                <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-500" />
                  Establish Contact
                </DialogTitle>
                <DialogDescription className="text-neutral-400 text-sm">
                  Send a discrete, encrypted ping directly to the portfolio owner. Zero friction.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-neutral-300 text-xs uppercase tracking-wider font-semibold">Your Company</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <Input 
                      id="company"
                      type="text" 
                      placeholder="e.g. Acme Corp" 
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                      className="bg-black/50 border-white/10 text-white pl-10 focus-visible:ring-1 focus-visible:ring-blue-500/50 placeholder:text-neutral-600 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact" className="text-neutral-300 text-xs uppercase tracking-wider font-semibold">Preferred Contact</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <Input 
                      id="contact"
                      type="text" 
                      placeholder="Email or LinkedIn URL" 
                      value={contactMethod}
                      onChange={(e) => setContactMethod(e.target.value)}
                      required
                      className="bg-black/50 border-white/10 text-white pl-10 focus-visible:ring-1 focus-visible:ring-blue-500/50 placeholder:text-neutral-600 h-11"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting || !company || !contactMethod}
                  className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-semibold h-11 relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-blue-400/30 border-t-blue-400 animate-spin" />
                      Encrypting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      Send Ping
                    </span>
                  )}
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 flex flex-col items-center justify-center min-h-[300px]"
            >
              <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [0.8, 1.2, 1], opacity: [0, 1, 0.5] }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl"
                />
                <motion.div
                   initial={{ opacity: 0, width: 0 }}
                   animate={{ opacity: 1, width: "100%" }}
                   transition={{ duration: 0.8, ease: "easeInOut" }}
                   className="h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)] rounded-full relative overflow-hidden"
                >
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                    className="absolute top-0 bottom-0 w-1/2 bg-white/50 blur-sm"
                  />
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center space-y-2"
              >
                <h3 className="text-xl font-bold text-white tracking-wide">Neural Sync Complete</h3>
                <p className="text-blue-400 font-mono text-xs uppercase tracking-widest">Target Acquired</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
