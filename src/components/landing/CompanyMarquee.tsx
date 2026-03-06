import { motion } from 'framer-motion';

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z" fill="currentColor" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" />
    </svg>
  );
}

function AmazonLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 603 182" className={className} style={{ width: 'auto', height: '18px' }}>
      <path fill="currentColor" d="M374.1 142.3c-34.5 25.5-84.6 39-127.7 39-60.4 0-114.8-22.3-155.9-59.5-3.2-2.9-.3-6.9 3.6-4.6 44.4 25.8 99.3 41.4 156.1 41.4 38.3 0 80.4-7.9 119.1-24.4 5.8-2.5 10.7 3.8 4.8 8.1z" />
      <path fill="currentColor" d="M387.8 126.8c-4.4-5.7-29.3-2.7-40.5-1.4-3.4.4-3.9-2.5-.9-4.7 19.8-13.9 52.3-9.9 56.1-5.2 3.8 4.7-1 37.3-19.6 52.9-2.9 2.4-5.6 1.1-4.3-2.1 4.2-10.4 13.6-33.8 9.2-39.5z" />
      <path fill="currentColor" d="M348.2 22.1V6.9c0-2.3 1.7-3.9 3.8-3.9h67.6c2.2 0 3.8 1.6 3.8 3.8v13c0 2.2-1.8 5-5 8.9l-35 50c13-.3 26.7 1.6 38.5 8.2 2.7 1.5 3.4 3.7 3.6 5.8v16.2c0 2.2-2.4 4.7-4.9 3.4-20.4-10.7-47.5-11.9-70.1.1-2.3 1.2-4.7-1.2-4.7-3.4V90c0-2.4 0-6.5 2.4-10.2l40.6-58.2h-35.3c-2.2 0-3.8-1.6-3.8-3.8l-.4 4.3zM124.8 105.1H107c-1.7-.1-3-1.4-3.2-3V6.9c0-1.8 1.6-3.3 3.5-3.3h16.6c1.7.1 3.1 1.5 3.2 3.1v12.5h.3C131.6 7.3 141 1.7 153.5 1.7c12.7 0 20.6 5.6 26.3 17.5C184 7.3 195.5 1.7 207.5 1.7c8.5 0 17.8 3.5 23.5 11.3 6.4 8.7 5.1 21.3 5.1 32.4l0 56.5c0 1.8-1.6 3.3-3.5 3.3h-17.7c-1.8-.1-3.3-1.6-3.3-3.3V53.9c0-4.4.4-15.2-.6-19.3-1.5-6.9-6-8.8-11.9-8.8-4.9 0-10 3.3-12.1 8.5-2.1 5.2-1.9 13.9-1.9 19.6v48.1c0 1.8-1.6 3.3-3.5 3.3h-17.7c-1.8-.1-3.3-1.6-3.3-3.3l0-48.1c0-11.5 1.9-28.5-12.5-28.5-14.5 0-14 16.6-14 28.5v48.1c0 1.8-1.6 3.3-3.5 3.3l.2-.2zM469.5 1.7c26.3 0 40.5 22.6 40.5 51.3 0 27.8-15.7 49.8-40.5 49.8-25.9 0-40-22.6-40-50.5 0-28 14.3-50.6 40-50.6zm.1 18.6c-13.1 0-13.9 17.8-13.9 28.9 0 11.1-.2 34.8 13.7 34.8 13.7 0 14.3-19.1 14.3-30.8 0-7.7-.3-16.9-2.7-24.2-2.1-6.3-6.2-8.7-11.4-8.7zM547.9 105.1h-17.6c-1.8-.1-3.3-1.6-3.3-3.3l0-95c.2-1.7 1.7-3 3.5-3h16.4c1.6.1 2.9 1.2 3.2 2.7v14.5h.3c5.1-13 12.2-19.2 25.4-19.2 9.1 0 17.9 3.3 23.6 12.2 5.3 8.3 5.3 22.2 5.3 32.1v56.5c-.2 1.7-1.7 3-3.5 3h-17.8c-1.6-.1-3-1.4-3.2-3V52.9c0-11.3 1.3-27.7-12.7-27.7-4.9 0-9.5 3.3-11.7 8.3-2.8 6.3-3.2 12.6-3.2 19.4v49c0 1.8-1.6 3.3-3.5 3.3l-.2-.1zM299.8 57.5c0 7.8.2 14.3-3.7 21.3-3.2 5.7-8.3 9.1-14 9.1-7.8 0-12.3-5.9-12.3-14.7 0-17.3 15.5-20.4 30-20.4v4.7zm20.3 49.2c-1.3 1.2-3.3 1.3-4.8.5-6.8-5.6-8-8.2-11.7-13.6-11.2 11.4-19.1 14.8-33.6 14.8-17.2 0-30.6-10.6-30.6-31.8 0-16.6 9-27.8 21.8-33.4 11.1-4.9 26.6-5.8 38.5-7.2v-2.7c0-4.9.4-10.7-2.5-14.9-2.5-3.7-7.4-5.2-11.7-5.2-8 0-15.1 4.1-16.8 12.5-.4 1.9-1.7 3.7-3.6 3.8l-17.2-1.9c-1.7-.4-3.5-1.7-3-4.3C249.6 7.3 269 1.7 286.6 1.7c9 0 20.8 2.4 27.9 9.2 9 8.4 8.1 19.6 8.1 31.8v28.8c0 8.7 3.6 12.5 7 17.2 1.2 1.7 1.5 3.7 0 4.9-3.7 3.1-10.3 8.9-14 12.1l-.5-.1v1z" />
    </svg>
  );
}

function MicrosoftLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 23 23" className={className}>
      <rect x="1" y="1" width="10" height="10" fill="currentColor" />
      <rect x="12" y="1" width="10" height="10" fill="currentColor" />
      <rect x="1" y="12" width="10" height="10" fill="currentColor" />
      <rect x="12" y="12" width="10" height="10" fill="currentColor" />
    </svg>
  );
}

function FlipkartLogo({ className }: { className?: string }) {
  return (
    <div className={`font-outfit font-bold italic tracking-tighter ${className}`} style={{ fontSize: '20px' }}>
      Flipkart
    </div>
  );
}

function RazorpayLogo({ className }: { className?: string }) {
  return (
    <div className={`font-outfit font-bold ${className}`} style={{ fontSize: '20px' }}>
      Razorpay
    </div>
  );
}

const companies = [
  { name: 'Google', Logo: GoogleLogo },
  { name: 'Amazon', Logo: AmazonLogo },
  { name: 'Microsoft', Logo: MicrosoftLogo },
  { name: 'Flipkart', Logo: FlipkartLogo },
  { name: 'Razorpay', Logo: RazorpayLogo },
];

function MarqueeRow({ direction = 'left' }: { direction?: 'left' | 'right' }) {
  const duplicated = [...companies, ...companies, ...companies];

  return (
    <div className="flex overflow-hidden">
      <motion.div
        className="flex gap-12 py-4 items-center"
        animate={{ x: direction === 'left' ? ['0%', '-33.33%'] : ['-33.33%', '0%'] }}
        transition={{ x: { repeat: Infinity, repeatType: 'loop', duration: 35, ease: 'linear' } }}
      >
        {duplicated.map((c, i) => (
          <div
            key={`${c.name}-${i}`}
            className="flex items-center gap-3 px-8 py-4 rounded-full border border-ink/5 bg-white/40 backdrop-blur-sm whitespace-nowrap group grayscale hover:grayscale-0 transition-all duration-300 hover:border-ink/10 shadow-sm shadow-ink/5"
          >
            <div className="flex items-center justify-center transition-all duration-300 text-ink/60 group-hover:text-cobalt">
              <c.Logo className="h-6 w-auto" />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function CompanyMarquee() {
  return (
    <section className="relative py-24 bg-canvas overflow-hidden border-b border-ink/5">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-canvas to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-canvas to-transparent z-10 pointer-events-none" />

      <div className="container mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="font-outfit text-sm font-semibold text-cobalt tracking-widest uppercase mb-4">
            Trusted by professionals hired at
          </p>
        </motion.div>
      </div>

      <div className="space-y-6 flex flex-col items-center">
        <MarqueeRow direction="left" />
      </div>
    </section>
  );
}
