import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import logo from '@/assets/logo.png';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Simple Header */}
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

      {/* Content */}
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold text-white mb-8">Data Vault Privacy Policy</h1>

        <div className="prose prose-invert prose-slate max-w-none">
          <p className="text-slate-300 text-lg mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">1. Personal Data Vault & Sovereignty</h2>
            <p className="text-slate-400 leading-relaxed">
              Your "Personal Data Vault" is the core of our security architecture. We employ strict AES-256 bit encryption for all career narratives and identity data. Foliogen operates on the "Sovereignty Principle"—you own your professional identity unconditionally. We never sell, rent, or lease your data to third-party brokers or external recruitment agencies.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">2. AI Processing Transparency</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              Our AI engines process your professional data ephemerally. Your career history is used solely to generate your portfolio and is never repurposed for global model training. We maintain a strict "Zero Leakage" policy for AI-generated insights.
            </p>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 my-4">
              <p className="text-slate-300 font-medium mb-2">Vault Security:</p>
              <p className="text-slate-400 text-sm">
                All backend interactions are protected by hardened Row Level Security (RLS). Your trust metrics and sensitive data are READ-ONLY via public APIs to prevent unauthorized tampering.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">3. Security Infrastructure</h2>
            <p className="text-slate-400 leading-relaxed">
              We maintain a rigorous NO-LOGS policy for production analytics. All authentication is handled through encrypted handshakes, ensuring your credentials never touch our internal diagnostic logs.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">4. Sovereignty Rights</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              In accordance with international privacy standards, you have the right to:
            </p>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li>Instant export of your Vault data in JSON format</li>
              <li>Surgical correction of any narrative field</li>
              <li>Nuclear deletion of all account data and active hosting</li>
              <li>Revocation of AI processing access at any time</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">5. Contact & Data Deletion</h2>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <p className="text-slate-300">Email:
                <a href="mailto:admin@foliogen.in" className="text-primary hover:underline ml-2">admin@foliogen.in</a>
              </p>
              <p className="text-slate-400 text-sm mt-2">
                We respond to all Data Sovereignty inquiries within 30 days.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-white/10 bg-slate-950 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Foliogen. All rights reserved.
          </p>
        </div>
      </footer>
    </div>);

};

export default Privacy;