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
                <h1 className="text-4xl font-bold text-white mb-8">Professional Identity Verification (Terms)</h1>

                <div className="prose prose-invert prose-slate max-w-none">
                    <p className="text-slate-300 text-lg mb-8">
                        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Identity Verification Standards</h2>
                        <p className="text-slate-400 leading-relaxed">
                            By utilizing Foliogen, you agree to represent your professional history with 100% accuracy. We strictly prohibit "Identity Spoofing" or the fabrication of professional credentials. All candidates are verified under our "True-Story" narrative protocol.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">2. AI-Narrative Responsibility</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Foliogen provides AI-powered infrastructure to amplify your professional story. However, users bear full responsibility for the factual integrity of any AI-enhanced text. You must review and validate all AI-generated content before public deployment.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Professional Ethics & Use</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Automated harvesting, scraping, or the reverse engineering of other users' portfolio architectures is fundamentally prohibited. Violation of these ethics results in immediate and permanent Vault closure.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Paid Services & Brand Autonomy</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Foliogen subscribers (Basic and Pro) are granted complete Brand Autonomy. This ensures your portfolio remains free of Foliogen branding, watermarks, or promotional footprints. Your professional brand is yours alone.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Termination Clause</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Foliogen reserves the right to suspend or terminate Vault access for any breach of these "Professional Verification" standards. Upon termination, data access is immediately restricted to protect the integrity of our professional network.
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
