import { motion } from 'framer-motion';

const cities = ['TOKYO', 'PARIS', 'NEW YORK', 'LONDON', 'BERLIN', 'MILAN', 'DUBAI', 'SEOUL'];

const projects = [
  {
    id: 1,
    title: 'Maison Lumière',
    category: 'Brand Identity',
    year: '2024',
    image: 'https://picsum.photos/seed/gaspar1/800/600',
  },
  {
    id: 2,
    title: 'Atelier Noir',
    category: 'Editorial Design',
    year: '2023',
    image: 'https://picsum.photos/seed/gaspar2/800/600',
  },
  {
    id: 3,
    title: 'Verso Studio',
    category: 'Web Design',
    year: '2024',
    image: 'https://picsum.photos/seed/gaspar3/800/600',
  },
  {
    id: 4,
    title: 'Callisto',
    category: 'Product Design',
    year: '2023',
    image: 'https://picsum.photos/seed/gaspar4/800/600',
  },
];

const clients = [
  'CHANEL', 'HERMÈS', 'LVMH', 'DIOR', 'PRADA', 'GUCCI', 'CARTIER', 'BALENCIAGA',
  'SAINT LAURENT', 'BOTTEGA VENETA', 'LOEWE', 'FENDI',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

function ClientMarquee() {
  return (
    <div className="overflow-hidden py-16 border-t border-[#D4C9B8]">
      <motion.div
        className="flex whitespace-nowrap gap-16"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {[...clients, ...clients].map((client, i) => (
          <span
            key={i}
            className="text-2xl md:text-3xl font-light tracking-[0.2em] text-[#8A7E6B] select-none"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {client}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function GasparTemplate() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: '#F5F0E8',
        color: '#2A2520',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between px-8 md:px-16 py-6 border-b border-[#D4C9B8]"
      >
        <span
          className="text-2xl tracking-[0.15em] font-semibold"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          GASPAR
        </span>
        <div className="flex gap-8 text-xs tracking-[0.2em] uppercase text-[#8A7E6B]">
          <span className="hover:text-[#2A2520] transition-colors cursor-pointer">Work</span>
          <span className="hover:text-[#2A2520] transition-colors cursor-pointer">About</span>
          <span className="hover:text-[#2A2520] transition-colors cursor-pointer">Contact</span>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="w-full h-[70vh] md:h-[80vh] relative"
        >
          <img
            src="https://picsum.photos/seed/gaspar-hero/1600/900"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-[#2A2520]/30" />

          {/* Scattered city names */}
          {cities.map((city, i) => {
            const positions = [
              { top: '12%', left: '8%' },
              { top: '25%', right: '12%' },
              { bottom: '30%', left: '15%' },
              { top: '18%', left: '45%' },
              { bottom: '15%', right: '8%' },
              { top: '55%', left: '5%' },
              { bottom: '40%', right: '25%' },
              { top: '40%', right: '5%' },
            ];
            return (
              <motion.span
                key={city}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 0.5 + i * 0.15, duration: 0.8 }}
                className="absolute text-white text-[10px] md:text-xs tracking-[0.3em] font-light select-none"
                style={positions[i]}
              >
                {city}
              </motion.span>
            );
          })}

          {/* Hero title overlay */}
          <div className="absolute inset-0 flex items-end p-8 md:p-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <h1
                className="text-5xl md:text-8xl lg:text-9xl text-white font-light leading-[0.9] tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Creative
                <br />
                <span className="italic font-normal">Direction</span>
              </h1>
              <p className="mt-6 text-white/70 text-sm md:text-base tracking-[0.15em] uppercase max-w-md">
                Art direction, brand identity & editorial design for luxury brands worldwide
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Selected Work */}
      <section className="px-8 md:px-16 py-20 md:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={itemVariants} className="mb-16 flex items-end justify-between">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-[#8A7E6B] block mb-3">
                Portfolio
              </span>
              <h2
                className="text-4xl md:text-6xl font-light"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Selected <span className="italic">Work</span>
              </h2>
            </div>
            <span className="text-xs tracking-[0.2em] uppercase text-[#8A7E6B] hidden md:block">
              {projects.length} Projects
            </span>
          </motion.div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden mb-5">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full aspect-[4/3] object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#2A2520]/0 group-hover:bg-[#2A2520]/20 transition-colors duration-500" />
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3
                      className="text-xl md:text-2xl font-light mb-1 group-hover:text-[#8A7E6B] transition-colors duration-300"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {project.title}
                    </h3>
                    <span className="text-xs tracking-[0.2em] uppercase text-[#8A7E6B]">
                      {project.category}
                    </span>
                  </div>
                  <span className="text-xs tracking-[0.15em] text-[#8A7E6B] mt-1">
                    {project.year}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Client Marquee */}
      <ClientMarquee />

      {/* Contact Footer — 3 columns */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="px-8 md:px-16 py-20 md:py-28 border-t border-[#D4C9B8]"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Col 1: CTA */}
          <div>
            <h3
              className="text-3xl md:text-4xl font-light mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Let's create
              <br />
              <span className="italic">together</span>
            </h3>
            <p className="text-sm text-[#8A7E6B] leading-relaxed max-w-xs">
              Available for select projects and collaborations in 2024–2025.
            </p>
          </div>

          {/* Col 2: Contact */}
          <div className="space-y-4">
            <span className="text-xs tracking-[0.3em] uppercase text-[#8A7E6B] block mb-4">
              Contact
            </span>
            <a
              href="mailto:hello@gaspar.studio"
              className="block text-sm hover:text-[#8A7E6B] transition-colors"
            >
              hello@gaspar.studio
            </a>
            <p className="text-sm text-[#8A7E6B]">Paris, France</p>
          </div>

          {/* Col 3: Social */}
          <div className="space-y-4">
            <span className="text-xs tracking-[0.3em] uppercase text-[#8A7E6B] block mb-4">
              Follow
            </span>
            {['Instagram', 'Behance', 'Dribbble', 'LinkedIn'].map((social) => (
              <span
                key={social}
                className="block text-sm hover:text-[#8A7E6B] transition-colors cursor-pointer"
              >
                {social}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-20 pt-8 border-t border-[#D4C9B8] flex items-center justify-between">
          <span
            className="text-lg tracking-[0.15em] font-semibold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            GASPAR
          </span>
          <span className="text-xs text-[#8A7E6B]">© 2024 All rights reserved</span>
        </div>
      </motion.footer>
    </div>
  );
}
