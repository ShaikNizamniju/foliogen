import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion, useInView, Variants } from 'framer-motion';
import { useRef } from 'react';

export function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const stagger: Variants = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <section className="relative min-h-[90vh] bg-canvas flex items-center overflow-hidden pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <motion.div
          ref={ref}
          className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
        >
          {/* Left Column: Copy */}
          <div className="flex flex-col items-start text-left max-w-2xl">
            <motion.h1
              variants={fadeUp}
              className="font-instrument text-5xl md:text-7xl lg:text-8xl leading-[1.05] text-ink mb-6"
            >
              Your Professional Identity, <span className="text-cobalt italic">Engineered.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="font-outfit text-xl md:text-2xl text-ink/70 font-light mb-10 max-w-xl leading-relaxed"
            >
              Upload your resume. Our AI builds a world-class portfolio in minutes—no design skills, no code, no compromise.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 items-center mb-12">
              <Button asChild size="lg" className="bg-cobalt hover:bg-cobalt/90 text-white font-outfit px-8 py-6 text-lg rounded-xl shadow-lg transition-transform hover:scale-105 w-full sm:w-auto">
                <Link to="/auth">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div variants={fadeUp} className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-canvas bg-gray-200 overflow-hidden"><img src="https://i.pravatar.cc/100?img=1" alt="Avatar" /></div>
                <div className="w-10 h-10 rounded-full border-2 border-canvas bg-gray-300 overflow-hidden"><img src="https://i.pravatar.cc/100?img=2" alt="Avatar" /></div>
                <div className="w-10 h-10 rounded-full border-2 border-canvas bg-gray-400 overflow-hidden"><img src="https://i.pravatar.cc/100?img=3" alt="Avatar" /></div>
                <div className="w-10 h-10 rounded-full border-2 border-canvas bg-gray-100 overflow-hidden flex items-center justify-center text-xs font-bold font-outfit text-ink">+</div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="font-outfit text-sm text-ink/70 mt-1">
                  <span className="font-semibold text-ink">340+</span> Hired
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Visual */}
          <motion.div
            variants={fadeUp}
            className="relative lg:h-[600px] flex items-center justify-center lg:justify-end"
          >
            {/* Browser Mockup */}
            <div className="relative w-full max-w-[500px] rounded-2xl border border-ink/10 bg-white shadow-2xl overflow-hidden translate-x-0 lg:translate-x-8">
              <div className="h-10 border-b border-ink/10 bg-canvas/50 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="p-0 select-none pointer-events-none">
                <img src="/assets/logo-DY04JMdn.png" alt="Portfolio Preview" className="w-full h-auto object-cover opacity-80" />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent"></div>
              </div>
            </div>

            {/* Floating Analytics Card */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -left-8 md:-left-16 bottom-16 bg-white p-4 rounded-xl shadow-xl border border-ink/5 flex items-center gap-4 z-20"
            >
              <div className="w-12 h-12 rounded-full bg-cobalt/10 flex items-center justify-center text-cobalt font-bold text-xl">
                📈
              </div>
              <div>
                <p className="font-outfit text-sm text-ink/50">Total Views</p>
                <p className="font-outfit text-2xl font-semibold text-ink">12,492</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
