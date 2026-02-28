import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, ArrowRight } from 'lucide-react';
import { GasparTemplate } from '@/components/templates/GasparTemplate';
import { DestelloTemplate } from '@/components/templates/DestelloTemplate';
import { Helmet } from 'react-helmet-async';

interface TemplateEntry {
  id: string;
  name: string;
  tagline: string;
  style: string;
  gradient: string;
  preview: React.ComponentType;
}

const galleryTemplates: TemplateEntry[] = [
  {
    id: 'gaspar',
    name: 'GASPAR',
    tagline: 'High-end branding studio with serif typography',
    style: 'Editorial · Luxury · Serif',
    gradient: 'from-[#F5F0E8] to-[#E8E0D0]',
    preview: GasparTemplate,
  },
  {
    id: 'destello',
    name: 'DESTELLO',
    tagline: 'Dramatic agency with numbered works & process accordion',
    style: 'Bold · Creative · Studio',
    gradient: 'from-[#FFFFFF] to-[#FFF0F0]',
    preview: DestelloTemplate,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 * i, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export default function TemplatesGallery() {
  const [previewId, setPreviewId] = useState<string | null>(null);
  const activeTemplate = galleryTemplates.find((t) => t.id === previewId);

  return (
    <>
      <Helmet>
        <title>Template Gallery — FolioGen</title>
        <meta name="description" content="Browse premium portfolio templates for professionals. From editorial luxury to minimalist elegance." />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold tracking-tight text-foreground">FolioGen</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm text-muted-foreground">Templates</span>
            </div>
            <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
              {galleryTemplates.length} Template{galleryTemplates.length !== 1 ? 's' : ''}
            </span>
          </div>
        </motion.header>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-4">
              Template{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-foreground">
                Gallery
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Premium, hand-crafted portfolio designs. Click preview to experience each template in full.
            </p>
          </motion.div>
        </section>

        {/* Grid */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryTemplates.map((template, i) => (
              <motion.div
                key={template.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="group relative rounded-2xl border border-border bg-card overflow-hidden cursor-pointer hover:border-primary/40 transition-colors duration-300"
                onClick={() => setPreviewId(template.id)}
              >
                {/* Thumbnail */}
                <div className={`relative h-56 bg-gradient-to-br ${template.gradient} overflow-hidden`}>
                  {/* Mini preview scaled down */}
                  <div className="absolute inset-0 origin-top-left scale-[0.25] w-[400%] h-[400%] pointer-events-none">
                    <template.preview />
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300 flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm text-foreground text-sm font-medium px-4 py-2 rounded-full shadow-lg">
                        <Eye className="h-4 w-4" />
                        Preview
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground tracking-tight">
                      {template.name}
                    </h3>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{template.tagline}</p>
                  <span className="text-xs tracking-wider uppercase text-muted-foreground/70">
                    {template.style}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Full-screen Preview Modal */}
        <AnimatePresence>
          {activeTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-background"
            >
              {/* Close bar */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-background/80 backdrop-blur-xl border-b border-border"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">{activeTemplate.name}</span>
                  <span className="text-xs text-muted-foreground">{activeTemplate.style}</span>
                </div>
                <button
                  onClick={() => setPreviewId(null)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5 text-foreground" />
                </button>
              </motion.div>

              {/* Template render */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="overflow-auto"
                style={{ height: 'calc(100vh - 53px)' }}
              >
                <activeTemplate.preview />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
