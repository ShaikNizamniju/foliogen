import { motion } from 'framer-motion';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Linkedin, ExternalLink, Briefcase, Zap, Heart, Target, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import profilePhoto from '@/assets/profile-photo.jpeg';

export default function AboutFounder() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30">
      <Navbar />
      
      <main className="pt-32 pb-24 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-blue-500 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border border-white/10">
                <img 
                  src={profilePhoto} 
                  alt="Shaik Nizamuddin" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </motion.div>
            
            <div className="flex-1 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold font-serif mb-4 tracking-tight">
                  Shaik Nizamuddin
                </h1>
                <p className="text-xl text-primary font-medium mb-6 uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                  <Zap className="h-5 w-5 fill-primary" />
                  AI Product Manager
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <Button asChild variant="outline" className="rounded-full border-white/10 hover:bg-white/5 bg-transparent">
                    <a href="https://linkedin.com/in/shaiknizamniju" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full border-white/10 hover:bg-white/5 bg-transparent">
                    <a href="https://niju.sh" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Personal Portfolio
                    </a>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-12">
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  The Mission
                </h2>
                <div className="space-y-4 text-lg text-slate-400 leading-relaxed font-light">
                  <p>
                    Foliogen was engineered to solve a fundamental friction in the modern talent market: <span className="text-white italic">Professional Identity Rot.</span>
                  </p>
                  <p>
                    As professionals, we are rarely static. We grow, pivot, and acquire multi-dimensional skills. Yet, our traditional representation—the PDF resume—is a frozen snapshot that fails to communicate our dynamic value across different industries.
                  </p>
                  <p>
                    Our mission is to bridge this narrative gap by providing every professional with a high-fidelity, AI-augmented digital identity that adapts in real-time to the context of their career goals.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  The Narrative Engine
                </h2>
                <div className="space-y-4 text-lg text-slate-400 leading-relaxed font-light">
                  <p>
                    At the core of Foliogen is the <span className="text-white font-medium">Industrial Dialect Engine</span>. This specialized AI layer understands the subtle linguistic and structural differences between sectors like <span className="text-primary font-medium">High-Growth Startups</span>, <span className="text-primary font-medium">Big Tech</span>, and <span className="text-primary font-medium">Specialized Finance</span>.
                  </p>
                  <p>
                    By leveraging advanced Large Language Models, we've built a system that doesn't just rewrite text, but completely reframes your professional accomplishments to speak the "native tongue" of your target industry. This ensures that your expertise is never lost in translation.
                  </p>
                </div>
              </section>
            </div>

            {/* Sidebar / Stats */}
            <div className="space-y-8">
              <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4 text-primary">
                  <Target className="h-5 w-5" />
                  <h3 className="font-bold uppercase tracking-wider text-sm">Product Focus</h3>
                </div>
                <p className="font-medium text-white">Narrative Engineering</p>
                <p className="text-sm text-slate-400">Context-Aware AI Agents</p>
              </div>

              <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4 text-primary">
                  <Layers className="h-5 w-5" />
                  <h3 className="font-bold uppercase tracking-wider text-sm">Expertise</h3>
                </div>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    AI-Driven User Experiences
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Growth Product Management
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Technical Narrative Design
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/20">
                <div className="flex items-center gap-3 mb-4 text-white">
                  <Heart className="h-5 w-5 fill-white" />
                  <h3 className="font-bold uppercase tracking-wider text-sm">Philosophy</h3>
                </div>
                <p className="text-slate-200 text-sm italic leading-relaxed">
                  "The most powerful thing you can do for someone is give them the words to describe their own value."
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
