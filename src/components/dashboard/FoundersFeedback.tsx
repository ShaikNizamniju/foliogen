import { useState } from 'react';
import { MessageSquare, Send, Loader2, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase_v2";
import { useAuth } from "@/contexts/AuthContext";
import { trackEvent } from "@/lib/analytics";
import { motion, AnimatePresence } from "framer-motion";

export function FoundersFeedback() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error("Please enter some feedback first.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('user_feedback')
        .insert({
          user_id: user?.id,
          content: feedback,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Log North Star Metric
      trackEvent('feedback_submitted', { length: feedback.length });

      toast.success("Saved ✓", {
        description: "Thank you for helping me build FolioGen!"
      });

      setFeedback('');
      setIsOpen(false);
    } catch (err: any) {
      console.error("Feedback error:", err);
      toast.error("Failed to save feedback", {
        description: err.message || "Something went wrong. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 z-[60]"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 px-6 rounded-full bg-primary shadow-[0_8px_30px_rgb(79,70,229,0.4)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.6)] group transition-all duration-300"
        >
          <MessageSquare className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
          <span className="font-semibold">Feedback</span>
          <div className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-foreground"></span>
          </div>
        </Button>
      </motion.div>

      {/* Feedback Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md border-primary/20 bg-background/95 backdrop-blur-xl">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center">
              Help me build FolioGen
            </DialogTitle>
            <DialogDescription className="text-center">
              I'm building this for you. What features should I add next? What's bothering you?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Your feature requests, bugs, or just a quick 'hello'..."
              className="min-h-[150px] resize-none bg-muted/30 border-border focus:ring-primary/20"
            />
          </div>

          <DialogFooter className="sm:justify-center">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !feedback.trim()}
              className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
