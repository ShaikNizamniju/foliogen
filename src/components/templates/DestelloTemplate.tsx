import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, ArrowLeft, ChevronRight, Send } from 'lucide-react';

/* ── Data ── */
const works = [
  { num: '01', title: 'Nova Identity', category: 'Brand Identity', image: 'https://picsum.photos/seed/dest1/1200/600' },
  { num: '02', title: 'Pulse Campaign', category: 'Art Direction', image: 'https://picsum.photos/seed/dest2/1200/600' },
  { num: '03', title: 'Kinetic Social', category: 'Social Marketing', image: 'https://picsum.photos/seed/dest3/1200/600' },
  { num: '04', title: 'Vertex Studio', category: 'Content Production', image: 'https://picsum.photos/seed/dest4/1200/600' },
  { num: '05', title: 'Ember Film', category: 'Art Direction', image: 'https://picsum.photos/seed/dest5/1200/600' },
  { num: '06', title: 'Arclight Launch', category: 'Brand Identity', image: 'https://picsum.photos/seed/dest6/1200/600' },
];

const expertise = [
  { num: '01', title: 'Brand Identity', desc: 'Crafting visual systems that resonate and endure.' },
  { num: '02', title: 'Art Direction', desc: 'Guiding aesthetics from concept to final pixel.' },
  { num: '03', title: 'Content Production', desc: 'High-impact assets across every medium.' },
  { num: '04', title: 'Social Marketing', desc: 'Campaigns that spark engagement and growth.' },
];

const processSteps = [
  { title: 'Spark the Vision', desc: 'We start with deep discovery — understanding your brand DNA, audience, and goals.', image: 'https://picsum.photos/seed/proc1/800/400' },
  { title: 'Craft the Blueprint', desc: 'Strategy meets structure. We map the experience before a single pixel is placed.', image: 'https://picsum.photos/seed/proc2/800/400' },
  { title: 'Design the Experience', desc: 'Every detail is intentional — from typography to micro-interactions.', image: 'https://picsum.photos/seed/proc3/800/400' },
  { title: 'Launch & Illuminate', desc: 'We ship, measure, and iterate — ensuring impact from day one.', image: 'https://picsum.photos/seed/proc4/800/400' },
];

const testimonials = [
  { quote: 'Destello transformed our brand from ordinary to extraordinary. Their creative instinct is unmatched.', name: 'Sarah Chen', role: 'CMO, NovaTech' },
  { quote: 'The attention to detail and strategic thinking blew us away. A true creative partner.', name: 'Marcus Rivera', role: 'Founder, Vertex Labs' },
  { quote: 'Working with Destello felt like having an in-house creative team that actually gets it.', name: 'Lina Johansson', role: 'Brand Director, Ember Co.' },
];

const faqs = [
  { q: 'What is your typical project timeline?', a: 'Most projects run 6-12 weeks depending on scope. We always align on milestones before kicking off.' },
  { q: 'Do you work with startups?', a: 'Absolutely. We love working with ambitious teams at every stage, from pre-seed to Series C and beyond.' },
  { q: 'What does your pricing look like?', a: "We offer project-based and retainer models. Reach out and we'll scope something that fits your budget." },
  { q: 'Can you handle both digital and print?', a: 'Yes. Our team covers the full spectrum: websites, apps, packaging, editorial, and environmental design.' },
  { q: 'How do revisions work?', a: 'Every phase includes structured feedback rounds. We believe in collaboration, not endless revisions.' },
  { q: 'Where is your team based?', a: "We're a distributed studio with hubs in New York, London, and Tokyo." },
];

const footerLinks = {
  Studio: ['About', 'Careers', 'Press'],
  Services: ['Branding', 'Digital', 'Content'],
  Connect: ['Instagram', 'Twitter', 'LinkedIn'],
};

