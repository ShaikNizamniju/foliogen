import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';
import logo from '@/assets/logo.png';
import { SecurityBadge } from '@/components/ui/SecurityBadge';

export function Footer() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSending(true);
    // Simulate send (uses the existing contact edge function pattern)
    try {
      const { supabase } = await import('@/lib/supabase_v2');
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          location: location.trim(),
          recipientEmail: 'admin@foliogen.in',
          recipientName: 'Foliogen Team',
        },
      });
      if (error) throw error;
      toast.success('Message sent! We\'ll get back to you soon.');
      setName(''); setEmail(''); setMessage(''); setLocation('');
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <footer className="border-t border-border bg-background py-16">
      <div className="container mx-auto px-4">
        {/* Contact Form Section */}
        <div className="max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-2">
            Let&apos;s Build Something Amazing
          </h2>
          <p className="text-muted-foreground text-center mb-8 text-sm">
            Got a question, feedback, or partnership idea? Drop us a line.
          </p>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              placeholder="Your Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11"
              required
            />
            <Input
              type="email"
              placeholder="Your Email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
              required
            />
            <Input
              placeholder="Location (optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-11 sm:col-span-2"
            />
            <Textarea
              placeholder="Your Message *"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="sm:col-span-2 min-h-[100px] resize-none"
              required
            />
            <div className="sm:col-span-2 flex justify-center">
              <Button type="submit" disabled={sending} className="gap-2 px-8">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send Message
              </Button>
            </div>
          </form>
        </div>

        {/* Business Identity */}
        <div className="max-w-4xl mx-auto mb-16 border-t border-border/50 pt-12">
          <h3 className="text-lg font-semibold text-foreground text-center mb-8">Business Identity</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground mb-2">Registered Address</p>
              <p>123 Tech Park, 4th Floor</p>
              <p>HSR Layout, Sector 2</p>
              <p>Bengaluru, Karnataka 560102, India</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-2">Contact</p>
              <p>Email: admin@foliogen.in</p>
              <p>Phone: +91 98765 43210</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-2">Legal</p>
              <p>Foliogen is compliant with</p>
              <p>Indian Consumer Law standards</p>
              <p>for transparent billing.</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row border-t border-border pt-8">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Foliogen" className="h-10 w-auto" />
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link to="/auth" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Login
            </Link>
            <Link to="/auth" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Sign Up
            </Link>
            <Link to="/contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Contact
            </Link>
            <Link to="/privacy" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link to="/refunds" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Refunds
            </Link>
          </nav>

          {/* Copyright + Security Badge */}
          <div className="flex flex-col items-center sm:items-end gap-3">
            <SecurityBadge />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Foliogen. All rights reserved.
            </p>
            <a
              href="https://forms.gle/foliogen_feedback"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Found a bug? Help us improve.
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
