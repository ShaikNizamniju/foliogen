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
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

        <div className="prose prose-invert prose-slate max-w-none">
          <p className="text-slate-300 text-lg mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">1. Identity Vault & Data Sovereignty</h2>
            <p className="text-slate-400 leading-relaxed">
              Your "Identity Vault" is our core security architecture. We employ AES-256 bit encryption for all personal data. Foliogen operates on a "Data Sovereignty" principle—you own your data unconditionally. We do not sell, rent, or lease your professional identity to third-party recruiters or data brokers.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">2. AI Usage & Model Integrity</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              Your professional narratives are engineered via the STAR, RICE, and HEART frameworks powered by Google Gemini. This processing is ephemeral; your data is never used to train global LLM benchmarks.
            </p>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 my-4">
              <p className="text-slate-300 font-medium mb-2">Security Lock:</p>
              <p className="text-slate-400 text-sm">
                All backend interactions are protected by strict Row Level Security (RLS) policies. Your `composite_trust_score` and sensitive metrics are READ-ONLY via public APIs to prevent tampering.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">3. Security Infrastructure</h2>
            <p className="text-slate-400 leading-relaxed">
              We maintain a NO-LOGS policy for production analytics. All authentication is handled via encrypted handsakes with Supabase Auth, ensuring your credentials nunca (never) touch our internal logs.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">5. Your Rights</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li>Access and export your personal data at any time</li>
              <li>Correct inaccurate information in your profile</li>
              <li>Request complete deletion of your account and data</li>
              <li>Withdraw consent for AI processing</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">6. Contact & Data Deletion</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              For any privacy inquiries or data deletion requests, please contact us:
            </p>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <p className="text-slate-300">Email:
                <a href="mailto:admin@foliogen.in" className="text-primary hover:underline ml-2">admin@foliogen.in</a>
              </p>
              <p className="text-slate-400 text-sm mt-2">
                We will respond to all requests within 30 days.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">7. Terms of Service</h2>
            <p className="text-slate-400 leading-relaxed">
              By using Foliogen, you agree to use the service for lawful purposes only. You retain
              ownership of all content you upload. We reserve the right to terminate accounts that
              violate these terms or engage in abusive behavior.
            </p>
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