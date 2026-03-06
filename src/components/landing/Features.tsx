import { motion, useInView, Variants } from 'framer-motion';
import { useRef } from 'react';
import { FileText, Palette, BarChart3, ArrowRight } from 'lucide-react';

export function Features() {
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
    <section id="features" className="py-24 bg-canvas/50">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="flex flex-col items-center mb-16"
        >
          <motion.h2
            variants={fadeUp}
            className="font-instrument text-4xl md:text-5xl text-ink mb-6 text-center"
          >
            Built for <span className="italic text-cobalt">Outcomes.</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="font-outfit text-lg text-ink/60 text-center max-w-2xl"
          >
            We abstracted away the design details so you can focus on what matters: the content that gets you hired.
          </motion.p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Card 1: Resume to Live */}
          <motion.div variants={fadeUp} className="bg-white p-8 rounded-3xl border border-ink/5 shadow-sm shadow-ink/5 flex flex-col items-start gap-8 h-full">
            <div className="w-12 h-12 bg-cobalt/10 rounded-2xl flex items-center justify-center text-cobalt">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1 w-full bg-canvas/30 rounded-xl border border-ink/5 p-4 flex flex-col justify-center gap-2 overflow-hidden relative">
              <motion.div
                animate={{ y: [0, -40, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-full bg-white h-24 rounded-md shadow-sm border border-border p-3"
              >
                <div className="w-1/3 h-2 bg-ink/10 rounded mb-2"></div>
                <div className="w-full h-1.5 bg-ink/5 rounded mb-1"></div>
                <div className="w-5/6 h-1.5 bg-ink/5 rounded mb-1"></div>
              </motion.div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-canvas to-transparent h-12"></div>
            </div>
            <div>
              <h3 className="font-instrument text-2xl text-ink mb-2">Resume to Live</h3>
              <p className="font-outfit text-ink/60 text-sm leading-relaxed">Instantly transform any PDF resume into a fully functional, mobile-responsive portfolio site.</p>
            </div>
          </motion.div>

          {/* Card 2: 19+ Design Systems */}
          <motion.div variants={fadeUp} className="bg-white p-8 rounded-3xl border border-ink/5 shadow-sm shadow-ink/5 flex flex-col items-start gap-8 h-full md:col-span-1">
            <div className="w-12 h-12 bg-cobalt/10 rounded-2xl flex items-center justify-center text-cobalt">
              <Palette className="w-6 h-6" />
            </div>
            <div className="flex-1 w-full flex items-center justify-center gap-3">
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 bg-black rounded-lg shadow-sm"></div>
                <div className="w-12 h-12 bg-white border border-ink/10 rounded-lg shadow-sm"></div>
              </div>
              <div className="flex flex-col gap-3 mt-6">
                <div className="w-12 h-12 bg-cobalt rounded-lg shadow-sm"></div>
                <div className="w-12 h-12 bg-[#F3F4F6] border border-ink/10 rounded-lg shadow-sm"></div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 bg-zinc-900 rounded-lg shadow-sm"></div>
                <div className="w-12 h-12 bg-[#FAFAF8] border border-ink/10 rounded-lg shadow-sm"></div>
              </div>
            </div>
            <div>
              <h3 className="font-instrument text-2xl text-ink mb-2">19+ Design Systems</h3>
              <p className="font-outfit text-ink/60 text-sm leading-relaxed">Choose from cinematic, brutalist, and minimalist themes crafted by world-class designers.</p>
            </div>
          </motion.div>

          {/* Card 3: Portfolio Analytics */}
          <motion.div variants={fadeUp} className="bg-white p-8 rounded-3xl border border-ink/5 shadow-sm shadow-ink/5 flex flex-col items-start gap-8 h-full">
            <div className="w-12 h-12 bg-cobalt/10 rounded-2xl flex items-center justify-center text-cobalt">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="flex-1 w-full flex items-end justify-between px-4 gap-2 h-32 border-b border-ink/5 pb-2">
              <motion.div animate={{ height: ["40%", "70%", "40%"] }} transition={{ repeat: Infinity, duration: 3 }} className="w-full bg-cobalt/20 rounded-t-sm"></motion.div>
              <motion.div animate={{ height: ["60%", "90%", "60%"] }} transition={{ repeat: Infinity, duration: 4 }} className="w-full bg-cobalt/50 rounded-t-sm"></motion.div>
              <motion.div animate={{ height: ["30%", "50%", "30%"] }} transition={{ repeat: Infinity, duration: 2.5 }} className="w-full bg-cobalt rounded-t-sm"></motion.div>
              <motion.div animate={{ height: ["80%", "100%", "80%"] }} transition={{ repeat: Infinity, duration: 5 }} className="w-full bg-ink rounded-t-sm"></motion.div>
            </div>
            <div>
              <h3 className="font-instrument text-2xl text-ink mb-2">Portfolio Analytics</h3>
              <p className="font-outfit text-ink/60 text-sm leading-relaxed">Track exactly who is viewing your portfolio, their origins, and deep LinkedIn integration.</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}