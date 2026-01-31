import { useState } from 'react';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Validation schema
const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email must be less than 255 characters"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000, "Message must be less than 5000 characters"),
});

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientEmail: string;
  recipientName: string;
}

export function ContactDialog({ open, onOpenChange, recipientEmail, recipientName }: ContactDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const resetForm = () => {
    setName('');
    setEmail('');
    setMessage('');
    setErrors({});
    setSent(false);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const result = contactSchema.safeParse({ name, email, message });
    if (!result.success) {
      const fieldErrors: { name?: string; email?: string; message?: string } = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as 'name' | 'email' | 'message';
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSending(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: result.data.name,
          email: result.data.email,
          message: result.data.message,
          toEmail: recipientEmail,
          toName: recipientName,
        },
      });

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to send message');
      }

      setSent(true);
      toast({
        title: "Message sent! ✨",
        description: `Your message has been delivered to ${recipientName}.`,
      });

      // Auto-close after success
      setTimeout(() => {
        handleClose(false);
      }, 2000);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {recipientName || 'Me'}</DialogTitle>
          <DialogDescription>
            Send a message directly to {recipientName}. They'll receive it via email.
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto animate-in zoom-in" />
            <div>
              <h3 className="font-semibold text-lg">Message Sent!</h3>
              <p className="text-muted-foreground text-sm">
                {recipientName} will get back to you soon.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Your Name</Label>
              <Input
                id="contact-name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={sending}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-email">Your Email</Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={sending}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea
                id="contact-message"
                placeholder="Hi! I'd love to connect about a potential opportunity..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={sending}
                rows={4}
                className={errors.message ? 'border-destructive' : ''}
              />
              {errors.message && (
                <p className="text-xs text-destructive">{errors.message}</p>
              )}
              <p className="text-xs text-muted-foreground text-right">
                {message.length}/5000
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={sending}>
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
