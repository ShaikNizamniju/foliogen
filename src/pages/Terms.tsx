import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import logo from '@/assets/logo.png';

const Terms = () => {
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

            <main className="container mx-auto px-4 py-16 max-w-3xl">
                <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>

                <div className="prose prose-invert prose-slate max-w-none">
                    <p className="text-slate-300 text-lg mb-8">
                        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="text-slate-400 leading-relaxed">
                            By accessing and using Foliogen, you accept and agree to be bound by the terms of a "Verified Candidate." You represent that all professional narratives are true and grounded in fact.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service & AI Integrity</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Foliogen provides AI-powered infrastructure for career acceleration. While our AI enhances your narratives, the "AI Match Integrity" clause requires you to review all generated content for accuracy before publication.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Candidate Ethics</h2>
                        <p className="text-slate-400 leading-relaxed">
                            You agree to use our services to represent your professional self authentically. Automated scraping or "identity spoofing" of other users' portfolios is grounds for immediate termination.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Paid Services & Branding</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Users on the Basic and Pro tiers are entitled to the "No-Foliogen Branding" clause. This guarantees that no Foliogen watermarks, logos, or promotional links will be appended to your published portfolio. You own your brand presentation unconditionally.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Data Retention & Privacy</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Following the cancellation of a paid subscription, your published portfolio and underlying data will remain securely hosted and live for a grace period of 30 days. After 30 days, your portfolio will be taken offline, but your data is retained securely for 90 days before permanent deletion. Foliogen employs 256-bit encryption for all connected accounts.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Termination</h2>
                        <p className="text-slate-400 leading-relaxed">
                            We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                        </p>
                    </section>
                </div>
            </main>

            <footer className="border-t border-white/10 bg-slate-950 py-8">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} Foliogen. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Terms;
