import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';
import logo from '@/assets/logo.png';
import { supabase } from '@/lib/supabase_v2';

const Contact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !message.trim()) {
            toast.error('Please fill in all required fields.');
            return;
        }
        setSending(true);
        try {
            const { error } = await supabase.functions.invoke('send-contact-email', {
                body: {
                    name: name.trim(),
                    email: email.trim(),
                    message: message.trim(),
                    recipientEmail: 'admin@foliogen.in',
                    recipientName: 'Foliogen Team',
                },
            });
            if (error) throw error;
            toast.success('Message sent! We\'ll get back to you soon.');
            setName(''); setEmail(''); setMessage('');
        } catch {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950">
            <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link to="/" className="flex items-center">
                        <img src={logo} alt="Foliogen" className="h-10 w-auto" />
                    </Link>
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4 py-16 max-w-5xl">
                <h1 className="text-4xl font-bold text-white mb-12 text-center">Contact Us</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-slate-900 border border-white/10 rounded-xl p-6 sm:p-8">
                        <h2 className="text-2xl font-semibold text-white mb-6">Send a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Input
                                    className="bg-slate-950 border-white/10 text-white placeholder:text-slate-500"
                                    placeholder="Your Name *"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Input
                                    className="bg-slate-950 border-white/10 text-white placeholder:text-slate-500"
                                    type="email"
                                    placeholder="Your Email *"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Textarea
                                    className="bg-slate-950 border-white/10 text-white placeholder:text-slate-500 min-h-[150px]"
                                    placeholder="Your Message *"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={sending} className="w-full gap-2">
                                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                Send Message
                            </Button>
                        </form>
                    </div>

                    {/* Business Identity Block */}
                    <div className="flex flex-col justify-center">
                        <div className="bg-slate-900 border border-white/10 rounded-xl p-6 sm:p-8">
                            <h2 className="text-2xl font-semibold text-white mb-6">Business Identity</h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-slate-800 rounded-lg shrink-0">
                                        <MapPin className="h-5 w-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium mb-1">Registered Address</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            123 Tech Park, 4th Floor<br />
                                            HSR Layout, Sector 2<br />
                                            Bengaluru, Karnataka 560102<br />
                                            India
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-800 rounded-lg shrink-0">
                                        <Phone className="h-5 w-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium mb-1">Telephone Support</h3>
                                        <p className="text-slate-400 text-sm">
                                            +91 98765 43210
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-800 rounded-lg shrink-0">
                                        <Mail className="h-5 w-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium mb-1">Email Support</h3>
                                        <p className="text-slate-400 text-sm">
                                            admin@foliogen.in
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="border-t border-white/10 bg-slate-950 py-8 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} Foliogen. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Contact;
