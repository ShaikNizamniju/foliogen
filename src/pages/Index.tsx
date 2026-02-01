import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Features } from '@/components/landing/Features';
import { TemplateGallery } from '@/components/landing/TemplateGallery';
import { Pricing } from '@/components/landing/Pricing';
import { CompanyMarquee } from '@/components/landing/CompanyMarquee';
import { Footer } from '@/components/landing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <TemplateGallery />
      <Pricing />
      <CompanyMarquee />
      <Footer />
    </div>
  );
};

export default Index;
