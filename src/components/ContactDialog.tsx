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
import { Send, Mail, Linkedin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Please enter a valid email').max(255),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000),
});

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientEmail: string;
  recipientName: string;
  recipientLinkedIn?: string;
}

export function ContactDialog({
  open,
  onOpenChange,
  recipientEmail,
  recipientName,
  recipientLinkedIn,
}: ContactDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const resetForm = () => {
    setName('');
    setEmail('');
    setMessage('');
    setErrors({});
  };

  const handleClose = (o: boolean) => {
    if (!o) resetForm();
    onOpenChange(o);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
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

    if (!recipientEmail) {
      toast({
        title: 'No email on file',
        description: "This portfolio owner hasn't shared an email address.",
        variant: 'destructive',
      });
      return;
    }

    const subject = 'Portfolio inquiry';
    const body =
      `Hi ${recipientName || 'there'},\n\n` +
      `${result.data.message}\n\n` +
      `— ${result.data.name}\n${result.data.email}`;
    const href = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;

    toast({
      title: 'Opening your email app…',
      description: `Your message to ${recipientName || recipientEmail} is ready to send.`,
    });
    setTimeout(() => handleClose(false), 600);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {recipientName || 'Me'}</DialogTitle>
          <DialogDescription>
            Send a message — it will open in your email app, addressed directly to {recipientName || 'the owner'}.
          </DialogDescription>
        </DialogHeader>

        {/* Direct contact options */}
        <div className="rounded-lg border bg-muted/30 p-3 space-y-2 text-sm">
          {recipientEmail && (
            <a
              href={`mailto:${recipientEmail}?subject=${encodeURIComponent('Portfolio inquiry')}`}
              className="flex items-center gap-2 hover:text-primary transition-colors break-all"
            >
              <Mail className="h-4 w-4 shrink-0" />
              <span>{recipientEmail}</span>
            </a>
          )}
          {recipientLinkedIn && (
            <a
              href={recipientLinkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors break-all"
            >
              <Linkedin className="h-4 w-4 shrink-0" />
              <span>LinkedIn Profile</span>
            </a>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="contact-name">Your Name</Label>
            <Input
              id="contact-name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-email">Your Email</Label>
            <Input
              id="contact-email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-message">Message</Label>
            <Textarea
              id="contact-message"
              placeholder="Hi! I'd love to connect about a potential opportunity..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className={errors.message ? 'border-destructive' : ''}
            />
            {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
            <p className="text-xs text-muted-foreground text-right">{message.length}/5000</p>
          </div>

          <Button type="submit" className="w-full" disabled={!recipientEmail}>
            <Send className="h-4 w-4 mr-2" />
            Send via Email
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