/* ── Accordion Item ── */
function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b" style={{ borderColor: '#E5E5E5' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left group">
        <span className="text-base md:text-lg font-medium" style={{ fontFamily: "'Syne', sans-serif" }}>{title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="h-5 w-5" style={{ color: '#FF4444' }} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const }} className="overflow-hidden">
            <div className="pb-5 text-sm leading-relaxed" style={{ color: '#555' }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Process Step ── */
function ProcessAccordion({ step, index }: { step: typeof processSteps[0]; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="border-b" style={{ borderColor: '#E5E5E5' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-4 py-6 text-left">
        <span className="text-sm font-bold" style={{ color: '#FF4444', fontFamily: "'Syne', sans-serif" }}>0{index + 1}</span>
        <span className="text-lg md:text-xl font-semibold flex-1" style={{ fontFamily: "'Syne', sans-serif" }}>{step.title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="h-5 w-5" style={{ color: '#FF4444' }} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }} className="overflow-hidden">
            <div className="pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <p className="text-sm leading-relaxed" style={{ color: '#555' }}>{step.desc}</p>
              <img src={step.image} alt={step.title} className="w-full aspect-[2/1] object-cover rounded-lg" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main Template ── */
export function DestelloTemplate() {
  const [activeWork, setActiveWork] = useState<number | null>(null);
  const [testimIdx, setTestimIdx] = useState(0);

  const nextTestim = () => setTestimIdx((i) => (i + 1) % testimonials.length);
  const prevTestim = () => setTestimIdx((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF', color: '#0A0A0A', fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar */}
      <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-14 py-5 backdrop-blur-md bg-white/90 border-b" style={{ borderColor: '#F0F0F0' }}>
        <div>
          <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>destello</span>
          <span className="text-[10px] tracking-widest uppercase block -mt-0.5" style={{ color: '#999' }}>Creative Digital Studio</span>
        </div>
        <div className="hidden md:flex gap-7 text-xs tracking-widest uppercase" style={{ color: '#666' }}>
          {['Work', 'Services', 'Process', 'Contact'].map((l) => (
            <span key={l} className="cursor-pointer hover:text-[#FF4444] transition-colors">{l}</span>
          ))}
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="px-6 md:px-14 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="flex-1">
            <h1 className="text-6xl md:text-8xl lg:text-[120px] font-bold leading-[0.9] tracking-tighter" style={{ fontFamily: "'Syne', sans-serif" }}>
              des<span style={{ color: '#FF4444' }}>t</span>ello
            </h1>
            <p className="mt-6 text-base md:text-lg max-w-md" style={{ color: '#555' }}>
              We build brands that move culture forward. Strategy, design, and content — all under one roof.
            </p>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="mt-8 px-8 py-3.5 text-sm font-semibold tracking-wider uppercase text-white rounded-full" style={{ backgroundColor: '#FF4444' }}>
              Start a Project
            </motion.button>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="flex-1 max-w-md w-full">
            <div className="relative rounded-2xl overflow-hidden">
              <img src="https://picsum.photos/seed/dest-hero/500/700" alt="Hero" className="w-full aspect-[5/7] object-cover" />
              <div className="absolute inset-0 bg-[#FF4444]/15 mix-blend-multiply" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Selected Works */}
      <section className="px-6 md:px-14 py-16 md:py-24 border-t" style={{ borderColor: '#F0F0F0' }}>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-bold mb-12" style={{ fontFamily: "'Syne', sans-serif" }}>
          Selected Works
        </motion.h2>

        {/* Numbered list */}
        <div className="border-t" style={{ borderColor: '#E5E5E5' }}>
          {works.map((w, i) => (
            <motion.button key={w.num} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} onClick={() => setActiveWork(activeWork === i ? null : i)} className="w-full flex items-center gap-4 md:gap-8 py-5 border-b text-left group hover:bg-[#FAFAFA] transition-colors px-2" style={{ borderColor: '#E5E5E5' }}>
              <span className="text-sm font-bold" style={{ color: '#FF4444', fontFamily: "'Syne', sans-serif" }}>{w.num}</span>
              <span className="text-lg md:text-2xl font-semibold flex-1 group-hover:text-[#FF4444] transition-colors" style={{ fontFamily: "'Syne', sans-serif" }}>{w.title}</span>
              <span className="text-xs tracking-widest uppercase hidden sm:block" style={{ color: '#999' }}>{w.category}</span>
              <ChevronRight className="h-4 w-4" style={{ color: '#CCC' }} />
            </motion.button>
          ))}
        </div>

        {/* Expanded project card */}
        <AnimatePresence>
          {activeWork !== null && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }} className="overflow-hidden mt-8">
              <div className="rounded-2xl overflow-hidden relative">
                <img src={works[activeWork].image} alt={works[activeWork].title} className="w-full aspect-[2/1] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-10">
                  <span className="text-xs tracking-widest uppercase text-white/70">{works[activeWork].category}</span>
                  <h3 className="text-2xl md:text-4xl font-bold text-white mt-1" style={{ fontFamily: "'Syne', sans-serif" }}>{works[activeWork].title}</h3>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Expertise */}
      <section className="px-6 md:px-14 py-16 md:py-24" style={{ backgroundColor: '#FAFAFA' }}>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-bold mb-12" style={{ fontFamily: "'Syne', sans-serif" }}>
          Our Expertise
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {expertise.map((e, i) => (
            <motion.div key={e.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 bg-white rounded-xl border group cursor-pointer hover:border-[#FF4444]/30 transition-colors" style={{ borderColor: '#E5E5E5' }}>
              <span className="text-xs font-bold block mb-3" style={{ color: '#FF4444', fontFamily: "'Syne', sans-serif" }}>{e.num}</span>
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>{e.title}</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#666' }}>{e.desc}</p>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" style={{ color: '#FF4444' }} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="px-6 md:px-14 py-16 md:py-24">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-bold mb-12" style={{ fontFamily: "'Syne', sans-serif" }}>
          Our Process
        </motion.h2>
        <div>
          {processSteps.map((s, i) => (
            <ProcessAccordion key={i} step={s} index={i} />
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="px-6 md:px-14 py-16 md:py-24" style={{ backgroundColor: '#0A0A0A', color: '#FFFFFF' }}>
        <div className="max-w-3xl mx-auto text-center">
          <AnimatePresence mode="wait">
            <motion.div key={testimIdx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <p className="text-xl md:text-3xl font-light leading-relaxed mb-8" style={{ fontFamily: "'Syne', sans-serif" }}>
                "{testimonials[testimIdx].quote}"
              </p>
              <p className="text-sm font-semibold">{testimonials[testimIdx].name}</p>
              <p className="text-xs mt-1" style={{ color: '#999' }}>{testimonials[testimIdx].role}</p>
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center justify-center gap-4 mt-10">
            <button onClick={prevTestim} className="p-2 rounded-full border border-white/20 hover:border-white/50 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="text-xs" style={{ color: '#999' }}>{testimIdx + 1} / {testimonials.length}</span>
            <button onClick={nextTestim} className="p-2 rounded-full border border-white/20 hover:border-white/50 transition-colors">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-14 py-16 md:py-24">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-bold mb-12" style={{ fontFamily: "'Syne', sans-serif" }}>
          FAQ
        </motion.h2>
        <div className="max-w-2xl">
          {faqs.map((f, i) => (
            <Accordion key={i} title={f.q}>{f.a}</Accordion>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-14 py-16 md:py-20 border-t" style={{ borderColor: '#E5E5E5' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Contact */}
          <div className="md:col-span-1">
            <span className="text-xl font-bold tracking-tight block mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>destello</span>
            <p className="text-sm" style={{ color: '#666' }}>hello@destello.studio</p>
            <p className="text-sm" style={{ color: '#666' }}>+1 (212) 555-0199</p>
          </div>

          {/* Sitemap */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <span className="text-xs tracking-widest uppercase font-semibold block mb-4" style={{ color: '#999' }}>{heading}</span>
              {links.map((l) => (
                <span key={l} className="block text-sm mb-2 cursor-pointer hover:text-[#FF4444] transition-colors">{l}</span>
              ))}
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-14 pt-8 border-t flex flex-col sm:flex-row items-center gap-4" style={{ borderColor: '#E5E5E5' }}>
          <span className="text-sm font-medium">Stay in the loop</span>
          <div className="flex-1 max-w-sm flex">
            <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-2.5 text-sm border rounded-l-full outline-none focus:border-[#FF4444] transition-colors" style={{ borderColor: '#E5E5E5' }} />
            <button className="px-5 py-2.5 rounded-r-full text-white text-sm" style={{ backgroundColor: '#FF4444' }}>
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 text-xs text-center" style={{ color: '#999' }}>© 2024 Destello. All rights reserved.</div>
      </footer>
    </div>
  );
}
