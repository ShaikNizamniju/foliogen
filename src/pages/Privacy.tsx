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
            <h2 className="text-2xl font-semibold text-white mb-4">1. Data Collection</h2>
            <p className="text-slate-400 leading-relaxed">
              We collect resumes and professional data solely for the purpose of generating your portfolio.
              This includes your name, work experience, skills, projects, and any other information you
              voluntarily provide through our platform. We do not collect data beyond what is necessary
              to deliver our core service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">2. AI Usage & Data Processing</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              Your data is processed by Google Gemini AI to generate portfolio content, enhance project
              descriptions, and power the RAG-based chatbot on your public profile.
            </p>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 my-4">
              <p className="text-slate-300 font-medium mb-2">Important:</p>
              <p className="text-slate-400 text-sm">
                We do not use your data to train public AI models. Your professional information is
                processed in real-time and is not retained by AI providers for model improvement purposes.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">3. Cookies & Local Storage</h2>
            <p className="text-slate-400 leading-relaxed">
              We use local storage to save your session preferences, theme settings, and authentication
              state. We do not use third-party tracking cookies. Essential cookies are used only to
              maintain your logged-in session and remember your UI preferences.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
            <p className="text-slate-400 leading-relaxed">
              Your data is stored securely using industry-standard encryption. All data transmission
              is protected via HTTPS. We implement Row Level Security (RLS) policies to ensure users
              can only access their own data.
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